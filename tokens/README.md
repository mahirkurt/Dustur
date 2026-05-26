# Tasarım Jetonları · W3C DTCG

Sistemin **tek-kaynak-doğruluk** (single source of truth) deposu. Tüm renkler, tipografi, boşluk, motion ve z-index değerleri W3C Design Tokens Community Group (DTCG) Format Module standardında JSON dosyalarında tutulur.

## Mimari · Üç Katman

```
primitive  →  semantic  →  component
ham değer     rol-bağlam    bileşen özel
```

### `primitives/` — Ham Değer Kütüphanesi
Politik olarak nötr jetonlar. Hiçbir UI rolüne, hiçbir bağlama bağlı değildir.

| Dosya | İçerik | Sayı |
|---|---|---|
| [`color.json`](./primitives/color.json) | 6 aile × 12 step LCH scale | 72 |
| [`kagit.json`](./primitives/kagit.json) | Specimen miras (kâğıt + ink + system) · ana 6 ailenin dışında | 16 |
| [`typography.json`](./primitives/typography.json) | Font aileleri + variable axis değerleri | ~35 |
| [`space.json`](./primitives/space.json) | 12-step modular scale (4mm base) | 12 |
| [`radius.json`](./primitives/radius.json) | Sabit 0 (kurumsal sade keskin köşe) | 1 |
| [`motion.json`](./primitives/motion.json) | Duration + easing | 6 |
| [`z-index.json`](./primitives/z-index.json) | Katman hiyerarşisi | 7 |

### `semantic/` — Rol-Bağlam Kütüphanesi
Primitive'lere referans tutan, UI rolüne göre adlandırılmış jetonlar.

| Dosya | İçerik | Sayı |
|---|---|---|
| [`tier.json`](./semantic/tier.json) | Mevzuat kademesi mührleri (Anayasa, Kanun, CBK, Mülga, ...) | ~25 |
| [`action.json`](./semantic/action.json) | Buton · link · durum mesajları | ~20 |
| [`surface.json`](./semantic/surface.json) | Yüzey · kenarlık · metin | ~15 |
| [`typography.json`](./semantic/typography.json) | Rol bazlı kompozit tipografi | ~25 |

### `component/` — Bileşen-Düzeyi Kütüphanesi
Semantic'e referans tutan, bileşen-özel jetonlar. Bileşen iç özelleştirmelerini semantic katmandan ayırır.

| Dosya | Bileşen | Açıklama |
|---|---|---|
| [`rozet.json`](./component/rozet.json) | `.yuzey-badge` | 7 tier varyantı + padding/font/border |
| [`yuzey.json`](./component/yuzey.json) | `.yuzey-render` | Madde detay, kanun ana, vb. |
| [`atif-modal.json`](./component/atif-modal.json) | `.atif-modal` | Cross-reference popover |

### `akoma-ntoso/` — XML Standart Eşlemesi

| Dosya | Açıklama |
|---|---|
| [`element-map.json`](./akoma-ntoso/element-map.json) | Akoma Ntoso element → CSS class → semantic jeton |
| [`eli-uri.schema.json`](./akoma-ntoso/eli-uri.schema.json) | TR adaptasyonlu ELI URI JSON Schema |

## Naming Convention · 5-Segment Pattern

```
--tcm  -  color    -  turkuvaz  -  9
prefix    category    subcategory  step
```

`tcm` = T.C. Mevzuat prefix.

## `$extensions` Meta-Veri

Her jeton, `$extensions.tr.tcm.*` namespace'i altında ek meta-veri taşır:

| Anahtar | Anlam |
|---|---|
| `tr.tcm.kilit` | `"LOCKED"` · MAJOR bump olmadan değiştirilemez |
| `tr.tcm.kaynak` | Doktriner kaynak referansı (TS standardı, akademik kaynak) |
| `tr.tcm.tier` | Mevzuat kademesi atfı |
| `tr.tcm.rol` | UI semantik rol (app-bg, solid-base, vb.) |
| `tr.tcm.wcag.aaa` | `true` ise body text için AAA kontrast karşılar |

Örnek:
```json
"9": {
  "$type": "color",
  "$value": "#E30A17",
  "$description": "Solid base · TS 715/2010 · Türk Bayrağı Kırmızısı",
  "$extensions": {
    "tr.tcm.rol": "solid-base",
    "tr.tcm.kilit": "LOCKED",
    "tr.tcm.kaynak": "TS 715/2010"
  }
}
```

## Manifest (`index.json`)

`tokens/index.json` tüm jeton dosyalarının ve LOCKED jeton listesinin agregasyonudur. Build/CI script'leri bu dosyayı tek giriş noktası olarak kullanır.

## Cross-Platform Export

Style Dictionary ile 5 platforma otomatik dışa aktarım:

```bash
npm run build
```

Veya Style Dictionary gerektirmeyen fallback:

```bash
node scripts/build-css-from-tokens.mjs
```

Çıktılar: `dist/web/`, `dist/ios/`, `dist/android/`, `dist/dtcg/`, `dist/ts/`

## Token Doğrulama

```bash
node scripts/lint-tokens.mjs        # JSON + DTCG + referans çözümleme
node scripts/check-contrast.mjs     # WCAG + APCA
node scripts/check-diacritics.mjs   # TR diakritik
node scripts/token-usage-map.mjs    # Hangi token nerede kullanılıyor
```

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

## LOCKED Jetonlar

Aşağıdaki jetonlar doktriner sözleşmenin parçasıdır — MAJOR bump + Kurum Yönetim Kurulu bilgilendirmesi olmadan değiştirilemez:

- `color.tbk.9` (TS 715/2010)
- `color.turkuvaz.9` (Karatay 1251)
- `color.bordo.9`, `color.lacivert.9`, `color.amber.9`
- Tüm `tier.*.mark` jetonları
- `family.fr`, `family.as`, `family.mo`
- `radius.0`

Tam liste: `tokens/index.json` → `kilit-jetonlar`.

## Değişiklik

Tüm jeton değişiklikleri 4-aşamalı RFC sürecine tabidir. Bkz. [CONTRIBUTING.md](../CONTRIBUTING.md) ve `.github/ISSUE_TEMPLATE/jeton-rfc.yml`.

> "Bir tasarım sistemi insan tarafından okunsa bile, makine tarafından uygulanmadığı sürece çoğaltılamaz, devredilemez, sürdürülemez."
