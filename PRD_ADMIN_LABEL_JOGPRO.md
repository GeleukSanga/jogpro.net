# PRD — Halaman Admin Cetak Label Pengiriman JOGPRO.NET

**Versi:** 1.0 — 11 Sep 2026  
**Owner:** JOGPRO  
**Tujuan:** Admin bisa kelola pesanan & print label pengiriman dari halaman admin  
**Stack:** Next.js 16 (jogpro-lighter-store), Supabase (`jogpro_orders`), Vercel  
**Referensi alamat:** Mengikuti format di `lib/supabase.ts` + `app/checkout/page.tsx` & `app/payment/content.tsx`

---

## 1. Ringkasan
Admin butuh halaman `/admin` (protected) untuk melihat daftar pesanan, mem-verifikasi pembayaran, lalu mencetak label pengiriman yang siap tempel di paket. Format alamat HARUS sama persis dengan input pembeli di checkout (recipient_name / phone / address + destination_city + courier).

Fitur inti: **list pesanan → preview label → cetak per ukuran → cetak batch → hapus**.

---

## 2. Goals & Non-Goals
**Goals**
- Kurangi waktu packing dari cek WA manual ke 1-klik print.
- Label rapi, scannable, sesuai ukuran thermal printer yang dipakai di gudang.
- Bisa cetak massal (pilih 10-20 order sekaligus).

**Non-Goals (v1)**
- Integrasi resi otomatis JNE/JNT/SiCepat (hanya tampilkan courier & ongkir).
- Barcode/QR resi (opsional v2).

---

## 3. User & Role
| Role | Akses | Catatan |
|------|-------|---------|
| Admin (owner) | full | Login via Supabase Auth email + password, middleware protect `/admin/*` |
| Staff (opsional v2) | lihat + print saja | tanpa hapus |

> **Butuh dari kamu:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (untuk bypass RLS di server), dan akun admin yang mau dipakai. Beritahu kalau mau aku pakai service role di `lib/supabase.ts` yang sekarang masih fallback.

---

## 4. Data — Mengikuti Format Pesanan Pembeli
Tabel `jogpro_orders` (sudah ada, cek `lib/supabase.ts`):

```
id (PK)
product_id, custom_name, color
origin_city, destination_city, courier, shipping_cost, total, status, payment_method, created_at
recipient_name, recipient_phone, recipient_address
```

**Tampilan alamat di admin & di label HARUS:**
```
recipient_name
recipient_phone
recipient_address
destination_city   (mis. “SERPONG, TANGERANG SELATAN” + “Kec. … , Kota …” dari RajaOngkir)
courier • shipping_cost • order_id
```
> Sesuai `app/checkout/page.tsx: recipientName/Phone/Address + destSelected` dan `app/payment/content.tsx` “Pengiriman ke”.

Jika `recipient_address` kosong → fallback tampilkan `destination_city`.

---

## 5. Fitur Admin v1

### 5.1 Daftar Pesanan (`/admin`)
- Table: checkbox | ID | Produk (+ warna/custom) | Total | Kurir | Status | Tanggal | Alamat Ringkas | Aksi
- Filter: status (`pending/paid/packed/shipped`), kurir, tanggal, search (nama/no HP/ID)
- Sort: terbaru dulu
- Pagination 20/row
- Badge warna status: pending=abu, paid=lime, packed=blue, shipped=green
- Alamat ringkas = `recipient_address` truncated 60 char + `destination_city` badge
- Aksi per baris: [Preview] [Print] [Hapus 🗑️]

### 5.2 Preview Label (modal / drawer)
- Live preview seperti kertas label, menampilkan:
  - Header: **JOGPRO.NET** + ID order + tanggal
  - Kiri: *Dari:* JOGPRO Warehouse, Serpong 15311
  - Kanan: *Tujuan:* format alamat lengkap di atas
  - Bawah: Produk • Warna • Custom • Courier • Ongkir • Total
- Tombol: Cetak (dengan pilihan ukuran) | Tutup

### 5.3 Cetak — Pilihan Ukuran (wajib)
Dropdown / radio di modal & di toolbar batch:
- **100×150 mm (4×6 inch)** — Thermal default, paling dipakai
- **100×100 mm** — Kotak
- **80×80 mm** — Kecil
- **A6 (105×148 mm)** — Kertas HVS
- **A4 (1 label / halaman)** — Untuk printer biasa
- **58 mm (struk)** — Thermal mini

Implementasi: CSS `@media print` + `@page { size: 100mm 150mm; margin:0 }` per ukuran. Satu label = satu `@page`, tidak terpotong. Opsi “Fit to paper” otomatis.

### 5.4 Cetak Bersamaan (Batch)
- Checkbox di table → “Pilih semua” → Toolbar muncul: “Cetak 12 terpilih (100×150)”
- Preview batch: grid (2×5 per halaman untuk 100×150, diatur CSS)
- Print = `window.print()` satu job, tiap label `page-break-after: always` (atau 2 per halaman sesuai ukuran)
- Jika ukuran 100×150 & A4, batch tetap 1 label per halaman berurutan.

### 5.5 Hapus
- Soft delete v1: `status='cancelled'` + tombol Hapus butuh konfirmasi modal “Yakin hapus order #123? Data tidak bisa dikembalikan.”
- Hard delete (opsional via service_role) → `DELETE FROM jogpro_orders WHERE id=...` hanya untuk admin owner.
- Toast sukses/gagal + undo 5 detik (opsional).
- Log aktivitas (siapa hapus kapan) di `jogpro_admin_logs` (v2).

---

## 6. Alur (Flow)
1. Pembeli checkout → `POST /api/orders` → `jogpro_orders` status `pending`
2. Admin buka `/admin` → lihat pending → klik Preview → pilih ukuran → Print
3. Atau checklist 10 order → Cetak Bersama → pilih 100×150 → Print → ubah status ke `packed` (opsional)
4. Butuh edit? klik alamat untuk copy. Butuh hapus → konfirmasi.

---

## 7. Desain — Harus Oke (ikuti JOGPRO)
- Ikuti `app/globals.css` & `page.tsx`: bg `#fbfbf8`, text `#171717`, accent lime `#d7ff3f`, rounded `2rem`, font black tracking `-0.06em`
- Table: card putih `rounded-[1.75rem] border-black/10`, header `bg-[#171717] text-white`, hover `bg-black/3`
- Toolbar batch: sticky bottom `bg-[#171717] text-white rounded-full`
- Preview label: kertas putih dengan border dashed, font mono untuk alamat agar rapi.
- Empty state: ilustrasi + “Belum ada pesanan”
- Mobile: table jadi card list dengan swipe.

> Wireframe ada di `/jogpro-redesign-wireframe/index.html` bisa dipakai sebagai referensi layout admin.

---

## 8. Teknis

**Route**
- `/admin` → Server Component, fetch via `supabase` (service_role)
- `/admin/api/orders` → GET (list, filter), DELETE (hapus), PATCH (update status)
- Auth: `middleware.ts` cek session Supabase, redirect ke `/admin/login` jika belum login
- Print: Client Component, `useReactToPrint` atau `window.print()` + CSS print

**Supabase**
- RLS: hanya `service_role` boleh SELECT/DELETE di `jogpro_orders` untuk admin
- Butuh kamu set env di Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`
- Migration: tidak perlu tambah kolom, cukup manfaatkan yang ada. Tambahan opsional `admin_notes`.

**Keamanan**
- API delete pakai `role=admin` check
- Rate limit print batch max 50 order per job

---

## 9. Acceptance Criteria
- [ ] Admin login bisa lihat list 20 order/page dengan alamat sesuai checkout
- [ ] Preview label menampilkan `recipient_name/phone/address + destination_city` 100% sama dengan input pembeli
- [ ] Cetak 1 label di semua 6 ukuran tidak terpotong, margin pas
- [ ] Cetak bersamaan 10 order dalam 1 job print berhasil (tiap label halaman sendiri)
- [ ] Hapus butuh konfirmasi, setelah hapus tidak muncul di list, bisa undo 5 detik
- [ ] Print di Chrome & thermal printer 100×150 teruji
- [ ] Mobile responsive, tidak ada overflow

---

## 10. Estimasi & Next Step
- **Desain mockup Figma/code:** 1 hari
- **Dev admin + print logic:** 2-3 hari
- **Testing printer:** 0.5 hari

**Yang perlu dari kamu sekarang:**
1. Kredensial Supabase (URL + service_role) — atau beri akses Vercel env.
2. Ukuran printer yang paling sering dipakai di gudang (100×150 atau 80mm?) biar jadi default.
3. Mau pakai soft delete atau hard delete?

Kalau oke, aku langsung bikinin mockup `/admin` + API-nya sesuai PRD ini.
