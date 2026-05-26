#!/usr/bin/env node
/**
 * scripts/token-usage-map.mjs
 *
 * Her token için CSS/HTML/JSON dosyalarında nerede kullanıldığını tarar.
 * Çıktı:  dist/reports/token-usage.json + token-usage.md
 *
 * Kullanım:  node scripts/token-usage-map.mjs
 */

import { readFileSync, mkdirSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SCAN_DIRS = ["css", "examples", "docs", "tokens", "reference"];
const TOKEN_RE  = /--tcm-[a-z0-9-]+/g;
const REF_RE    = /\{([a-z0-9.-]+)\}/gi;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, files);
    else if (/\.(css|html|json|md|svg)$/.test(p)) files.push(p);
  }
  return files;
}

// Tüm tokenları topla
function flatten(obj, prefix = "", out = {}) {
  if (obj && typeof obj === "object" && "$value" in obj) {
    out[prefix.replace(/^\./, "")] = true;
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

function loadAllTokens() {
  const all = {};
  const dirs = ["tokens/primitives", "tokens/semantic", "tokens/component", "tokens/akoma-ntoso"];
  for (const dir of dirs) {
    try {
      for (const entry of readdirSync(dir)) {
        if (!entry.endsWith(".json") || entry.includes("schema")) continue;
        try {
          const data = JSON.parse(readFileSync(join(dir, entry), "utf8"));
          Object.assign(all, flatten(data));
        } catch (e) { /* skip */ }
      }
    } catch (e) { /* skip */ }
  }
  return Object.keys(all);
}

const tokens = loadAllTokens();
const usage  = Object.fromEntries(tokens.map(t => [t, []]));

// CSS var ismi: color.tbk.9 → --tcm-color-tbk-9
function cssVar(tokenPath) {
  return "--tcm-" + tokenPath.replace(/\./g, "-");
}

const allFiles = SCAN_DIRS.flatMap(d => { try { return walk(d); } catch { return []; } });

for (const file of allFiles) {
  const content = readFileSync(file, "utf8");
  const rel = relative(".", file);

  for (const token of tokens) {
    const cv = cssVar(token);
    if (content.includes(cv)) usage[token].push({ file: rel, type: "css-var" });
    if (content.includes(`{${token}}`)) usage[token].push({ file: rel, type: "json-ref" });
  }
}

// Kullanılmayan tokenları işaretle
const used   = Object.entries(usage).filter(([, refs]) => refs.length > 0);
const unused = Object.entries(usage).filter(([, refs]) => refs.length === 0);

// JSON rapor
const reportDir  = "dist/reports";
mkdirSync(reportDir, { recursive: true });
writeFileSync(`${reportDir}/token-usage.json`, JSON.stringify({
  generated: new Date().toISOString(),
  total: tokens.length,
  used: used.length,
  unused: unused.length,
  usage
}, null, 2));

// Markdown rapor
let md = `# Token Usage Map\n\n`;
md += `_Otomatik üretildi · ${new Date().toISOString()}_\n\n`;
md += `**Toplam:** ${tokens.length} · **Kullanılan:** ${used.length} · **Kullanılmayan:** ${unused.length}\n\n`;

md += `## Kullanılan Tokenlar\n\n`;
md += `| Token | Kullanım sayısı | Yerler |\n|---|---|---|\n`;
for (const [token, refs] of used.sort((a, b) => b[1].length - a[1].length)) {
  const files = [...new Set(refs.map(r => r.file))].slice(0, 5).join(", ");
  md += `| \`${token}\` | ${refs.length} | ${files}${refs.length > 5 ? " …" : ""} |\n`;
}

if (unused.length) {
  md += `\n## ⚠ Kullanılmayan Tokenlar\n\n`;
  md += `_Aşağıdaki tokenlar hiçbir CSS/HTML/JSON dosyasında referans edilmiyor. Kasıtlı reserve mi yoksa ölü kod mu kontrol edin._\n\n`;
  for (const [token] of unused) {
    md += `- \`${token}\`\n`;
  }
}

writeFileSync(`${reportDir}/token-usage.md`, md);

console.log(`\n📊 Token Usage Map`);
console.log(`${"━".repeat(50)}`);
console.log(`Toplam token:       ${tokens.length}`);
console.log(`Kullanılan:         ${used.length}`);
console.log(`Kullanılmayan:      ${unused.length}`);
console.log(`Taranan dosya:      ${allFiles.length}`);
console.log(`\nRaporlar:`);
console.log(`  ${reportDir}/token-usage.json`);
console.log(`  ${reportDir}/token-usage.md\n`);
