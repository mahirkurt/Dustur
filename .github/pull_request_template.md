<!--
  Düstur Pull Request

  Lütfen aşağıdaki şablonu doldurun. Jeton değişiklikleri için
  öncelikle `.github/ISSUE_TEMPLATE/jeton-rfc.yml` ile RFC açın.
-->

## Tip

- [ ] PATCH · değer/dokümantasyon düzeltmesi
- [ ] MINOR · yeni jeton / bileşen / platform
- [ ] MAJOR · breaking change · doktriner sözleşme değişikliği
- [ ] DOC · sadece dokümantasyon
- [ ] CI · sadece build/test

## Özet

<!-- 1-3 cümle ile değişikliği açıklayın. -->

## Etkilenen Dosyalar

<!-- Önemli dosyaları sayın. `tokens/`, `css/`, `docs/`, `scripts/`, `.github/` gibi -->

## Doktriner Bağlam

<!-- Hangi bölüm (I-VII) ile ilgili? Hangi sub-bölüm? -->

## Test Planı

- [ ] `node scripts/lint-tokens.mjs` ✓
- [ ] `node scripts/check-contrast.mjs --strict` ✓
- [ ] `node scripts/check-diacritics.mjs` ✓
- [ ] `node scripts/build-css-from-tokens.mjs` ✓
- [ ] Yeni veya değişen bileşenler için örnek HTML (examples/) güncellendi
- [ ] Doktriner referans gerektiriyorsa docs/ güncellendi
- [ ] CHANGELOG.md güncellendi

## Erişilebilirlik

<!-- Renk değişikliği varsa: WCAG + APCA kontrast değerleri -->
<!-- Motion / klavye etkisi varsa: açıklayın -->

## Geriye-Uyum

<!-- Breaking change var mı? Hangi versiyondan beri? Deprecation gerekli mi? -->

## RACI Onay (MAJOR için zorunlu)

- [ ] Tasarım Lideri onayı
- [ ] A11y Lead görüşü
- [ ] Brand / Hukuk Danışmanı görüşü (TBK gibi semboller için)
- [ ] Kurum Yönetim Kurulu bilgilendirmesi

## İlgili Issue

Closes #
