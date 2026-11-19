# Checklist sebelum peluncuran publik

- [ ] Ganti semua placeholder URL dan konfigurasi.
- [ ] Masukkan D1 database ID yang benar ke `wrangler.toml`.
- [ ] Implementasikan login dan registrasi aman di Worker.
- [ ] Simpan password menggunakan algoritma hashing password yang sesuai; jangan simpan password teks biasa.
- [ ] Implementasikan session cookie aman (HttpOnly, Secure, SameSite) dan perlindungan CSRF bila diperlukan.
- [ ] Terapkan pemeriksaan role Admin di server pada setiap endpoint Admin.
- [ ] Aktifkan Cloudflare Access pada hostname Admin dengan allowlist email pemilik.
- [ ] Implementasikan verifikasi email, reset password, rate limiting, dan logging.
- [ ] Implementasikan Google OAuth dengan redirect URI yang benar jika diinginkan.
- [ ] Tambahkan validasi input dan penanganan error.
- [ ] Uji bahwa Member tidak dapat mengakses API Admin.
- [ ] Siapkan kebijakan privasi dan ketentuan penggunaan.
- [ ] Lakukan pengujian keamanan sebelum menerima pengguna publik.

**Penting:** jangan deploy starter ini sebagai sistem produksi yang menerima akun. Endpoint autentikasi saat ini sengaja belum aktif.
