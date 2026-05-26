#!/usr/bin/env node
/**
 * scripts/build-css-from-tokens.mjs
 *
 * Style Dictionary'siz çalışan basit fallback build script.
 * tokens/**\/*.json → dist/web/tcm-tokens.css üretir.
 *
 * Style Dictionary kurulmamış ortamlar için (CI'da `npm install` çalıştırılamadığında).
 *
 * Kullanım:  node scripts/build-css-from-tokens.mjs
 */

import { readFileSync, readdirSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "dist/web/tcm-tokens.css";

function walk(dir, files = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, files);
    else if (p.endsWith(".json") && !p.includes("schema") && !p.endsWith("tokens/index.json") && p !== "tokens/index.json") files.push(p);
  }
  return files;
}

function flatten(obj, prefix = "", out = {}) {
  if (obj && typeof obj === "object" && "$value" in obj) {
    out[prefix.replace(/^\./, "")] = { value: obj.$value, type: obj.$type, desc: obj.$description };
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

const all = {};
for (const file of walk("tokens").filter(f => !f.includes("akoma-ntoso"))) {
  try {
    const data = JSON.parse(readFileSync(file, "utf8"));
    Object.assign(all, flatten(data));
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

function toCssVar(path) {
  return "--tcm-" + path.replace(/\./g, "-");
}

function resolveValue(val) {
  if (typeof val !== "string") return val;
  return val.replace(/\{([^}]+)\}/g, (_, ref) => `var(${toCssVar(ref)})`);
}

let out = `/* ═══════════════════════════════════════════════════════════════════
   DÜSTUR · AUTO-GENERATED CSS TOKENS
   Generated: ${new Date().toISOString()}
   Source: tokens/**\\/*.json
   DO NOT EDIT BY HAND
   ═══════════════════════════════════════════════════════════════════ */

:root {
`;

const sorted = Object.entries(all).sort(([a], [b]) => a.localeCompare(b));
for (const [path, { value, type, desc }] of sorted) {
  if (Array.isArray(value)) {
    out += `  ${toCssVar(path)}: ${value.map(v => /\s/.test(v) ? `"${v}"` : v).join(", ")};`;
  } else if (typeof value === "object" && value !== null) {
    /* shadow vb. kompozit token */
    if (type === "shadow") {
      const v = value;
      out += `  ${toCssVar(path)}: ${v.offsetX} ${v.offsetY} ${v.blur} ${v.spread} ${v.color};`;
    } else if (type === "cubicBezier") {
      out += `  ${toCssVar(path)}: cubic-bezier(${value.join(", ")});`;
    } else {
      continue;
    }
  } else {
    out += `  ${toCssVar(path)}: ${resolveValue(value)};`;
  }
  if (desc) out += ` /* ${desc} */`;
  out += "\n";
}
out += "}\n";

mkdirSync("dist/web", { recursive: true });
writeFileSync(OUT, out);

console.log(`\n🛠  Düstur CSS Build`);
console.log(`${"━".repeat(50)}`);
console.log(`Token sayısı:  ${Object.keys(all).length}`);
console.log(`Çıktı:         ${OUT}`);
console.log(`Boyut:         ${(out.length / 1024).toFixed(1)} KB\n`);
