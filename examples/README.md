# Örnekler

Sistemin gerçek kullanımını gösteren HTML örnekleri.

| Dosya | Yüzey | Doktriner Referans |
|---|---|---|
| [`madde-detay.html`](./madde-detay.html) | Madde Detay Sayfası | Bölüm V · 5.1 |
| [`badge-galeri.html`](./badge-galeri.html) | Rozet + tier border galerisi | Bölüm V · 5.9 |

## Yerel Önizleme

```bash
# Basit HTTP server
python3 -m http.server 8080
# Tarayıcıda
open http://localhost:8080/examples/madde-detay.html
```

## Yeni Örnek Eklemek

1. HTML dosyasını `examples/` altına koy
2. CSS importları relative path ile (`../css/...`)
3. Google Fonts preconnect ekle
4. Bu README'ye bir satır ekle
