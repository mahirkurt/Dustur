# Changelog

Bu projenin tüm dikkat çekici değişiklikleri bu dosyada belgelenir.

Format [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) standardını izler.
Sürümlendirme [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) standardına uyar.

## [Unreleased]

## [1.0.0] · 2026-05-26

### İlk yayım · Stratejik Çerçeve

#### Eklendi

**Tokens (`tokens/`)**
- W3C DTCG formatında primitive token kütüphanesi (~140 jeton)
  - 6 renk ailesi × 12 step = 72 renk primitive (TBK, Turkuvaz, Bordo, Lacivert, Amber, Nötr Gri)
  - 3 font ailesi + variable axis değerleri (Fraunces, Albert Sans, Recursive)
  - 12-step modular space scale (4mm base)
  - Radius sabit 0
  - Motion duration + easing
  - Z-index katman hiyerarşisi
- Semantic token kütüphanesi (~80 jeton)
  - Mevzuat kademeleri (Anayasa, Kanun, CBK, Yönetmelik, Tebliğ, AYM, Genelge)
  - Action jetonları (buton, link, status)
  - Surface jetonları (yüzey, kenarlık, metin)
  - Rol bazlı tipografi jetonları

**CSS (`css/`)**
- Primitive CSS custom properties (`tokens/primitives.css`)
- Semantic CSS custom properties (`tokens/semantics.css`)
- Base reset (`base/reset.css`)
- Base typography rol sınıfları (`base/typography.css`)
- Paged.js print disiplini (`base/print.css`)
- Bileşenler: badges, code-block, quote-block, token-card
- Bundled stylesheet (`dustur.css`)

**Docs (`docs/`)**
- 7 bölümlük doktrin haritası
- Tipografik, kromatik, hukuk sözlüğü
- Bölüm bazlı README'ler

**Reference (`reference/`)**
- Tam orijinal HTML kaynak (~100 sayfa A4 PDF), Paged.js uyumlu

**Build**
- Style Dictionary config (5 platform: web, iOS, Android, DTCG, TS)
- NPM package metadata
- CONTRIBUTING.md (4-aşamalı jeton RFC protokolü)

#### Doktriner Kararlar (kilit · LOCKED)
- TBK = `#E30A17` (TS 715/2010)
- Anayasa = TBK mührü
- Tier-kromatik atamaları (Bölüm III)
- 3 font ailesi seçimi (SIL OFL 1.1)
- Radius = 0 sabit
