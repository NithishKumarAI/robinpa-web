import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9229;
const APP_PORT = 3000;
const OUTPUT_DIR = path.resolve("qa-screenshots/final");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
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

  async screenshot(filename) {
    const res = await this.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    const buffer = Buffer.from(res.data, "base64");
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
    console.log(`Saved screenshot: ${filename}`);
  }

  close() {
    this.ws.close();
  }
}

async function runVerification() {
  const tempProfile = path.resolve(".chrome-qa-temp");
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${tempProfile}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ]);

  try {
    let retries = 25;
    let list = null;
    while (retries > 0) {
      try {
        list = await getJson(`http://127.0.0.1:${CDP_PORT}/json/list`);
        if (list && list.length > 0) break;
      } catch {}
      await sleep(300);
      retries--;
    }

    if (!list || list.length === 0) {
      throw new Error("Could not connect to Chrome CDP");
    }

    const pageTarget = list.find((t) => t.type === "page") || list[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.waitOpen();

    await client.send("Page.enable");
    await client.send("Runtime.enable");

    console.log("Connected to Chrome. Navigating to homepage...");
    await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}` });
    await sleep(2500);

    // 1. Check title and meta
    const pageMeta = await client.eval(`({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
    })`);
    console.log("\n--- Homepage Metadata ---", pageMeta);

    // 2. Desktop Viewport (1440x900)
    console.log("\nSetting desktop viewport 1440x900...");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(800);

    // Hero screenshot
    await client.eval("window.scrollTo(0, 0)");
    await sleep(600);
    await client.screenshot("final_desktop_01_hero.png");

    const sectionsToCapture = [
      { id: "why-robin", name: "final_desktop_02_why_robin.png" },
      { id: "meet-robin", name: "final_desktop_03_meet_robin.png" },
      { id: "product", name: "final_desktop_04_capabilities.png" },
      { id: "pa-experience", name: "final_desktop_05_pa_experience.png" },
      { id: "ai-choice", name: "final_desktop_06_local_cloud.png" },
      { id: "privacy", name: "final_desktop_07_privacy.png" },
      { id: "how-it-works", name: "final_desktop_08_how_it_works.png" },
      { id: "faq", name: "final_desktop_09_faq.png" },
      { id: "download", name: "final_desktop_10_download.png" },
    ];

    for (const sec of sectionsToCapture) {
      await client.eval(`(() => {
        const el = document.getElementById('${sec.id}');
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      })()`);
      await sleep(700);
      await client.screenshot(sec.name);
    }

    // Test FAQ interaction
    console.log("\nTesting FAQ accordion expand...");
    const faqClicked = await client.eval(`(() => {
      const btn = document.querySelector('#faq button');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()`);
    if (faqClicked) {
      await sleep(500);
      await client.screenshot("final_desktop_09b_faq_expanded.png");
    }

    // Check Download links
    const downloadHrefs = await client.eval(`(() => {
      const links = Array.from(document.querySelectorAll('a[download]'));
      return links.map(a => a.href);
    })()`);
    console.log("\nVerified Download link targets:", downloadHrefs);

    // 3. Mobile Viewport (390x844 - iPhone 12/13/14)
    console.log("\nSetting mobile viewport 390x844...");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(800);

    await client.eval("window.scrollTo(0, 0)");
    await sleep(600);
    await client.screenshot("final_mobile_01_hero.png");

    await client.eval(`document.getElementById('product')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await sleep(600);
    await client.screenshot("final_mobile_02_capabilities.png");

    await client.eval(`document.getElementById('faq')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await sleep(600);
    await client.screenshot("final_mobile_03_faq.png");

    // 4. Test Legal Pages
    console.log("\nTesting /privacy page...");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/privacy` });
    await sleep(1500);
    const privacyTitle = await client.eval("document.title");
    console.log("Privacy page title:", privacyTitle);
    await client.screenshot("final_privacy_page.png");

    console.log("Testing /terms page...");
    await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/terms` });
    await sleep(1500);
    const termsTitle = await client.eval("document.title");
    console.log("Terms page title:", termsTitle);
    await client.screenshot("final_terms_page.png");

    console.log("Testing /support page...");
    await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/support` });
    await sleep(1500);
    const supportTitle = await client.eval("document.title");
    console.log("Support page title:", supportTitle);
    await client.screenshot("final_support_page.png");

    console.log("\n=== Console Errors Reported ===");
    console.log(client.errors.length === 0 ? "None! (0 errors)" : client.errors);

    client.close();
  } finally {
    chromeProcess.kill();
    try {
      fs.rmSync(tempProfile, { recursive: true, force: true });
    } catch {}
  }
}

runVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
