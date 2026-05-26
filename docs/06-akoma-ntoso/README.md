# 06 · Akoma Ntoso XML

## Bölüm Haritası

| # | Sub-bölüm |
|---|---|
| 6.1 | Akoma Ntoso Standardı |
| 6.2 | Element Omurgası + TR Adaptasyon |
| 6.3 | Tipografik CSS Mapping |
| 6.4 | ELI URI · Element Spesifikasyonu |

## 6.1 · Akoma Ntoso · OASIS LegalDocML

Akoma Ntoso, **OASIS LegalDocML TC** tarafından standartlaştırılmış XML şemasıdır. Dünya genelinde parlamento, mahkeme ve resmi gazete dijital arşivlerinin **lingua franca**'sıdır. Sistemde TR mevzuatın **kalıcı dijital biçimi** olarak adapte edilir.

```xml
<akomaNtoso xmlns="http://docs.oasis-open.org/legaldocml/ns/akn/3.0">
  <act>
    <meta>
      <identification source="#turkey">
        <FRBRWork>
          <FRBRthis value="/akn/tr/act/2004/5237"/>
          <FRBRuri value="/akn/tr/act/2004/5237"/>
        </FRBRWork>
      </identification>
    </meta>
    <body>
      <article eId="art_1">
        <num>Madde 1</num>
        <heading>Amaç</heading>
        <content>
          <p>...</p>
        </content>
      </article>
    </body>
  </act>
</akomaNtoso>
```

## 6.2 · TR Adaptasyon · Element Omurgası

| Akoma Ntoso Element | TR Karşılık | Sistem CSS Class |
|---|---|---|
| `<act>` | Kanun | `.akn-act` |
| `<bill>` | Tasarı | `.akn-bill` |
| `<article>` | Madde | `.akn-article` |
| `<paragraph>` | Fıkra | `.akn-paragraph` |
| `<subparagraph>` | Bent | `.akn-subparagraph` |
| `<heading>` | Madde başlığı | `.akn-heading` |
| `<num>` | Numara | `.akn-num` |
| `<ref>` | Çapraz referans | `.akn-ref` |
| `<quotedStructure>` | Alıntı (mülga, değişiklik) | `.akn-quoted` |

## 6.3 · Tipografik CSS Mapping

Akoma Ntoso XML doğrudan render edildiğinde sistem semantic jetonları otomatik uygulanır:

```css
.akn-act > .akn-heading {
  font-family: var(--tcm-page-title-family);
  font-variation-settings:
    "opsz" var(--tcm-page-title-opsz),
    "wght" var(--tcm-page-title-wght);
  border-top: 3px solid var(--tcm-kanun-mark);
}

.akn-article > .akn-num {
  font-family: var(--tcm-uri-family);
  font-weight: var(--tcm-uri-wght);
  color: var(--tcm-color-turkuvaz-10);
}

.akn-ref {
  color: var(--tcm-link-default);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.akn-quoted[type="repealed"] {
  text-decoration: line-through;
  color: var(--tcm-text-muted);
  opacity: 0.7;
}
```

## 6.4 · ELI URI

**European Legislation Identifier (ELI)** standardı, normların kalıcı evrensel URI'larını tanımlar. Sistem TR mevzuat için ELI'yi şu pattern ile uygular:

```
/akn/tr/act/{yıl}/{kanun-no}/{tarih}/main
/akn/tr/act/2004/5237/2026-01-15/main      ← TCK, 15 Ocak 2026 versiyonu
/akn/tr/act/2004/5237/!main/article_220    ← Madde 220
```

URI segmentleri:
- `tr` — Ülke kodu (ISO 3166-1)
- `act` — Norm tipi
- `2004` — Kabul yılı
- `5237` — Kanun numarası
- `2026-01-15` — Konsolide tarih
- `article_220` — Element ID

## Uygulama Kaynakları

| Dosya | Açıklama |
|---|---|
| [`tokens/akoma-ntoso/element-map.json`](../../tokens/akoma-ntoso/element-map.json) | XML element → CSS class → semantic jeton eşlemesi |
| [`tokens/akoma-ntoso/eli-uri.schema.json`](../../tokens/akoma-ntoso/eli-uri.schema.json) | TR ELI URI JSON Schema |
| [`css/akn/element-styles.css`](../../css/akn/element-styles.css) | Akoma Ntoso element CSS uygulaması |
| [`examples/akn/tck-madde-220.xml`](../../examples/akn/tck-madde-220.xml) | TCK Madde 220 örneği · valid AKN 3.0 |
| [`examples/akn/render.html`](../../examples/akn/render.html) | Aynı maddenin Düstur stillerinde HTML render'ı |

## Validasyon

```bash
# Lokal validasyon (xmllint)
xmllint --noout --schema https://docs.oasis-open.org/legaldocml/ns/akn/3.0 examples/akn/tck-madde-220.xml

# ELI URI schema validation
ajv validate -s tokens/akoma-ntoso/eli-uri.schema.json -d <your-uri.json>
```

---

> Tam metin: [`reference/dustur-source.html`](../../reference/dustur-source.html) (Sayfalar 69-76)
