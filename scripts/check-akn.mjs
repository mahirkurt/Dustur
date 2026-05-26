#!/usr/bin/env node
/**
 * scripts/check-akn.mjs
 *
 * Akoma Ntoso XML örneklerini OASIS LegalDocML 3.0 XSD şemasına karşı doğrular.
 * xmllint sistem komutunu kullanır (libxml2).
 *
 * Şema: tokens/akoma-ntoso/schema/akomantoso30.xsd
 *
 * Kullanım:  node scripts/check-akn.mjs [--strict]
 */

import { execSync } from "node:child_process";
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const STRICT = process.argv.includes("--strict");
const SCHEMA = "tokens/akoma-ntoso/schema/akomantoso30.xsd";

if (!existsSync(SCHEMA)) {
  console.error(`✗ Schema bulunamadı: ${SCHEMA}`);
  console.error(`  Schema'yı kurmak için:`);
  console.error(`    curl -sL https://docs.oasis-open.org/legaldocml/akn-core/v1.0/os/part2-specs/schemas/akomantoso30.xsd -o ${SCHEMA}`);
  process.exit(1);
}

try {
  execSync("xmllint --version", { stdio: "ignore" });
} catch {
  console.error("✗ xmllint bulunamadı. Kurmak için:  apt install libxml2-utils  (Debian/Ubuntu)");
  process.exit(1);
}

function walk(dir, files = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith(".xml")) files.push(p);
  }
  return files;
}

const files = [];
if (existsSync("examples/akn")) files.push(...walk("examples/akn"));

console.log(`\n📜 Düstur · Akoma Ntoso XSD Validation`);
console.log("━".repeat(60));
console.log(`Schema: ${SCHEMA}`);
console.log(`Dosya:  ${files.length}\n`);

const errors = [];
for (const f of files) {
  try {
    execSync(`xmllint --noout --schema ${SCHEMA} ${f}`, { stdio: "pipe" });
    console.log(`  ✓ ${f}`);
  } catch (e) {
    const stderr = e.stderr?.toString() || "";
    errors.push({ file: f, error: stderr });
    console.log(`  ✗ ${f}`);
    console.log(stderr.split("\n").map(l => "      " + l).join("\n"));
  }
}

if (errors.length === 0) {
  console.log(`\n✓ Tüm AKN XML dosyaları OASIS şemasını geçti\n`);
  process.exit(0);
}

console.error(`\n✗ ${errors.length} dosya schema'ya uymadı\n`);
if (STRICT) process.exit(1);
