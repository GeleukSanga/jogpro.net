# PRD — Kalkulator Weton & Jodoh JOGPRO TAROT

> Status: Draft | Pemilik: Yohanes | Tanggal: 21 Sep 2026
> Repo: `GeleukSanga/jogpro.net` | Data siap: `lib/weton-data.ts` (commit `93838e5`)

## 1. Latar & Tujuan

jogpro.net (versi tarot) punya traffic organik potensial dari pencarian weton/primbon (KD rendah, volume stabil). Tujuan: tambah 2 rute baru — kalkulator weton dan cek jodoh — untuk menaikkan pageview, durasi kunjungan, dan share (hasil weton sangat shareable di WA).

## 2. Scope

**In:**
- Rute `/tarot/weton`: input 1 tanggal lahir (+ opsi lahir setelah Maghrib) → weton, pasaran, neptu, wuku + dewa + watak wuku, 5 blok tafsir (Watak, Karir, Rejeki, Percintaan, Masa Depan), daftar Pasangan Ideal
- Rute `/tarot/jodoh`: input 2 tanggal lahir → weton + neptu masing-masing, total, badge kategori (8 kategori), makna + saran
- Tombol share hasil (copy teks / WA share link dengan query param tanggal)
- SEO: title/desc unik per rute, heading hierarchy, FAQ schema (4–6 Q&A)

**Out (non-goal v1):**
- Hari-baik picker (akad nikah/pindah rumah) — backlog v2
- Kalender Jawa bulanan — backlog v2
- Login/simpan riwayat — tidak perlu
- Meta Pixel event baru (pakai PageView + ViewContent existing)

## 3. User Stories

1. Sebagai pengunjung, saya masukkan tanggal lahir → saya lihat weton + neptu + wuku saya dalam <1 detik, tanpa signup
2. Sebagai pasangan, kami masukkan 2 tanggal → kami lihat kategori kecocokan + maknanya
3. Sebagai pengguna WA, saya share hasil ke grup keluarga via 1 tombol

## 4. Fungsional

### 4.1 Kalkulasi (WAJIB pakai `lib/weton-data.ts`, jangan hardcode ulang)
- `hitungWeton(y,m,d)` → hari, pasaran, weton, neptu, wuku + info lengkap
- Anchor: pasaran 1 Sep 2026 = Legi (urutan Legi-Pahing-Pon-Wage-Kliwon); wuku Minggu 3 Mei 2026 = awal Tolu
- Opsi Maghrib: bila dicentang, tanggal digeser +1 hari sebelum hitung
- `hitungJodoh(n1,n2)` → total + kategori + makna (8 set angka baku)
- `pasanganIdeal(n)` → daftar weton kompatibel per kategori baik

### 4.2 Input & Validasi
- Date input native (min 1900-01-01, max hari ini); tanggal invalid → pesan error inline, tidak crash
- Share link: `/tarot/weton?tgl=YYYY-MM-DD` dan `/tarot/jodoh?a=..&b=..` → halaman render hasil langsung dari URL

### 4.3 Output `/tarot/weton`
1. Kartu weton: nama besar (mis. "Jumat Pon"), badge neptu 13, pasaran
2. Kartu wuku: nama + nomor + dewa + watak
3. Lima blok: Watak, Karir, Rejeki, Percintaan, Masa Depan (sembunyikan blok yang null)
4. Pasangan Ideal: 4 kategori baik + contoh weton
5. Disclaimer budaya: "cermin, bukan vonis" (wajib tampil)

### 4.4 Output `/tarot/jodoh`
1. Dua kartu weton + neptu masing-masing
2. Total + badge kategori besar + makna + 1 kalimat saran
3. Disclaimer budaya (wajib tampil)

## 5. Desain

- Ikut bahasa desain tarot existing (`site-header`, `hero`, `eyebrow`, `button-gold`, kartu CSS di `globals.css`); tanpa gambar baru
- Mobile-first; hasil harus terbaca penuh di layar 360px
- Tone Indonesia reflektif, bukan ramalan mutlak

## 6. Non-fungsional

- Kalkulasi 100% sisi klien, tanpa API call; TTI tidak boleh turun vs sekarang
- Aksesibilitas: label form, aria-live untuk hasil, kontras teks
- Tidak ada tracking tambahan selain Pixel existing

## 7. Acceptance Criteria (test vectors — SUDAH terverifikasi)

| Input | Ekspektasi |
|---|---|
| 1945-08-17 | Jumat Legi, neptu 11, wuku Manahil (23) |
| 2026-09-01 | Selasa Legi, neptu 8, wuku Wuye (22) |
| 2026-09-18 | Jumat Pon, neptu 13, wuku Prangbakat (24) |
| Jodoh 13 + 13 | total 26 → PESTHI |
| Ideal neptu 13 RATU | neptu {7,16} → Selasa Wage, Rabu Pahing, Kamis Kliwon, Sabtu Pon |
| Maghrib ON, lahir 2026-09-01 malam | dihitung sebagai 2026-09-02 |
| Tanggal invalid/kosong | error inline, halaman tidak crash |
| Blok null (mis. masaDepan Senin Wage) | blok disembunyikan, layout tidak bolong |

QA manual: `npx tsx -e` dengan vektor di atas + klik submit kosong + cek mobile 360px + cek share link render hasil.

## 8. Risiko & Catatan

- Rumus proleptik Gregorian: eksak untuk 1900–sekarang; tanggal pra-1582 bisa selisih (tak relevan untuk tanggal lahir)
- Framing budaya sensitif: disclaimer wajib, hindari klaim mutlak ("pasti cerai", "pasti kaya")
- Sumber tafsir tercantum per weton di data (URL); jangan ubah narasi tanpa sumber

## 9. Rollout

1. Desain (owner) → 2. Build 2 rute + share (dev) → 3. QA vektor + mobile → 4. Commit + deploy Vercel → 5. Submit GSC `/tarot/weton`, `/tarot/jodoh` → 6. Pin Pinterest per weton populer (Jumat Kliwon, Sabtu Pahing — neptu besar paling dicari)
