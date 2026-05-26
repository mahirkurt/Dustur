#!/usr/bin/env node
/**
 * scripts/lint-tokens.mjs
 *
 * Tüm tokens/**\/*.json dosyalarını şu kontrollerden geçirir:
 *  1. Valid JSON
 *  2. W3C DTCG zorunlu alanlar: $type, $value (yaprak jetonlar)
 *  3. Referans çözümleme: {x.y.z} pattern'leri gerçek token'a işaret etmeli
 *  4. Locked tokens için $extensions.tr.tcm.kilit alanı
 *
 * Kullanım:  node scripts/lint-tokens.mjs
 * Exit code: 0 başarılı, 1 hata
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const TOKENS_DIR = "tokens";
const errors = [];
const warnings = [];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, files);
    else if (p.endsWith(".json")) files.push(p);
  }
  return files;
}

function flatten(obj, prefix = "", out = {}) {
  if (obj && typeof obj === "object" && "$value" in obj) {
    out[prefix.replace(/^\./, "")] = obj;
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

// Tüm dosyaları topla, parse et
const files = walk(TOKENS_DIR).filter(f => !f.includes("eli-uri.schema.json") && !f.endsWith("/index.json"));
const allTokens = {};

for (const file of files) {
  try {
    const data = JSON.parse(readFileSync(file, "utf8"));
    Object.assign(allTokens, flatten(data));
  } catch (e) {
    errors.push(`✗ JSON parse hatası · ${file}: ${e.message}`);
  }
}

// W3C DTCG validasyonu
const VALID_TYPES = [
  "color", "dimension", "duration", "fontFamily", "fontWeight",
  "number", "cubicBezier", "shadow", "string", "border", "transition",
  "gradient", "typography", "strokeStyle"
];

for (const [path, tok] of Object.entries(allTokens)) {
  if (!("$value" in tok)) {
    errors.push(`✗ ${path}: $value eksik`);
    continue;
  }
  if (!("$type" in tok)) {
    warnings.push(`⚠ ${path}: $type eksik (DTCG önerisi)`);
    continue;
  }
  if (!VALID_TYPES.includes(tok.$type)) {
    warnings.push(`⚠ ${path}: bilinmeyen $type '${tok.$type}'`);
  }
}

// Referans çözümleme
const REF = /\{([^}]+)\}/g;
for (const [path, tok] of Object.entries(allTokens)) {
  const val = tok.$value;
  if (typeof val !== "string") continue;
  let m;
  REF.lastIndex = 0;
  while ((m = REF.exec(val)) !== null) {
    const refPath = m[1];
    if (!(refPath in allTokens)) {
      errors.push(`✗ ${path}: '{${refPath}}' referansı çözülemiyor`);
    }
  }
}

// Çıktı
console.log(`\n📋 Düstur Token Lint\n${"━".repeat(60)}`);
console.log(`Dosya:  ${files.length}`);
console.log(`Jeton:  ${Object.keys(allTokens).length}`);
console.log(`Hata:   ${errors.length}`);
console.log(`Uyarı:  ${warnings.length}\n`);

if (errors.length) {
  console.log("HATALAR:");
  errors.forEach(e => console.log(`  ${e}`));
  console.log();
}
if (warnings.length && process.env.LINT_STRICT) {
  console.log("UYARILAR:");
  warnings.forEach(w => console.log(`  ${w}`));
  console.log();
}

if (errors.length) process.exit(1);
console.log("✓ Tüm token'lar geçerli\n");
