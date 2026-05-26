#!/usr/bin/env node
/**
 * scripts/subset-fonts.mjs
 *
 * Üç variable font'u TR-mevzuat ihtiyaçlarına subset eder.
 * Variable axes (opsz/wght/SOFT/WONK için Fraunces, wght için Albert Sans,
 * MONO/CASL/wght için Recursive) korunur.
 *
 * Çıktı:  assets/fonts/subset/<Family>-Subset.woff2
 *
 * Glyph kapsamı:
 *   - ASCII (U+0020-U+007E)
 *   - Latin-1 supplement (U+00A0-U+00FF) — Avrupa diakritikleri
 *   - Latin Extended-A (U+0100-U+017F) — Türkçe Ç Ğ İ Ş Ö Ü
 *   - Genel noktalama (U+2010-U+205E) — em-dash, en-dash, smart quotes
 *   - TR-spesifik: ₺, §, ¶, †, ‡, ™, ©, ®
 *
 * Kullanım:  node scripts/subset-fonts.mjs
 * Gereksinim:  pyftsubset (pip install fonttools brotli)
 */

import { execSync, spawnSync } from "node:child_process";
import { existsSync, statSync, mkdirSync } from "node:fs";

try {
  execSync("pyftsubset --help", { stdio: "ignore" });
} catch {
  console.error("✗ pyftsubset yok. Kurmak için:  pip install fonttools brotli");
  process.exit(1);
}

// Variable font axes pyftsubset tarafından otomatik korunur — açıkça subset etmek gerekmiyor.
const FONTS = [
  { name: "Fraunces",   src: "assets/fonts/source/Fraunces-VF.ttf" },
  { name: "AlbertSans", src: "assets/fonts/source/AlbertSans-VF.ttf" },
  { name: "Recursive",  src: "assets/fonts/source/Recursive-VF.ttf" }
];

// TR-mevzuat unicode kapsamı
const UNICODES = [
  "U+0020-007E",           // ASCII printable
  "U+00A0-00FF",           // Latin-1 supplement
  "U+0100-017F",           // Latin Extended-A (Ç Ğ İ Ş Ö Ü etc.)
  "U+0180-024F",           // Latin Extended-B
  "U+02B0-02FF",           // Spacing modifier letters
  "U+2010-205E",           // General punctuation
  "U+20A0-20CF",           // Currency (₺ U+20BA)
  "U+2122",                // ™
  "U+00A9",                // ©
  "U+00AE",                // ®
  "U+00B6",                // ¶
  "U+00A7",                // §
  "U+2020-2021",           // † ‡
  "U+2030"                 // ‰
].join(",");

// OpenType features korunmalı
const FEATURES = ["liga","calt","ss01","ss02","ss03","ss04","ss05","ss06","ss07","ss08","kern","frac","sups","subs","ordn","numr","dnom","tnum","onum","lnum","pnum","smcp","c2sc","case","cpsp","dlig"].join(",");

mkdirSync("assets/fonts/subset", { recursive: true });

console.log("\n✂  Düstur · Font Subsetting (TR-only)");
console.log("━".repeat(70));

const results = [];
for (const font of FONTS) {
  if (!existsSync(font.src)) {
    console.log(`  ⚠ ${font.name}: kaynak bulunamadı (${font.src}) · atlandı`);
    continue;
  }

  const out = `assets/fonts/subset/${font.name}-Subset.woff2`;
  const origSize = statSync(font.src).size;

  const args = [
    font.src,
    `--output-file=${out}`,
    "--flavor=woff2",
    `--unicodes=${UNICODES}`,
    `--layout-features+=${FEATURES}`,
    "--no-hinting",
    "--desubroutinize",
    "--name-IDs=*",
    "--name-legacy",
    "--drop-tables+=DSIG,VDMX"
  ];

  const res = spawnSync("pyftsubset", args, { encoding: "utf8" });
  if (res.status !== 0) {
    console.log(`  ✗ ${font.name}: ${res.stderr.split("\n")[0]}`);
    results.push({ name: font.name, fail: true });
    continue;
  }

  const newSize = statSync(out).size;
  const reduction = (1 - newSize/origSize) * 100;
  console.log(`  ✓ ${font.name.padEnd(12)} · ${(origSize/1024).toFixed(0).padStart(5)}KB → ${(newSize/1024).toFixed(0).padStart(4)}KB · -${reduction.toFixed(1).padStart(5)}%`);
  results.push({ name: font.name, origSize, newSize, reduction, output: out });
}

const totalOrig = results.filter(r=>!r.fail).reduce((s,r)=>s+r.origSize,0);
const totalNew  = results.filter(r=>!r.fail).reduce((s,r)=>s+r.newSize,0);

console.log("─".repeat(70));
console.log(`  TOPLAM:        · ${(totalOrig/1024).toFixed(0).padStart(5)}KB → ${(totalNew/1024).toFixed(0).padStart(4)}KB · -${((1-totalNew/totalOrig)*100).toFixed(1)}%`);
console.log();
