import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9224;
const APP_PORT = 3009;

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
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  console.log("=== Testing Google Analytics 4 in Static Output ===");

  // Start a simple static server serving out/ on port 3009 using npx serve
  const server = spawn("npx", ["serve", "out", "-l", String(APP_PORT), "--no-clipboard"], {
    shell: true,
    stdio: "inherit",
  });

  // Wait for server to start
  await sleep(1500);

  // Start Chrome
  const chromeDataDir = path.resolve(".chrome-qa-analytics-" + Date.now());
  const chrome = spawn(
    CHROME_PATH,
    [
      "--headless=new",
      `--remote-debugging-port=${CDP_PORT}`,
      `--user-data-dir=${chromeDataDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  let targets = null;
  for (let i = 0; i < 30; i++) {
    await sleep(300);
    try {
      targets = await getJson(`http://127.0.0.1:${CDP_PORT}/json/list`);
      if (targets && targets.length > 0) break;
    } catch {}
  }

  const pageTarget = targets.find((t) => t.type === "page") || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.waitOpen();

  await client.send("Runtime.enable");
  await client.send("Page.enable");

  // Navigate to Homepage
  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
  await sleep(2000);

  const initialCheck = await client.eval(`(() => {
    return {
      hasDataLayer: Array.isArray(window.dataLayer),
      dataLayerLength: window.dataLayer?.length || 0,
      dataLayerEvents: window.dataLayer ? JSON.parse(JSON.stringify(window.dataLayer)) : [],
    };
  })()`);
  console.log("Homepage initial dataLayer state:", JSON.stringify(initialCheck, null, 2));

  // Click the Meet Robin CTA in Hero
  console.log("\n--- Testing 'meet_robin_click' CTA ---");
  await client.eval(`(() => {
    const btn = document.querySelector('a[href="#meet-robin"]');
    if (btn) btn.click();
  })()`);
  await sleep(500);

  const ctaCheck = await client.eval(`(() => {
    return {
      dataLayerEvents: window.dataLayer ? JSON.parse(JSON.stringify(window.dataLayer)) : [],
    };
  })()`);
  console.log("dataLayer after Meet Robin click:", JSON.stringify(ctaCheck, null, 2));

  // Test client-side navigation to /privacy
  console.log("\n--- Testing Navigation to /privacy ---");
  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/privacy` });
  await sleep(2000);

  const privacyCheck = await client.eval(`(() => {
    return {
      pathname: window.location.pathname,
      dataLayerEvents: window.dataLayer ? JSON.parse(JSON.stringify(window.dataLayer)) : [],
    };
  })()`);
  console.log("dataLayer after navigating to /privacy:", JSON.stringify(privacyCheck, null, 2));

  // Cleanup
  client.close();
  chrome.kill();
  server.kill();

  if (fs.existsSync(chromeDataDir)) {
    try {
      fs.rmSync(chromeDataDir, { recursive: true, force: true });
    } catch {}
  }

  console.log("\n=== Test Finished Successfully ===");
  process.exit(0);
}

run().catch((e) => {
  console.error("Test error:", e);
  process.exit(1);
});
