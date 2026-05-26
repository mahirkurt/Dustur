#!/usr/bin/env node
/**
 * scripts/check-colorblind.mjs
 *
 * Tier mührlerinin renk körlüğü (protanopia, deuteranopia, tritanopia)
 * altında hâlâ ayırt edilebilir olduğunu doğrular.
 *
 * Brettel algoritması (1997) ile her renk için 3 körlük tipinin simülasyonunu
 * yapar, sonra her tier-tier kombinasyonu için CIEDE2000 algısal renk farkını
 * hesaplar. Eşik: ΔE2000 ≥ 10 (ayırt edilebilir).
 *
 * Kullanım:  node scripts/check-colorblind.mjs [--strict]
 */

import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const STRICT = process.argv.includes("--strict");

// ─────────────────────────────────────────────────────────────
// sRGB ↔ Linear RGB
// ─────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0,2), 16),
    parseInt(h.substring(2,4), 16),
    parseInt(h.substring(4,6), 16)
  ];
}
function rgbToHex([r,g,b]) {
  return "#" + [r,g,b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2,"0")).join("").toUpperCase();
}
function sRGBtoLin(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function linToSRGB(c) {
  c = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1/2.4) - 0.055;
  return c * 255;
}

// ─────────────────────────────────────────────────────────────
// Brettel 1997 · CVD simulation (RGB-space matrix approximation)
// Vienot/Brettel/Mollon constants for the most common dichromacy types
// ─────────────────────────────────────────────────────────────
const CVD = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281,  0.099216],
    [-0.003882,-0.048116, 1.051998]
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501,  0.047413],
    [-0.011820, 0.042940, 0.968881]
  ],
  tritan: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733,  0.691367, 0.303900]
  ]
};

function simulate(hex, type) {
  const [r,g,b] = hexToRgb(hex).map(sRGBtoLin);
  const m = CVD[type];
  const out = [
    m[0][0]*r + m[0][1]*g + m[0][2]*b,
    m[1][0]*r + m[1][1]*g + m[1][2]*b,
    m[2][0]*r + m[2][1]*g + m[2][2]*b
  ];
  return rgbToHex(out.map(linToSRGB));
}

// ─────────────────────────────────────────────────────────────
// sRGB → CIE Lab (D65 illuminant)
// ─────────────────────────────────────────────────────────────
function rgbToXyz([r,g,b]) {
  [r,g,b] = [r,g,b].map(sRGBtoLin);
  return [
    r*0.4124564 + g*0.3575761 + b*0.1804375,
    r*0.2126729 + g*0.7151522 + b*0.0721750,
    r*0.0193339 + g*0.1191920 + b*0.9503041
  ];
}
function xyzToLab([x,y,z]) {
  // D65 reference white
  const Xn=0.95047, Yn=1.0, Zn=1.08883;
  const f = t => t > 216/24389 ? Math.cbrt(t) : (24389/27*t + 16) / 116;
  const fx = f(x/Xn), fy = f(y/Yn), fz = f(z/Zn);
  return [116*fy - 16, 500*(fx-fy), 200*(fy-fz)];
}
function hexToLab(hex) {
  return xyzToLab(rgbToXyz(hexToRgb(hex)));
}

// ─────────────────────────────────────────────────────────────
// CIEDE2000 · algısal renk farkı
// ─────────────────────────────────────────────────────────────
function deltaE2000([L1,a1,b1], [L2,a2,b2]) {
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const Cm = (C1 + C2) / 2;
  const G  = 0.5 * (1 - Math.sqrt(Math.pow(Cm,7) / (Math.pow(Cm,7) + Math.pow(25,7))));
  const a1p = (1+G) * a1;
  const a2p = (1+G) * a2;
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);
  const h1p = Math.atan2(b1, a1p) * 180 / Math.PI; const h1 = h1p < 0 ? h1p + 360 : h1p;
  const h2p = Math.atan2(b2, a2p) * 180 / Math.PI; const h2 = h2p < 0 ? h2p + 360 : h2p;
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) {
    if (Math.abs(h2 - h1) <= 180) dhp = h2 - h1;
    else if (h2 - h1 > 180) dhp = h2 - h1 - 360;
    else dhp = h2 - h1 + 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp/2 * Math.PI/180);
  const Lpm = (L1 + L2) / 2;
  const Cpm = (C1p + C2p) / 2;
  let hpm = (h1 + h2) / 2;
  if (C1p * C2p !== 0 && Math.abs(h1 - h2) > 180) hpm += hpm < 360 ? 180 : -180;
  const T = 1 - 0.17*Math.cos((hpm-30)*Math.PI/180) + 0.24*Math.cos(2*hpm*Math.PI/180)
            + 0.32*Math.cos((3*hpm+6)*Math.PI/180) - 0.20*Math.cos((4*hpm-63)*Math.PI/180);
  const dTheta = 30 * Math.exp(-Math.pow((hpm-275)/25, 2));
  const Rc = 2 * Math.sqrt(Math.pow(Cpm,7)/(Math.pow(Cpm,7)+Math.pow(25,7)));
  const Sl = 1 + (0.015*Math.pow(Lpm-50,2)) / Math.sqrt(20+Math.pow(Lpm-50,2));
  const Sc = 1 + 0.045*Cpm;
  const Sh = 1 + 0.015*Cpm*T;
  const Rt = -Math.sin(2*dTheta*Math.PI/180) * Rc;
  return Math.sqrt(Math.pow(dLp/Sl,2) + Math.pow(dCp/Sc,2) + Math.pow(dHp/Sh,2) + Rt*(dCp/Sc)*(dHp/Sh));
}

// ─────────────────────────────────────────────────────────────
// Token yükleyici
// ─────────────────────────────────────────────────────────────
function flatten(obj, prefix = "", out = {}) {
  if (obj && typeof obj === "object" && "$value" in obj) {
    out[prefix.replace(/^\./, "")] = obj.$value;
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
function resolveRef(val, all, depth=0) {
  if (depth > 10 || typeof val !== "string") return val;
  const m = val.match(/^\{(.+)\}$/);
  if (m && all[m[1]]) return resolveRef(all[m[1]], all, depth+1);
  return val;
}

const all = {};
for (const dir of ["tokens/primitives", "tokens/semantic"]) {
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".json") || f.includes("schema")) continue;
    Object.assign(all, flatten(JSON.parse(readFileSync(`${dir}/${f}`, "utf8"))));
  }
}

// Tier mührleri — ayırt edilebilirliği test et
const tiers = [
  { name: "Anayasa",    token: "tier.anayasa.mark" },
  { name: "AYM",        token: "tier.aym.mark" },
  { name: "CBK",        token: "tier.cbk.mark" },
  { name: "Kanun",      token: "tier.kanun.mark" },
  { name: "Yönetmelik", token: "tier.yonetmelik.mark" },
  { name: "Tebliğ",     token: "tier.teblig.mark" },
  { name: "Genelge",    token: "tier.genelge.mark" }
];
tiers.forEach(t => t.hex = resolveRef(`{${t.token}}`, all));

// ─────────────────────────────────────────────────────────────
// CVD simulation + ΔE2000 matrix
// ─────────────────────────────────────────────────────────────
const SIMS = ["normal", "protan", "deutan", "tritan"];
const THRESHOLD = 10; // ΔE2000 ≥ 10 — ayırt edilebilir (kabul: ≥ 5 just-noticeable, ≥ 10 clearly different)

const results = { tiers, threshold: THRESHOLD, types: {} };

let failures = 0;
console.log("\n🌈 Düstur Color Blindness Audit (Brettel 1997 · ΔE2000)");
console.log("━".repeat(80));

for (const sim of SIMS) {
  const simHex = sim === "normal" ? tiers.map(t => t.hex) : tiers.map(t => simulate(t.hex, sim));
  const labs = simHex.map(h => hexToLab(h));

  console.log(`\n→ ${sim.toUpperCase()} ${sim === "normal" ? "(referans)" : ""}`);
  const matrix = [];
  for (let i = 0; i < tiers.length; i++) {
    const row = [];
    for (let j = 0; j < tiers.length; j++) {
      if (i >= j) { row.push(null); continue; }
      const dE = deltaE2000(labs[i], labs[j]);
      row.push(+dE.toFixed(1));
      const pass = dE >= THRESHOLD;
      if (sim !== "normal" && !pass) {
        failures++;
        console.log(`  ✗ ${tiers[i].name.padEnd(11)} ↔ ${tiers[j].name.padEnd(11)} ΔE=${dE.toFixed(1)} (eşik: ${THRESHOLD})`);
      }
    }
    matrix.push(row);
  }
  results.types[sim] = { simulated: simHex.map((h,i) => ({ tier: tiers[i].name, original: tiers[i].hex, simulated: h })), matrix };
  const pairCount = tiers.length * (tiers.length - 1) / 2;
  const failCount = matrix.flat().filter(v => v !== null && v < THRESHOLD).length;
  console.log(`  ${failCount === 0 ? "✓" : "⚠"} ${pairCount - failCount}/${pairCount} pair ayırt edilebilir (ΔE ≥ ${THRESHOLD})`);
}

mkdirSync("dist/reports", { recursive: true });
writeFileSync("dist/reports/colorblind.json", JSON.stringify(results, null, 2));

console.log(`\n📝 Rapor: dist/reports/colorblind.json`);
console.log(`Toplam hata: ${failures} (CVD altında ayırt edilemeyen tier çifti)\n`);

if (failures > 0 && STRICT) {
  process.exit(1);
}
