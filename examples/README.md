# Örnekler

Sistemin gerçek kullanımını gösteren HTML/SVG/XML örnekleri.

## Canlı Galeri

| Dosya | Açıklama |
|---|---|
| [`index.html`](./index.html) | **Tüm component galerisi** · sticky nav · tema switcher · 9 demo bölümü |
| [`madde-detay.html`](./madde-detay.html) | Madde Detay Sayfası (Bölüm V · 5.1) |
| [`badge-galeri.html`](./badge-galeri.html) | Rozet + tier border galerisi (Bölüm V · 5.9) |

## Akoma Ntoso

| Dosya | Açıklama |
|---|---|
| [`akn/tck-madde-220.xml`](./akn/tck-madde-220.xml) | Valid AKN 3.0 XML · TCK Madde 220 |
| [`akn/render.html`](./akn/render.html) | Aynı XML'in Düstur stillerinde HTML render'ı |

## Anatomi (annotated SVG)

| Dosya | Bileşen |
|---|---|
| [`anatomy/yuzey-anatomy.svg`](./anatomy/yuzey-anatomy.svg) | Madde detay yüzeyi anatomisi |
| [`anatomy/rozet-anatomy.svg`](./anatomy/rozet-anatomy.svg) | Rozet bileşeni anatomisi |

## Do / Don't

| Dosya | Açıklama |
|---|---|
| [`do-dont/index.html`](./do-dont/index.html) | 5 pattern karşı-örnekli yapın/yapmayın koleksiyonu |

## Yerel Önizleme

```bash
npm run preview                          # python http server (port 8080)
# Sonra:
# http://localhost:8080/examples/
```

## Yeni Örnek Eklemek

1. HTML/SVG/XML dosyasını uygun alt klasöre koy
2. CSS importları relative path ile (`../css/...`)
3. Google Fonts preconnect ekle
4. Bu README'ye satır ekle
5. `examples/index.html` ana galerisine link eklemeyi düşün
