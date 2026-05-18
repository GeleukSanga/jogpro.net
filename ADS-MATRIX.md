# Ads Matrix – LumiMemo (UTM to WhatsApp)

Dokumen ini untuk mapping iklan -> landing page -> UTM naming, supaya chat WhatsApp membawa source campaign yang jelas.

## 1) Aturan UTM (standar)

- `utm_source`: platform traffic (`meta`, `instagram`, `facebook`, `tiktok`, `google`)
- `utm_medium`: tipe traffic (`paid_social`, `cpc`, `retargeting`)
- `utm_campaign`: objective + angle + periode
  - format: `lm_{objective}_{angle}_{yyyymm}`
  - contoh: `lm_conv_anniversary_202605`
- `utm_content`: variasi creative / hook
  - format: `{format}_{hook}_{variant}`
  - contoh: `video_story_v1`, `image_offer_v2`
- `utm_term`: audience / interest / lookalike
  - contoh: `interest_anniversary`, `lal_1pct_buyers`, `broad_women_22_35`

## 2) Matrix Campaign per Landing Page

| Audience / Angle | Landing Page | Primary Objective | Contoh `utm_campaign` | Catatan Creative |
|---|---|---|---|---|
| Anniversary / Pasangan | `/kado-anniversary` | Click to WhatsApp | `lm_conv_anniversary_202605` | Visual couple + momen surprise |
| Hadiah untuk Orang Tua | `/kado-untuk-ortu` | Click to WhatsApp | `lm_conv_parents_202605` | Emosi gratitude anak ke ortu |
| Hadiah Wisuda | `/kado-wisuda` | Click to WhatsApp | `lm_conv_graduation_202605` | Before/after momen wisuda |
| Kenangan Anak | `/kenangan-anak` | Click to WhatsApp | `lm_conv_child_202605` | Foto anak + growth memory |
| General Prospecting | `/` | Click to WhatsApp | `lm_conv_home_202605` | Broad pain point + social proof |

## 3) URL Template per Platform

Base domain: `https://jogpro.net`

### Anniversary
`https://jogpro.net/kado-anniversary?utm_source=meta&utm_medium=paid_social&utm_campaign=lm_conv_anniversary_202605&utm_content=video_story_v1&utm_term=interest_anniversary`

### Orang Tua
`https://jogpro.net/kado-untuk-ortu?utm_source=meta&utm_medium=paid_social&utm_campaign=lm_conv_parents_202605&utm_content=image_emotional_v1&utm_term=interest_family`

### Wisuda
`https://jogpro.net/kado-wisuda?utm_source=tiktok&utm_medium=paid_social&utm_campaign=lm_conv_graduation_202605&utm_content=video_reaction_v1&utm_term=broad_students`

### Kenangan Anak
`https://jogpro.net/kenangan-anak?utm_source=instagram&utm_medium=paid_social&utm_campaign=lm_conv_child_202605&utm_content=reel_mom_v2&utm_term=interest_parenting`

### General
`https://jogpro.net/?utm_source=meta&utm_medium=paid_social&utm_campaign=lm_conv_home_202605&utm_content=video_offer_v1&utm_term=broad`

## 4) Apa yang masuk ke WhatsApp Prefill

Semua tombol WhatsApp sekarang otomatis append block tracking:

- `Landing: /path`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Jika UTM kosong, tetap kirim `Ref: /path` supaya tetap tahu origin landing page.

## 5) Naming Convention Cepat (biar tim konsisten)

- Objective: `conv`, `traffic`, `ret`
- Angle: `anniversary`, `parents`, `graduation`, `child`, `home`
- Bulan: `YYYYMM`

Pattern final:

`lm_{objective}_{angle}_{yyyymm}`

Contoh:
- `lm_conv_anniversary_202605`
- `lm_conv_parents_202605`
- `lm_ret_child_202606`

## 6) Checklist Launch Ads

- [ ] Set URL sesuai landing angle
- [ ] Isi semua UTM wajib (`source`, `medium`, `campaign`, `content` minimal)
- [ ] Tes klik iklan -> WA prefill menampilkan block tracking
- [ ] Pastikan campaign naming sesuai pattern
- [ ] Catat creative variant (`utm_content`) untuk analisis pemenang
