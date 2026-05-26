# 03 · Renk Sistemi

## Bölüm Haritası

| # | Sub-bölüm |
|---|---|
| 3.1 | Kompozit Palet Detaylı Argüman |
| 3.2 | TBK · Türk Bayrağı Kırmızısı Derivation |
| 3.3 | Turkuvaz · Anadolu Selçuklu Derivation |
| 3.4 | Mevzuat Tipi Kromatik Haritalama |
| 3.5 | Radix 12-Step LCH Scales |
| 3.6 | WCAG AA + APCA Kontrast Matrisi |
| 3.7 | Tier × Element × Color Haritası |

## 3.1 · Kompozit Palet

Sistemde tek-renk monomania reddedilir. **Beş ana renk + nötr gri** kompozit palet ile her mevzuat kademesi kendi kromatik kimliğine sahip olur:

| Aile | Step 9 | Doktriner Kaynak |
|---|---|---|
| **TBK** (Türk Bayrağı Kırmızısı) | `#E30A17` | TS 715/2010 standardı |
| **Turkuvaz** (Anadolu Selçuklu) | `#1A8B8C` | Karatay Medrese 1251 |
| **Bordo** (Düstûr Bordo) | `#5C1A1B` | Yürütme mührü teamülü |
| **Lacivert** (Cumhuriyet) | `#002664` | Devlet teamülü |
| **Amber** (Tebliğ) | `#B45309` | Bakanlık mührü |
| **Nötr Gri** | `#525252` | UI omurgası |

## 3.2 · TBK · Türk Bayrağı Kırmızısı Derivation

Sistemde TBK rengi keyfi değildir. **TS 715/2010** standardının (Türk Standardları Enstitüsü) belirlediği bayrak kırmızısının dijital karşılığı olan `#E30A17` kullanılır. Bu renk:

- Anayasa kademesinin tek mührüdür
- AYM iptal kararlarının arka plan rengidir
- Sistem dışında hiçbir tier'a uygulanmaz

## 3.3 · Turkuvaz · Anadolu Selçuklu

Turkuvaz renginin kaynağı **Karatay Medresesi (1251, Konya)** çini referansıdır. `#1A8B8C` solid base step 9, çini eserlerin orta yoğunluklu turkuvaz tonunun dijital karşılığıdır. Sistemde:

- Kanun kademesi (full saturation, step 9)
- Yönetmelik kademesi (lighter, step 7)
- Primary action butonları
- Cross-reference linkleri

## 3.4 · Mevzuat Tipi Kromatik Haritalama

12 ana norm tipi şu kromatik kademelere haritalanır:

| Norm Tipi | Aile | Step | Kullanım |
|---|---|---|---|
| Anayasa | TBK | 9 | Mühür · rozet |
| Anayasa değişiklik | TBK | 11 | Üst etiket |
| AYM kararı | Lacivert | 9 | Border-left |
| CBK | Bordo | 9 | Border-top |
| Kanun | Turkuvaz | 9 | Border-top |
| KHK | Turkuvaz | 8 | Border-top (lighter) |
| Yönetmelik | Turkuvaz | 7 | Border-top (lighter) |
| Tebliğ | Amber | 9 | Border-left |
| Genelge | Gri | 9 | Border-left |
| Mülga (yürürlükten) | Gri | 6 | Strikethrough |

## 3.5 · 12-Step LCH Scales

Her renk ailesi LCH (Lightness, Chroma, Hue) renk uzayında **12 algısal-eşit adımda** türetilmiştir. Radix Renkler (Modulz/WorkOS) metodolojisini izler. Her step belirli bir UI rolüne karşılık gelir:

| Step | Semantik Rol |
|---|---|
| 1 | App background |
| 2 | Subtle background |
| 3 | Element background |
| 4 | Hover element bg |
| 5 | Active element bg |
| 6 | Subtle border |
| 7 | UI element border |
| 8 | Hover border |
| 9 | **Solid base** (rozet, buton) |
| 10 | Hover solid |
| 11 | Low-contrast text |
| 12 | High-contrast text |

Tam scale tablosu: [`tokens/primitives/color.json`](../../tokens/primitives/color.json)

## 3.6 · WCAG AA + APCA Kontrast

Sistemin her semantic jeton kombinasyonu için:
- **WCAG 2.1 AA** (≥4.5:1 normal text, ≥3:1 large text) zorunlu
- **WCAG 2.1 AAA** (≥7:1 normal text) hedef
- **APCA** (WCAG 3.0 hazırlığı) hesaplama belgelenir

Kontrast matrisi (~50 satır): `reference/dustur-source.html` sayfa 42.

## 3.7 · Tier × Element × Color Haritası

Üç boyutlu haritalama belgesi: hangi kademe (tier) için hangi UI element'inde hangi renk (semantic token) kullanılır. Tam tablo: `reference/dustur-source.html` sayfa 43-44.

---

> Tam metin: [`reference/dustur-source.html`](../../reference/dustur-source.html) (Sayfalar 31-44)
