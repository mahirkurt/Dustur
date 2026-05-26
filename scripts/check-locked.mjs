#!/usr/bin/env node
/**
 * scripts/check-locked.mjs
 *
 * tokens/index.json'daki LOCKED jeton listesi ile kaynak dosyalardaki
 * $extensions.tr.tcm.kilit etiketi arasındaki tutarlılığı doğrular.
 *
 * Bir jeton:
 *   - index.json kilit-jetonlar listesinde varsa AMA $extensions.tr.tcm.kilit yoksa → HATA
 *   - $extensions.tr.tcm.kilit = "LOCKED" ise AMA index.json listesinde yoksa → UYARI
 *
 * Kullanım:  node scripts/check-locked.mjs
 */

import { readFileSync, readdirSync } from "node:fs";

function flatten(obj, prefix = "", out = {}) {
  if (obj && typeof obj === "object" && "$value" in obj) {
    out[prefix.replace(/^\./, "")] = obj;
    return out;
  }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith("$")) continue;
      flatten(v, prefix + "." + k, out);
    }
  }
  return out;
}

const all = {};
for (const dir of ["tokens/primitives", "tokens/semantic", "tokens/component"]) {
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".json") || f.includes("schema")) continue;
    Object.assign(all, flatten(JSON.parse(readFileSync(`${dir}/${f}`, "utf8"))));
  }
}

const idx = JSON.parse(readFileSync("tokens/index.json", "utf8"));
const lockedList = new Set(idx["kilit-jetonlar"].jetonlar);

const errors = [];
const warnings = [];

// 1) Her listed-locked'ın $extension'da işareti olmalı
for (const path of lockedList) {
  const tok = all[path];
  if (!tok) {
    errors.push(`Bilinmeyen LOCKED jeton: ${path}`);
    continue;
  }
  const kilit = tok.$extensions?.["tr.tcm.kilit"];
  if (kilit !== "LOCKED") {
    errors.push(`${path}: index.json'da LOCKED ama \$extensions.tr.tcm.kilit eksik veya yanlış`);
  }
}

// 2) $extension'da LOCKED işareti olan ama listede olmayan jetonlar (uyarı)
for (const [path, tok] of Object.entries(all)) {
  const kilit = tok.$extensions?.["tr.tcm.kilit"];
  if (kilit === "LOCKED" && !lockedList.has(path)) {
    warnings.push(`${path}: \$extensions LOCKED ama tokens/index.json'a eklenmemiş`);
  }
}

console.log("\n🔒 Düstur LOCKED Jeton Audit");
console.log("━".repeat(60));
console.log(`index.json LOCKED:  ${lockedList.size}`);
console.log(`Hata:               ${errors.length}`);
console.log(`Uyarı:              ${warnings.length}\n`);

if (errors.length) {
  console.log("HATALAR:");
  errors.forEach(e => console.log(`  ✗ ${e}`));
  console.log();
}
if (warnings.length) {
  console.log("UYARILAR:");
  warnings.forEach(w => console.log(`  ⚠ ${w}`));
  console.log();
}

if (errors.length) process.exit(1);
console.log("✓ LOCKED jeton tutarlılığı OK\n");
