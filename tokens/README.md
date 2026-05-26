# Tasarım Jetonları · W3C DTCG

Sistemin **tek-kaynak-doğruluk** (single source of truth) deposu. Tüm renkler, tipografi, boşluk, motion ve z-index değerleri W3C Design Tokens Community Group (DTCG) Format Module standardında JSON dosyalarında tutulur.

## Mimari · İki Katman

### `primitives/` — Ham Değer Kütüphanesi
Politik olarak nötr jetonlar. Hiçbir UI rolüne, hiçbir bağlama bağlı değildir.

| Dosya | İçerik | Sayı |
|---|---|---|
| [`color.json`](./primitives/color.json) | 6 aile × 12 step LCH scale | 72 |
| [`typography.json`](./primitives/typography.json) | Font aileleri + variable axis değerleri | ~30 |
| [`space.json`](./primitives/space.json) | 12-step modular scale (4mm base) | 12 |
| [`radius.json`](./primitives/radius.json) | Sabit 0 (kurumsal sade keskin köşe) | 1 |
| [`motion.json`](./primitives/motion.json) | Duration + easing | 6 |
| [`z-index.json`](./primitives/z-index.json) | Katman hiyerarşisi | 7 |

### `semantic/` — Rol-Bağlam Kütüphanesi
Primitive'lere referans tutan, UI rolüne göre adlandırılmış jetonlar. Bileşenlerin tek tükettiği katman.

| Dosya | İçerik | Sayı |
|---|---|---|
| [`tier.json`](./semantic/tier.json) | Mevzuat kademesi mührleri (Anayasa, Kanun, CBK, ...) | ~20 |
| [`action.json`](./semantic/action.json) | Buton · link · durum mesajları | ~20 |
| [`surface.json`](./semantic/surface.json) | Yüzey · kenarlık · metin | ~15 |
| [`typography.json`](./semantic/typography.json) | Rol bazlı kompozit tipografi | ~25 |

## Naming Convention · 5-Segment Pattern

```
--tcm  -  color    -  turkuvaz  -  9
prefix    category    subcategory  step
```

`tcm` = T.C. Mevzuat prefix.

## Cross-Platform Export

Style Dictionary ile 5 platforma otomatik dışa aktarım:

```bash
npm run build
```

Çıktılar: `dist/web/`, `dist/ios/`, `dist/android/`, `dist/dtcg/`, `dist/ts/`

Detaylar: [`docs/04-tokens/`](../docs/04-tokens/)

## Referans Çözümleme

Semantic jetonlar primitive'lere `{kategori.subcategori.varyant}` syntax'ı ile referans verir:

```json
{
  "anayasa-mark": {
    "$type": "color",
    "$value": "{color.tbk.9}",
    "$description": "Anayasa kademesi mührü"
  }
}
```

Style Dictionary pipeline bu referansları her hedef platform için çözer:

| Platform | Çözüm |
|---|---|
| CSS | `var(--tcm-color-tbk-9)` |
| iOS | `TCMColor.tbk9` |
| Android | `@color/tcm_color_tbk_9` |
| DTCG | `{color.tbk.9}` (referans korunur) |

## JSON Validasyonu

```bash
npm run lint:tokens
```

veya manuel:

```bash
find tokens -name '*.json' -exec node -e "JSON.parse(require('fs').readFileSync(process.argv[1]))" {} \;
```

## Değişiklik

Tüm jeton değişiklikleri 4-aşamalı RFC sürecine tabidir. Bkz. [CONTRIBUTING.md](../CONTRIBUTING.md).

> "Bir tasarım sistemi insan tarafından okunsa bile, makine tarafından uygulanmadığı sürece çoğaltılamaz, devredilemez, sürdürülemez."
