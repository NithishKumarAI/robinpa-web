import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9228;
const APP_PORT = 3013;

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

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
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

async function capture() {
  const outDir = path.resolve("./out");
  const server = await createStaticServer(outDir, APP_PORT);
  const profileDir = path.resolve("./.chrome-qa-profile-phase14-snap");
  if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

  const screenDir = path.resolve("./qa-screenshots");
  if (!fs.existsSync(screenDir)) fs.mkdirSync(screenDir, { recursive: true });

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

  const targets = await getJson(`http://localhost:${CDP_PORT}/json/list`);
  const pageTarget = targets.find((t) => t.type === "page");
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.waitOpen();

  await client.send("Page.enable");
  await client.send("Runtime.enable");

  // 1. Desktop captures (1440x900)
  console.log("=== CAPTURING DESKTOP SCENES (1440x900) ===");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
  await sleep(1500);

  const desktopScenes = [
    { name: "01_hero", selector: "#hero" },
    { name: "02_meet_robin", selector: "#meet-robin" },
    { name: "03_your_day", selector: "#your-day" },
    { name: "04_people_email", selector: "#people-email" },
    { name: "05_control", selector: "#control" },
    { name: "06_voice", selector: "#voice" },
    { name: "07_memory", selector: "#memory" },
    { name: "08_ai_choice", selector: "#ai-choice" },
    { name: "09_download", selector: "#download" },
  ];

  for (const scene of desktopScenes) {
    await client.eval(`
      (() => {
        const el = document.querySelector('${scene.selector}');
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      })()
    `);
    await sleep(600);

    const shot = await client.send("Page.captureScreenshot", { format: "png" });
    const buffer = Buffer.from(shot.data, "base64");
    fs.writeFileSync(path.join(screenDir, `phase14_desktop_${scene.name}.png`), buffer);
    console.log(`Saved: phase14_desktop_${scene.name}.png`);
  }

  // 1b. Phase 14.2 Transition Captures (5 stages across 4 key transitions)
  console.log("\n=== CAPTURING PHASE 14.2 FLUID TRANSITIONS (5 STAGES PER TRANSITION) ===");
  const transitionDir = path.join(screenDir, "transitions");
  if (!fs.existsSync(transitionDir)) fs.mkdirSync(transitionDir, { recursive: true });

  const targetTransitions = [
    { name: "hero_to_meet_robin", fromId: "hero", toId: "meet-robin" },
    { name: "meet_robin_to_your_day", fromId: "meet-robin", toId: "your-day" },
    { name: "control_to_voice", fromId: "control", toId: "voice" },
    { name: "ai_choice_to_download", fromId: "ai-choice", toId: "download" },
  ];

  const stages = [
    { label: "01_settled_source", progress: 0.00 },
    { label: "02_early_release", progress: 0.24 },
    { label: "03_mid_travel", progress: 0.50 },
    { label: "04_early_reform", progress: 0.82 },
    { label: "05_settled_destination", progress: 1.00 },
  ];

  for (const trans of targetTransitions) {
    console.log(`-> Capturing transition: ${trans.name}`);
    for (const stage of stages) {
      await client.eval(`
        (() => {
          const triggers = window.ScrollTrigger.getAll();
          const tr = triggers.find(
            (st) =>
              st.trigger &&
              st.trigger.id === '${trans.fromId}' &&
              st.vars &&
              st.vars.endTrigger &&
              st.vars.endTrigger.id === '${trans.toId}'
          );
          if (tr) {
            const scrollPos = tr.start + (tr.end - tr.start) * ${stage.progress};
            window.scrollTo({ top: scrollPos, behavior: 'instant' });
            tr.update();
          }
        })()
      `);
      await sleep(500);

      const shot = await client.send("Page.captureScreenshot", { format: "png" });
      const buffer = Buffer.from(shot.data, "base64");
      const filename = `trans_${trans.name}_${stage.label}.png`;
      fs.writeFileSync(path.join(transitionDir, filename), buffer);
      console.log(`   Saved: ${filename}`);
    }
  }

  // 2. Mobile captures (390x844)
  console.log("\n=== CAPTURING MOBILE SCENES (390x844) ===");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
  await sleep(1500);

  const mobileScenes = [
    { name: "01_hero", selector: "#hero" },
    { name: "02_meet_robin", selector: "#meet-robin" },
    { name: "03_your_day", selector: "#your-day" },
    { name: "04_people_email", selector: "#people-email" },
    { name: "05_control", selector: "#control" },
    { name: "06_voice", selector: "#voice" },
    { name: "07_memory", selector: "#memory" },
    { name: "08_ai_choice", selector: "#ai-choice" },
    { name: "09_download", selector: "#download" },
  ];

  for (const scene of mobileScenes) {
    await client.eval(`
      (() => {
        const el = document.querySelector('${scene.selector}');
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      })()
    `);
    await sleep(600);

    const shot = await client.send("Page.captureScreenshot", { format: "png" });
    const buffer = Buffer.from(shot.data, "base64");
    fs.writeFileSync(path.join(screenDir, `phase14_mobile_${scene.name}.png`), buffer);
    console.log(`Saved: phase14_mobile_${scene.name}.png`);
  }

  // 2b. Voice 3-State Captures (Desktop 1440x900)
  console.log("\n=== CAPTURING VOICE 3-STATE INTERACTIONS ===");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
  await sleep(1500);

  const voiceStates = [
    { name: "listening", progress: 0.15 },
    { name: "thinking", progress: 0.50 },
    { name: "speaking", progress: 0.85 },
  ];

  for (const vs of voiceStates) {
    await client.eval(`
      (() => {
        const st = window.ScrollTrigger ? window.ScrollTrigger.getAll().find((s) => s.vars && s.vars.id === 'voice-trigger') : null;
        if (st) {
          const scrollPos = st.start + (st.end - st.start) * ${vs.progress};
          window.scrollTo({ top: scrollPos, behavior: 'instant' });
          st.update();
        }
      })()
    `);
    await sleep(600);

    const shot = await client.send("Page.captureScreenshot", { format: "png" });
    const buffer = Buffer.from(shot.data, "base64");
    fs.writeFileSync(path.join(screenDir, `voice_state_${vs.name}.png`), buffer);
    console.log(`Saved: voice_state_${vs.name}.png`);
  }

  // 3. Multi-viewport check for overflow & errors
  console.log("\n=== TESTING ADDITIONAL VIEWPORTS FOR OVERFLOW & ERRORS ===");
  const testViewports = [
    { name: "tablet", width: 768, height: 1024 },
    { name: "small_laptop", width: 1366, height: 768 },
    { name: "large_desktop", width: 1920, height: 1080 },
  ];

  for (const vp of testViewports) {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
    await sleep(1000);

    const hasOverflow = await client.eval(`
      document.documentElement.scrollWidth > window.innerWidth
    `);
    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): horizontal overflow = ${hasOverflow}`);
    if (hasOverflow) {
      console.error(`FAIL: Viewport ${vp.name} has horizontal overflow!`);
      process.exit(1);
    }
  }

  client.close();
  chromeProc.kill();
  server.close();
  console.log("\nAll visual QA captures & viewport checks completed successfully!");
  process.exit(0);
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});
