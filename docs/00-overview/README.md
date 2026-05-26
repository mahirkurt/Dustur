# 00 · Genel Bakış

## İçerik

- **Önsöz** — sistemin niyet beyanı.
- **Belge Konvansiyonları** — kullanılan tipografik, kromatik ve referans kuralları.
- **Sürüm Mührü ve Kilit Beyanı** — versiyonlama ve değişmezlik teminatı.

## Önsöz · Özet

DÜSTUR, Türkiye Cumhuriyeti mevzuat sisteminin **devredilebilir** bir tasarım altyapısıdır. "Devredilebilir" üç anlama gelir:

1. **Kişiden kişiye** — Bir tasarımcının kararı, başka tasarımcı tarafından yeniden inşa edilmeden uygulanabilir olmalı.
2. **Ekipten ekibe** — Bir kurum içi ekip değişikliği sistemi sıfırdan kurmak zorunda kalmamalı.
3. **Platformdan platforma** — Web · iOS · Android · print · kiosk — sistem her hedefe taşınabilir olmalı.

Bu üç devredilebilirliğin operasyonel ifadesi **tasarım jetonları** mimarisidir (Bölüm IV).

## Belge Konvansiyonları

| Konvansiyon | Anlam |
|---|---|
| **Doktrini** | Sistemin sözleşmesel kararı. Değiştirilmesi için Bölüm VII'deki yönetişim protokolü gerekir. |
| **Mühür** | Bir kademenin görsel imzası (ör. TBK Anayasa'nın mührüdür). |
| **Kademe** | Mevzuat hiyerarşisindeki bir norm tipi (Anayasa, Kanun, CBK, Yönetmelik, Tebliğ, Genelge). |
| **Yüzey** | UI'da bir norm tipinin görüntülendiği sayfa/ekran (örn. madde detay yüzeyi). |
| **Kompozit palet** | Beş ana renk + nötr griden oluşan disiplinli renk havuzu. |
| **Üç evren** | Tipografi · Renk · Geometri evrenleri (Bölüm I). |

## Sürüm Mührü ve Kilit Beyanı

Bu repository sürümleri **Semantic Versioning 2.0.0** ile kilitlidir. Major sürüm değişikliği:

- Jeton silme veya yeniden adlandırma
- Primitive scale tipolojik değişimi (örn. 12-step → 10-step)
- Doktriner sözleşme değişikliği

bu üç durumla sınırlıdır ve Kurum Yönetim Kurulu bilgilendirmesi gerektirir.

---

> Tam belge için: [`reference/dustur-source.html`](../../reference/dustur-source.html) (Sayfalar 5-8)
