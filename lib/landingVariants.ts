export type IntentOption = {
  label: string;
  emoji: string;
  waText: string;
};

export type LandingVariant = {
  slug: string;
  eyebrow: string;
  headlineTop: string;
  headlineAccent: string;
  headlineBottom: string;
  subtext: string;
  primaryWaText: string;
  ctaTitle: string;
  ctaSubtext: string;
  intentOptions: IntentOption[];
  offerItems: string[];
};

const baseOffers = [
  '💰 Mulai Rp99.000',
  '⚡ Proses 3–5 hari',
  '🛠️ Revisi desain 1x',
  '📦 Kirim se-Indonesia',
];

export const landingVariants: Record<string, LandingVariant> = {
  home: {
    slug: '/',
    eyebrow: '🕯 Hadiah Paling Bermakna',
    headlineTop: 'Mereka selalu',
    headlineAccent: 'ada dalam',
    headlineBottom: 'cahayamu',
    subtext:
      'Ubah foto orang tersayangmu menjadi lampu tidur yang bercahaya hangat. Setiap malam, wajah mereka menyambutmu dalam cahaya yang tenang.',
    primaryWaText: 'Halo, saya ingin memesan lampu kenangan litophane',
    ctaTitle: 'Siapa yang ingin kamu kenang?',
    ctaSubtext:
      'Jangan biarkan foto berharga hanya tersimpan di galeri ponsel. Wujudkan mereka dalam cahaya yang selalu menyala.',
    offerItems: baseOffers,
    intentOptions: [
      { label: 'Untuk Pasangan', emoji: '💑', waText: 'Halo, saya mau konsultasi litophane untuk hadiah pasangan.' },
      { label: 'Untuk Orang Tua', emoji: '👨‍👩‍👧‍👦', waText: 'Halo, saya mau konsultasi litophane untuk hadiah orang tua.' },
      { label: 'Untuk Anak', emoji: '🧒', waText: 'Halo, saya mau konsultasi litophane untuk kenangan anak.' },
    ],
  },
  anniversary: {
    slug: '/kado-anniversary',
    eyebrow: '💍 Kado Anniversary Romantis',
    headlineTop: 'Rayakan cinta',
    headlineAccent: 'lebih dari',
    headlineBottom: 'sekadar bunga',
    subtext:
      'Jadikan momen anniversary lebih berkesan dengan lampu litophane dari foto favorit kalian berdua.',
    primaryWaText: 'Halo, saya ingin pesan litophane untuk hadiah anniversary.',
    ctaTitle: 'Anniversary tahun ini mau lebih berkesan?',
    ctaSubtext:
      'Kirim fotomu sekarang, kami bantu ubah jadi hadiah yang personal dan tidak terlupakan.',
    offerItems: baseOffers,
    intentOptions: [
      { label: 'Anniversary 1–3 tahun', emoji: '🌹', waText: 'Halo, saya mau buat hadiah anniversary 1-3 tahun.' },
      { label: 'Anniversary 4+ tahun', emoji: '💖', waText: 'Halo, saya mau buat hadiah anniversary 4 tahun ke atas.' },
      { label: 'LDR / Surprise', emoji: '🎁', waText: 'Halo, saya mau buat litophane untuk surprise pasangan.' },
    ],
  },
  parents: {
    slug: '/kado-untuk-ortu',
    eyebrow: '👨‍👩‍👧 Kado untuk Ayah & Ibu',
    headlineTop: 'Terima kasih untuk',
    headlineAccent: 'orang yang',
    headlineBottom: 'selalu ada',
    subtext:
      'Abadikan momen berharga bersama orang tua menjadi lampu kenangan yang menyala setiap malam.',
    primaryWaText: 'Halo, saya ingin pesan litophane untuk hadiah orang tua.',
    ctaTitle: 'Mau kasih hadiah yang benar-benar bermakna?',
    ctaSubtext:
      'Hadiah personal dari foto keluarga jauh lebih menyentuh daripada hadiah biasa.',
    offerItems: baseOffers,
    intentOptions: [
      { label: 'Hadiah untuk Ibu', emoji: '💐', waText: 'Halo, saya mau buat hadiah litophane untuk Ibu.' },
      { label: 'Hadiah untuk Ayah', emoji: '🫶', waText: 'Halo, saya mau buat hadiah litophane untuk Ayah.' },
      { label: 'Foto Keluarga', emoji: '🏡', waText: 'Halo, saya mau buat litophane dari foto keluarga.' },
    ],
  },
  graduation: {
    slug: '/kado-wisuda',
    eyebrow: '🎓 Kado Wisuda Anti-Mainstream',
    headlineTop: 'Momen wisuda',
    headlineAccent: 'layak dikenang',
    headlineBottom: 'selamanya',
    subtext:
      'Ubah foto wisuda jadi lampu kenangan estetik yang bisa dipajang di kamar atau meja kerja.',
    primaryWaText: 'Halo, saya ingin pesan litophane untuk hadiah wisuda.',
    ctaTitle: 'Cari kado wisuda yang beda dari yang lain?',
    ctaSubtext:
      'Litophane custom bikin momen kelulusan terasa lebih personal dan berkesan.',
    offerItems: baseOffers,
    intentOptions: [
      { label: 'Untuk Pacar', emoji: '🎓💘', waText: 'Halo, saya mau buat hadiah wisuda untuk pacar.' },
      { label: 'Untuk Sahabat', emoji: '🎓🤝', waText: 'Halo, saya mau buat hadiah wisuda untuk sahabat.' },
      { label: 'Untuk Diri Sendiri', emoji: '✨', waText: 'Halo, saya mau buat litophane dari foto wisuda saya.' },
    ],
  },
  child: {
    slug: '/kenangan-anak',
    eyebrow: '🧒 Kenangan Masa Kecil',
    headlineTop: 'Masa kecil',
    headlineAccent: 'terlalu cepat',
    headlineBottom: 'berlalu',
    subtext:
      'Simpan senyum si kecil dalam bentuk lampu kenangan yang hangat, estetik, dan personal.',
    primaryWaText: 'Halo, saya ingin pesan litophane untuk kenangan anak.',
    ctaTitle: 'Mau simpan momen si kecil selamanya?',
    ctaSubtext:
      'Foto anak paling berharga bukan cuma di galeri — wujudkan jadi kenangan nyata di rumah.',
    offerItems: baseOffers,
    intentOptions: [
      { label: 'Foto Bayi', emoji: '👶', waText: 'Halo, saya mau buat litophane dari foto bayi.' },
      { label: 'Foto Ulang Tahun', emoji: '🎂', waText: 'Halo, saya mau buat litophane dari foto ulang tahun anak.' },
      { label: 'Foto Keluarga + Anak', emoji: '👨‍👩‍👧‍👦', waText: 'Halo, saya mau buat litophane dari foto keluarga bersama anak.' },
    ],
  },
};
