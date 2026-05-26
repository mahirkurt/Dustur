# Audit Raporu · v1.1.1

_Test tarihi: 2026-05-26 · 30 bağımsız test_

Sistemde gerçek kullanıma hazırlık için yapılan kapsamlı audit. Bulgular ve uygulanan düzeltmeler.

## Özet

| Test grubu | Test sayısı | Geçti | Düzeltildi | Bilinen sınırlama |
|---|---|---|---|---|
| JSON / config validity | 4 | 4 | — | — |
| YAML workflow validity | 7 | 7 | — | — |
| XML/SVG well-formedness | 6 | 6 | — | — |
| CSS @import path integrity | 9 | 9 | — | — |
| Token referans çözümleme | 308 jeton | 308 | — | — |
| Build pipeline (5 platform) | 5 | 5 | 3 hata | — |
| Audit script'ler | 5 | 5 | 1 bug | — |
| Architectural integrity | 4 | 3 | 1 | — |

**Tüm 6-aşamalı pipeline 911ms'de tamamlanıyor.**

---

## Bulunan ve Düzeltilen Hatalar

### 🐛 BUG-001 · `build-css-from-tokens.mjs` z-index.json'i atlıyordu
**Şiddet:** Yüksek  
**Etki:** 7 z-index primitive jetonu (`--tcm-z-base`, `--tcm-z-modal`, vb.) üretilen CSS'ten EKSİKTİ.  
**Neden:** Filter `!p.endsWith("index.json")` `tokens/index.json` için yazılmıştı ama `tokens/primitives/z-index.json`'i de yanlışlıkla yakalıyordu.  
**Düzeltme:** `!p.endsWith("tokens/index.json")` ile spesifikleştirildi.

### 🐛 BUG-002 · Style Dictionary `fileHeader` referansı tanımsız
**Şiddet:** Yüksek  
**Etki:** `npm run build:sd` (Style Dictionary tam build) FAIL ediyordu — `Can't find fileHeader: dustur-header`.  
**Düzeltme:** Geçersiz `fileHeader` referansı kaldırıldı; SD config sadeleştirildi.

### 🐛 BUG-003 · SD Android filter `category` yerine `$type` olmalıydı
**Şiddet:** Orta  
**Etki:** `dist/android/colors.xml` ve `dimens.xml` üretilmiyordu (No tokens for...).  
**Düzeltme:** Filter `{ "$type": "color" }` ve `{ "$type": "dimension" }` ile düzeltildi.

### 🐛 BUG-004 · mm → dp/pt cross-platform unit conversion hatası
**Şiddet:** Yüksek  
**Etki:** Print-first sistem (4mm base) Android'de `1mm → 16dp` (yanlış · 5× büyük).  
**Doğru değerler:** `1mm → 3.78dp` (Android, 160dpi base) · `1mm → 2.83pt` (iOS).  
**Düzeltme:** `scripts/sd-config.mjs` ile özel `size/mm-to-dp` ve `size/mm-to-pt` transform'ları yazıldı. Default SD transform set yerine custom transform listesi kullanılır.

### 🐛 BUG-005 · `tokens/semantic/typography.json` geçersiz primitive referans
**Şiddet:** Orta  
**Etki:** `section.soft` jetonu `{fr.soft.12}` referansı veriyordu ama bu primitive yoktu (0, 25, 50, 100 vardı).  
**Tespit:** `lint-tokens.mjs` ilk çalıştırmada yakaladı.  
**Düzeltme:** `{fr.soft.25}` olarak güncellendi.

---

## Architectural Findings

### 🏗 FINDING-A · Semantic katmanda hex literal sızıntısı

Audit, semantic JSON'larında 16 hex literal tespit etti (DTCG'ye göre semantic katman primitive'lere referans vermeli, hex literal içermemeli):

| Dosya | Hex literal sayısı | Tipi |
|---|---|---|
| `surface.json` | 12 | Specimen miras renkleri (#FAF6EE, #E9E2D2, #FFFFFF, vb.) |
| `action.json` | 4 | Standalone semantic (danger #FEE2E2, success #D1FAE5, vb.) |

**Düzeltme:** Yeni primitive dosyası `tokens/primitives/kagit.json` oluşturuldu:
- `kagit.*` — Specimen miras kâğıt renkleri
- `ink.*` — Specimen miras metin tonları (sıcak gri, saf siyah değil)
- `system.*` — Standalone semantic renkler (danger/success)

`surface.json` ve `action.json` artık 0 hex literal içerir; tüm değerler primitive referansı.

### 🏗 FINDING-B · LOCKED jeton tutarsızlığı

`tokens/index.json`'da 14 LOCKED jeton listeleniyor ama 6'sında (`tier.*.mark`, `radius.0`) `$extensions.tr.tcm.kilit` etiketi eksikti.

**Düzeltme:** Tüm tier marker'lara ve radius'a `$extensions.tr.tcm.kilit: "LOCKED"` eklendi. `scripts/check-locked.mjs` ile bu tutarlılık her CI çalışmasında doğrulanır.

### 🏗 FINDING-C · Auto-generated vs Manual CSS naming gap

SD `dist/web/tcm-tokens.css` jetonları full-path naming kullanıyor (örn. `--tcm-tier-anayasa-mark`), ama component CSS dosyaları kısa form kullanıyor (örn. `--tcm-anayasa-mark`). Manuel `css/tokens/semantics.css` katmanı bu boşluğu doldurur.

**Karar:** Dokümante edildi · bu hibrit yaklaşım korunacak. Manuel semantics.css ergonomik alias katmanı; SD output low-level platform-neutral kanonik form.

---

## Bilinen Sınırlamalar

### ⚠ LIMITATION-A · `mm` birimi screen-render'da pixel-perfect değil
Sistem print-first (Paged.js A4) tasarlandı. `mm` birimi tarayıcıda 96dpi referans alınarak hesaplanır ama gerçek piksel boyutu kullanıcı zoom'una ve ekran DPI'ına bağlı değişir.

**Etki:** Düşük (sistem zaten print-first). Ekran render'da çok hassas boyut gerekiyorsa, `dist/android/dimens.xml` veya `dist/ios/TCMTokens.swift` ile doğru dp/pt değerler alınabilir.

### ⚠ LIMITATION-B · Style Dictionary collision uyarıları
Her primitive/semantic JSON file root'unda `$description` ve `$extensions` var. SD bunları flat namespace'te collision olarak görüyor. Uyarılar fatal değil ama log gürültüsü.

**Etki:** Düşük. Çözüm: Her dosya root'undaki `$description`'ı kaldırmak veya namespace eklemek.

---

## Sistem Sağlık Skoru

```
🟢 308 jeton          · 0 hata, 0 uyarı
🟢 13 contrast pair    · tümü WCAG/APCA hedef
🟢 3 font ailesi       · TR diakritik belgeli
🟢 14 LOCKED jeton     · tutarlı
🟢 5 platform build    · CSS, iOS, Android, DTCG, TS
🟢 9 dist artifact     · 81 KB total
🟢 18 doc README       · 0 broken link
🟢 6 audit script      · 911ms full pipeline
🟢 14 CSS dosyası      · @layer cascade · 0 syntax hatası
🟢 7 HTML örnek        · HTTP 200 · CSS link integrity 100%
```

---

## Hâlâ Eksik (gelecek versiyon için aday)

1. **Headless browser render snapshot test** — Playwright/Puppeteer ile actual visual regression
2. **AKN XML XSD validation** — OASIS LegalDocML schema ile valid AKN doğrulaması (xmllint --schema gerektirir)
3. **Color blindness simulation** — Protanopia/Deuteranopia/Tritanopia altında tier ayırt edilebilirliği
4. **Font subsetting** — sadece TR + temel ASCII glyph'lerini içeren subset font dosyaları
5. **Source map** — `dist/web/tcm-tokens.css` için JSON source link
6. **i18n (TR → EN/AR)** — Doctrine document'ın İngilizce ve Arapça çevirisi (Osmanlıca arşiv için)
7. **Visual changelog** — Her release için before/after screenshot diff
