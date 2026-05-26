# Scripts

Tek-amaçlı Node.js script'leri. Tüm script'ler ESM (`.mjs`), zero-dependency (sadece Node stdlib).

| Script | Komut | Açıklama |
|---|---|---|
| [`lint-tokens.mjs`](./lint-tokens.mjs) | `npm run lint` | JSON parse · DTCG zorunlu alanlar · referans çözümleme |
| [`check-contrast.mjs`](./check-contrast.mjs) | `npm run check:contrast` | WCAG 2.1 + APCA Lc kontrast matrisi · `--strict` ile CI fail |
| [`check-diacritics.mjs`](./check-diacritics.mjs) | `npm run check:diacritics` | TR diakritik karakterler için font belgeleme audit |
| [`token-usage-map.mjs`](./token-usage-map.mjs) | `npm run report:usage` | Her token'ın CSS/HTML/JSON'da kullanımını haritalar; kullanılmayan token'ları işaretler |
| [`build-css-from-tokens.mjs`](./build-css-from-tokens.mjs) | `npm run build:fallback` | Style Dictionary gerektirmeyen fallback build; `dist/web/tcm-tokens.css` üretir |

## Tüm Audit'leri Çalıştır

```bash
npm run check:all
```

CI'da `.github/workflows/ci.yml` her PR'da bunu çalıştırır + raporları artifact olarak yükler.

## Yeni Script Ekleme

1. `scripts/<isim>.mjs` oluştur (ESM)
2. Sadece Node stdlib kullan (`node:fs`, `node:path`, vb.)
3. CLI args için `process.argv` yeterli (yargs vb. kullanma)
4. `package.json` → `scripts` bölümüne komut ekle
5. Bu README'ye satır ekle
6. CI workflow'a (`.github/workflows/ci.yml`) ekle

## Çıktı Standardı

Tüm script'ler:
- Başarı durumunda exit code 0
- Hata durumunda exit code 1 (CI fail)
- Stdout'a okunabilir Türkçe tablo
- `dist/reports/` altına makine-okunabilir JSON
