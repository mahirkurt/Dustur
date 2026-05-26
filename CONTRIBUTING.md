# Katkıda Bulunmak · DÜSTUR

## Genel İlke

Bu sistem, **devredilebilir** olmak için tasarlanmıştır. Her değişiklik, sistemin sözleşmesinin bir parçasıdır. Bu sebeple katkı süreci disiplinli bir yönetişim protokolüne tabidir.

## Değişiklik Tipleri

### 🟢 PATCH (Düşük risk)
- Jeton değer düzeltmesi (kontrast iyileştirme)
- Açıklama/dokümantasyon güncelleme
- CSS bug fix
- Yazım hatası

→ Basit PR, 1 reviewer onayı.

### 🟡 MINOR (Orta risk)
- Yeni primitive jeton ekleme
- Yeni semantic jeton ekleme
- Yeni bileşen ekleme
- Yeni platform export ekleme

→ Jeton RFC PR'ı, 2 reviewer onayı, A11y review.

### 🔴 MAJOR (Yüksek risk)
- Jeton silme
- Jeton yeniden adlandırma
- Primitive scale tipolojik değişimi
- Doktriner sözleşme değişikliği

→ Jeton RFC + 30-günlük deprecation window + Kurum Yönetim Kurulu bilgilendirmesi.

## Jeton RFC PR Şablonu

MINOR ve MAJOR değişiklikler için PR açarken aşağıdaki bilgiler zorunludur:

```markdown
## Değişiklik Tipi
[ ] PATCH  [ ] MINOR  [ ] MAJOR

## Etkilenen Jetonlar
- `--tcm-...`
- `--tcm-...`

## Gerekçe
Neden bu değişiklik gerekli?

## Doktriner Bağlam
Hangi bölüm doktrinine bağlı?

## Etkilenen Bileşenler
- `css/components/...`
- `dist/...`

## Erişilebilirlik Etkisi
- WCAG kontrast değerleri (renk ise)
- APCA Lc değerleri

## Geriye-Uyum
Breaking change var mı? Hangi versiyonlardan beri etkili?

## Alternatif Yaklaşımlar
Düşünülen ve reddedilen alternatifler.
```

## 4-Aşamalı İnceleme

### Aşama I · Proposal
PR aç, RFC şablonunu doldur.

### Aşama II · İnceleme
RACI uyarınca incelenir:

| Konu | Görüş Alınan |
|---|---|
| Renk değişikliği | A11y Lead + Brand Lead |
| TBK/Anayasa mührü | + Hukuk Danışmanı |
| Tipografi değişikliği | A11y Lead + Lead Designer |
| Yeni norm tipi | Hukuk Danışmanı |
| API/naming | Lead Developer |

### Aşama III · Approval
- PATCH → 1 maintainer
- MINOR → Tasarım Lideri
- MAJOR → Sistem Sahibi + Kurum Yönetim Kurulu bilgi

### Aşama IV · Release
- Pipeline tetiklenir
- 5 platforma export yayılır
- CHANGELOG.md güncellenir
- MAJOR → 30-günlük deprecation window
- Etkilenen ekiplere duyuru

## Yerel Geliştirme

```bash
git clone https://github.com/mahirkurt/dustur.git
cd dustur
npm install
npm run build
```

### JSON Lint
```bash
npm run lint:tokens
```

### CSS Lint
```bash
npx stylelint "css/**/*.css"
```

### PDF Önizleme
```bash
npx pagedjs-cli reference/dustur-source.html -o /tmp/dustur-preview.pdf
```

## Branch Konvansiyonu

| Prefix | Anlam | Örnek |
|---|---|---|
| `feat/` | Yeni özellik / jeton ekleme | `feat/add-genelge-tier` |
| `fix/` | Bug fix · değer düzeltmesi | `fix/turkuvaz-9-contrast` |
| `docs/` | Dokümantasyon | `docs/update-glossary` |
| `refactor/` | Kod refactor (no behavior change) | `refactor/css-modular-import` |
| `chore/` | Build · CI · deps | `chore/update-style-dictionary` |

## Commit Konvansiyonu

[Conventional Commits 1.0.0](https://www.conventionalcommits.org/) izlenir:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Örnek:
```
feat(tokens): genelge tier semantic jetonları ekle

İdari genelge kademesi için nötr-gri tabanlı semantic jetonlar
eklendi. RACI uyarınca Hukuk Danışmanı ile incelendi.

Refs: #42
```

---

> "Jeton mimarisi sistemin anayasal mührüdür. Bir primitive'in değiştirilmesi, sistemin sözleşmesinin değiştirilmesidir." — Bölüm IV
