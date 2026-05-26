# Güvenlik Politikası

## Desteklenen Versiyonlar

| Versiyon | Destek |
|---|---|
| 1.x | ✓ Aktif destek |
| < 1.0 | ✗ Beta · destek yok |

## Güvenlik Açığı Bildirimi

Düstur, T.C. mevzuat sisteminin tasarım altyapısıdır. Güvenlik açıkları (özellikle aşağıdaki kategorilerde) **özel kanal üzerinden** bildirilmelidir:

### Kritik Kategoriler

1. **Token tampering** — JSON jetonları üzerinde kötü niyetli değişiklik girişimi (özellikle LOCKED jetonlar)
2. **Build pipeline** — Style Dictionary veya scripts/ üzerinde supply chain saldırısı
3. **CI workflow** — `.github/workflows/` üzerinden privilege escalation
4. **Reference HTML XSS** — `reference/dustur-source.html` Paged.js polyfill üzerinden script injection
5. **Akoma Ntoso XML parsing** — XXE veya XML bomb saldırıları

### Bildirim Süreci

1. **Public issue ACMAYIN**.
2. GitHub Security Advisory üzerinden özel raporlama yapın: [Security tab → Report a vulnerability](https://github.com/mahirkurt/Dustur/security/advisories/new)
3. Alternatif: drmahirkurt@gmail.com adresine **PGP imzalı** mesaj gönderin.

### Yanıt Süresi

| Şiddet | İlk yanıt | Yama |
|---|---|---|
| Kritik | 48 saat | 7 gün |
| Yüksek | 5 iş günü | 14 gün |
| Orta | 10 iş günü | 30 gün |
| Düşük | 30 iş günü | Sonraki minor release |

### Sorumluluk Açıklaması

Sorumluluk açıklaması protokolünü izleriz. Bildirimde bulunan araştırmacı:
- Yamada yer alır (istenirse anonim).
- 90 günlük embargo süresi sonunda public disclosure yapılır.
- Etik araştırma çerçevesinde [Safe Harbor](https://disclose.io/) korumasındadır.

## Bağımlılık Güvenliği

- `npm audit` her CI çalışmasında otomatik çalışır.
- Dependabot etkin (`.github/dependabot.yml`).
- Tüm dev dependencies SemVer caret (`^`) ile kilitli.
- Token JSON'ları runtime dependency içermez — supply chain riski yalnız build script'lerinde.

## Yetkilendirilmiş Bakımcı

- @mahirkurt — Sistem Sahibi
