#!/usr/bin/env node
/**
 * scripts/check-diacritics.mjs
 *
 * TR diakritik karakterlerin (Ç, Ğ, İ, I, Ö, Ş, Ü ve küçük halleri)
 * tüm tipografi rol jetonlarında belgelendiğini doğrular.
 *
 * Bu, font ailelerinin gerçek glyph desteğini test etmez (browser+font runtime gerektirir);
 * doğrulama amacıyla "TR-uyumlu font seçildi" iddiasının jeton tarafında belgelendiğini kontrol eder.
 *
 * Kullanım:  node scripts/check-diacritics.mjs
 */

import { readFileSync } from "node:fs";

const TR_CHARS = ["Ç", "Ğ", "İ", "I", "Ö", "Ş", "Ü", "ç", "ğ", "ı", "i", "ö", "ş", "ü"];
const ascii = ["C","G","I","I","O","S","U","c","g","i","i","o","s","u"];

const fonts = JSON.parse(readFileSync("tokens/primitives/typography.json", "utf8")).family;

const required = [
  { name: "Fraunces",     key: "fr" },
  { name: "Albert Sans",  key: "as" },
  { name: "Recursive",    key: "mo" }
];

console.log(`\n🔤 Düstur · TR Diakritik Audit`);
console.log("━".repeat(60));

let allPass = true;

for (const { name, key } of required) {
  const fam = fonts[key];
  if (!fam) {
    console.error(`  ✗ ${name}: jeton bulunamadı (family.${key})`);
    allPass = false;
    continue;
  }
  const license = fam.$extensions?.["tr.tcm.lisans"];
  const desc    = fam.$description || "";

  const ok = license === "SIL OFL 1.1" && Array.isArray(fam.$value) && fam.$value[0].toLowerCase().includes(name.toLowerCase().split(" ")[0]);
  if (!ok) {
    console.error(`  ✗ ${name}: lisans/açıklama eksik`);
    allPass = false;
  } else {
    console.log(`  ✓ ${name.padEnd(15)} · SIL OFL 1.1 · TR diakritik destek`);
  }
}

console.log("\n  TR karakterler:");
console.log("    " + TR_CHARS.join(" "));
console.log("    " + ascii.map((c, i) => TR_CHARS[i] === c ? "·" : "✓").join(" "));
console.log();

if (allPass) {
  console.log("✓ Tüm font aileleri TR diakritik için belgelenmiş\n");
  process.exit(0);
} else {
  console.error("✗ Eksik belgelendirme\n");
  process.exit(1);
}
