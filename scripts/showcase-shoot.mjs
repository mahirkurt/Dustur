import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname } from "node:path";
import { writeFileSync, mkdirSync } from "node:fs";

const MIME = {".html":"text/html",".css":"text/css",".js":"application/javascript",".json":"application/json",".svg":"image/svg+xml",".woff2":"font/woff2",".png":"image/png",".xml":"application/xml"};

const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(req.url.split("?")[0]).replace(/^\//, "");
    const filePath = path || "index.html";
    const st = await stat(filePath).catch(() => null);
    if (!st) { res.statusCode = 404; res.end(); return; }
    const body = await readFile(filePath);
    res.setHeader("content-type", MIME[extname(filePath)] || "application/octet-stream");
    res.end(body);
  } catch (e) { res.statusCode = 500; res.end(String(e)); }
});
await new Promise(r => server.listen(8770, "127.0.0.1", r));

mkdirSync("dist/showcase", { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 2 });
const page = await ctx.newPage();

// Desktop · 1440 wide · viewport only screenshots
await page.setViewportSize({ width: 1440, height: 900 });

const sections = ["", "#doktrini", "#renk", "#tipografi", "#yuzey", "#jeton", "#audit", "#install"];
for (const s of sections) {
  await page.goto(`http://127.0.0.1:8770/index.html${s}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const buf = await page.screenshot({ type: "png" });   // viewport only
  const name = s ? s.slice(1) : "hero";
  writeFileSync(`dist/showcase/${name}.png`, buf);
  console.log(name + ":", buf.length, "bytes");
}

// Mobile · iPhone 14 size · viewport screenshots
await page.setViewportSize({ width: 390, height: 844 });

const mobSections = ["", "#doktrini", "#renk", "#tipografi", "#jeton", "#install"];
for (const s of mobSections) {
  await page.goto(`http://127.0.0.1:8770/index.html${s}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const buf = await page.screenshot({ type: "png" });
  const name = "m-" + (s ? s.slice(1) : "hero");
  writeFileSync(`dist/showcase/${name}.png`, buf);
  console.log(name + ":", buf.length, "bytes");
}

await browser.close();
server.close();
