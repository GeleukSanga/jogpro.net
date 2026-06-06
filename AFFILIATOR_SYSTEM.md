# Jogpro Affiliator System

## Overview
Sistem affiliasi Jogpro untuk TikTok & Shopee. Affiliator membuat konten produk Jogpro,
lalu klaim komisi berdasarkan views video dan checkout yang dihasilkan.

---

## Alur Kerja

### 1. Pendaftaran
- Calon affiliator isi form: nama, WA, kota, TikTok username, jumlah followers, URL profil, Instagram (opsional)
- Status awal: `pending`
- Jo review manual → `approved` atau `rejected`
- Affiliator approved mendapat akses dashboard

### 2. Sampel Produk
- Affiliator approved berhak request sampel produk
- Jo proses pengiriman, input nomor resi
- Tracking status: `requested → packed → shipped → delivered`

### 3. Komisi Checkout (Platform)
- Affiliator mendapat link affiliate dari **TikTok Shop** dan/atau **Shopee** masing-masing
- Komisi checkout: **20% dari GMV** per transaksi yang dihasilkan
- Data komisi checkout bisa dilihat langsung di dashboard TikTok Shop / Shopee affiliator
- **Jogpro tidak perlu tracking manual** — platform yang menghitung otomatis
- Affiliator diberi petunjuk cara mendapatkan link affiliate di masing-masing platform

### 4. Komisi Views Video
- Setiap video yang mencapai **kelipatan 500 views** bisa diklaim
- Rate: **Rp 2.500 per 500 views**
- Klaim bertahap per kelipatan:
  - 500 views → klaim Rp 2.500
  - 1.000 views → klaim tambahan Rp 2.500
  - 1.500 views → klaim tambahan Rp 2.500
  - dst. (tidak ada batas atas, sesuai budget)
- Affiliator upload: URL video + screenshot views sebagai bukti
- **Setiap kelipatan 500 hanya bisa diklaim 1x**

#### Contoh Perhitungan:
> Affiliator punya 10 video:
> - 6 video hit 500 views → komisi views = 6 × Rp 2.500 = **Rp 15.000**
> - 3 dari 6 video lanjut ke 1.000 views → tambahan 3 × Rp 2.500 = **Rp 7.500**
> - Total komisi views = **Rp 22.500**

### 5. Budget & Progress Pencairan
- Jo mengalokasikan budget komisi views (misal: Rp 500.000/periode)
- Dashboard admin menampilkan **animasi progress bar** pencairan budget
- Affiliator bisa melihat total klaim mereka vs status pencairan
- **Affiliator TIDAK tahu bahwa pembayaran dilakukan manual oleh Jo**

### 6. Pembayaran
- Dilakukan **manual oleh Jo** via transfer bank
- Jo update status klaim → `paid` setelah transfer
- Affiliator hanya melihat status: `pending → approved → paid`

---

## Status & Alur Database

### affiliators
| Status | Keterangan |
|--------|-----------|
| `pending` | Baru daftar, menunggu review Jo |
| `approved` | Diterima, bisa akses dashboard & klaim |
| `rejected` | Ditolak |

### affiliator_samples
| Status | Keterangan |
|--------|-----------|
| `requested` | Affiliator request sampel |
| `packed` | Jo sudah packing |
| `shipped` | Sudah dikirim (ada resi) |
| `delivered` | Sampai ke affiliator |

### affiliator_claims (komisi views)
| Status | Keterangan |
|--------|-----------|
| `pending` | Klaim masuk, belum diverifikasi |
| `approved` | Jo setujui, menunggu transfer |
| `rejected` | Bukti tidak valid |
| `paid` | Sudah ditransfer |

---

## Komisi Views — Aturan Klaim
- Minimum klaim: **500 views**
- Rate: **Rp 2.500 per 500 views**
- Sistem mencatat milestone per video (500, 1000, 1500, ...)
- 1 milestone = 1 klaim, tidak bisa klaim milestone yang sama 2x
- Bukti wajib: URL video + screenshot views saat klaim

---

## Budget Pencairan
- Jo set budget per periode di admin dashboard
- Progress bar animasi menampilkan: total klaim approved / budget × 100%
- Jika budget hampir habis, admin dapat notifikasi

---

## Yang TIDAK Perlu Dibangun (Platform Handle)
- Tracking checkout & GMV → TikTok Shop / Shopee dashboard affiliator
- Perhitungan komisi checkout 20% → otomatis di platform
- Link affiliate → affiliator generate sendiri di platform masing-masing

---

## Catatan Developer
- Semua API route pakai `service_role` key Supabase (server-side only)
- Pembayaran manual, jangan expose info ini ke UI affiliator
- Budget dialokasikan oleh Jo via admin panel
- Notifikasi klaim masuk → bisa via Telegram ke Jo
