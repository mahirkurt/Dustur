#!/usr/bin/env node
/**
 * scripts/check-contrast.mjs
 *
 * Tüm semantic text-on-bg jeton kombinasyonları için WCAG 2.1 + APCA kontrast hesaplar.
 *
 * Çıktı: dist/reports/contrast.json + ASCII tablo
 * CI'da: --strict bayrağı ile fail-on-warning
 *
 * Kullanım:  node scripts/check-contrast.mjs [--strict] [--quiet]
 */

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const STRICT = process.argv.includes("--strict");
const QUIET  = process.argv.includes("--quiet");

// ─────────────────────────────────────────────────────────────
// Renk yardımcıları
// ─────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16)
  };
}

function relativeLuminance({ r, g, b }) {
  const ch = c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

function wcagContrast(fg, bg) {
  const L1 = relativeLuminance(hexToRgb(fg));
  const L2 = relativeLuminance(hexToRgb(bg));
  const [lighter, darker] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (lighter + 0.05) / (darker + 0.05);
}

// APCA Lc (simplified · Andrew Somers' algorithm)
function apcaLc(fg, bg) {
  const { r: rT, g: gT, b: bT } = hexToRgb(fg);
  const { r: rB, g: gB, b: bB } = hexToRgb(bg);
  const sRGBtrc = 2.4;
  const Rco = 0.2126729;
  const Gco = 0.7151522;
  const Bco = 0.0721750;
  const normBG = 0.56;
  const normTXT = 0.57;
  const revTXT = 0.62;
  const revBG = 0.65;
  const blkThrs = 0.022;
  const blkClmp = 1.414;
  const scaleBoW = 1.14;
  const scaleWoB = 1.14;
  const loBoWoffset = 0.027;
  const loWoBoffset = 0.027;
  const deltaYmin = 0.0005;
  const loClip = 0.1;

  let Ybg = Math.pow(rB / 255, sRGBtrc) * Rco + Math.pow(gB / 255, sRGBtrc) * Gco + Math.pow(bB / 255, sRGBtrc) * Bco;
  let Ytxt = Math.pow(rT / 255, sRGBtrc) * Rco + Math.pow(gT / 255, sRGBtrc) * Gco + Math.pow(bT / 255, sRGBtrc) * Bco;

  Ybg  = Ybg  < blkThrs ? Ybg  + Math.pow(blkThrs - Ybg,  blkClmp) : Ybg;
  Ytxt = Ytxt < blkThrs ? Ytxt + Math.pow(blkThrs - Ytxt, blkClmp) : Ytxt;

  if (Math.abs(Ybg - Ytxt) < deltaYmin) return 0;

  let SAPC;
  if (Ybg > Ytxt) {
    SAPC = (Math.pow(Ybg, normBG) - Math.pow(Ytxt, normTXT)) * scaleBoW;
    SAPC = SAPC < loClip ? 0 : SAPC - loBoWoffset;
  } else {
    SAPC = (Math.pow(Ybg, revBG) - Math.pow(Ytxt, revTXT)) * scaleWoB;
    SAPC = SAPC > -loClip ? 0 : SAPC + loWoBoffset;
  }

  return Math.abs(SAPC) * 100;
}

// ─────────────────────────────────────────────────────────────
// Token yükleyici (basit resolver)
// ─────────────────────────────────────────────────────────────
function flatten(obj, prefix = "", out = {}) {
  if (obj && typeof obj === "object" && "$value" in obj) {
    out[prefix.replace(/^\./, "")] = obj.$value;
    return out;
  }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith("$")) continue;
      flatten(v, `${prefix}.${k}`, out);
    }
  }
  return out;
}

const primitives = flatten(JSON.parse(readFileSync("tokens/primitives/color.json", "utf8")));
const semanticTier = flatten(JSON.parse(readFileSync("tokens/semantic/tier.json", "utf8")));
const semanticAction = flatten(JSON.parse(readFileSync("tokens/semantic/action.json", "utf8")));
const semanticSurface = flatten(JSON.parse(readFileSync("tokens/semantic/surface.json", "utf8")));

const all = { ...primitives, ...semanticTier, ...semanticAction, ...semanticSurface };

function resolve(val, depth = 0) {
  if (depth > 10) return val;
  if (typeof val !== "string") return val;
  const m = val.match(/^\{(.+)\}$/);
  if (m) {
    const ref = m[1];
    if (!(ref in all)) return val;
    return resolve(all[ref], depth + 1);
  }
  return val;
}

// ─────────────────────────────────────────────────────────────
// Kontrast eşleşmeleri (sistem doktriner kombinasyonları)
// ─────────────────────────────────────────────────────────────
const PAIRS = [
  // Body text — AAA hedef
  ["ink.1", "surface.page.bg",   "Body · sayfa zemini",         "AAA"],
  ["ink.1", "surface.panel.bg",  "Body · panel zemini",         "AAA"],
  ["ink.2", "surface.page.bg",   "Secondary text · sayfa",      "AAA"],
  ["ink.3", "surface.page.bg",   "Muted text · sayfa (AA Large)", "AA-Large"],
  // Tier rozet text-on-bg — sembolik markerlar için AA yeterli (büyük metin)
  ["tier.anayasa.text",      "tier.anayasa.mark",       "Anayasa rozet (büyük metin)",  "AA"],
  ["tier.kanun.rozet-text",  "tier.kanun.rozet-bg",     "Kanun rozet",                  "AAA"],
  ["tier.cbk.rozet-text",    "tier.cbk.rozet-bg",       "CBK rozet",                    "AAA"],
  ["tier.aym.rozet-text",    "tier.aym.rozet-bg",       "AYM rozet",                    "AAA"],
  ["tier.aym-iptal.hap-text","tier.aym-iptal.hap-bg",   "AYM iptal hap",                "AAA"],
  // Action — AA zorunlu
  ["action.primary.text", "action.primary.bg-hover",  "Primary buton (hover · turkuvaz-10)", "AA"],
  // Link — AA zorunlu (büyük metin/altı çizili)
  ["link.default", "surface.page.bg",  "Link default · sayfa",  "AA"],
  ["link.default", "surface.panel.bg", "Link default · panel",  "AA"],
  ["link.visited", "surface.page.bg",  "Link visited · sayfa",  "AA"]
];

const results = [];
for (const [fg, bg, label, target] of PAIRS) {
  const fgHex = resolve(`{${fg}}`);
  const bgHex = resolve(`{${bg}}`);
  if (!/^#[0-9A-F]{6}$/i.test(fgHex) || !/^#[0-9A-F]{6}$/i.test(bgHex)) {
    if (!QUIET) console.warn(`⚠ Resolve: ${fg}=${fgHex} ${bg}=${bgHex}`);
    continue;
  }
  const ratio = wcagContrast(fgHex, bgHex);
  const Lc    = apcaLc(fgHex, bgHex);
  const pass = target === "AAA" ? ratio >= 7 :
               target === "AA-Large" ? ratio >= 3 :
               ratio >= 4.5;
  results.push({ label, fg, fgHex, bg, bgHex, wcag: +ratio.toFixed(2), apca: +Lc.toFixed(1), target, pass });
}

// ─────────────────────────────────────────────────────────────
// Çıktı
// ─────────────────────────────────────────────────────────────
if (!QUIET) {
  console.log(`\n🎨 Düstur Contrast Audit\n${"━".repeat(80)}`);
  console.log(`${"Kombinasyon".padEnd(28)}${"WCAG".padStart(8)}${"APCA".padStart(8)}${"Hedef".padStart(8)}${"Durum".padStart(10)}`);
  console.log("─".repeat(80));
  for (const r of results) {
    const status = r.pass ? "✓ GEÇTİ" : "✗ DÜŞTÜ";
    console.log(`${r.label.padEnd(28)}${(r.wcag + ":1").padStart(8)}${("Lc" + r.apca).padStart(8)}${r.target.padStart(8)}${status.padStart(10)}`);
  }
  console.log();
}

const failed = results.filter(r => !r.pass);

// JSON raporu yaz
const reportPath = "dist/reports/contrast.json";
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, JSON.stringify({
  generated: new Date().toISOString(),
  pass: results.length - failed.length,
  fail: failed.length,
  results
}, null, 2));

if (!QUIET) console.log(`📝 Rapor: ${reportPath}\n`);

if (failed.length && STRICT) {
  console.error(`✗ ${failed.length} kontrast hatası (strict mode)`);
  process.exit(1);
}
if (failed.length) {
  console.log(`⚠ ${failed.length} kontrast hatası (warning · strict mode kapalı)`);
}
