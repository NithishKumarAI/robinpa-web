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

async function testPage(client, route, namePrefix) {
  console.log(`\n--- Testing ${route} ---`);
  await client.send("Page.navigate", { url: `http://localhost:3005${route}` });
  await sleep(1500);

  // Desktop check
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sleep(500);

  const desktopInfo = await client.eval(`(() => {
    return {
      title: document.title,
      h1: document.querySelector('h1')?.textContent || '',
      headingsCount: document.querySelectorAll('h2, h3').length,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  })()`);

  console.log(`Desktop (1440x900) on ${route}:`, desktopInfo);
  await client.screenshot(`${namePrefix}_desktop_1440.png`);

  // Mobile check
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await sleep(500);

  const mobileInfo = await client.eval(`(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  })()`);

  console.log(`Mobile (390x844) on ${route}:`, mobileInfo);
  await client.screenshot(`${namePrefix}_mobile_390.png`);
}

async function run() {
  console.log("Starting Chrome for Phase 10 QA...");
  const chromeProcess = spawn(
    CHROME_PATH,
    [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      "--disable-gpu",
      "--no-sandbox",
      "--user-data-dir=" + process.env.TEMP + "\\chrome_phase10_profile_" + Date.now(),
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

    // Test 1: Footer link navigation from Homepage
    console.log("\n=== Testing Homepage Footer Link Navigation ===");
    await client.send("Page.navigate", { url: "http://localhost:3005" });
    await sleep(2000);

    const footerLinks = await client.eval(`(() => {
      const footer = document.querySelector('footer');
      if (!footer) return null;
      const links = Array.from(footer.querySelectorAll('a')).map(a => ({
        text: a.textContent.trim(),
        href: a.getAttribute('href')
      }));
      return links;
    })()`);
    console.log("Found footer links on Homepage:", footerLinks);

    // Test 2: Test /privacy
    await testPage(client, "/privacy", "phase10_privacy");

    // Test 3: Test /terms
    await testPage(client, "/terms", "phase10_terms");

    // Test 4: Test /support
    await testPage(client, "/support", "phase10_support");

    // Test 5: Verify Home link from /support
    console.log("\n=== Testing Return to Home link from /support ===");
    await client.eval(`document.querySelector('header a[href="/"]')?.click()`);
    await sleep(1500);
    const currentUrl = await client.eval(`window.location.pathname`);
    console.log("Current path after clicking Return to Home:", currentUrl);

    console.log("\nErrors logged during run:", client.errors.length);
    if (client.errors.length > 0) {
      console.log("Errors:", client.errors);
    }

    client.close();
  } finally {
    chromeProcess.kill();
  }
}

run().catch((err) => {
  console.error("Phase 10 test failed:", err);
  process.exit(1);
});
