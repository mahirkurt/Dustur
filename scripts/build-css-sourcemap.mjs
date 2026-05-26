#!/usr/bin/env node
/**
 * scripts/build-css-sourcemap.mjs
 *
 * CSS source map üretir — `dist/web/tcm-tokens.css` içindeki her CSS değişkeni,
 * kaynak JSON dosyasındaki ilgili token'a haritalanır.
 *
 * Çıktı:
 *   - dist/web/tcm-tokens.css            (mevcut, augmented with /*# sourceMappingURL=...)
 *   - dist/web/tcm-tokens.css.map        (Source Map v3 JSON)
 *
 * Tarayıcı DevTools'unda bir CSS değişkenine tıklarken doğrudan kaynak
 * JSON dosyasının ilgili satırına atlayabilir.
 *
 * Kullanım:  node scripts/build-css-sourcemap.mjs
 */

import { readFileSync, readdirSync, statSync, writeFileSync, appendFileSync, mkdirSync } from "node:fs";
import { join, relative, dirname } from "node:path";

// ─────────────────────────────────────────────────────────────
// Source Map v3 VLQ encoding
// ─────────────────────────────────────────────────────────────
const VLQ_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function vlqEncode(value) {
  let out = "";
  let vlq = value < 0 ? ((-value) << 1) | 1 : value << 1;
  do {
    let digit = vlq & 0b11111;
    vlq >>>= 5;
    if (vlq > 0) digit |= 0b100000;
    out += VLQ_CHARS[digit];
  } while (vlq > 0);
  return out;
}

// ─────────────────────────────────────────────────────────────
// Token yükleyici · her token için kaynak (dosya, satır)
// ─────────────────────────────────────────────────────────────
function walk(dir, files = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith(".json") && !p.includes("schema") && !p.endsWith("tokens/index.json")) files.push(p);
  }
  return files;
}

const allTokens = {}; // path → { value, type, sourceFile, sourceLine, originalText }

function indexFile(file) {
  const txt = readFileSync(file, "utf8");
  const lines = txt.split("\n");
  const data = JSON.parse(txt);

  // Walk JSON recursively, track line positions
  function find(obj, path = "") {
    if (obj && typeof obj === "object" && "$value" in obj) {
      // Find the line number of this token in the source
      const cleanPath = path.replace(/^\./, "");
      // Find pattern matching the leaf key
      const segments = cleanPath.split(".");
      const lastKey = segments[segments.length - 1];
      // Search for `"lastKey":` line (simple heuristic; works for most cases)
      // Better: scan for "$value" near the key
      const valueStr = typeof obj.$value === "string" ? obj.$value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : null;
      let lineFound = 1;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (valueStr && line.includes(`"${lastKey}"`) && line.includes(valueStr)) {
          lineFound = i + 1; break;
        }
        if (line.match(new RegExp(`"${lastKey}"\\s*:\\s*\\{`))) {
          lineFound = i + 1;
          break;
        }
      }
      allTokens[cleanPath] = {
        value: obj.$value,
        type: obj.$type,
        sourceFile: file,
        sourceLine: lineFound,
        sourceColumn: 0
      };
      return;
    }
    if (obj && typeof obj === "object") {
      for (const [k, v] of Object.entries(obj)) {
        if (k.startsWith("$")) continue;
        find(v, path + "." + k);
      }
    }
  }
  find(data);
}

for (const file of walk("tokens").filter(f => !f.includes("akoma-ntoso"))) {
  indexFile(file);
}

// ─────────────────────────────────────────────────────────────
// CSS üret + her satır için source map entry
// ─────────────────────────────────────────────────────────────
function toCssVar(path) { return "--tcm-" + path.replace(/\./g, "-"); }

function resolveValue(val) {
  if (typeof val !== "string") return val;
  return val.replace(/\{([^}]+)\}/g, (_, ref) => `var(${toCssVar(ref)})`);
}

const sorted = Object.entries(allTokens).sort(([a],[b]) => a.localeCompare(b));

// Source files index (Source Map'te "sources" array)
const sourcesList = [...new Set(sorted.map(([, t]) => t.sourceFile))];
const sourceIndex = (file) => sourcesList.indexOf(file);

// Build CSS line by line + collect mappings
let css = `/* ═══════════════════════════════════════════════════════════════════
   DÜSTUR · AUTO-GENERATED CSS TOKENS · Source-mapped
   Generated: ${new Date().toISOString()}
   Source: tokens/**\\/*.json
   DO NOT EDIT BY HAND
   ═══════════════════════════════════════════════════════════════════ */

:root {
`;

const HEADER_LINES = css.split("\n").length - 1; // 1-indexed; lines before first var
const mappings = []; // array of arrays per generated line

// Fill empty mappings for header lines
for (let i = 0; i < HEADER_LINES; i++) mappings.push("");

// Use VLQ delta encoding
let prevGenCol = 0;
let prevSrcFile = 0;
let prevSrcLine = 0;
let prevSrcCol = 0;

for (const [path, tok] of sorted) {
  const cssVar = toCssVar(path);
  let valueStr;
  if (Array.isArray(tok.value)) {
    valueStr = tok.value.map(v => /\s/.test(v) ? `"${v}"` : v).join(", ");
  } else if (typeof tok.value === "object" && tok.value !== null) {
    if (tok.type === "shadow") {
      const v = tok.value;
      valueStr = `${v.offsetX} ${v.offsetY} ${v.blur} ${v.spread} ${v.color}`;
    } else if (tok.type === "cubicBezier") {
      valueStr = `cubic-bezier(${tok.value.join(", ")})`;
    } else {
      continue;
    }
  } else {
    valueStr = resolveValue(tok.value);
  }
  const line = `  ${cssVar}: ${valueStr};`;
  css += line + "\n";

  // Mapping: generatedCol 2 (after "  ") → sourceFile / sourceLine
  // VLQ relative deltas
  const genColDelta = 2 - prevGenCol; prevGenCol = 2;
  const fileIdx = sourceIndex(tok.sourceFile);
  const fileDelta = fileIdx - prevSrcFile; prevSrcFile = fileIdx;
  const lineDelta = (tok.sourceLine - 1) - prevSrcLine; prevSrcLine = tok.sourceLine - 1;
  const colDelta = tok.sourceColumn - prevSrcCol; prevSrcCol = tok.sourceColumn;
  const vlq = vlqEncode(genColDelta) + vlqEncode(fileDelta) + vlqEncode(lineDelta) + vlqEncode(colDelta);
  mappings.push(vlq);
  prevGenCol = 0; // her satırın başında reset
}

css += "}\n";

// Source map URL annotation
const SOURCE_MAP_FILE = "tcm-tokens.css.map";
css += `\n/*# sourceMappingURL=${SOURCE_MAP_FILE} */\n`;

// ─────────────────────────────────────────────────────────────
// Source Map v3 JSON
// ─────────────────────────────────────────────────────────────
const sourceMap = {
  version: 3,
  file: "tcm-tokens.css",
  sourceRoot: "../../",
  sources: sourcesList,
  names: [],
  mappings: mappings.join(";"),
  sourcesContent: sourcesList.map(f => {
    try { return readFileSync(f, "utf8"); } catch { return null; }
  })
};

mkdirSync("dist/web", { recursive: true });
writeFileSync("dist/web/tcm-tokens.css", css);
writeFileSync(`dist/web/${SOURCE_MAP_FILE}`, JSON.stringify(sourceMap, null, 2));

console.log(`\n🗺  Düstur CSS + Source Map`);
console.log(`${"━".repeat(50)}`);
console.log(`Token sayısı:    ${sorted.length}`);
console.log(`Kaynak dosya:    ${sourcesList.length}`);
console.log(`CSS:             dist/web/tcm-tokens.css (${(css.length/1024).toFixed(1)} KB)`);
console.log(`Source Map:      dist/web/${SOURCE_MAP_FILE} (${(JSON.stringify(sourceMap).length/1024).toFixed(1)} KB)`);
console.log();
