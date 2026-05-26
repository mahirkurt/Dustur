# Sözlük · Kromatik + Erişilebilirlik

## LCH (Lightness · Chroma · Hue)
CIE 1976 renk uzayı. İnsan gözünün doğal algısına uygun. Tek değer artışı (örn. L+10) sRGB'den farklı olarak **algısal-eşit** değişim üretir. Sistemde 12-step scales LCH'de türetilir.

## OKLCH
LCH'in iyileştirilmiş varyantı (Björn Ottosson, 2020). CSS `oklch()` desteği modern browser'larda mevcut. Daha doğru perceptual uniformity.

## Radix Renkler
Modulz/WorkOS tarafından 2022'de yayımlanan tasarım jeton metodolojisi. Her renk için 12-step scale, her step belirli bir UI rolüne karşılık gelir. Sistemin baz mimarisi.

## WCAG (Web Content Accessibility Guidelines)
W3C standardı. 2.1 AA seviyesi sistem zorunlusudur:
- Normal text contrast: ≥4.5:1
- Large text (18pt+ veya 14pt bold+): ≥3:1
- UI elements: ≥3:1

WCAG AAA hedef:
- Normal text: ≥7:1
- Large text: ≥4.5:1

## APCA (Accessible Perceptual Contrast Algorithm)
WCAG 3.0 hazırlığı kontrast algoritması (Andrew Somers, 2022). WCAG 2.x'in fiziksel kontrast yerine algısal kontrast hesaplar.

Skoring:
- `Lc 90+` — Body text optimum
- `Lc 75+` — Body text minimum
- `Lc 60+` — Large text
- `Lc 45+` — UI elements

## Solid Base (Step 9)
Bir renk scale'inin en yoğun, tanımlayıcı adımı. Buton fill, rozet background, brand identity için kullanılır.

## Subtle Background (Step 2)
Bir tema bölgesinin çok-açık arka planı. Üzerine yine aynı aileden text yerleşebilir.

## Hover State
UI element üzerine gelme. Sistemde +1 step kullanılır (örn. `turkuvaz-9` solid → `turkuvaz-10` hover).

## Disabled State
UI element devre dışı. Sistemde opacity 0.4-0.6 + cursor not-allowed.

## Selection Color
Text seçim arka planı. Sistemde Turkuvaz step 9.

## sRGB vs Display-P3
Renk gamutları. Sistemde tüm jetonlar sRGB-safe; Display-P3 destekli platformlarda otomatik wide-gamut render.
