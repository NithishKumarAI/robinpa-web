import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9226;
const APP_PORT = 3011;

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
  const profileDir = path.resolve("./.chrome-qa-profile-phase13-snap");
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
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send("Page.navigate", { url: `http://localhost:${APP_PORT}/` });
  await sleep(1500);

  const scenes = [
    { name: "01_hero", selector: "#hero" },
    { name: "02_meet_robin", selector: "#meet-robin" },
    { name: "03_capabilities", selector: "#capabilities" },
    { name: "04_safety", selector: "#safety" },
    { name: "05_voice", selector: "#voice" },
    { name: "06_memory", selector: "#memory" },
    { name: "07_local_first", selector: "#local-first" },
    { name: "08_download", selector: "#download" },
  ];

  for (const scene of scenes) {
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
    fs.writeFileSync(path.join(screenDir, `phase13_${scene.name}.png`), buffer);
    console.log(`Saved screenshot: phase13_${scene.name}.png`);
  }

  client.close();
  chromeProc.kill();
  server.close();
  console.log("Screenshots captured successfully!");
  process.exit(0);
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});
