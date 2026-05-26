# DÜSTUR

**T.C. Mevzuat Tasarım Sistemi · Stratejik Çerçeve**

Türkiye Cumhuriyeti mevzuat sisteminin kromatik, tipografik, jeton ve UI yüzey doktrini. Anayasa'dan Tebliğ'e tüm normlara — basılı belgeden mobil arayüze tüm yüzeylere — tek bir devredilebilir kaynak.

---

## Bu Repository Nedir

Bu repo, sistemin **tek-kaynak-doğruluk** (single source of truth) deposudur:

- **`tokens/`** — W3C DTCG (Tasarım Jetonları Community Group) standartında JSON jetonları. Sistemin makine-okunabilir anayasası.
- **`css/`** — Web/print uygulama katmanı. Primitive + semantic jetonların CSS Custom Properties biçimi + base ve bileşen stilleri.
- **`docs/`** — Doktrin belgesi. 7 ana bölüm + ön/arka-matter.
- **`reference/`** — Tam orijinal kaynak HTML (`dustur-source.html`). Print-ready, Paged.js uyumlu, A4 PDF üretimi için.
- **`examples/`** — Yüzey örnekleri (madde detay, kanun ana, anayasa kademe, vb.).
- **`assets/`** — Selçuklu motif kütüphanesi, sigil, mühür SVG'leri.

---

## Mimarisi

```
Dustur/
├── tokens/                         W3C DTCG · single source of truth
│   ├── primitives/                 — Ham değer kütüphanesi (~140 jeton)
│   │   ├── color.json              · 6 aile × 12 step = 72 renk
│   │   ├── typography.json         · Fraunces · Albert Sans · Recursive eksen değerleri
│   │   ├── space.json              · 12-step modular scale (4mm base)
│   │   ├── radius.json             · sabit 0 (kurumsal sade)
│   │   ├── motion.json             · duration + easing
│   │   └── z-index.json            · katman hiyerarşisi
│   └── semantic/                   — Rol-bağlam kütüphanesi (~80 jeton)
│       ├── tier.json               · Anayasa · Kanun · CBK · Yönetmelik · Tebliğ · AYM
│       ├── action.json             · buton · link · durum mesajları
│       ├── surface.json            · yüzey · kenarlık · metin
│       └── typography.json         · rol bazlı kompozit tipografi
│
├── css/                            Web/print uygulama katmanı
│   ├── tokens/
│   │   ├── primitives.css          · :root --tcm-* primitives
│   │   └── semantics.css           · :root --tcm-* semantics (referans)
│   ├── base/
│   │   ├── reset.css               · minimal reset
│   │   ├── typography.css          · .t-display, .t-section, .t-body, ...
│   │   └── print.css               · @page · Paged.js disiplini
│   ├── components/
│   │   ├── badges.css              · .yuzey-badge.{anayasa,kanun,cbk,...}
│   │   ├── code-block.css          · syntax-highlighted dark code
│   │   ├── quote-block.css         · doktriner alıntı + aside-box
│   │   └── token-card.css          · jeton sergi kartları
│   └── dustur.css                  · tek-dosya bundle (@import zinciri)
│
├── docs/                           Doktrin belgesi · 7 ana bölüm
│   ├── 00-overview/                · Önsöz · Konvansiyonlar · Lock Statement
│   ├── 01-manifesto/               · Üç Evren · Kompozit Palet · Modern Geometri
│   ├── 02-typography/              · Fraunces · Albert Sans · Recursive · opsz · WONK/SOFT
│   ├── 03-color/                   · TBK · Turkuvaz · Bordo · Lacivert · Amber · 12-step LCH · WCAG/APCA
│   ├── 04-tokens/                  · DTCG · naming · primitive · semantic · cross-platform · governance
│   ├── 05-ui-surface/              · 17 UI yüzey spesifikasyonu
│   ├── 06-akoma-ntoso/             · XML standardı · TR adaptasyonu · ELI URI
│   ├── 07-governance/              · Axis Lock · değişiklik yönetimi · handoff
│   └── glossary/                   · Tipografik · Kromatik · Hukuk sözlüğü
│
├── examples/                       Yüzey HTML örnekleri
├── reference/
│   └── dustur-source.html          Tam orijinal kaynak · Paged.js A4 PDF
├── assets/motifs/                  Selçuklu rozet · sigil · chain SVG'leri
│
├── package.json                    NPM package (@dustur/tasarim-sistemi)
├── style-dictionary.config.json    Cross-platform export pipeline
└── README.md                       (bu dosya)
```

---

## Hızlı Başlangıç

### 1) CSS olarak kullanım (web · print)

```html
<link rel="stylesheet" href="https://unpkg.com/@dustur/tasarim-sistemi/css/dustur.css">
```

Veya modüler:

```css
@import "@dustur/tasarim-sistemi/css/tokens/primitives.css";
@import "@dustur/tasarim-sistemi/css/tokens/semantics.css";
@import "@dustur/tasarim-sistemi/css/base/typography.css";
@import "@dustur/tasarim-sistemi/css/components/badges.css";
```

Sonra bileşenler doğrudan semantic jetonlar üzerinden çalışır:

```html
<span class="yuzey-badge kanun">KANUN</span>
<span class="yuzey-badge anayasa">ANAYASA</span>
<span class="yuzey-badge teblig">TEBLİĞ</span>
```

### 2) Cross-platform export (Style Dictionary)

```bash
npm install
npm run build
```

Çıktı `dist/` altında üretilir:

| Platform | Dosya | Format |
|---|---|---|
| Web | `dist/web/tcm-tokens.css` | CSS Custom Properties |
| iOS | `dist/ios/TCMTokens.swift` | Swift constants |
| Android | `dist/android/colors.xml` · `dimens.xml` | Android resources |
| DTCG | `dist/dtcg/tcm-tokens.json` | W3C DTCG JSON |
| TS | `dist/ts/tokens.ts` | TypeScript/ES6 |

---

## Doktriner Temel

### Üç Evren Doktrini

Sistem üç bağımsız evreni tek doktrinde birleştirir:
1. **Tipografik evren** — Fraunces (serif · mevzuat), Albert Sans (sans · UI), Recursive (mono · URI/veri)
2. **Kromatik evren** — Kompozit palet: TBK · Turkuvaz · Bordo · Lacivert · Amber
3. **Geometrik evren** — Selçuklu motif kütüphanesi · sabit 0 radius · sade keskin köşe

### Kromatik Mührler · Mevzuat Kademeleri

| Kademe | Renk | Hex (Step 9) | Doktriner Kaynak |
|---|---|---|---|
| **Anayasa** | TBK (Türk Bayrağı Kırmızısı) | `#E30A17` | TS 715/2010 standardı |
| **AYM** | Cumhuriyet Lacivert | `#002664` | Devlet teamülü |
| **CBK** | Düstûr Bordo | `#5C1A1B` | Yürütme mührü |
| **Kanun** | Anadolu Selçuklu Turkuvazı | `#1A8B8C` | Karatay Medrese 1251 |
| **Yönetmelik** | Turkuvaz lighter | `#43A1A2` | Yönetmelik tier |
| **Tebliğ** | Tebliğ Amber | `#B45309` | Bakanlık mührü |
| **Genelge** | Nötr Gri | `#525252` | İdari teamül |

### Erişilebilirlik

- **WCAG 2.1 AA** zorunlu, **WCAG 2.1 AAA** hedef.
- **APCA** (WCAG 3.0 hazırlığı) kontrast hesaplaması her semantic jeton için belgeli.
- TR diakritik audit: 6 karakter (Ç, Ğ, İ, Ö, Ş, Ü) tüm font ailelerinde tam destek.

---

## Jeton Yönetişim

Sistem **W3C DTCG Format Module** ve **Semantic Versioning 2.0.0** üzerinde inşa edilmiştir.

| Bump | Tetikleyen |
|---|---|
| **MAJOR** | Jeton silme · yeniden adlandırma · scale tipolojik değişimi |
| **MINOR** | Yeni jeton ekleme · yeni primitive aile · yeni semantic kategori |
| **PATCH** | Mevcut jeton değer düzeltmesi · contrast iyileştirme · doc güncelleme |

Sorumluluk haritası, inceleme protokolü ve deprecation politikası: [`docs/07-governance/`](./docs/07-governance/) ve [`docs/04-tokens/governance.md`](./docs/04-tokens/governance.md).

---

## Belge Olarak Okuma (PDF)

Sistemin tam doktriner belgesi `reference/dustur-source.html`'tedir. Paged.js polyfill ile A4 PDF olarak basılır:

```bash
# Bir Paged.js çıktı aracıyla
pagedjs-cli reference/dustur-source.html -o dustur.pdf
```

Belge ~100 sayfa, 7 ana bölüm + ön/arka-matter içerir.

---

## Lisans

İçerik · doktrin · görsel sistem: bkz. `LICENSE`.

Üçüncü-taraf:
- **Fraunces** — SIL OFL 1.1 (Undercase Type)
- **Albert Sans** — SIL OFL 1.1 (Florian Karsten)
- **Recursive** — SIL OFL 1.1 (Arrow Type)

---

## Katkıda Bulunmak

Bkz. [`CONTRIBUTING.md`](./CONTRIBUTING.md). Jeton değişiklik talepleri 4-aşamalı inceleme protokolüne tabidir.

---

> *"Bir tasarım sistemi insan tarafından okunsa bile, makine tarafından uygulanmadığı sürece çoğaltılamaz, devredilemez, sürdürülemez."* — Bölüm IV, Jeton Mimarisi Doktrini
