# DÜSTUR

**T.C. Mevzuat Tasarım Sistemi · Stratejik Çerçeve**

Türkiye Cumhuriyeti mevzuat sisteminin kromatik, tipografik, jeton ve UI yüzey doktrini. Anayasa'dan Tebliğ'e tüm normlara — basılı belgeden mobil arayüze tüm yüzeylere — tek bir devredilebilir kaynak.

---

## Bu Repository Nedir

Bu repo, sistemin **tek-kaynak-doğruluk** (single source of truth) deposudur:

- **`tokens/`** — W3C DTCG jetonları (primitive · semantic · component · akoma-ntoso). Sistemin makine-okunabilir anayasası.
- **`css/`** — Web/print uygulama katmanı. CSS `@layer` cascade · base · components · themes (HC/RM/print) · Akoma Ntoso element stilleri.
- **`docs/`** — Doktrin belgesi. 7 ana bölüm + ön/arka-matter + sözlük.
- **`reference/`** — Tam orijinal kaynak HTML. Print-ready, Paged.js uyumlu, A4 PDF üretimi.
- **`examples/`** — Canlı galeri (`index.html`) + yüzey örnekleri + AKN XML + anatomi SVG + do/don't.
- **`scripts/`** — Token lint, contrast audit (WCAG+APCA), diakritik audit, usage map, fallback build.
- **`.github/`** — CI workflow, Issue/PR templates, CODEOWNERS, dependabot.
- **`assets/`** — Selçuklu motif kütüphanesi, sigil, mühür SVG'leri.

---

## Mimarisi

```
Dustur/
├── tokens/                         W3C DTCG · single source of truth
│   ├── primitives/                 — Ham değer kütüphanesi (~140 jeton)
│   │   ├── color.json              · 6 aile × 12 step · $extensions kaynak/kilit
│   │   ├── typography.json         · 3 variable font + axis · lisans meta
│   │   ├── space.json              · 12-step modular (4mm base)
│   │   ├── radius.json, motion.json, z-index.json
│   ├── semantic/                   — Rol-bağlam (~80 jeton)
│   │   ├── tier.json, action.json, surface.json, typography.json
│   ├── component/                  — Bileşen-düzeyi (üçüncü katman)
│   │   ├── rozet.json, yuzey.json, atif-modal.json
│   ├── akoma-ntoso/                — XML element eşlemesi
│   │   ├── element-map.json        · AKN → CSS class → semantic jeton
│   │   └── eli-uri.schema.json     · TR ELI URI JSON Schema
│   └── index.json                  · Manifest + LOCKED jeton listesi
│
├── css/                            Web/print uygulama · @layer cascade
│   ├── tokens/                     · primitives.css · semantics.css
│   ├── base/                       · reset · typography · print
│   ├── components/                 · badges · code-block · quote-block · token-card
│   ├── themes/                     · high-contrast · reduced-motion · print
│   ├── akn/                        · element-styles.css (AKN XML render)
│   └── dustur.css                  · @layer ile bundled
│
├── docs/                           Doktrin belgesi · 7 bölüm + sözlük
│   ├── 00-overview / 01-manifesto / 02-typography / 03-color
│   ├── 04-tokens / 05-ui-surface / 06-akoma-ntoso / 07-governance
│   └── glossary/                   · Tipografik · Kromatik · Hukuk
│
├── examples/                       Canlı galeri + örnekler
│   ├── index.html                  · Sticky-nav component galerisi (tema switcher)
│   ├── madde-detay.html · badge-galeri.html
│   ├── akn/                        · TCK Madde 220 XML + render
│   ├── anatomy/                    · Annotated SVG anatomi diyagramları
│   └── do-dont/                    · Yapın/Yapmayın pattern library
│
├── scripts/                        Audit + build (zero-dependency ESM)
│   ├── lint-tokens.mjs             · DTCG + referans çözümleme
│   ├── check-contrast.mjs          · WCAG + APCA · CI strict
│   ├── check-diacritics.mjs        · TR diakritik audit
│   ├── token-usage-map.mjs         · Kullanılan/ölü token raporu
│   └── build-css-from-tokens.mjs   · Style Dictionary fallback
│
├── .github/                        Yönetişim + CI
│   ├── workflows/                  · ci.yml · release.yml
│   ├── ISSUE_TEMPLATE/             · jeton-rfc · hata-raporu · doc
│   ├── pull_request_template.md, CODEOWNERS, dependabot.yml
│
├── reference/dustur-source.html    Tam orijinal kaynak · Paged.js A4 PDF
├── assets/motifs/                  Selçuklu rozet · sigil · chain SVG'leri
│
├── package.json · style-dictionary.config.json
├── CONTRIBUTING.md · CHANGELOG.md · SECURITY.md · CODE_OF_CONDUCT.md
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
npm run build:sd   # Style Dictionary tam pipeline (5 platform)
npm run build      # Style Dictionary'siz fallback (sadece CSS)
```

Çıktı `dist/` altında üretilir:

| Platform | Dosya | Format |
|---|---|---|
| Web | `dist/web/tcm-tokens.css` | CSS Custom Properties |
| iOS | `dist/ios/TCMTokens.swift` | Swift constants |
| Android | `dist/android/colors.xml` · `dimens.xml` | Android resources |
| DTCG | `dist/dtcg/tcm-tokens.json` | W3C DTCG JSON |
| TS | `dist/ts/tokens.ts` | TypeScript/ES6 |

### 3) Audit / Quality

```bash
npm run check:all          # token lint + contrast + diakritik
npm run check:contrast     # WCAG + APCA matrisi (strict mode CI'da fail)
npm run report:usage       # Hangi token nerede kullanılıyor / ölü kod tespiti
```

CI'da `.github/workflows/ci.yml` her PR'da bu auditleri çalıştırır.

### 4) Tema Değiştirme

```html
<!-- Otomatik (prefers-contrast / prefers-reduced-motion / print) -->
<html>

<!-- Manuel ekran/baskı/yüksek kontrast -->
<html data-tema="ekran">
<html data-tema="baski">
<html data-tema="yuksek-kontrast">
```

### 5) Canlı Galeri

```bash
npm run preview   # python http server :8080
# Sonra http://localhost:8080/examples/
```

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
