# Renk Körlüğü Stratejisi · Non-Color Cue Zorunluluğu

## Audit Sonucu

`scripts/check-colorblind.mjs` Brettel 1997 algoritması + CIEDE2000 algısal renk farkı ile tüm tier kombinasyonlarını test eder. Bulgular:

| CVD tipi | Çakışan tier çifti | ΔE2000 |
|---|---|---|
| Protanopia | Anayasa ↔ Tebliğ | 5.5 (eşik 10) |
| Protanopia | Kanun ↔ Yönetmelik | 7.5 |
| Deuteranopia | Anayasa ↔ Tebliğ | **3.6** (kritik) |
| Deuteranopia | Kanun ↔ Yönetmelik | 8.2 |
| Tritanopia | Kanun ↔ Yönetmelik | 7.1 |

**Anayasa (TBK kırmızı)** ve **Tebliğ (Amber)** turuncu/kırmızı dichromat sahibi için ayırt edilemez. Bu doktriner LOCKED renklerin (TS 715/2010, devlet teamülü) değiştirilemediği için, sistem **non-color cue'larını ZORUNLU** kılar.

## Zorunlu Non-Color Cue'lar

Türkiye'de ~%4 erkek + %0.5 kadın renk körüdür. Bu nüfus için **kromatik tek başına yeterli değil**.

### Tier Border — yön + kalınlık ikilisi

| Tier | Border yön | Kalınlık | Doktrin |
|---|---|---|---|
| Anayasa | top | **3px** | Asıl norm + yüksek hiyerarşi |
| Kanun | top | **3px** | Asıl norm |
| CBK | top | **3px** | Asıl norm |
| Yönetmelik | top | **2px** | Asıl normun ikincil tipi (ince) |
| AYM | left | **3px** | Aksesuar/destekleyici |
| Tebliğ | left | **2px** | Aksesuar/destekleyici (ince) |
| Genelge | left | **2px** | Aksesuar/destekleyici (ince) |

Bu şema **iki bilgi kanalı** sağlar:
1. **Border yön** (top vs left) → asıl norm mu, aksesuar mı?
2. **Border kalınlık** (3px vs 2px) → birincil mi, ikincil mi?

### Rozet Metin (zorunlu)

Hiçbir tier sadece renkle iletilmez. Her rozet kademe adını **uppercase metin** olarak taşır:

```html
<span class="yuzey-badge anayasa">ANAYASA</span>
<span class="yuzey-badge teblig">TEBLİĞ</span>
```

Bu, en kötü senaryoda (monokromatik ekran, full CVD) bile bilgiyi korur.

### URI Mono Font · Kademe Adı

Akoma Ntoso ELI URI'larında tier tipi mevzuat tipini açıkça belirtir:

```
/akn/tr/act/2004/5237        ← act = kanun
/akn/tr/cbk/2018/1           ← cbk
/akn/tr/teblig/2024/42       ← teblig
/akn/tr/judgment/2022/E2021  ← AYM
```

Renk değil **metin URI** kademe gerçek kaynağıdır.

## Sistem Kuralları (zorunlu)

1. ❌ **Asla** renkle ayrıştırılmış UI yapma · daima eşlik eden ikon, metin veya yapısal cue kullan
2. ❌ **Asla** "kırmızı badge'i tıkla" gibi instructionlar yazma · daima "**Anayasa** badge'ini tıkla"
3. ❌ **Asla** sadece renk farkıyla durum gösterme (mülga için strikethrough da gereklidir)
4. ✓ Her tier marker → metin etiket + border yön/kalınlık + kademe URI
5. ✓ Madde durum (mülga, AYM iptal) → renk + ikon/etiket + strikethrough

## Test Sürdürülebilirliği

```bash
npm run check:colorblind          # warning
npm run check:colorblind:strict   # CI fail on regression
```

Yeni bir tier eklenirse veya bir tier rengi değişirse, `dist/reports/colorblind.json` raporu otomatik güncellenir. CI yeni çakışmaları yakalar.

## Referans Bilim

- Brettel, H., Viénot, F., & Mollon, J. D. (1997). "Computerized simulation of color appearance for dichromats". *Journal of the Optical Society of America A*.
- CIEDE2000 · Luo, M. R., et al. (2001). "The development of the CIE 2000 colour-difference formula".
- Eşik **ΔE2000 ≥ 10** · "açıkça farklı" (5: just-noticeable, 1-2: barely perceptible).
