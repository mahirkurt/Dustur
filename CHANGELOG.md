# Changelog

Bu projenin tüm dikkat çekici değişiklikleri bu dosyada belgelenir.

Format [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) standardını izler.
Sürümlendirme [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) standardına uyar.

## [Unreleased]

## [1.2.0] · 2026-05-26

### Eklendi · Backlog tamamlandı

**1) Renk körlüğü audit (Brettel 1997 + CIEDE2000)**
- `scripts/check-colorblind.mjs` — Protanopia/Deuteranopia/Tritanopia simülasyonu + ΔE2000 algısal renk farkı
- **Gerçek bulgu:** Anayasa↔Tebliğ (TBK kırmızı ↔ Amber) deuteranopia altında ΔE=3.6 — ayırt edilemez
- `docs/03-color/colorblind-strategy.md` — Non-color cue zorunluluğu doktrini

**2) Akoma Ntoso XSD validation**
- `tokens/akoma-ntoso/schema/akomantoso30.xsd` — OASIS LegalDocML 3.0 resmî şeması (244 KB)
- `tokens/akoma-ntoso/schema/xml.xsd` — W3C xml namespace bağımlılığı
- `scripts/check-akn.mjs` — Tüm AKN XML örneklerini xmllint ile valide eder
- TCK Madde 220 örneği şemayı geçti ✓

**3) CSS Source Maps (v3)**
- `scripts/build-css-sourcemap.mjs` — Source Map v3 VLQ encoding
- `dist/web/tcm-tokens.css.map` üretir; her CSS değişkeni kaynak JSON dosyasının satırına haritalanır
- Tarayıcı DevTools'unda token'a tıklayınca JSON kaynağına atlanabilir

**4) Font Subsetting (TR-only)**
- `scripts/subset-fonts.mjs` — pyftsubset ile variable font subset
- `css/fonts.css` — `@font-face` self-hosted declarations (Google Fonts CDN bağımlılığı yok)
- TR-optimum unicode kapsamı: ASCII + Latin Extended A/B + TR diakritik + ₺ + temel sembol
- **Boyut kazancı:**
  - Fraunces:    352 KB → 169 KB (-52.0%)
  - Albert Sans: 126 KB → 46 KB  (-63.5%)
  - Recursive:   2.3 MB → 521 KB (-77.6%)
  - **Toplam: 2.8 MB → 736 KB (-73.7%)**

**5) Visual Regression (Playwright)**
- `scripts/visual-regression.mjs` — Playwright + Chromium headless + pixelmatch
- 6 sayfa screenshot (gallery, madde, akn, badges, do-dont, yüksek-kontrast)
- İlk çalıştırma baseline oluşturur; sonrakiler pixel-by-pixel diff
- Eşik: <0.1% tolerans, 0.1-1% minor, >1% significant (CI fail)
- `dist/visual/diff/*.diff.png` — değişen pixel'leri kırmızıyla işaretler
- `.github/workflows/visual.yml` — PR'larda otomatik diff + comment

### Eklendi · Workflow
- `.github/workflows/visual.yml` — visual regression CI
- `scripts/check-akn.mjs` · `scripts/check-colorblind.mjs` · `scripts/build-css-sourcemap.mjs` · `scripts/subset-fonts.mjs` · `scripts/visual-regression.mjs`
- 5 yeni npm script: `check:colorblind`, `check:akn`, `check:visual`, `build:sourcemap`, `build:fonts`

### Değişti
- `css/dustur.css` — yeni `fonts` @layer ile self-hosted fonts en başta yüklenir
- `package.json` — playwright (devDep), pixelmatch + pngjs (dep)
- `.gitignore` — `assets/fonts/source/` (~3 MB) git-ignore; sadece subset'ler commit edilir
- CI workflow'una `check:colorblind` ve `check:akn` zorunlu adımları eklendi

## [1.1.1] · 2026-05-26

### Düzeltildi (audit-driven · `docs/audit-report.md`)

**Kritik bug'lar:**
- `build-css-from-tokens.mjs` filter `index.json`'i yakalamak için yazılmıştı ama `z-index.json`'i de yanlışlıkla atlıyordu → 7 z-index jetonu eksikti
- Style Dictionary config'inde tanımsız `fileHeader: dustur-header` referansı → `build:sd` FAIL
- SD Android filter `attributes.category` yerine DTCG `$type` kullanmalı → `dimens.xml` boş üretilmiyordu
- mm → dp/pt cross-platform conversion 5× yanlıştı (`1mm → 16dp` yerine doğrusu `3.78dp`)

**Architectural:**
- Semantic katmanda 16 hex literal tespit edildi · yeni primitive `tokens/primitives/kagit.json` (kagit/ink/system) oluşturuldu
- LOCKED jeton tutarsızlığı: index.json'da listede ama `$extensions.tr.tcm.kilit` eksik olan 6 jeton düzeltildi

### Eklendi
- `scripts/sd-config.mjs` · özel `size/mm-to-dp` ve `size/mm-to-pt` transform'larıyla SD programmatic API kullanır
- `scripts/check-locked.mjs` · LOCKED jeton tutarlılık denetimi (index.json ↔ $extensions)
- `tokens/primitives/kagit.json` · 7. primitive ailesi (specimen miras + system colors)
- `docs/audit-report.md` · 30 testlik kapsamlı audit raporu

### Değişti
- `style-dictionary.config.json` · simplifiye edildi (collision-free, $type-aware filtering)
- `package.json` → `build` artık `sd-config.mjs` kullanır (custom transform'lu)
- `tokens/semantic/surface.json` · 12 hex literal → kagit.* referansları
- `tokens/semantic/action.json` · 4 hex literal → system.* referansları

### Doğrulama
```
✓ 308 jeton · 0 hata, 0 uyarı
✓ 13 contrast pair · WCAG/APCA hedef
✓ 14 LOCKED jeton tutarlı
✓ 5 platform build (CSS, iOS, Android, DTCG, TS)
✓ Full pipeline 911ms
✓ 0 broken internal link (18 README)
```

## [1.1.0] · 2026-05-26

### Eklendi · Carbon/MD3 paritesi iyileştirmeleri

**Jeton mimarisi**
- Üçüncü katman: `tokens/component/` (rozet, yüzey, atıf-modal)
- `$extensions.tr.tcm.*` namespace ile doktriner meta-veri:
  - `tr.tcm.kilit` (LOCKED), `tr.tcm.kaynak`, `tr.tcm.tier`, `tr.tcm.rol`, `tr.tcm.wcag.aaa`
- `$type: "fontWeight"` düzeltmeleri
- `tokens/index.json` manifest dosyası + LOCKED jeton listesi
- `tokens/akoma-ntoso/element-map.json` · XML → CSS → jeton eşlemesi
- `tokens/akoma-ntoso/eli-uri.schema.json` · TR ELI URI JSON Schema

**Tema sistemi**
- `css/themes/high-contrast.css` · `prefers-contrast: more` + `[data-tema="yuksek-kontrast"]`
- `css/themes/reduced-motion.css` · `prefers-reduced-motion` desteği
- `css/themes/print.css` · ekran ↔ baskı tema ayrımı (`[data-tema="baski"|"ekran"]`)
- CSS `@layer reset, tokens, base, components, themes, utilities, overrides`

**Akoma Ntoso uygulaması**
- `css/akn/element-styles.css` · `<article>`, `<paragraph>`, `<num>`, `<ref>`, `<quotedStructure>`, madde durum işaretleri
- Container query: `@container akn-article (max-width: 480px)` mobil madde görünümü
- Örnek: `examples/akn/tck-madde-220.xml` + `examples/akn/render.html`

**Build & CI**
- `.github/workflows/ci.yml` · token lint + contrast strict + diakritik audit + CSS build
- `.github/workflows/release.yml` · tag-tetikli release artifact üretimi
- `.github/dependabot.yml` · weekly npm + monthly actions
- `scripts/lint-tokens.mjs` · 297 jeton, 0 hata
- `scripts/check-contrast.mjs` · 13 jeton kombinasyonu, WCAG + APCA hesaplama
- `scripts/check-diacritics.mjs` · TR diakritik font audit
- `scripts/token-usage-map.mjs` · dead-token tespiti
- `scripts/build-css-from-tokens.mjs` · Style Dictionary'siz fallback build

**Yönetişim**
- `.github/ISSUE_TEMPLATE/jeton-rfc.yml` · structured 4-aşamalı RFC formu
- `.github/ISSUE_TEMPLATE/hata-raporu.yml`
- `.github/ISSUE_TEMPLATE/dokumantasyon.yml`
- `.github/pull_request_template.md` · test plan + RACI onay
- `.github/CODEOWNERS` · RACI haritasını koda bağlar
- `SECURITY.md` · güvenlik açığı bildirim politikası
- `CODE_OF_CONDUCT.md` · Contributor Covenant 2.1 (TR)

**Bileşen belgelendirme**
- `examples/index.html` · canlı component galerisi (sticky nav + tema switcher + scrollspy)
- `examples/anatomy/yuzey-anatomy.svg` · annotated yüzey diyagramı
- `examples/anatomy/rozet-anatomy.svg` · annotated rozet diyagramı
- `examples/do-dont/index.html` · 5 yapın/yapmayın karşı-örneği

### Düzeltildi
- `tokens/semantic/typography.json` · `section.soft` referansı `{fr.soft.12}` → `{fr.soft.25}` (lint katched)
- Tüm `wght` jetonlarının `$type` değeri `number` → `fontWeight` (DTCG uyumu)

### Değişti
- `package.json` → `type: "module"`, exports updated, new scripts added
- `css/dustur.css` → `@layer` cascade kontrolü

---

## [1.0.0] · 2026-05-26

### İlk yayım · Stratejik Çerçeve

#### Eklendi

**Tokens (`tokens/`)**
- W3C DTCG formatında primitive token kütüphanesi (~140 jeton)
- Semantic token kütüphanesi (~80 jeton)

**CSS (`css/`)**
- Primitive + semantic CSS custom properties
- Base reset, typography, print
- Bileşenler: badges, code-block, quote-block, token-card

**Docs (`docs/`)**
- 7 bölümlük doktrin haritası + sözlükler

**Reference**
- Tam orijinal HTML kaynak (~100 sayfa A4 PDF)

**Build**
- Style Dictionary config (5 platform)
- NPM package metadata
- CONTRIBUTING.md (4-aşamalı jeton RFC protokolü)

#### Doktriner Kararlar (LOCKED)
- TBK = `#E30A17` (TS 715/2010)
- Anayasa = TBK mührü
- Tier-kromatik atamaları (Bölüm III)
- 3 font ailesi seçimi (SIL OFL 1.1)
- Radius = 0 sabit
