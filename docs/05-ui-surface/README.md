# 05 · UI Yüzey Anatomy

## Bölüm Haritası · 17 Yüzey

| # | Yüzey | Açıklama |
|---|---|---|
| 5.1 | Madde Detay Sayfası | Tek bir madde'nin tam görüntülenmesi |
| 5.2 | Kanun Ana Sayfası | Bir kanunun TOC + maddelerinin liste görünümü |
| 5.3 | Anayasa Kademesi | Anayasa özel yüzey — TBK mührü ile |
| 5.4 | Madde Durum İşaretleri | Yürürlükte · mülga · AYM iptal · değişiklik |
| 5.5 | Atıf Ağı Modal | Hangi normların atıfta bulunduğunun ağ görünümü |
| 5.6 | Çapraz Referans Görüntüsü | Inline cross-reference popover |
| 5.7 | Arama-Filtreleme Paneli | Mevzuat arama UI |
| 5.8 | Grid Sistemi + Responsive | 12-col grid · breakpoints |
| 5.9 | Düstur Bileşen Galerisi | Tüm bileşen sergisi |
| 5.10 | Çoklu Norm Tipi Mock-up | 12 norm tipinin yüzey karşılıkları |
| 5.11 | Tebliğ Yüzeyi | Tebliğ özel anatomi |
| 5.12 | Mevzuat Arama Sonuç Yüzeyi | Arama sonuç listesi |
| 5.13 | Mobil Madde Görünümü | Responsive madde detay |
| 5.14 | Mevzuat Arşivi Yüzeyi | Tarihsel arşiv UI |
| 5.15 | Resmi Gazete Yüzeyi | RG sayı görünümü |
| 5.16 | Çapraz Koordinasyon Disiplini | Norm-norm referans disiplini |
| 5.17 | PDF + Word Export Şartnamesi | Belge çıktı formatı |

## Yüzey Anatomi Şeması

Tüm yüzeyler üç katmandan oluşur:

```
┌────────────────────────────────────────┐
│  MASTHEAD                              │  ← Logo · breadcrumb · nav
├────────────────────────────────────────┤
│  ▌▌▌▌▌▌  TIER BORDER (3px)            │  ← Kademe mührü (renk)
├────────────────────────────────────────┤
│  [ROZET] Kanun no · v1.2.3            │  ← Sub-header
│                                        │
│  Sayfa Başlığı                         │  ← Page title
│  (Fraunces 42pt · WONK 1)             │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Madde 1 ─ İçerik metni...       │ │  ← Body (Fraunces 10.5pt)
│  │                                  │ │
│  │ Madde 2 ─ İçerik metni...       │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

## Tier Border Disiplini

Her yüzey üst kısmında **3px yatay bant** ile kademesini ilan eder:

| Kademe | Border CSS | Renk |
|---|---|---|
| Anayasa | `border-top: 3px solid var(--tcm-anayasa-mark)` | `#E30A17` |
| CBK | `border-top: 3px solid var(--tcm-cbk-mark)` | `#5C1A1B` |
| Kanun | `border-top: 3px solid var(--tcm-kanun-mark)` | `#1A8B8C` |
| Yönetmelik | `border-top: 2px solid var(--tcm-yonetmelik-mark)` | `#43A1A2` |
| AYM | `border-left: 3px solid var(--tcm-aym-mark)` | `#002664` |
| Tebliğ | `border-left: 2px solid var(--tcm-teblig-mark)` | `#B45309` |

## Grid Sistemi

Standart 12-kolon grid, 4mm gutter:

| Breakpoint | Min-width | Margin | Gutter |
|---|---|---|---|
| Mobile | 0 | 4mm | 2mm |
| Tablet | 768px | 8mm | 4mm |
| Desktop | 1024px | 16mm | 6mm |
| Wide | 1440px | 24mm | 8mm |
| Print A4 | — | 22mm | 4mm |

## Examples

Örnek HTML kodları için: [`examples/`](../../examples/) klasörü.

---

> Tam metin: [`reference/dustur-source.html`](../../reference/dustur-source.html) (Sayfalar 55-89)
