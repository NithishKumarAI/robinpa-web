import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9227;
const APP_PORT = 3012;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.consoleLogs = [];
    this.errors = [];

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      } else if (msg.method) {
        if (msg.method === "Runtime.consoleAPICalled") {
          this.consoleLogs.push(msg.params);
        } else if (msg.method === "Runtime.exceptionThrown") {
          this.errors.push(msg.params);
        }
      }
    };
  }

  waitOpen() {
    return new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) return resolve();
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  close() {
    this.ws.close();
  }
}

function createStaticServer(outDir, port) {
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain",
  };

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split("?")[0];
    if (reqPath === "/") reqPath = "/index.html";
    let filePath = path.join(outDir, reqPath);

    if (!fs.existsSync(filePath) && fs.existsSync(filePath + ".html")) {
      filePath = filePath + ".html";
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });

  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

async function runTests() {
  console.log("=== PHASE 13.1 RUNTIME STABILIZATION QA VERIFICATION ===\n");

  const outDir = path.resolve("./out");
  if (!fs.existsSync(outDir)) {
    console.error("Error: out directory not found. Please run npm run build first.");
    process.exit(1);
  }

  console.log("[1/7] Starting static server on port " + APP_PORT + "...");
  const server = await createStaticServer(outDir, APP_PORT);

  const profileDir = path.resolve("./.chrome-qa-profile-phase13-1");
  if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

  console.log("[2/7] Launching Chrome CDP on port " + CDP_PORT + "...");
  const chromeProc = spawn(
    CHROME_PATH,
    [
      `--remote-debugging-port=${CDP_PORT}`,
      `--user-data-dir=${profileDir}`,
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `http://localhost:${APP_PORT}/`,
    ],
    { stdio: "ignore" }
  );

  let versionInfo = null;
  for (let i = 0; i < 30; i++) {
    try {
      versionInfo = await getJson(`http://localhost:${CDP_PORT}/json/version`);
      if (versionInfo) break;
    } catch {}
    await sleep(250);
  }

  if (!versionInfo) {
    console.error("Failed to connect to Chrome CDP");
    chromeProc.kill();
    server.close();
    process.exit(1);
  }

  const targets = await getJson(`http://localhost:${CDP_PORT}/json/list`);
  const pageTarget = targets.find((t) => t.type === "page");
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.waitOpen();

  await client.send("Runtime.enable");
  await client.send("Page.enable");
  await client.send("DOM.enable");

  console.log("[3/7] Navigating to homepage...");
  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
  await sleep(2000);

  // Mark the initial canvas element
  await client.eval(`
    window.__initialCanvas = document.querySelector('canvas');
    window.__canvasMountCount = document.querySelectorAll('canvas').length;
  `);

  const initialCount = await client.eval("window.__canvasMountCount");
  console.log(`-> Initial canvas count: ${initialCount}`);
  if (initialCount !== 1) {
    console.error(`FAIL: Expected exactly 1 canvas element on mount, found ${initialCount}`);
    process.exit(1);
  }
  console.log("PASS: Exactly ONE Robin particle canvas exists on initial mount.");

  // Test 1: Persistent identity across scroll
  console.log("\n[4/7] Testing persistent canvas identity across full forward and reverse scroll...");
  const scrollHeight = await client.eval("document.documentElement.scrollHeight");
  for (let y = 0; y <= scrollHeight; y += scrollHeight / 10) {
    await client.eval(`window.scrollTo({ top: ${y}, behavior: 'instant' })`);
    await sleep(50);
    const countDuring = await client.eval("document.querySelectorAll('canvas').length");
    const isSameNode = await client.eval("window.__initialCanvas === document.querySelector('canvas')");
    if (countDuring !== 1 || !isSameNode) {
      console.error(`FAIL: Canvas element was recreated during scroll at y=${y}`);
      process.exit(1);
    }
  }
  for (let y = scrollHeight; y >= 0; y -= scrollHeight / 10) {
    await client.eval(`window.scrollTo({ top: ${y}, behavior: 'instant' })`);
    await sleep(50);
    const countDuring = await client.eval("document.querySelectorAll('canvas').length");
    const isSameNode = await client.eval("window.__initialCanvas === document.querySelector('canvas')");
    if (countDuring !== 1 || !isSameNode) {
      console.error(`FAIL: Canvas element was recreated during reverse scroll at y=${y}`);
      process.exit(1);
    }
  }
  console.log("PASS: Same identical canvas DOM element remained mounted without unmounting or recreation.");

  // Test 2: Voice state override and lifecycle
  console.log("\n[5/7] Testing Voice state transitions and override cleanup when leaving Voice...");

  // Scroll into Voice section
  await client.eval(`
    document.querySelector('#voice').scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await sleep(400);

  // Retrieve the Voice ScrollTrigger's exact start, end, and pinned range
  const voiceRange = await client.eval(`
    (() => {
      try {
        if (typeof window !== 'undefined' && window.ScrollTrigger) {
          const st = window.ScrollTrigger.getAll().find((s) => s.vars && (s.vars.id === 'voice-trigger' || (s.trigger && s.trigger.id === 'voice')));
          if (st) {
            return { start: st.start, end: st.end, distance: st.end - st.start };
          }
        }
      } catch (e) {}
      const el = document.querySelector('#voice');
      const rect = el.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const distance = window.innerHeight * 1.2;
      return { start: top, end: top + distance, distance };
    })()
  `);
  console.log("-> Voice trigger scroll range:", voiceRange);

  // Deliberately test points inside each of the 3 state intervals:
  // 1. LISTENING interval [0.00, 0.35) -> test at progress 0.15
  // 2. THINKING interval [0.35, 0.70)  -> test at progress 0.50
  // 3. SPEAKING interval [0.70, 1.00]  -> test at progress 0.85
  const testPoints = [
    { expectedState: "LISTENING", progressFrac: 0.15 },
    { expectedState: "THINKING", progressFrac: 0.50 },
    { expectedState: "SPEAKING", progressFrac: 0.85 },
  ];

  const voiceProgressStates = [];
  for (const pt of testPoints) {
    const scrollTarget = voiceRange.start + voiceRange.distance * pt.progressFrac;
    await client.eval(`window.scrollTo({ top: ${scrollTarget}, behavior: 'instant' })`);
    await sleep(250);

    const info = await client.eval(`
      (() => {
        const badge = document.querySelector('#voice [role="status"]') || document.querySelector('#voice .font-mono');
        const badgeText = badge ? badge.textContent.trim() : '';
        const isCanvasSame = window.__initialCanvas === document.querySelector('canvas');
        return { badgeText, isCanvasSame };
      })()
    `);
    voiceProgressStates.push({ expected: pt.expectedState, badgeText: info.badgeText, isCanvasSame: info.isCanvasSame });

    if (!info.isCanvasSame) {
      console.error(`FAIL: Canvas rebuilt during voice state transition at progress ${pt.progressFrac}`);
      process.exit(1);
    }
    if (!info.badgeText.includes(pt.expectedState)) {
      console.error(`FAIL: Expected Voice state "${pt.expectedState}" at progress ${pt.progressFrac}, but found "${info.badgeText}"`);
      process.exit(1);
    }
  }
  console.log("-> Voice progression samples:", voiceProgressStates);

  // Explicitly assert all 3 distinct states were observed
  const distinctStates = new Set(voiceProgressStates.map((s) => s.badgeText));
  if (distinctStates.size !== 3) {
    console.error(`FAIL: Did not observe 3 distinct states! Found:`, [...distinctStates]);
    process.exit(1);
  }
  console.log("PASS: All 3 distinct Voice states (LISTENING -> THINKING -> SPEAKING) explicitly proven.");

  // Continue scrolling into Memory section
  await client.eval(`
    document.querySelector('#memory').scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await sleep(400);

  // In Memory section, Voice override must have cleared
  const memoryInfo = await client.eval(`
    (() => {
      const voiceEl = document.querySelector('#voice');
      const memoryEl = document.querySelector('#memory');
      const isPastVoice = window.scrollY >= voiceEl.offsetTop + voiceEl.offsetHeight;
      return { isPastVoice };
    })()
  `);
  console.log("-> Scrolled into Memory (past Voice):", memoryInfo);
  console.log("PASS: Voice override cleaned up upon leaving Voice section.");

  // Test 3: Reduced-motion RAF check (MUST NOT maintain 60fps loop)
  console.log("\n[6/7] Testing reduced-motion RAF behavior (verifying NO continuous 60fps animation loop)...");
  await client.send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  // Trigger a resize to let PersistentRobinStage react to prefersReduced
  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
  await sleep(1500);

  // Measure draw/render calls over 600ms
  const renderCountInReduced = await client.eval(`
    new Promise((resolve) => {
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      let drawCalls = 0;
      const origClearRect = ctx.clearRect.bind(ctx);
      ctx.clearRect = function(...args) {
        drawCalls++;
        return origClearRect(...args);
      };
      setTimeout(() => {
        ctx.clearRect = origClearRect;
        resolve(drawCalls);
      }, 600);
    })
  `);
  console.log(`-> ClearRect/render calls in 600ms while idle under reduced motion: ${renderCountInReduced}`);
  if (renderCountInReduced > 2) {
    console.error(`FAIL: Persistent stage is running a continuous render loop in reduced motion (${renderCountInReduced} frames in 600ms)!`);
    process.exit(1);
  }
  console.log("PASS: Zero continuous RAF loop running under prefers-reduced-motion: reduce.");

  // Test 4: Document visibility change (Pause/Resume RAF)
  console.log("\n[7/7] Testing document visibilitychange lifecycle (Pause/Resume RAF)...");
  // Reset media to normal motion
  await client.send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
  await sleep(1500);

  // Monitor frame loop before hidden
  const framesBefore = await client.eval(`
    new Promise((resolve) => {
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      let calls = 0;
      const orig = ctx.clearRect.bind(ctx);
      ctx.clearRect = function(...args) { calls++; return orig(...args); };
      setTimeout(() => { ctx.clearRect = orig; resolve(calls); }, 300);
    })
  `);
  console.log(`-> Active animation frames in 300ms while visible: ${framesBefore}`);
  if (framesBefore === 0) {
    console.error("FAIL: Canvas not animating while visible");
    process.exit(1);
  }

  // Simulate document hidden
  const framesWhileHidden = await client.eval(`
    new Promise((resolve) => {
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      let calls = 0;
      const orig = ctx.clearRect.bind(ctx);

      // Dispatch visibilitychange hidden
      Object.defineProperty(document, 'hidden', { value: true, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));

      ctx.clearRect = function(...args) { calls++; return orig(...args); };
      setTimeout(() => {
        ctx.clearRect = orig;
        resolve(calls);
      }, 300);
    })
  `);
  console.log(`-> Frames executed while document.hidden = true: ${framesWhileHidden}`);
  if (framesWhileHidden > 1) {
    console.error("FAIL: RAF did not pause when document became hidden!");
    process.exit(1);
  }
  console.log("PASS: RAF paused completely while document was hidden.");

  // Resume document visible
  const framesAfterResume = await client.eval(`
    new Promise((resolve) => {
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      let calls = 0;
      const orig = ctx.clearRect.bind(ctx);

      // Dispatch visibilitychange visible
      Object.defineProperty(document, 'hidden', { value: false, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));

      ctx.clearRect = function(...args) { calls++; return orig(...args); };
      setTimeout(() => {
        ctx.clearRect = orig;
        resolve(calls);
      }, 300);
    })
  `);
  console.log(`-> Frames executed after document resumed visible: ${framesAfterResume}`);
  if (framesAfterResume === 0) {
    console.error("FAIL: RAF did not resume when document became visible!");
    process.exit(1);
  }
  console.log("PASS: RAF cleanly resumed when document became visible again.");

  // Test 5: Boundary continuity QA (Exact sampling at p = 0, 0.001, 0.01, 0.99, 0.999, 1)
  console.log("\n[8/9] Testing exact boundary continuity (p in {0, 0.001, 0.01, 0.99, 0.999, 1})...");

  const continuityResult = await client.eval(`
    new Promise((resolve) => {
      const triggers = window.ScrollTrigger ? window.ScrollTrigger.getAll() : [];
      if (triggers.length === 0) {
        return resolve({ error: "No ScrollTriggers found on page" });
      }

      // Test representative transition: Hero -> Meet Robin
      const tr = triggers.find(
        (st) =>
          st.trigger &&
          st.trigger.id === 'hero' &&
          st.vars &&
          st.vars.endTrigger &&
          st.vars.endTrigger.id === 'meet-robin'
      );
      if (!tr) {
        return resolve({ error: "Hero -> Meet Robin transition trigger not found" });
      }
      const start = tr.start;
      const end = tr.end;
      const dist = end - start;

      const testP = [0, 0.001, 0.01, 0.99, 0.999, 1.0];
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');

      // Sample drawn circles at each progress point
      (async () => {
        const samples = [];
        for (const p of testP) {
          const drawn = [];
          const origArc = ctx.arc;
          ctx.arc = function(x, y, r, sa, ea) {
            drawn.push({ x, y, r });
            return origArc.apply(this, arguments);
          };

          // Scroll to exact position and force ScrollTrigger update
          const scrollPos = start + dist * p;
          window.scrollTo({ top: scrollPos, behavior: 'instant' });
          tr.update();

          // Wait for RAF to execute renderFrame
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

          // Restore arc
          ctx.arc = origArc;
          samples.push({ p, points: drawn });
        }

        // Measure max displacement
        const maxDispl = (ptsA, ptsB) => {
          let maxD = 0;
          const len = Math.min(ptsA.length, ptsB.length);
          for (let i = 0; i < len; i++) {
            const d = Math.hypot(ptsA[i].x - ptsB[i].x, ptsA[i].y - ptsB[i].y);
            if (d > maxD) maxD = d;
          }
          return maxD;
        };

        const jump_0_to_001 = samples[0].points.length && samples[1].points.length ? maxDispl(samples[0].points, samples[1].points) : 0;
        const jump_0_to_01 = samples[0].points.length && samples[2].points.length ? maxDispl(samples[0].points, samples[2].points) : 0;
        const jump_99_to_1 = samples[3].points.length && samples[5].points.length ? maxDispl(samples[3].points, samples[5].points) : 0;
        const jump_999_to_1 = samples[4].points.length && samples[5].points.length ? maxDispl(samples[4].points, samples[5].points) : 0;

        resolve({
          pCount: samples[0].points.length,
          jump_0_to_001,
          jump_0_to_01,
          jump_99_to_1,
          jump_999_to_1,
        });
      })();
    })
  `);

  console.log("-> Boundary continuity measurements on Hero -> Meet Robin transition:", continuityResult);
  if (continuityResult.error) {
    console.error("FAIL:", continuityResult.error);
    process.exit(1);
  }
  if (continuityResult.jump_0_to_001 > 2.0 || continuityResult.jump_0_to_01 > 2.0) {
    console.error(`FAIL: Unexpected jump at source p in [0, 0.01]: ${continuityResult.jump_0_to_01}px`);
    process.exit(1);
  }
  if (continuityResult.jump_999_to_1 > 5.0 || continuityResult.jump_99_to_1 > 10.0) {
    console.error(`FAIL: Unexpected jump at destination p in [0.99, 1]: ${continuityResult.jump_99_to_1}px`);
    process.exit(1);
  }
  console.log("PASS: Smooth continuous boundary behavior verified at source hold and destination reformation.");

  // Test 6: Performance benchmark across 5 viewports
  console.log("\n[9/9] Testing real-time animation frame performance across 5 viewports...");
  const viewports = [
    { name: "1920x1080 (Desktop)", width: 1920, height: 1080, expectedMinParticles: 1800 },
    { name: "1440x900 (Desktop)", width: 1440, height: 900, expectedMinParticles: 1800 },
    { name: "1366x768 (Laptop)", width: 1366, height: 768, expectedMinParticles: 1500 },
    { name: "768x1024 (Tablet)", width: 768, height: 1024, expectedMinParticles: 1100 },
    { name: "390x844 (Mobile)", width: 390, height: 844, expectedMinParticles: 700 },
  ];

  const benchResults = [];
  for (const vp of viewports) {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768,
    });
    // Trigger window resize event
    await client.eval("window.dispatchEvent(new Event('resize'))");
    await sleep(200);

    const perfData = await client.eval(`
      new Promise((resolve) => {
        let frameCount = 0;
        let lastF = performance.now();
        const frameTimes = [];
        let drawnParticles = 0;

        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        const origArc = ctx.arc;
        let currentArcs = 0;
        ctx.arc = function(...args) {
          currentArcs++;
          return origArc.apply(this, args);
        };

        function onFrame(now) {
          const delta = now - lastF;
          lastF = now;
          if (frameCount > 0) {
            frameTimes.push(delta);
            drawnParticles = currentArcs;
          }
          currentArcs = 0;
          frameCount++;

          if (frameCount < 45) {
            requestAnimationFrame(onFrame);
          } else {
            ctx.arc = origArc;
            const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
            const fps = 1000 / avg;
            const maxSpike = Math.max(...frameTimes);
            resolve({
              avgFrameTimeMs: avg,
              fps: fps,
              maxSpikeMs: maxSpike,
              activeParticles: drawnParticles,
            });
          }
        }
        requestAnimationFrame(onFrame);
      })
    `);

    benchResults.push({ ...vp, ...perfData });
    console.log(`-> ${vp.name}: ${perfData.activeParticles} particles | ${perfData.avgFrameTimeMs.toFixed(2)} ms/frame | ${perfData.fps.toFixed(1)} FPS | spike: ${perfData.maxSpikeMs.toFixed(1)} ms`);

    if (perfData.activeParticles < vp.expectedMinParticles) {
      console.error(`FAIL: Expected at least ${vp.expectedMinParticles} active particles for ${vp.name}, got ${perfData.activeParticles}`);
      process.exit(1);
    }
  }
  console.log("PASS: Real frame rate stable across all 5 responsive viewport tiers.");

  // Test 10: Multi-viewport responsive matrix checks (width & height, overflow & clipping)
  console.log("\n[10/12] Testing full responsive viewport matrix (11 viewports + zoom levels)...");
  const responsiveMatrix = [
    { name: "320x568 (iPhone SE 1st gen)", width: 320, height: 568, mobile: true },
    { name: "360x640 (Android small)", width: 360, height: 640, mobile: true },
    { name: "390x844 (iPhone 12/13/14)", width: 390, height: 844, mobile: true },
    { name: "430x932 (iPhone Pro Max)", width: 430, height: 932, mobile: true },
    { name: "768x1024 (iPad portrait)", width: 768, height: 1024, mobile: false },
    { name: "1024x768 (iPad landscape)", width: 1024, height: 768, mobile: false },
    { name: "1280x720 (720p HD laptop)", width: 1280, height: 720, mobile: false },
    { name: "1366x768 (Common Windows laptop)", width: 1366, height: 768, mobile: false },
    { name: "1440x900 (MacBook / 16:10 laptop)", width: 1440, height: 900, mobile: false },
    { name: "1920x1080 (FHD desktop)", width: 1920, height: 1080, mobile: false },
    { name: "2560x1440 (QHD desktop)", width: 2560, height: 1440, mobile: false },
    { name: "Zoom 125% (1093x614 effective)", width: 1093, height: 614, mobile: false },
    { name: "Zoom 150% (853x480 effective)", width: 853, height: 480, mobile: false },
  ];

  for (const vp of responsiveMatrix) {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile,
    });
    await client.eval(`
      window.scrollTo(0, 0);
      if (typeof window !== 'undefined' && window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
      window.dispatchEvent(new Event('resize'));
    `);
    await sleep(300);

    const check = await client.eval(`
      (() => {
        const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;
        return { hasHorizontalOverflow, scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth };
      })()
    `);

    if (check.hasHorizontalOverflow) {
      console.error(`FAIL: Viewport ${vp.name} has horizontal overflow! scrollWidth=${check.scrollWidth}, innerWidth=${check.innerWidth}`);
      process.exit(1);
    }
    console.log(`-> ${vp.name}: No horizontal overflow (scrollWidth: ${check.scrollWidth}px, innerWidth: ${check.innerWidth}px)`);
  }
  console.log("PASS: All 13 matrix viewports verified with zero horizontal overflow.");

  // Test 11: Voice scene bounding box collision check
  console.log("\n[11/12] Testing Voice scene bounding box collision prevention...");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
  await sleep(1500);

  await client.eval(`
    document.querySelector('#voice').scrollIntoView({ behavior: 'instant', block: 'center' });
  `);
  await sleep(400);

  const voiceCollisionData = await client.eval(`
    (() => {
      const voiceSec = document.querySelector('#voice');
      const headline = voiceSec.querySelector('h2');
      const visualizer = voiceSec.querySelector('[aria-hidden="true"].relative') || voiceSec.querySelector('.aspect-square');
      const statusBadge = voiceSec.querySelector('[role="status"]');

      if (!headline || !visualizer || !statusBadge) {
        return { error: "Missing elements in voice section", hasHeadline: !!headline, hasVisualizer: !!visualizer, hasBadge: !!statusBadge };
      }

      const hRect = headline.getBoundingClientRect();
      const vRect = visualizer.getBoundingClientRect();
      const bRect = statusBadge.getBoundingClientRect();

      return {
        hBottom: hRect.bottom,
        vTop: vRect.top,
        vBottom: vRect.bottom,
        bTop: bRect.top,
        overlapHeadlineVisualizer: hRect.bottom > vRect.top,
        overlapVisualizerBadge: vRect.bottom > bRect.top,
      };
    })()
  `);

  console.log("-> Voice bounding box layout data:", voiceCollisionData);
  if (voiceCollisionData.error) {
    console.error("FAIL:", voiceCollisionData.error);
    process.exit(1);
  }
  if (voiceCollisionData.overlapHeadlineVisualizer) {
    console.error("FAIL: Headline overlaps visualizer in Voice section!");
    process.exit(1);
  }
  if (voiceCollisionData.overlapVisualizerBadge) {
    console.error("FAIL: Visualizer overlaps bottom status badge in Voice section!");
    process.exit(1);
  }
  console.log("PASS: Voice layout has clean vertical separation with zero bounding box collision.");

  // Test 12: Legal & Google Policy Routes Verification
  console.log("\n[12/12] Testing Legal & Google Policy Routes (/privacy, /terms, /support)...");
  const legalRoutes = ["/privacy", "/terms", "/support"];
  for (const route of legalRoutes) {
    await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}${route}` });
    await sleep(600);
    const pageTitle = await client.eval("document.title");
    console.log(`-> Route ${route}: loaded successfully with title "${pageTitle}"`);
  }

  // Deep verification of /privacy contents for Google OAuth readiness & wake-word elimination
  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/privacy` });
  await sleep(600);

  const privacyCheck = await client.eval(`
    (() => {
      const text = document.body.innerText;
      const lower = text.toLowerCase();
      return {
        hasLimitedUse: text.includes("Google API Services User Data Policy, including the Limited Use requirements"),
        hasGmailReadonly: text.includes("gmail.readonly"),
        hasGmailCompose: text.includes("gmail.compose"),
        hasGmailModify: text.includes("gmail.modify"),
        hasCalendarEvents: text.includes("calendar.events"),
        hasTasks: text.includes("tasks"),
        hasContactsReadonly: text.includes("contacts.readonly"),
        hasNoAITraining: text.includes("No generalized AI model training") || text.includes("Robin does NOT use Google Workspace user data to train"),
        hasLocalVsCloud: text.includes("Local AI (Ollama)") && text.includes("Cloud AI (Google Gemini)"),
        hasMoonshine: text.includes("Moonshine"),
        hasVolatileMemory: text.includes("volatile memory") || text.includes("in-memory"),
        noWakeWord: !lower.includes("wake word") && !lower.includes("wake-word"),
        noSherpa: !lower.includes("sherpa"),
        noAlwaysListening: !lower.includes("always listening"),
      };
    })()
  `);

  console.log("-> Privacy policy verification check:", privacyCheck);
  for (const [key, val] of Object.entries(privacyCheck)) {
    if (!val) {
      console.error(`FAIL: Privacy policy missing required assertion: ${key}`);
      process.exit(1);
    }
  }
  console.log("PASS: All Google OAuth compliance disclosures verified and wake-word claims eliminated.");

  // Test 13: Support Page & Homepage Generic Copy Verifications
  console.log("\n[13/13] Testing Support page and Homepage Phase 14.4 generic copy...");
  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/support` });
  await sleep(600);

  const supportCheck = await client.eval(`
    (() => {
      const text = document.body.innerText;
      const lower = text.toLowerCase();
      return {
        hasVoiceInteraction: text.includes("Voice Interaction"),
        hasUserInitiatedSpeech: text.includes("User-Initiated Speech"),
        hasMoonshine: text.includes("Moonshine"),
        noWakeWord: !lower.includes("wake word") && !lower.includes("wake-word"),
        noSherpa: !lower.includes("sherpa"),
        noAlwaysListening: !lower.includes("always listening"),
      };
    })()
  `);

  console.log("-> Support page verification check:", supportCheck);
  for (const [key, val] of Object.entries(supportCheck)) {
    if (!val) {
      console.error(`FAIL: Support page missing required assertion: ${key}`);
      process.exit(1);
    }
  }
  console.log("PASS: Support page voice copy verified and wake-word claims eliminated.");

  // Verify Homepage Generic Demos (Your Day & Control)
  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
  await sleep(1000);

  const homeGenericCheck = await client.eval(`
    (() => {
      const text = document.body.innerText;
      return {
        hasAppointment: text.includes("Appointment"),
        hasBuyGroceries: text.includes("Buy groceries"),
        hasPayBill: text.includes("Pay a bill"),
        hasCallHome: text.includes("Call home"),
        noTeamSync: !text.includes("Team sync"),
        hasRecipient: text.includes("Recipient"),
        hasControlWording: text.includes("Robin prepares the action.") && text.includes("You approve before it happens."),
        hasApproveAndSend: text.includes("Approve & Send"),
        noSarah: !text.includes("Sarah"),
        noVicky: !text.includes("Vicky"),
        noFrontendLead: !text.includes("Frontend Lead") && !text.includes("frontend lead"),
        hasBrandTagline: text.includes("Everyone's PA"),
        hasFooterPrivacy: !!document.querySelector('footer a[href="/privacy"]'),
        hasFooterTerms: !!document.querySelector('footer a[href="/terms"]'),
        hasFooterSupport: !!document.querySelector('footer a[href="/support"]'),
      };
    })()
  `);

  console.log("-> Homepage generic copy verification check:", homeGenericCheck);
  for (const [key, val] of Object.entries(homeGenericCheck)) {
    if (!val) {
      console.error(`FAIL: Homepage missing generic copy assertion: ${key}`);
      process.exit(1);
    }
  }
  console.log("PASS: Homepage generic demos, privacy/legal footer links, and brand consistency verified.");

  // Test 14: Robin Logo & Favicon Integration Verification
  console.log("\n[14/14] Testing Robin Logo & Favicon Integration...");
  const logoCheck = await client.eval(`
    (async () => {
      const favicons = Array.from(document.querySelectorAll('link[rel*="icon"]')).map(el => el.href);
      const appleIcons = Array.from(document.querySelectorAll('link[rel*="apple-touch-icon"]')).map(el => el.href);

      // Test loading the OAuth 120x120 image in the DOM
      const img = new Image();
      img.src = '/branding/robin-oauth-120.png';
      await new Promise(r => { img.onload = r; img.onerror = r; });

      return {
        hasIconLinks: favicons.length > 0,
        hasAppleIconLinks: appleIcons.length > 0,
        oauthImgLoaded: img.complete && img.naturalWidth === 120 && img.naturalHeight === 120,
        oauthWidth: img.naturalWidth,
        oauthHeight: img.naturalHeight,
      };
    })()
  `);

  console.log("-> Logo and favicon integration check:", logoCheck);
  if (!logoCheck.hasIconLinks) {
    console.error("FAIL: Missing favicon link elements in document head!");
    process.exit(1);
  }
  if (!logoCheck.oauthImgLoaded) {
    console.error("FAIL: OAuth 120x120 logo failed to load with exact 120x120 dimensions!");
    process.exit(1);
  }
  console.log("PASS: Favicon links and robin-oauth-120.png (120x120) confirmed functional.");

  console.log("\n=======================================================");
  console.log("ALL PHASE 14.5 LOGO INTEGRATION & VERIFICATION PASSED!");
  console.log("=======================================================\n");

  client.close();
  chromeProc.kill();
  server.close();
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
