# Başlangıç Rehberi

İlk kez Düstur sistemini kullananlar için 5 dakikalık kurulum.

## 1. Yükleme

### Web (npm)

```bash
npm install @dustur/tasarim-sistemi
```

```html
<link rel="stylesheet" href="node_modules/@dustur/tasarim-sistemi/css/dustur.css">
```

### Web (CDN, npm gerektirmez)

```html
<link rel="stylesheet" href="https://unpkg.com/@dustur/tasarim-sistemi/css/dustur.css">
```

### Sadece tokens (CSS olmadan)

```bash
npm install @dustur/tasarim-sistemi
```

```js
import tokens from "@dustur/tasarim-sistemi/tokens";
```

```html
<!-- Veya doğrudan CSS Custom Properties -->
<link rel="stylesheet" href="node_modules/@dustur/tasarim-sistemi/dist/web/tcm-tokens.css">
```

### iOS / Android / TypeScript

```bash
# Style Dictionary çıktıları (releases'dan):
# - dist/ios/TCMTokens.swift
# - dist/android/colors.xml · dimens.xml
# - dist/dtcg/tcm-tokens.json
# - dist/ts/tokens.ts
```

## 2. İlk Bileşen

```html
<!DOCTYPE html>
<html lang="tr" data-tema="ekran">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://unpkg.com/@dustur/tasarim-sistemi/css/dustur.css">
</head>
<body>
  <!-- Kademe rozetleri -->
  <span class="yuzey-badge anayasa">ANAYASA</span>
  <span class="yuzey-badge kanun">KANUN</span>
  <span class="yuzey-badge cbk">CBK</span>

  <!-- Madde detay yüzeyi -->
  <article style="border-top: 3px solid var(--tcm-kanun-mark); padding: var(--tcm-space-5);">
    <h1 class="t-page-title">Türk Ceza Kanunu</h1>
    <p>Madde içeriği...</p>
  </article>
</body>
</html>
```

## 3. Tema Değiştirme

```html
<!-- Otomatik (prefers-contrast, prefers-reduced-motion, print media query) -->
<html>

<!-- Manuel: ekran / baskı / yüksek kontrast -->
<html data-tema="ekran">
<html data-tema="baski">
<html data-tema="yuksek-kontrast">
```

## 4. Akoma Ntoso XML Kullanımı

Mevzuat metnini doğrudan XML olarak yazıp Düstur stilleriyle render edebilirsiniz:

```html
<link rel="stylesheet" href="https://unpkg.com/@dustur/tasarim-sistemi/css/akn/element-styles.css">

<article class="akn-act">
  <section class="akn-article" id="article_220">
    <span class="akn-num">Madde 220</span>
    <span class="akn-heading">Suç işlemek amacıyla örgüt kurma</span>
    <div class="akn-paragraph">
      <span class="akn-num">(1)</span>
      Kanunun suç saydığı fiilleri işlemek...
      <a class="akn-ref" href="#article_221">Bkz. Madde 221</a>
    </div>
  </section>
</article>
```

## 5. Yerel Geliştirme

```bash
git clone https://github.com/mahirkurt/Dustur.git
cd Dustur
nvm use         # .nvmrc → Node 20
npm install
npm run check:all    # Tüm audit'leri çalıştır
npm run build        # Style Dictionary build
npm run preview      # http://localhost:8080
```

## 6. Live Galeri'yi Aç

```bash
open https://mahirkurt.github.io/Dustur/
```

Veya yerel:
```bash
npm run preview
# Tarayıcı: http://localhost:8080/examples/
```

## 7. Sonraki Adımlar

- **Doktriner çerçeve:** [`docs/01-manifesto/`](./01-manifesto/)
- **Tüm jetonlar:** [`tokens/README.md`](../tokens/README.md)
- **UI yüzeyleri (17 adet):** [`docs/05-ui-surface/`](./05-ui-surface/)
- **Akoma Ntoso entegrasyonu:** [`docs/06-akoma-ntoso/`](./06-akoma-ntoso/)
- **Renk körlüğü stratejisi:** [`docs/03-color/colorblind-strategy.md`](./03-color/colorblind-strategy.md)
- **Katkıda bulunmak:** [`CONTRIBUTING.md`](../CONTRIBUTING.md)

## Yardım

- **Issue açma:** [GitHub Issues](https://github.com/mahirkurt/Dustur/issues) (Jeton RFC, hata, doc)
- **Tartışma:** [GitHub Discussions](https://github.com/mahirkurt/Dustur/discussions)
- **Güvenlik:** [`SECURITY.md`](../SECURITY.md)
