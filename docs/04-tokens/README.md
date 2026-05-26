# 04 · Tasarım Jetonları Mimari

## Bölüm Haritası

| # | Sub-bölüm |
|---|---|
| 4.1 | Jeton Felsefesi + W3C DTCG Standardı |
| 4.2 | Naming Convention |
| 4.3 | Primitive Token Catalog (~140 jeton) |
| 4.4 | Semantic Token Catalog (~80 jeton) |
| 4.5 | Cross-Platform Export |
| 4.6 | Token Governance |

## 4.1 · Jeton Felsefesi

Bir tasarım sistemi insan tarafından okunsa bile, makine tarafından uygulanmadığı sürece çoğaltılamaz, devredilemez, sürdürülemez. Tasarım jetonları, doktrinin PDF belgelerinde yatan ölü harfinin **koddaki yaşayan biçimidir**.

Sistem **W3C Tasarım Jetonları Community Group (DTCG)** Format Module standardı üzerinde inşa edilir. İki katmanlı mimari:

- **Primitive** — Ham değer kütüphanesi. Politik olarak nötr.
- **Semantic** — Rol-bağlam birleşimleri. Primitive'lere referans.

## 4.2 · Naming Convention · 5-Segment Pattern

```
--tcm  -  color    -  turkuvaz  -  9
prefix    category    subcategory  step
```

| Segment | Anlam | Örnek |
|---|---|---|
| **prefix** | Sistemin namespace'i | `tcm` (T.C. Mevzuat) |
| **category** | Jeton kategorisi | `color`, `space`, `fr-opsz` |
| **subcategory** | Aile / rol | `turkuvaz`, `anayasa-mark` |
| **variant** | Modifier | `hover`, `visited` |
| **step** | Scale adımı | `1`-`12` |

### Primitive örnekleri:
```
--tcm-color-turkuvaz-9
--tcm-fr-opsz-144
--tcm-space-4
--tcm-duration-fast
```

### Semantic örnekleri:
```
--tcm-anayasa-mark
--tcm-kanun-rozet-bg
--tcm-action-primary-bg-hover
--tcm-link-visited
```

## 4.3 · Primitive Token Catalog

| Kategori | Sayı | Kaynak |
|---|---|---|
| Renk (6 aile × 12 step) | 72 | [`color.json`](../../tokens/primitives/color.json) |
| Tipografi (3 aile + axes) | ~30 | [`typography.json`](../../tokens/primitives/typography.json) |
| Space (12-step modular) | 12 | [`space.json`](../../tokens/primitives/space.json) |
| Radius | 1 | [`radius.json`](../../tokens/primitives/radius.json) |
| Motion (duration + easing) | 6 | [`motion.json`](../../tokens/primitives/motion.json) |
| Z-index | 7 | [`z-index.json`](../../tokens/primitives/z-index.json) |

## 4.4 · Semantic Token Catalog

| Kategori | Sayı | Kaynak |
|---|---|---|
| Tier (kademe mührleri) | ~20 | [`tier.json`](../../tokens/semantic/tier.json) |
| Action (buton · link · durum) | ~20 | [`action.json`](../../tokens/semantic/action.json) |
| Surface (yüzey · kenarlık · text) | ~15 | [`surface.json`](../../tokens/semantic/surface.json) |
| Typography (rol bazlı) | ~25 | [`typography.json`](../../tokens/semantic/typography.json) |

## 4.5 · Cross-Platform Export

Style Dictionary pipeline ile tek JSON kaynak → 5 hedef platform:

```bash
npm run build
```

| Platform | Format | Dosya |
|---|---|---|
| Web | CSS Custom Properties | `dist/web/tcm-tokens.css` |
| iOS | Swift constants | `dist/ios/TCMTokens.swift` |
| Android | XML resources | `dist/android/colors.xml` |
| DTCG | W3C JSON | `dist/dtcg/tcm-tokens.json` |
| TS | ES6 module | `dist/ts/tokens.ts` |

Config: [`style-dictionary.config.json`](../../style-dictionary.config.json)

## 4.6 · Token Governance

### Semantic Versioning 2.0.0

| Bump | Tetikleyen |
|---|---|
| **MAJOR** | Jeton silme · yeniden adlandırma · scale tipolojik değişimi |
| **MINOR** | Yeni jeton ekleme · yeni primitive aile · yeni semantic kategori |
| **PATCH** | Mevcut değer düzeltmesi · contrast iyileştirme · doc güncelleme |

### Sorumluluk Haritası (RACI)

| Değişiklik Tipi | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Primitive değiştirme | Tasarım Lideri | Sistem Sahibi | A11y + Brand + Hukuk | Tüm geliştiriciler |
| Semantic ekleme | Senior Designer | Tasarım Lideri | Lead Developer | Tasarım ekibi |
| Semantic değiştirme | Senior Designer | Tasarım Lideri | A11y Lead | Tüm geliştiriciler |
| Jeton silme | Sistem Sahibi | Sistem Sahibi | Tüm ekipler | Tüm paydaşlar |

### İnceleme Protokolü · 4-Aşamalı Süreç

1. **Proposal** — GitHub'da jeton RFC PR'ı açılır
2. **İnceleme** — Sorumluluk haritası uyarınca incelenir (a11y, brand, hukuki, geriye-uyum)
3. **Approval** — Accountable kişi final onay verir; MAJOR için Kurum Yönetim Kurulu bilgilendirmesi
4. **Release + Communication** — Pipeline tetiklenir, dağıtım yapılır, CHANGELOG güncellenir; MAJOR için 30-günlük deprecation window

---

> Tam metin: [`reference/dustur-source.html`](../../reference/dustur-source.html) (Sayfalar 45-54)
