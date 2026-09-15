import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9223;
const APP_PORT = 3008;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    }).on("error", reject);
  });
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

async function runTests() {
  console.log("=== Phase 11 Production Hardening Verification ===");

  // 1. Start next start server on port 3008
  console.log(`Starting production server on port ${APP_PORT}...`);
  const server = spawn("npx", ["next", "start", "-p", String(APP_PORT)], {
    shell: true,
    stdio: "inherit",
  });

  // Wait for server to respond
  let ready = false;
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      const res = await fetchUrl(`http://localhost:${APP_PORT}/`);
      if (res.statusCode === 200) {
        ready = true;
        break;
      }
    } catch {}
  }

  if (!ready) {
    console.error("Failed to connect to production Next.js server!");
    server.kill();
    process.exit(1);
  }

  console.log("Production server is up and responding.");

  // 2. Test Security Headers
  console.log("\n--- Checking Security Headers ---");
  const rootRes = await fetchUrl(`http://localhost:${APP_PORT}/`);
  const headers = rootRes.headers;
  console.log("X-Content-Type-Options:", headers["x-content-type-options"]);
  console.log("X-Frame-Options:", headers["x-frame-options"]);
  console.log("Referrer-Policy:", headers["referrer-policy"]);
  console.log("Permissions-Policy:", headers["permissions-policy"]);
  console.log("X-Powered-By header absent:", headers["x-powered-by"] === undefined);

  // 3. Test robots.txt
  console.log("\n--- Checking /robots.txt ---");
  const robotsRes = await fetchUrl(`http://localhost:${APP_PORT}/robots.txt`);
  console.log("Status:", robotsRes.statusCode);
  console.log("Body:\n" + robotsRes.body);

  // 4. Test sitemap.xml
  console.log("\n--- Checking /sitemap.xml ---");
  const sitemapRes = await fetchUrl(`http://localhost:${APP_PORT}/sitemap.xml`);
  console.log("Status:", sitemapRes.statusCode);
  console.log("URLs count in sitemap:", (sitemapRes.body.match(/<loc>/g) || []).length);
  console.log("Body snippet:\n" + sitemapRes.body.substring(0, 400));

  // 5. Start Chrome for CDP Testing
  console.log("\n--- Starting Chrome for Viewport & Accessibility QA ---");
  const chromeDataDir = path.resolve(".chrome-qa-profile-" + Date.now());
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

  const viewports = [
    { name: "Mobile", width: 390, height: 844 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Laptop", width: 1366, height: 768 },
    { name: "Desktop", width: 1440, height: 900 },
    { name: "Large Desktop", width: 1920, height: 1080 },
  ];

  console.log("\n--- Testing Homepage Across Viewports ---");
  for (const vp of viewports) {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768,
    });

    await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
    await sleep(1500);

    const val = await client.eval(`(() => {
      return {
        title: document.title,
        hasH1: !!document.querySelector('h1'),
        h1Text: document.querySelector('h1')?.textContent?.trim() || '',
        hasSkipLink: !!document.querySelector('a[href="#main-content"]'),
        mainId: !!document.getElementById('main-content'),
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
      };
    })()`);

    console.log(`[${vp.name} (${vp.width}x${vp.height})] Overflow: ${val.hasOverflow}, Title: "${val.title}", H1: "${val.h1Text}", SkipLink: ${val.hasSkipLink}, MainId: ${val.mainId}`);
  }

  console.log("\n--- Testing Legal Pages ---");
  const legalPages = ["privacy", "terms", "support"];
  for (const pageName of legalPages) {
    await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/${pageName}` });
    await sleep(1000);

    const val = await client.eval(`(() => {
      return {
        title: document.title,
        hasH1: !!document.querySelector('h1'),
        h1Text: document.querySelector('h1')?.textContent?.trim() || '',
        hasSkipLink: !!document.querySelector('a[href="#main-content"]'),
        mainId: !!document.getElementById('main-content'),
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
      };
    })()`);

    console.log(`[/${pageName}] Overflow: ${val.hasOverflow}, Title: "${val.title}", H1: "${val.h1Text}", Canonical: "${val.canonical}"`);
  }

  // Test reduced motion
  console.log("\n--- Testing Reduced Motion Mode ---");
  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
  await sleep(1500);

  const reducedVal = await client.eval(`(() => {
    return {
      hasMeetRobinStatic: !!document.querySelector('#meet-robin'),
      lenisSmooth: document.documentElement.classList.contains('lenis-smooth'),
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  })()`);
  console.log("Reduced motion status:", reducedVal);

  // Check console errors
  console.log("\n--- Console Error Audit ---");
  console.log("Total uncaught errors:", client.errors.length);
  if (client.errors.length > 0) {
    console.error("Errors:", client.errors);
  }

  // Cleanup
  client.close();
  chrome.kill();
  server.kill();

  if (fs.existsSync(chromeDataDir)) {
    try {
      fs.rmSync(chromeDataDir, { recursive: true, force: true });
    } catch {}
  }

  console.log("\n=== Testing Complete ===");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
