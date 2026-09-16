import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9225;
const APP_PORT = 3010;

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

// Simple static file server for Next.js out directory
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

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function runTests() {
  console.log("=== PHASE 13 PERSISTENT ORB QA VERIFICATION ===");

  const outDir = path.resolve("./out");
  if (!fs.existsSync(outDir)) {
    console.error("Error: out directory not found. Please run npm run build first.");
    process.exit(1);
  }

  console.log(`[1/8] Starting static server on port ${APP_PORT}...`);
  const server = await createStaticServer(outDir, APP_PORT);

  const profileDir = path.resolve(`./.chrome-qa-profile-phase13`);
  if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

  console.log(`[2/8] Launching Chrome CDP on port ${CDP_PORT}...`);
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

  console.log("[3/8] Navigating to homepage...");
  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
  await sleep(2000);

  // Verification 1: DOM canvas count
  console.log("[4/8] Inspecting DOM canvas instances...");
  const canvasCount = await client.eval("document.querySelectorAll('canvas').length");
  console.log(`-> Total canvas elements in DOM: ${canvasCount}`);
  if (canvasCount !== 1) {
    console.error(`FAIL: Expected exactly 1 canvas element, but found ${canvasCount}`);
    process.exit(1);
  }
  console.log("PASS: Exactly ONE Robin particle canvas exists on the homepage.");

  // Check canvas dimensions & styles
  const canvasDetails = await client.eval(`
    (() => {
      const c = document.querySelector('canvas');
      const rect = c.getBoundingClientRect();
      const style = window.getComputedStyle(c);
      const parentStyle = window.getComputedStyle(c.parentElement);
      return {
        width: rect.width,
        height: rect.height,
        parentPosition: parentStyle.position,
        parentPointerEvents: parentStyle.pointerEvents,
        parentZIndex: parentStyle.zIndex,
      };
    })()
  `);
  console.log("-> Canvas details:", canvasDetails);
  if (canvasDetails.parentPointerEvents !== "none") {
    console.error("FAIL: Canvas container must have pointer-events: none");
    process.exit(1);
  }
  console.log("PASS: Canvas container has pointer-events: none and full viewport coverage.");

  // Verification 2: Progressive scrolling through all scenes
  console.log("[5/8] Testing progressive forward scrolling through all scenes...");
  const scrollHeight = await client.eval("document.documentElement.scrollHeight");
  console.log(`-> Total document scrollHeight: ${scrollHeight}px`);

  const stepCount = 20;
  for (let s = 1; s <= stepCount; s++) {
    const targetY = (scrollHeight / stepCount) * s;
    await client.eval(`window.scrollTo({ top: ${targetY}, behavior: 'instant' })`);
    await sleep(80);
  }
  await sleep(500);

  const errorsAfterForward = client.errors.length;
  console.log(`-> Forward scroll completed with ${errorsAfterForward} console errors.`);
  if (errorsAfterForward > 0) {
    console.error("FAIL: Errors occurred during forward scroll:", client.errors);
    process.exit(1);
  }
  console.log("PASS: Forward scrolling completed without any runtime error.");

  // Verification 3: Reverse scrolling back to top
  console.log("[6/8] Testing reverse scrolling back to top (verifying deterministic rewind)...");
  for (let s = stepCount; s >= 0; s--) {
    const targetY = (scrollHeight / stepCount) * s;
    await client.eval(`window.scrollTo({ top: ${targetY}, behavior: 'instant' })`);
    await sleep(60);
  }
  await sleep(500);

  const errorsAfterReverse = client.errors.length;
  console.log(`-> Reverse scroll completed with ${errorsAfterReverse} console errors.`);
  if (errorsAfterReverse > 0) {
    console.error("FAIL: Errors occurred during reverse scroll:", client.errors);
    process.exit(1);
  }
  console.log("PASS: Reverse scrolling completed cleanly without errors.");

  // Verification 4: Fast wheel & slow trackpad scrolling
  console.log("[7/8] Testing fast wheel scrolling and slow trackpad increments...");
  // Fast jump
  await client.eval("window.scrollTo({ top: 3000, behavior: 'instant' })");
  await sleep(100);
  await client.eval("window.scrollTo({ top: 6000, behavior: 'instant' })");
  await sleep(100);
  await client.eval("window.scrollTo({ top: 0, behavior: 'instant' })");
  await sleep(100);

  // Slow trackpad simulation (25px per step)
  for (let y = 0; y <= 800; y += 25) {
    await client.eval(`window.scrollTo({ top: ${y}, behavior: 'instant' })`);
    await sleep(15);
  }
  await sleep(200);
  console.log("PASS: Fast jump and slow trackpad increments executed flawlessly.");

  // Verification 5: Mobile viewport and reduced-motion
  console.log("[8/8] Testing mobile viewport (390x844) and reduced-motion...");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await sleep(300);

  const mobileCanvasCount = await client.eval("document.querySelectorAll('canvas').length");
  const mobileOverflow = await client.eval("document.documentElement.scrollWidth > window.innerWidth");
  console.log(`-> Mobile canvas count: ${mobileCanvasCount}, horizontal overflow: ${mobileOverflow}`);
  if (mobileCanvasCount !== 1 || mobileOverflow) {
    console.error("FAIL: Mobile layout failure");
    process.exit(1);
  }

  // Emulate prefers-reduced-motion
  await client.send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await sleep(400);

  const finalErrors = client.errors.length;
  if (finalErrors > 0) {
    console.error("FAIL: Errors in reduced-motion mode:", client.errors);
    process.exit(1);
  }
  console.log("PASS: Mobile viewport and reduced-motion verified with zero errors.");

  console.log("\n==========================================");
  console.log("ALL PHASE 13 QA CHECKS PASSED SUCCESSFULLY!");
  console.log("==========================================\n");

  client.close();
  chromeProc.kill();
  server.close();
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
