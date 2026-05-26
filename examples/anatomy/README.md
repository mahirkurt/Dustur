# Anatomi Diyagramları

Bileşenlerin yapısal sergisi · annotated SVG'ler.

| Dosya | Bileşen | Doktriner Referans |
|---|---|---|
| [`yuzey-anatomy.svg`](./yuzey-anatomy.svg) | Madde detay yüzeyi | Bölüm V · 5.1 |
| [`rozet-anatomy.svg`](./rozet-anatomy.svg) | Rozet bileşeni | Bölüm V · 5.9 |

## Anatomi Yazımı Kuralı

1. Sol blok: gerçek bileşen render'ı (1:1 oranlı)
2. Sağ blok: rakamlı annotation
3. Numbered callout'lar: ①②③④⑤⑥ — soldan-üstten saat yönünde
4. Her annotation: **rol** + **jeton path** + **çözüm değeri**

## Yeni Anatomi Eklemek

```
examples/anatomy/<bilesen>-anatomy.svg
```

Şablon: `yuzey-anatomy.svg` veya `rozet-anatomy.svg`'yi kopyala, içeriği değiştir, bu README'ye satır ekle.
