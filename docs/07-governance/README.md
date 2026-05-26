# 07 · Yönetişim ve Yol Haritası

## Bölüm Haritası

| # | Sub-bölüm |
|---|---|
| 7.1 | Axis Lock Matrix |
| 7.2 | Değişiklik Yönetimi Protokolü |
| 7.3 | Handoff + Devredilebilirlik |

## 7.1 · Axis Lock Matrix

Sistem, **doktriner sözleşme**'sinin değiştirilemez ekseni (kilitli) ile değiştirilebilir ekseni (esnek) arasındaki sınırı açıkça belgeler:

| Eksen | Kilit | Gerekçe |
|---|---|---|
| **TBK = `#E30A17`** | 🔒 LOCKED | TS 715/2010 standardı · değiştirilemez |
| **Anayasa = TBK mühür** | 🔒 LOCKED | Doktriner sözleşme |
| **Tier kromatik ataması** | 🔒 LOCKED | Bölüm III'te belgelenen kademe-renk eşleşmesi |
| **Üç font ailesi seçimi** | 🔒 LOCKED | Fraunces · Albert Sans · Recursive |
| **Radius = 0** | 🔒 LOCKED | Kurumsal sade keskin köşe doktrini |
| Kontrast değerleri | 🔓 FLEX | WCAG iyileştirmeleri için PATCH bump |
| Naming convention varyantları | 🔓 FLEX | Yeni primitive aile ekleme MINOR bump |
| Bileşen iç ölçüleri | 🔓 FLEX | UX iyileştirmeleri için |
| Cross-platform export hedefleri | 🔓 FLEX | Yeni platform eklenebilir |

## 7.2 · Değişiklik Yönetimi Protokolü

### 4-Aşamalı Süreç

```
┌─────────────────────────────────────────────────────────────┐
│  AŞAMA I · PROPOSAL                                         │
│  GitHub'da jeton RFC PR'ı açılır. Gerekli içerik:           │
│  • Değişiklik gerekçesi                                     │
│  • Etkilenen jetonlar                                       │
│  • Etkilenen bileşenler                                     │
│  • Contrast hesaplaması (renk ise)                          │
│  • Alternatif yaklaşımlar                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  AŞAMA II · İNCELEME                                        │
│  RACI haritası uyarınca incelenir:                          │
│  • A11y etkisi (WCAG/APCA)                                  │
│  • Brand etkisi                                             │
│  • Hukuki/anayasal etki (TBK gibi semboller için)           │
│  • Geriye-uyum etkisi                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  AŞAMA III · APPROVAL                                       │
│  Accountable kişi final onay verir.                         │
│  MAJOR bump → Kurum Yönetim Kurulu bilgilendirmesi          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  AŞAMA IV · RELEASE + COMMUNICATION                         │
│  • Pipeline tetiklenir (5 platform dışa aktarım)            │
│  • CHANGELOG.md güncellenir                                 │
│  • Etkilenen ekipler bilgilendirilir                        │
│  • MAJOR → 30-günlük deprecation window                     │
└─────────────────────────────────────────────────────────────┘
```

## 7.3 · Handoff · Devredilebilirlik

### Kişiden Kişiye

- Tüm doktriner kararlar yazılı belgede (`reference/dustur-source.html`)
- Tüm jetonlar W3C DTCG standardında (`tokens/`)
- Tüm bileşenler dökümante edilmiş (`css/components/`)
- Hiçbir karar tribal knowledge olarak tutulmaz

### Ekipten Ekibe

- GitHub repository tek-noktada barındırma
- Issue + PR akışı dokümante (`CONTRIBUTING.md`)
- RACI haritası sorumlulukları belirler
- Onboarding belgesi: `docs/00-overview/`

### Platformdan Platforma

- Style Dictionary pipeline 5 platforma otomatik dışa aktarım
- Web · iOS · Android · DTCG · TypeScript
- Yeni platform eklemek için sadece `style-dictionary.config.json` güncellenir

---

> Tam metin: [`reference/dustur-source.html`](../../reference/dustur-source.html) (Sayfalar 77-82)
