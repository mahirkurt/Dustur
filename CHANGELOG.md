# Changelog

Bu projenin tüm dikkat çekici değişiklikleri bu dosyada belgelenir.

Format [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) standardını izler.
Sürümlendirme [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) standardına uyar.

## [Unreleased]

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
