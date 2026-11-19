# Panduan pemasangan Cloudflare

## Isi paket
- `apps/member` — website publik Member.
- `apps/admin` — website Admin terpisah.
- `workers/api` — fondasi backend.
- `database/schema.sql` — skema awal D1.

## A. Buat database D1
1. Buka dashboard Cloudflare.
2. Pilih Workers & Pages → D1 SQL Database.
3. Buat database bernama `zyqent-db`.
4. Jalankan isi `database/schema.sql` melalui Console D1.
5. Salin Database ID.

## B. Siapkan Worker API
1. Pasang Node.js LTS di laptop.
2. Buka terminal pada folder `workers/api`.
3. Jalankan `npm install`.
4. Jalankan `npx wrangler login`.
5. Buka `wrangler.toml`, ganti `REPLACE_WITH_YOUR_D1_DATABASE_ID` dengan ID D1 milikmu.
6. Jalankan `npx wrangler deploy`.
7. Catat URL Worker yang diberikan Cloudflare.

## C. Siapkan dua website terpisah
Buat dua project Cloudflare Pages:
- Project Member: deploy isi folder `apps/member`.
- Project Admin: deploy isi folder `apps/admin`.

Pada masing-masing file `config.js`, ganti URL contoh dengan URL Worker milikmu.

## D. Lindungi Admin
Gunakan hostname terpisah untuk Admin dan aktifkan Cloudflare Access. Tetapkan kebijakan hanya untuk email pemilik. Cloudflare Access adalah lapisan perlindungan tambahan; aplikasi tetap harus memeriksa sesi dan role Admin di backend.

## Sebelum diluncurkan
Ikuti `SECURITY_CHECKLIST.md`. Jangan menganggap login, registrasi, atau AI sudah aktif hanya karena halaman tampil.
