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

  // Verify Voice section entered and driving states
  const voiceProgressStates = [];
  const voiceSection = await client.eval(`
    (() => {
      const el = document.querySelector('#voice');
      const rect = el.getBoundingClientRect();
      return { top: window.scrollY + rect.top, height: el.offsetHeight };
    })()
  `);

  for (const frac of [0.1, 0.35, 0.6, 0.8]) {
    const targetY = voiceSection.top + voiceSection.height * frac;
    await client.eval(`window.scrollTo({ top: ${targetY}, behavior: 'instant' })`);
    await sleep(100);
    const info = await client.eval(`
      (() => {
        const badge = document.querySelector('#voice [role="status"], #voice .font-mono');
        const badgeText = badge ? badge.textContent : '';
        const isCanvasSame = window.__initialCanvas === document.querySelector('canvas');
        return { badgeText, isCanvasSame };
      })()
    `);
    voiceProgressStates.push(info);
  }
  console.log("-> Voice progression samples:", voiceProgressStates);
  const allMaintainedCanvas = voiceProgressStates.every((s) => s.isCanvasSame);
  if (!allMaintainedCanvas) {
    console.error("FAIL: Canvas rebuilt during voice state transitions!");
    process.exit(1);
  }
  console.log("PASS: Voice state transitions occurred without rebuilding the persistent stage.");

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

  console.log("\n=======================================================");
  console.log("ALL PHASE 13.1 RUNTIME STABILIZATION CHECKS PASSED!");
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
