# 02 · Tipografi Sistemi

## Bölüm Haritası

| # | Sub-bölüm |
|---|---|
| 2.1 | Fraunces Deep-Dive |
| 2.2 | Albert Sans Deep-Dive |
| 2.3 | Recursive Mono Deep-Dive |
| 2.4 | Optical Sizing Doktrini |
| 2.5 | WONK / SOFT Axis Yönetimi |
| 2.6 | Type Scale · 12 UI Rolü Tam Tablo |
| 2.7 | TR Diakritik Audit + SIL OFL 1.1 Lisans |

## Üç Font Ailesi · Tek-Amaç Ayrılığı

| Aile | Stil | Rol | Lisans |
|---|---|---|---|
| **Fraunces** | Variable serif (opsz · wght · SOFT · WONK) | Mevzuat metni · başlıklar | SIL OFL 1.1 |
| **Albert Sans** | Variable sans (wght) | UI · navigasyon · rozet | SIL OFL 1.1 |
| **Recursive** | Variable mono (MONO · CASL · wght) | URI · kanun no · veri ifadeleri | SIL OFL 1.1 |

## 2.1 · Fraunces

Fraunces, **Phoebe Lickwar / Undercase Type** (2020) tarafından tasarlanmış variable serif. Sistemde dört ekseni de aktif kullanılır:

| Eksen | Aralık | Rol |
|---|---|---|
| **opsz** | 9-144 | Boyuta-duyarlı optical sizing |
| **wght** | 100-900 | Font ağırlığı |
| **SOFT** | 0-100 | Serif keskinliği (yumuşatma) |
| **WONK** | 0-1 | Eccentric formlar (karakter) |

### Sistem kullanım örnekleri:
- **Display (144pt)** — `opsz 144 · wght 700 · SOFT 25 · WONK 1`
- **Body (10.5pt)** — `opsz 14 · wght 400 · SOFT 0 · WONK 0`
- **Italik lead** — `opsz 18 · wght 500 · SOFT 25 · italic`

## 2.2 · Albert Sans

**Florian Karsten** (2021) tarafından tasarlanan variable sans. Sistemde sadece wght ekseni kullanılır (400-700). UI bileşenlerinde, navigasyonda, butonlarda ve rozetlerde **tek sans aile** olarak kullanılır.

## 2.3 · Recursive

**Arrow Type / Stephen Nixon** (2020) tarafından tasarlanan variable mono. Sistemde **MONO sabit 1** (klasik monospace) ve **CASL sabit 0** (linear) konfigürasyonu kullanılır:

- URI · ELI · kanun numarası
- Veri tabloları
- Kod örnekleri
- Eyebrow / üst etiketler (all-caps mono)

## 2.4 · Optical Sizing Doktrini

OpenType **opsz** ekseni, font tasarımının **boyuta-duyarlı** olmasını sağlar. Fraunces 9pt'de ile 144pt'de farklı çizimler kullanır — küçük boyutta daha açık apertures, büyük boyutta daha sıkı counters. Bu doktrin **görsel-akustik eşitliği** sağlar: 9pt body 144pt display ile aynı estetik karakterde okunur.

## 2.5 · WONK / SOFT Axis

| Axis | Konfigürasyon | Bağlam |
|---|---|---|
| **WONK 1** | Eccentric formlar (g/a karakterleri) | Display başlıklar, doktriner alıntılar |
| **WONK 0** | Disiplinli formlar | Body metin, tablo başlıkları |
| **SOFT 25-50** | Tipografik sıcaklık | Italik vurgular, lead paragraflar |
| **SOFT 0** | Klasik serif keskinliği | Body, başlıklar |

## 2.6 · Type Scale · 12 UI Rolü

Sistemde 12 ana UI rolü için type scale belirlenmiştir. Tam tablo için bkz. [`tokens/semantic/typography.json`](../../tokens/semantic/typography.json) veya `reference/dustur-source.html` sayfa 28.

## 2.7 · TR Diakritik

Üç fontun da TR diakritikleri (Ç, Ğ, İ, Ö, Ş, Ü ve küçük halleri) tam destekli olduğu doğrulanmıştır. SIL OFL 1.1 lisansı altında ticari kullanım serbesttir; modifikasyon ve redistribution OFL şartlarına tabidir.

---

> Tam metin: [`reference/dustur-source.html`](../../reference/dustur-source.html) (Sayfalar 19-30)
