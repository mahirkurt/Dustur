#!/usr/bin/env node
/**
 * scripts/visual-regression.mjs
 *
 * Playwright + Chromium headless ile her HTML örneğinin screenshot'unu çeker,
 * baseline ile karşılaştırır.
 *
 * İlk çalıştırma:  baseline oluşturur (dist/visual/baseline/*.png)
 * Sonraki çalıştırmalar: yeni screenshot'lar ile baseline'ı pixel-by-pixel diff'ler.
 *
 * Kullanım:
 *   node scripts/visual-regression.mjs                # diff veya ilk baseline
 *   node scripts/visual-regression.mjs --baseline     # baseline'ı zorla yenile
 *   node scripts/visual-regression.mjs --strict       # diff > eşik → exit 1 (CI)
 */

import { chromium } from "playwright";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname } from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const ARGS = new Set(process.argv.slice(2));
const FORCE_BASELINE = ARGS.has("--baseline");
const STRICT = ARGS.has("--strict");

// Eşik: PNG byte-level diff için (basit hash karşılaştırma).
// Gerçek pixel diff için pixelmatch gerekli; burada SHA-256 ile bütünlük testi.
const HASH_THRESHOLD_PCT = 0; // 0% → her byte birebir olmalı

// Test edilecek sayfalar
const PAGES = [
  { name: "gallery",     path: "/examples/index.html",              vp: { width: 1280, height: 1800 } },
  { name: "madde",       path: "/examples/madde-detay.html",        vp: { width: 1024, height: 1400 } },
  { name: "akn",         path: "/examples/akn/render.html",         vp: { width: 1024, height: 900  } },
  { name: "badges",      path: "/examples/badge-galeri.html",       vp: { width: 1024, height: 1200 } },
  { name: "do-dont",     path: "/examples/do-dont/index.html",      vp: { width: 1100, height: 2200 } },
  { name: "gallery-hc",  path: "/examples/index.html#renk-primitives",  vp: { width: 1280, height: 1800 }, theme: "yuksek-kontrast" },
];

// ─────────────────────────────────────────────────────────────
// Mini HTTP server
// ─────────────────────────────────────────────────────────────
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg":  "image/svg+xml",
  ".woff2": "font/woff2",
  ".png":  "image/png",
  ".xml":  "application/xml"
};
async function startServer(port=8766) {
  const server = createServer(async (req, res) => {
    try {
      const path = decodeURIComponent(req.url.split("?")[0]).replace(/^\//, "");
      const filePath = path || "examples/index.html";
      const st = await stat(filePath).catch(() => null);
      if (!st) { res.statusCode = 404; res.end("Not found: " + filePath); return; }
      const body = await readFile(filePath);
      res.setHeader("content-type", MIME[extname(filePath)] || "application/octet-stream");
      res.end(body);
    } catch (e) {
      res.statusCode = 500; res.end(String(e));
    }
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve({ server, port })));
}

// ─────────────────────────────────────────────────────────────
// SHA-256
// ─────────────────────────────────────────────────────────────
import { createHash } from "node:crypto";
function sha(buf) { return createHash("sha256").update(buf).digest("hex"); }

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────
const BASELINE_DIR = "dist/visual/baseline";
const CURRENT_DIR  = "dist/visual/current";
const DIFF_DIR     = "dist/visual/diff";

mkdirSync(BASELINE_DIR, { recursive: true });
mkdirSync(CURRENT_DIR, { recursive: true });
mkdirSync(DIFF_DIR, { recursive: true });

console.log("\n📸 Düstur · Visual Regression");
console.log("━".repeat(70));

const { server, port } = await startServer();
console.log(`HTTP server: http://127.0.0.1:${port}`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 1 });
const page = await ctx.newPage();

const results = [];
for (const p of PAGES) {
  await page.setViewportSize(p.vp);
  const url = `http://127.0.0.1:${port}${p.path}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 15000 }).catch(() => {});

  // Determinism: tüm font'lar yüklenene kadar bekle (race condition önlemi)
  await page.evaluate(() => document.fonts.ready).catch(() => {});

  if (p.theme) {
    await page.evaluate(t => document.documentElement.setAttribute("data-tema", t), p.theme);
    await page.evaluate(() => document.fonts.ready).catch(() => {});
  }

  // Ek tampon: layout/paint kararlı hâle gelene kadar
  await page.waitForTimeout(200);

  const buf = await page.screenshot({ fullPage: true, type: "png" });
  const currentPath = `${CURRENT_DIR}/${p.name}.png`;
  writeFileSync(currentPath, buf);

  const baselinePath = `${BASELINE_DIR}/${p.name}.png`;
  const exists = existsSync(baselinePath);

  if (FORCE_BASELINE || !exists) {
    writeFileSync(baselinePath, buf);
    console.log(`  📌 ${p.name.padEnd(15)} · baseline yazıldı · ${(buf.length/1024).toFixed(0)} KB`);
    results.push({ page: p.name, action: "baseline-set", size: buf.length });
  } else {
    const baselineBuf = readFileSync(baselinePath);
    const sameHash = sha(buf) === sha(baselineBuf);
    if (sameHash) {
      console.log(`  ✓ ${p.name.padEnd(15)} · değişiklik yok`);
      results.push({ page: p.name, action: "match" });
    } else {
      // Pixel diff
      const a = PNG.sync.read(baselineBuf);
      const b = PNG.sync.read(buf);
      const sameSize = a.width === b.width && a.height === b.height;
      let pixelsChanged = -1, pctChanged = 0;
      if (sameSize) {
        const diffImg = new PNG({ width: a.width, height: a.height });
        pixelsChanged = pixelmatch(a.data, b.data, diffImg.data, a.width, a.height, { threshold: 0.1, alpha: 0.3 });
        pctChanged = (pixelsChanged / (a.width * a.height)) * 100;
        writeFileSync(`${DIFF_DIR}/${p.name}.diff.png`, PNG.sync.write(diffImg));
      }
      writeFileSync(`${DIFF_DIR}/${p.name}.current.png`, buf);
      writeFileSync(`${DIFF_DIR}/${p.name}.baseline.png`, baselineBuf);
      const verdict = !sameSize ? "boyut farkı" :
                      pctChanged < 0.1 ? "<0.1% (tolerans)" :
                      `${pctChanged.toFixed(2)}% piksel değişti`;
      const icon = !sameSize || pctChanged > 1 ? "✗" : "⚠";
      console.log(`  ${icon} ${p.name.padEnd(15)} · ${verdict}`);
      results.push({ page: p.name, action: "diff", sameSize, pixelsChanged, pctChanged: +pctChanged.toFixed(3) });
    }
  }
}

await browser.close();
server.close();

// Rapor
mkdirSync("dist/reports", { recursive: true });
writeFileSync("dist/reports/visual.json", JSON.stringify({
  generated: new Date().toISOString(),
  results
}, null, 2));

const diffs = results.filter(r => r.action === "diff" && (r.pctChanged > 1 || r.sameSize === false)).length;
const minor = results.filter(r => r.action === "diff" && r.pctChanged <= 1 && r.sameSize !== false).length;
const baselines = results.filter(r => r.action === "baseline-set").length;
const matches = results.filter(r => r.action === "match").length;

console.log("\n" + "─".repeat(70));
console.log(`  Toplam:                  ${results.length}`);
console.log(`  ✓ Birebir match:         ${matches}`);
console.log(`  📌 Yeni baseline:        ${baselines}`);
console.log(`  ⚠ Minor (<1% piksel):    ${minor}`);
console.log(`  ✗ Significant diff:      ${diffs}`);
console.log(`\n📝 Rapor: dist/reports/visual.json\n`);

if (diffs > 0 && STRICT) {
  console.error("✗ Visual regression tespit edildi (strict mode)");
  process.exit(1);
}
