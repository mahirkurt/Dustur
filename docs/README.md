# DÜSTUR · Doktrin Belgeleri

Sistemin tam doktriner belgesi `reference/dustur-source.html` içinde Paged.js A4 PDF formatındadır. Bu klasör, o belgenin **bölüm haritasını** ve **özet doktrinasyonunu** Markdown olarak sunar.

## Bölüm Haritası

| # | Bölüm | İçerik |
|---|---|---|
| **00** | [Genel Bakış](./00-overview/) | Önsöz · Belge Konvansiyonları · Sürüm Mührü ve Kilit Beyanı |
| **01** | [Manifesto](./01-manifesto/) | Üç Evren · Kompozit Palet · Modern Geometri · TR Mevzuat Reformu · Epistemoloji |
| **02** | [Tipografi](./02-typography/) | Fraunces · Albert Sans · Recursive · Optical Sizing · WONK/SOFT · Type Scale · TR Diakritik |
| **03** | [Renk](./03-color/) | TBK · Turkuvaz · Bordo · Lacivert · Amber · 12-step LCH · WCAG/APCA |
| **04** | [Jeton Mimarisi](./04-tokens/) | W3C DTCG · Naming · Primitive · Semantic · Cross-platform · Governance |
| **05** | [UI Yüzey Anatomy](./05-ui-surface/) | 17 yüzey: Madde · Kanun · Anayasa · Atıf · Arama · Resmi Gazete · ... |
| **06** | [Akoma Ntoso XML](./06-akoma-ntoso/) | Element omurgası · TR adaptasyon · CSS mapping · ELI URI |
| **07** | [Yönetişim](./07-governance/) | Axis Lock Matrix · değişiklik yönetimi · handoff |
| **A** | [Sözlük](./glossary/) | Tipografik · Kromatik · Hukuk |

## Doktriner Süreklilik

Bölümler birbirini şu zincirde takip eder:

```
Manifesto (I)
   │   doktriner kararlar
   ▼
Tipografi (II) + Renk (III) + Geometri
   │   doktriner kararların kromatik/tipografik karşılığı
   ▼
Jeton Mimarisi (IV)
   │   makine-okunabilir dönüşüm
   ▼
UI Yüzey Anatomy (V) + Akoma Ntoso (VI)
   │   doktrinasyonun yüzeylere ve XML'e uygulanması
   ▼
Yönetişim (VII)
       sistemin sürdürülebilir devredilebilirliği
```

## Belgeyi PDF Olarak Üretme

```bash
# Paged.js CLI ile
pagedjs-cli reference/dustur-source.html -o dustur.pdf

# Veya tarayıcıda aç ve "Yazdır → PDF olarak kaydet"
open reference/dustur-source.html
```

A4, ~100 sayfa, 22mm margin, Fraunces + Albert Sans + Recursive fontlar.
