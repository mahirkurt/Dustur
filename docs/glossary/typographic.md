# Sözlük · Tipografik

## opsz (Optical Size)
OpenType variable font ekseni. Font tasarımının boyuta-duyarlı olmasını sağlar. Küçük boyutta (9pt) daha açık apertures, büyük boyutta (144pt) daha sıkı counters kullanılır. Fraunces'ta 9-144 aralığı.

## WONK
Fraunces'a özgü eksen (0-1). Eccentric karakter formlarını (g, a, e) toggle eder. 1 değerinde tipografi karakter taşır; 0 değerinde disiplinli kalır. Sistemde display başlıklarda 1, body'de 0.

## SOFT
Fraunces ekseni (0-100). Serif keskinliğini yumuşatır. 0 klasik keskin serif; 100 yumuşak gusto. Sistemde italik vurgularda 25-50.

## Variable Font
Tek dosyada birden çok stil barındıran font formatı (OpenType Variable Font 1.8+). Ekseni (axis) ile interpolation yapar.

## Axis
Bir variable font'un boyutlandırılabilir parametresi. Ör. `wght` (weight), `opsz` (optical size), `wdth` (width), `slnt` (slant), `SOFT`, `WONK`.

## GSUB (Glyph Substitution)
OpenType feature. Bir karakteri başkasıyla değiştirir (ör. small caps, alternates, swash). Sistemde Fraunces'ın `ss01-ss10` stylistic set'leri.

## Font-variation-settings
CSS property: `font-variation-settings: "opsz" 14, "wght" 400, "SOFT" 0;`

## Optical Sizing
Display sizing ≠ display reading. Aynı font 9pt'de ile 144pt'de farklı çizimlerle render edilir.

## Hyphens
Türkçe hece-bazlı kelime kırma. `hyphens: auto;` + `lang="tr"` ile aktif.

## Justified Text
Sistemde body text justified. `text-align: justify; hyphens: auto;` Türkçe metinde "river" oluşumunu önlemek için optimum karakter genişliği 60-75ch.

## Tracking / Letter-spacing
Karakter aralığı. Sistemde 8 seviye: `tightest -0.045em` → `ultra 0.32em`. All-caps başlıklarda mutlaka pozitif tracking gerekir.

## Leading / Line-height
Satır yüksekliği. Sistemde 5 seviye: `tight 1.0` → `loose 1.7`. Body için 1.62.
