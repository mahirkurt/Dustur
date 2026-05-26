# Migration Guide · Sürüm Geçiş Rehberi

## 0.x → 1.0.0

İlk stable release. Tüm değişiklikler yeni özellik olarak kabul edilir.

## 1.0.0 → 1.1.0

**MINOR · Backward-compatible.** Herhangi bir kod değişikliği gerekmez.

### Eklenen
- Üçüncü token katmanı: `component/` (rozet, yuzey, atif-modal)
- `$extensions.tr.tcm.*` meta-veri (kilit, kaynak, tier, rol)
- Tema sistemi: `[data-tema="ekran|baski|yuksek-kontrast"]`
- CSS `@layer` cascade

### Önerilen (opsiyonel)
Yeni component-level jetonlarını kullanarak bileşen özelleştirmelerini semantic katmandan ayırabilirsiniz:

```diff
- background: var(--tcm-tier-kanun-rozet-bg);
+ background: var(--tcm-rozet-kanun-bg);   /* component-level */
```

## 1.1.0 → 1.1.1

**PATCH · Bug fixes.** Kod değişikliği gerekmez.

- mm → dp/pt cross-platform unit conversion 5× yanlıştı, düzeltildi
- z-index primitive jetonları üretilen CSS'ten eksikti, düzeltildi
- Semantic katmandaki hex literal'lar `kagit.*` primitive ailesine taşındı

## 1.1.1 → 1.2.0

**MINOR · Backward-compatible.**

### Eklenen
- Renk körlüğü audit (`check:colorblind`)
- AKN XSD validation (`check:akn`)
- CSS source maps (`build:sourcemap`)
- Font subsetting (`build:fonts`)
- Visual regression (`check:visual`)

### Self-Hosted Fonts (opsiyonel)
Google Fonts CDN bağımlılığını kaldırmak için:

```diff
- <link href="https://fonts.googleapis.com/css2?family=Fraunces..." rel="stylesheet">
+ <!-- Düstur 1.2.0 sonrası fonts otomatik dustur.css içinde -->
```

`css/dustur.css`'i import ediyorsanız değişiklik gerekmez — `@layer fonts` ile self-hosted fontlar otomatik yüklenir.

## Gelecek Major (2.0.0)

Henüz planlanmadı. Tetikleyebilecek değişiklikler:
- LOCKED jeton silme/yeniden adlandırma
- Primitive scale tipolojik değişimi (12-step → 10-step gibi)
- Doktriner sözleşme değişikliği

Bu tür değişiklikler 30-günlük deprecation window ile duyurulur. Bkz. [`docs/07-governance/`](./07-governance/).

## LOCKED Jeton Kaldırma Protokolü

Bir LOCKED jeton silinecek veya yeniden adlandırılacaksa:

1. **Aşama 1 (Minor sürüm):** `$extensions.tr.tcm.deprecated: true` + `$extensions.tr.tcm.replacement` eklenir.
2. **Aşama 2 (30 gün sonra):** Console warning eklenmiş build oluşturulur (`@deprecated` JSDoc + CSS yorum).
3. **Aşama 3 (Major sürüm):** Jeton silinir; MIGRATION.md bu rehberde belgelenir.

## Sürüm Politikası

[Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) sıkı uygulanır:

| Bump | Tetikleyen |
|---|---|
| **MAJOR** | Jeton silme · yeniden adlandırma · scale tipolojik değişimi · breaking CSS class kaldırma |
| **MINOR** | Yeni jeton ekleme · yeni semantic kategori · yeni bileşen · yeni platform · yeni audit |
| **PATCH** | Mevcut değer düzeltmesi · kontrast iyileştirme · bug fix · dokümantasyon |
