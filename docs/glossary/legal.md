# Sözlük · Mevzuat / Hukuk

## Norm Tipleri

### Anayasa
Devletin temel sözleşmesi. 1982 Anayasası. Sistemde TBK mührü.

### AYM (Anayasa Mahkemesi)
Anayasaya aykırılık iddialarını karara bağlayan mahkeme. Sistemde Lacivert mührü. AYM iptal kararları kırmızı bordo işaret (`aym-iptal-hap`).

### CBK (Cumhurbaşkanlığı Kararnamesi)
2018 sistem değişikliği sonrası yürütme erki. Sistemde Bordo mührü.

### KHK (Kanun Hükmünde Kararname)
1971-2018 dönemi yürütme aracı. 2018 sonrası kaldırıldı, mevcut KHK'ler mevzuatta hâlâ etkili.

### Kanun
TBMM tarafından çıkarılan en üst yasama tasarrufu. Sistemde Turkuvaz mührü.

### Yönetmelik
Bir kanunun uygulanma şeklini düzenleyen ikincil mevzuat. Bakanlık, kurul, vs. Sistemde Turkuvaz lighter (step 7).

### Tebliğ
Bakanlık tarafından çıkarılan ayrıntılı uygulama belgesi. Sistemde Amber mührü.

### Genelge
İdari uygulama açıklaması. Bağlayıcılığı tartışmalı. Sistemde nötr gri.

## Akoma Ntoso
OASIS standardı XML şema. Parlamento, mahkeme ve resmi gazete dijital arşivlerin **lingua franca**'sı. Dünya genelinde 30+ ülke tarafından adopt edilmiştir.

URL: https://www.oasis-open.org/committees/legaldocml/

## ELI (European Legislation Identifier)
EU kaynaklı evrensel norm URI standardı. TR adaptasyonunda:
```
/akn/tr/act/2004/5237/2026-01-15/main/article_220
```

## FRBR (Functional Requirements for Bibliographic Records)
IFLA standardı. Bir belgenin dört seviyesi:
- **Work** — Soyut esere
- **Expression** — Belirli bir versiyon
- **Manifestation** — Fiziksel/dijital format
- **Item** — Tek bir kopya

Akoma Ntoso FRBR seviyelendirmesini izler.

## Mülga
Yürürlükten kaldırılmış. UI'da strikethrough + opacity 0.5.

## Konsolide Versiyon
Bir kanunun belirli bir tarihteki değiştirilmiş haliyle birleştirilmiş hali. URI'da `/2026-01-15/` segment.

## İbtidai
İlk metin · değişiklikler öncesi. URI'da `/!main` segment.

## Atıf
Bir normun başka norma referansı. Sistemde `.akn-ref` class · cross-reference link rengi.

## Çapraz Referans
İki yönlü atıf — A → B ve B → A. Atıf ağı modal'da (5.5) görselleştirilir.

## Resmi Gazete (RG)
Devletin resmi yayın organı. Tüm kanun ve yönetmelikler RG'de yayımlanarak yürürlüğe girer. Sayfa 5.15'te özel yüzey.
