import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;
const SCREENSHOT_DIR = path.resolve("qa-screenshots");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

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
      this.ws.onerror = (err) => reject(err);
    });
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
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
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }

  async screenshot(filename) {
    const res = await this.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    const buffer = Buffer.from(res.data, "base64");
    fs.writeFileSync(path.join(SCREENSHOT_DIR, filename), buffer);
    console.log(`Saved screenshot: ${filename}`);
  }

  close() {
    this.ws.close();
  }
}

async function captureViewport(client, name, width, height, isMobile = false) {
  console.log(`\n=== Testing Viewport: ${name} (${width}x${height}) ===`);
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: isMobile ? 2 : 1,
    mobile: isMobile,
  });
  await sleep(1000);

  // Scroll to top
  await client.eval("window.scrollTo(0, 0)");
  await sleep(600);
  await client.screenshot(`${name}_01_hero.png`);

  const sections = [
    "meet-robin",
    "capabilities",
    "safety",
    "voice",
    "memory",
    "local-first",
    "download",
  ];

  for (let i = 0; i < sections.length; i++) {
    const id = sections[i];
    const metrics = await client.eval(`(() => {
      const el = document.getElementById('${id}');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      // Scroll into roughly middle of section pinned track
      const targetY = top + (el.clientHeight > window.innerHeight ? window.innerHeight * 0.8 : 0);
      window.scrollTo({ top: targetY, behavior: 'instant' });
      return { top, height: el.clientHeight, targetY };
    })()`);

    await sleep(600);
    await client.screenshot(`${name}_${String(i + 2).padStart(2, "0")}_${id}.png`);

    // Check overflow and layout info
    const check = await client.eval(`(() => {
      const scrollW = document.documentElement.scrollWidth;
      const clientW = document.documentElement.clientWidth;
      const el = document.getElementById('${id}');
      const card = el ? el.querySelector('.p-4, .rounded-xl, .rounded-2xl') : null;
      const cardRect = card ? card.getBoundingClientRect() : null;
      const orb = el ? el.querySelector('canvas') : null;
      const orbRect = orb ? orb.getBoundingClientRect() : null;
      return {
        overflow: scrollW > clientW,
        scrollW,
        clientW,
        cardTouchesOrb: (cardRect && orbRect) ? !(cardRect.bottom < orbRect.top || cardRect.top > orbRect.bottom || cardRect.right < orbRect.left || cardRect.left > orbRect.right) : false,
      };
    })()`);

    console.log(`Section [${id}] layout check:`, check);
  }
}

async function run() {
  console.log("Starting Chrome for Visual QA...");
  const chromeProcess = spawn(
    CHROME_PATH,
    [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      "--disable-gpu",
      "--no-sandbox",
      "--user-data-dir=" + process.env.TEMP + "\\chrome_qa_profile_" + Date.now(),
    ],
    { stdio: "ignore" }
  );

  try {
    let targets = null;
    for (let i = 0; i < 30; i++) {
      try {
        targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
        if (targets && targets.length > 0) break;
      } catch (e) {
        await sleep(200);
      }
    }

    const pageTarget = targets.find((t) => t.type === "page") || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.waitOpen();

    await client.send("Runtime.enable");
    await client.send("Page.enable");

    console.log("Loading http://localhost:3005 ...");
    await client.send("Page.navigate", { url: "http://localhost:3005" });
    await sleep(2000);

    // Viewport 1: 1440x900
    await captureViewport(client, "desktop_1440", 1440, 900, false);

    // Viewport 2: 1366x768 (Windows Laptop standard)
    await captureViewport(client, "laptop_1366", 1366, 768, false);

    // Viewport 3: 390x844 (Mobile)
    await captureViewport(client, "mobile_390", 390, 844, true);

    // Viewport 4: Reduced Motion
    console.log("\n=== Testing Reduced Motion Mode ===");
    await client.send("Emulation.setEmulatedMedia", {
      media: "screen",
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(1000);
    await client.eval("window.scrollTo(0, 0)");
    await sleep(500);
    await client.screenshot("reduced_motion_hero.png");

    await client.eval("document.getElementById('meet-robin').scrollIntoView()");
    await sleep(500);
    await client.screenshot("reduced_motion_meet_robin.png");

    await client.eval("document.getElementById('capabilities').scrollIntoView()");
    await sleep(500);
    await client.screenshot("reduced_motion_capabilities.png");

    await client.eval("document.getElementById('voice').scrollIntoView()");
    await sleep(500);
    await client.screenshot("reduced_motion_voice.png");

    client.close();
  } finally {
    chromeProcess.kill();
  }
}

run().catch((err) => {
  console.error("QA Capture failed:", err);
  process.exit(1);
});
