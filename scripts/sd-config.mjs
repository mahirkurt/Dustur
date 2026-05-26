/**
 * scripts/sd-config.mjs
 *
 * Style Dictionary v4 programmatic config.
 * Print-first sistemin (mm-based) mobile platformlara doğru çevrimi için
 * özel transform'lar tanımlar.
 *
 * Kullanım:  node scripts/sd-config.mjs
 */

import StyleDictionary from "style-dictionary";

// mm → dp/pt çevirimi (160dpi base)
//  1 inch = 25.4 mm = 96px (CSS reference) = 160dp (Android base) = 72pt (iOS)
//  1 mm = 3.7795px = 3.7795dp ≈ 2.8346pt
const MM_TO_DP = 96 / 25.4;   // ≈ 3.7795
const MM_TO_PT = 72 / 25.4;   // ≈ 2.8346

function mmToDp(value) {
  const m = String(value).match(/^([-\d.]+)mm$/);
  return m ? (parseFloat(m[1]) * MM_TO_DP).toFixed(2) + "dp" : value;
}
function mmToPt(value) {
  const m = String(value).match(/^([-\d.]+)mm$/);
  return m ? (parseFloat(m[1]) * MM_TO_PT).toFixed(2) : value;
}

StyleDictionary.registerTransform({
  name: "size/mm-to-dp",
  type: "value",
  filter: t => t.$type === "dimension" && /mm$/.test(String(t.$value || t.value || "")),
  transform: t => mmToDp(t.$value || t.value)
});

StyleDictionary.registerTransform({
  name: "size/mm-to-pt",
  type: "value",
  filter: t => t.$type === "dimension" && /mm$/.test(String(t.$value || t.value || "")),
  transform: t => mmToPt(t.$value || t.value)
});

const sd = new StyleDictionary({
  source: [
    "tokens/primitives/*.json",
    "tokens/semantic/*.json",
    "tokens/component/*.json"
  ],
  log: { warnings: "warn", verbosity: "default" },
  platforms: {
    css: {
      transformGroup: "css",
      prefix: "tcm",
      buildPath: "dist/web/",
      files: [{
        destination: "tcm-tokens.css",
        format: "css/variables",
        options: { outputReferences: true }
      }]
    },
    ios: {
      transforms: ["attribute/cti", "name/camel", "color/UIColor", "size/mm-to-pt", "content/quote", "time/seconds"],
      prefix: "TCM",
      buildPath: "dist/ios/",
      files: [{
        destination: "TCMTokens.swift",
        format: "ios-swift/class.swift",
        options: { className: "TCMTokens" }
      }]
    },
    android: {
      transforms: ["attribute/cti", "name/snake", "color/hex8android", "size/mm-to-dp", "content/quote", "time/seconds"],
      prefix: "tcm",
      buildPath: "dist/android/",
      files: [
        { destination: "colors.xml", format: "android/resources", filter: { $type: "color" } },
        { destination: "dimens.xml", format: "android/resources", filter: { $type: "dimension" } }
      ]
    },
    dtcg: {
      transformGroup: "js",
      buildPath: "dist/dtcg/",
      files: [{ destination: "tcm-tokens.json", format: "json/nested" }]
    },
    ts: {
      transformGroup: "js",
      prefix: "tcm",
      buildPath: "dist/ts/",
      files: [{ destination: "tokens.ts", format: "javascript/es6" }]
    }
  }
});

await sd.buildAllPlatforms();

console.log("\n✓ Tüm platformlar build edildi (mm→dp/pt transform aktif)\n");
