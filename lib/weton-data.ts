// Database Primbon: weton, neptu, wuku, jodoh — untuk kalkulator /tarot/weton.
// Sumber: javanesetime.org, detik.com, javasenseapp.com, kalenderindo.id,
//   kalenderlengkap.id, wetonjawa.com, kapanlagi.com, katadata.co.id,
//   jawapos.com, orami.co.id, primbon.com, Ullensentalu Museum, tempo.co.
// Rumus tanggal diverifikasi silang: 17 Agu 1945 = Jumat Legi ✓,
//   1 Sep 2026 = Selasa Legi ✓, 18 Sep 2026 = Jumat Pon ✓,
//   wuku 20–26 Sep 2026 = Bala ✓ (urutan ke-25).

export const NEPTU_HARI: Record<string, number> = {
  Minggu: 5,
  Senin: 4,
  Selasa: 3,
  Rabu: 7,
  Kamis: 8,
  Jumat: 6,
  Sabtu: 9,
}

export const NEPTU_PASARAN: Record<string, number> = {
  Legi: 5,
  Pahing: 9,
  Pon: 7,
  Wage: 4,
  Kliwon: 8,
}

export const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
export const PASARAN_LIST = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon']

export interface WetonInfo {
  weton: string
  hari: string
  pasaran: string
  neptu: number
  watak: string | null
  karir: string | null
  rejeki: string | null
  percintaan: string | null
  masaDepan: string | null
  sumber: string[]
}

export const WETON: WetonInfo[] = [
  { weton: 'Minggu Legi', hari: 'Minggu', pasaran: 'Legi', neptu: 10, watak: 'Pendiam namun cerdas, cepat paham bila diajari dan bisa menjadi tempat bertanya; digambarkan Sumur Sinaba dan Satria Wibawa yang kuat, berani, pekerja keras dan berjiwa kepemimpinan.', karir: 'Cocok di bidang pemasaran seperti sales, pedagang, makelar dan distributor, serta bidang akademik seperti peneliti, dosen, dokter dan guru.', rejeki: 'Pandai mencari nafkah, namun keuangan seret pada usia 12, 42 dan 48; berpotensi mendapat limpahan rezeki besar pada usia 54 bila diiringi doa dan usaha.', percintaan: 'Cocok dengan neptu 13 seperti Jumat Pon, Sabtu Wage, Minggu Kliwon, Senin Pahing dan Kamis Legi.', masaDepan: 'Garis nasib tipe Pati yaitu sering mengalami jalan buntu dalam asmara maupun karier; dianjurkan melakukan ruwatan.', sumber: ['https://www.jawapos.com/zodiak/2505250300/sifat-dan-kehidupan-pemilik-weton-minggu-legi-menurut-primbon-jawa', 'https://www.orami.co.id/magazine/weton-minggu-legi'] },
  { weton: 'Minggu Pahing', hari: 'Minggu', pasaran: 'Pahing', neptu: 14, watak: 'Bagaikan lakuning rembulan: cenderung tidak banyak bicara tapi sangat cerdas dan sangat teliti di pekerjaan; namun dikenal pelit dan sulit mengontrol emosi.', karir: 'Cocok pada bidang akuntan, ilmuwan maupun menjadi pemimpin; tidak cocok dengan pekerjaan yang menuntut berbicara di depan publik karena sifat pendiam.', rejeki: 'Berpeluang sangat besar meraih rezeki besar dengan jenis pekerjaan yang sesuai; arah keberuntungan rezeki mengarah ke utara dan timur.', percintaan: 'Cocok dengan neptu 10 dan 15 seperti Selasa Pon, Minggu Legi, Jumat Wage, Jumat Pahing, Rabu Kliwon dan Kamis Pon; hubungan awet dan harmonis.', masaDepan: null, sumber: ['https://kumparan.com/berita-terkini/weton-minggu-pahing-sifat-jodoh-hingga-karier-yang-menarik-untuk-diketahui-25oDA3Zbvvd'] },
  { weton: 'Minggu Pon', hari: 'Minggu', pasaran: 'Pon', neptu: 12, watak: 'Giat bekerja, tekun, tidak bisa diam dan anti menganggur (Bumi Kapethak); tahan menderita dan kuat hati, penuh kasih dan berdaya pikat; pemberani namun kadang jahil dan suka membantah.', karir: 'Lebih cocok berdiri sendiri sebagai pedagang, pemimpin, seniman atau peneliti; kurang cocok bekerja sebagai bawahan yang harus tunduk pada perintah.', rejeki: 'Menandakan peningkatan kualitas hidup keluarga secara ekonomi; membawa peruntungan baik bagi ayah terutama bila ayah berneptu kurang dari 12.', percintaan: 'Cocok dengan neptu 7, 12 atau 17 seperti Selasa Wage, Selasa Pahing, Senin Kliwon, Minggu Pon, Rabu Legi, Kamis Wage, Kamis Pahing dan Sabtu Kliwon.', masaDepan: 'Termasuk tibo lungguh: diyakini mencapai kedudukan terhormat dan kehidupan baik.', sumber: ['https://dewisundari.com/watak-kelahiran-minggu-pon'] },
  { weton: 'Minggu Wage', hari: 'Minggu', pasaran: 'Wage', neptu: 9, watak: 'Lakuning angin yang menyejukkan dan membawa kebahagiaan; namun sekali marah seperti api tertiup angin. Teliti, cerdas, berwawasan luas, setia dan berwibawa; namun tidak mau kalah, pencemburu dan mudah curiga.', karir: 'Lebih cocok menjadi pekerja daripada mandiri, terutama bidang ketelitian seperti dokter, akuntan, bendahara, arsitektur atau dosen.', rejeki: 'Umumnya dianggap membawa penurunan kesejahteraan keluarga terutama bila bapak berneptu di bawah 9; neptu 9 disebut kurang begitu baik dalam rezeki.', percintaan: 'Cocok dengan neptu 10 dan 15 seperti Selasa Pon, Minggu Legi, Jumat Wage, Jumat Pahing, Rabu Kliwon dan Kamis Pon.', masaDepan: null, sumber: ['https://dewisundari.com/watak-kelahiran-minggu-wage', 'https://www.jawapos.com/lifestyle/2406160018/mengenal-weton-minggu-wage-mulai-dari-kepribadian-rezeki-karir-hingga-jodoh-menurut-primbon-jawa'] },
  { weton: 'Minggu Kliwon', hari: 'Minggu', pasaran: 'Kliwon', neptu: 13, watak: 'Sederhana, bijaksana, bertanggung jawab dan berhati bersih namun tertutup; Lakuning Lintang yang dermawan, suka menolong dan pemaaf; sisi negatif mudah tersinggung, gampang percaya, angkuh dan boros.', karir: 'Cocok sebagai pemimpin desa, pegawai negeri, polisi atau tentara, serta guru, dosen atau pengajar; mudah beradaptasi, sabar dan tekun.', rejeki: 'Neptu 13 membawa keberuntungan besar dan berkah bagi keluarga; cenderung boros sehingga harus teliti mengelola keuangan.', percintaan: 'Serasi dengan neptu 11 atau 16 seperti Senin Pon, Selasa Kliwon, Rabu Wage, Jumat Legi, Rabu Pahing, Kamis Kliwon dan Sabtu Pon.', masaDepan: 'Hari baik: Kamis Wage, Jumat Kliwon, Sabtu Legi, Minggu Pahing, Senin Pon, Selasa Wage, Rabu Kliwon, Kamis Legi; hari sial: Minggu Kliwon, Rabu Pahing, Rabu Pon, Jumat Pahing.', sumber: ['https://www.jawapos.com/lifestyle/2501030547/weton-minggu-kliwon-neptu-13-karakter-rezeki-jodoh-dan-profesi-yang-cocok'] },
  { weton: 'Senin Legi', hari: 'Senin', pasaran: 'Legi', neptu: 9, watak: 'Lakuning Angin yang ceria dan membuat sekitar senang; kuat memegang prinsip namun keras kepala, tidak mau mengalah dan kerap meremehkan orang; menjunjung perdamaian dan sopan santun.', karir: 'Cocok di bidang sosial, perdagangan dan kemasyarakatan sebagai pedagang, PNS, karyawan dan pengusaha; mampu multitasking dan cocok di semua jenis bidang pekerjaan.', rejeki: 'Keberuntungan baik, diprediksi berkecukupan dan tidak kekurangan bahkan sebelum usia 30 tahun karena pandai mengatur keuangan.', percintaan: 'Cocok dengan neptu 10 maupun 15 seperti Jumat Wage, Selasa Pon, Rabu Kliwon, Minggu Legi dan Kamis Pon; hubungan diprediksi bahagia dan langgeng.', masaDepan: 'Harus berusaha keras selagi muda agar mapan pada usia 40 tahun dan kemapanan bertahan seumur hidup.', sumber: ['https://www.orami.co.id/magazine/weton-senin-legi', 'https://kabarbanten.pikiran-rakyat.com/hiburan/pr-593734179/kelahiran-weton-senin-ini-keistimewaan-kekurangan-hingga-pekerjaan-yang-cocok-menurut-primbon-jawa?page=all'] },
  { weton: 'Senin Pahing', hari: 'Senin', pasaran: 'Pahing', neptu: 13, watak: 'Introvert, pendiam, pemalu dan suka menyendiri; namun berhati baik, suka menolong, mandiri, sabar dan menghindari konflik; jarang marah namun susah memaafkan bila disakiti.', karir: 'Teliti, serius dan penuh tanggung jawab; cocok sebagai karyawan maupun pemilik usaha sendiri; sukses bila menekuni wirausaha.', rejeki: 'Garis rezeki bagus dan pembawa keberuntungan serta kesejahteraan bagi keluarga; tibo Lungguh dengan puncak pada usia 24, 48 dan 78.', percintaan: 'Cocok dengan neptu 16 atau 11 seperti Rabu Wage, Jumat Legi, Selasa Kliwon, Senin Pon, Kamis Kliwon dan Rabu Pahing.', masaDepan: 'Termasuk kelompok Tulang Wangi yang berkarisma dan berkekuatan spiritual besar; puncak kejayaan pada usia 24, 48 dan 78.', sumber: ['https://www.detik.com/jatim/budaya/d-8021623/watak-dan-rezeki-weton-senin-pahing-menurut-primbon-jawa'] },
  { weton: 'Senin Pon', hari: 'Senin', pasaran: 'Pon', neptu: 11, watak: 'Demang Kadhuruwan dan Aras Tuding: angkuh dan keras hati sejak lahir; namun cerdas, berwawasan luas, tidak mudah dihasut, kreatif, inovatif dan karismatik sebagai pemimpin.', karir: 'Cocok sebagai pemimpin atau manajer, pengusaha, peneliti atau ilmuwan, seniman atau desainer, politikus, konsultan, pegawai pemerintahan dan pengajar; butuh lingkungan yang memberi otonomi.', rejeki: 'Rezeki berkecukupan; peluang usaha baik dari kreativitas; berpotensi sukses finansial tinggi bila bijak mengelola keuangan.', percintaan: 'Cocok dengan neptu 7, 13 atau 18 seperti Minggu Kliwon, Selasa Legi, Kamis Legi, Sabtu Pahing, Jumat Pon dan Sabtu Wage; setia namun keras kepala jadi tantangan.', masaDepan: 'Hari baik: Rabu Wage, Jumat Kliwon, Sabtu Legi, Minggu Pahing; hindari Selasa Kliwon dan Kamis Wage untuk kegiatan penting.', sumber: ['https://www.liputan6.com/feeds/read/5782382/hari-senin-pon-menurut-primbon-jawa-ini-makna-karakteristik-dan-pengaruhnya'] },
  { weton: 'Senin Wage', hari: 'Senin', pasaran: 'Wage', neptu: 8, watak: 'Berwatak lakuning geni yang sangat berapi-api; sisi baik sangat setia, hemat, penurut dan suka menolong tanpa pamrih.', karir: 'Cocok sebagai karyawan, buruh dan pekerja lepas yang tidak terlalu membutuhkan kesabaran; tidak cocok membangun usaha sendiri karena mental kurang teruji.', rejeki: null, percintaan: 'Sangat cocok dengan neptu 11 atau 16 seperti Senin Pon, Selasa Kliwon, Rabu Wage, Kamis Kliwon, Jumat Legi dan Sabtu Pon.', masaDepan: null, sumber: ['https://www.gramedia.com/literasi/senin-wage'] },
  { weton: 'Senin Kliwon', hari: 'Senin', pasaran: 'Kliwon', neptu: 12, watak: 'Menjunjung kekeluargaan dan kehormatan keluarga; cerdas, pandai bicara, sabar dan berjiwa pelindung (aras kembang); namun curiga, waspada, ambisius dan ceroboh (macan ketawan).', karir: 'Cocok di bidang kreativitas, komunikasi dan kepemimpinan seperti seniman, penulis, desainer, guru, manajer atau konsultan; kecuali pekerjaan yang membutuhkan ketelitian seperti peneliti atau akuntan.', rejeki: 'Tibo Silit yang boros; keuangan melimpah pada usia 12, 30, 42, 60 dan 66, seret pada usia 6, 24, 48 dan 72 sehingga disarankan menabung.', percintaan: 'Paling cocok dengan neptu 11 seperti Senin Pon, Selasa Kliwon, Rabu Wage dan Jumat Legi (jumlah 23: damai dan bahagia selamanya).', masaDepan: 'Garis nasib Tibo Lungguh: berpeluang meraih kedudukan terhormat; nasib usia 1-6 kurang beruntung, 7-12 membaik, rezeki lancar di usia 26.', sumber: ['https://www.jawapos.com/zodiak/015879934/rezeki-jodoh-dan-nasib-pemilik-weton-senin-kliwon-berdasarkan-primbon-jawa'] },
  { weton: 'Selasa Legi', hari: 'Selasa', pasaran: 'Legi', neptu: 8, watak: 'Bernaung Lakuning Geni: mudah tersulut emosi dan pencemburu; namun mandiri, tegas, luwes, mudah membaur dan menyenangkan sehingga banyak teman.', karir: 'Cocok menjadi wirausahawan, pemimpin, guru/dosen, pengacara/konsultan, pekerja kreatif, tenaga medis; tidak cocok menjadi bawahan karena tak suka diatur.', rejeki: 'Tergolong kecil/sulit karena neptu kecil (8); rezeki keluarga membantu bila neptu ayah/kakak lebih besar; bisa meningkat dengan kerja keras dan pengendalian emosi.', percintaan: 'Cocok dengan neptu 11 atau 16 seperti Kamis Kliwon, Rabu Wage, Selasa Kliwon, Sabtu Pon, Senin Pon, Rabu Pahing, Jumat Legi.', masaDepan: 'Hari naas: Kamis Pon, Sabtu Kliwon, Senin Pahing; Pancasuda Wasesa Segara: pemurah, pemaaf, berwibawa dan tidak pendendam.', sumber: ['https://www.detik.com/jatim/budaya/d-7971148/karakter-weton-tulang-wangi-selasa-legi-ini-keistimewaannya'] },
  { weton: 'Selasa Pahing', hari: 'Selasa', pasaran: 'Pahing', neptu: 12, watak: 'Berwatak Aras Kembang: mempesona, berwibawa, santai dan menerima orang apa adanya; namun mudah tersulut emosi dan suka membantah; kreatif, cerdas, disiplin dan mandiri.', karir: 'Kurang cocok sebagai karyawan; cocok sebagai wirausaha, pedagang, petani, peternak, makelar, serta bidang kepemimpinan, militer, teknik dan bisnis.', rejeki: 'Tergolong cukup baik/berkecukupan sejak kecil dan pandai mengatur uang serta berbakat bisnis; namun bisa impulsif setelah menikah.', percintaan: 'Cocok dengan neptu 12, 13 atau 17 seperti Selasa Pahing, Minggu Pon, Senin Kliwon, Rabu Legi, Sabtu Kliwon; pantangan jodoh Kamis Wage dan Selasa Wage.', masaDepan: 'Arah keberuntungan Selatan untuk sandang dan Utara untuk pangan.', sumber: ['https://www.orami.co.id/magazine/weton-selasa-pahing'] },
  { weton: 'Selasa Pon', hari: 'Selasa', pasaran: 'Pon', neptu: 10, watak: 'Bernaung Sanggar Waringin: berjiwa kemanusiaan tinggi, senang menolong dan melindungi yang lemah, jujur, berbudi luhur dan tidak serakah; namun mudah marah bila ada kebohongan dan tertutup.', karir: 'Cocok menjadi pedagang atau wirausahawan karena jujur dan pantang menyerah; dianggap kurang cocok kerja bersama orang lain.', rejeki: 'Garis rezeki dan kehidupan baik; keuangan keluarga bisa meningkat lewat usaha, namun bisa menemui rintangan sehingga perlu kerja keras.', percintaan: 'Cocok dengan neptu 9 atau 14 seperti Senin Legi, Rabu Pon, Sabtu Legi, Minggu Wage, Minggu Pahing.', masaDepan: 'Hari buruk Jumat Kliwon; hari baik Sabtu Pahing, Minggu Pon, Senin Wage, Selasa Kliwon, Rabu Legi.', sumber: ['https://katadata.co.id/lifestyle/varia/665562fcee679/weton-selasa-pon-gambaran-watak-karier-percintaan-dan-rezeki'] },
  { weton: 'Selasa Wage', hari: 'Selasa', pasaran: 'Wage', neptu: 7, watak: 'Berwatak Lakuning Bumi dan Mantri Sinaroja: sabar, berwibawa, suka mengalah dan melindungi, penyayang dan pemaaf; namun kurang teratur dan kurang peka lingkungan.', karir: 'Cocok menjadi karyawan/bawahan seperti PNS, polisi, tentara, karyawan swasta, buruh dan petani; teladan dalam menjalankan perintah.', rejeki: 'Neptu terkecil (7) sehingga sering hadapi tantangan finansial; namun gigih dan mampu bangkit; peruntungan nasib berubah setiap 6 tahun.', percintaan: 'Cocok dengan neptu 7, 12 atau 17 seperti Sabtu Kliwon, Kamis Pahing, Kamis Wage, Rabu Legi, Minggu Pon, Senin Kliwon, Selasa Pahing dan Selasa Wage.', masaDepan: 'Rezeki seperti aliran sungai kadang deras kadang surut; puncak kestabilan sekitar usia 55-60 tahun.', sumber: ['https://www.orami.co.id/magazine/weton-selasa-wage'] },
  { weton: 'Selasa Kliwon', hari: 'Selasa', pasaran: 'Kliwon', neptu: 11, watak: 'Disebut Anggoro Kasih/Aras Tuding: tegas, berani, berpendirian kuat, pandai berbicara, setia dan ambisius; namun mudah marah, keras hati, kurang sabar dan sulit diatur.', karir: 'Cocok menjadi pemimpin, pedagang/wirausaha, guru, militer, petani, pengacara; wawasan luas dan komunikasi baik menjadi modal.', rejeki: 'Tergolong cukup/baik namun perlu kerja keras; ada pasang surut terutama usia 30-40 tahun; bisa mapan di usia 40-an.', percintaan: 'Menurut Betaljemur cocok dengan neptu 8, 10 atau 18 seperti Senin Wage, Kamis Legi, Sabtu Wage, Minggu Legi, Senin Pon dan Selasa Legi.', masaDepan: 'Siklus: lahir-12 tahun untung, 13-18 jaya, 19-27 bencana, 28-36 Sri/kemuliaan, 37-45 rezeki.', sumber: ['https://katadata.co.id/lifestyle/varia/6641d96e36f19/weton-selasa-kliwon-ini-gambaran-watak-rezeki-hingga-percintaannya'] },
  { weton: 'Rabu Legi', hari: 'Rabu', pasaran: 'Legi', neptu: 12, watak: 'Tekun, teliti, terampil, berbudi luhur, cekatan, mudah bergaul dan disukai banyak orang; namun bisa labil, mudah tersulut emosi, arogan dan ingin disanjung.', karir: 'Cocok di bidang sosialisasi seperti polisi, guru, TNI, pengacara, PR/humas, serta bertani, dagang beras atau perhiasan, dan pemimpin komunitas.', rejeki: 'Jalur rezeki lancar/berkecukupan (Waseso Segoro); stabil dan pandai mengatur keuangan, namun perlu hemat.', percintaan: 'Cocok dengan neptu 7, 12 atau 17 seperti Senin Kliwon, Selasa Wage, Rabu Legi, Kamis Wage, Kamis Pahing, Sabtu Kliwon, Minggu Pon.', masaDepan: 'Fase: 0-16 Sri, 17-26 Rejeki, 27-39 Untung, 40-52 Jaya; sukses asmara/karier sekitar 30 tahun, puncak sekitar 60 tahun.', sumber: ['https://www.detik.com/jateng/budaya/d-8307117/watak-weton-rabu-legi-pria-dan-wanita-menurut-primbon-jawa-jodoh-rezeki'] },
  { weton: 'Rabu Pahing', hari: 'Rabu', pasaran: 'Pahing', neptu: 16, watak: 'Berwatak Laku Bumi: santun, teduh, tenang dan tidak mudah marah, cerdas dan komunikatif, pekerja keras dan mandiri; namun ambisius dan suka memendam emosi.', karir: 'Cocok di segala bidang terutama guru/dosen, pengusaha, pekerja sosial, konsultan, seniman/kreator konten.', rejeki: 'Potensi besar/berlimpah dan mudah mengais rezeki; membawa keberuntungan ekonomi keluarga, namun perlu ketekunan.', percintaan: 'Cocok dengan neptu 8, 13 atau 18 seperti Selasa Legi, Selasa Wage, Kamis Legi, Sabtu Wage, Minggu Kliwon, Senin Pahing, Sabtu Pahing.', masaDepan: 'Fase: lahir-16 Jaya, 17-26 Bencana, 27-39 Sri, 40-52 Rejeki, 53-63 Untung.', sumber: ['https://www.detik.com/jateng/budaya/d-8443959/rabu-pahing-orangnya-gimana-ini-watak-neptu-jodoh-dan-ramalan-hidupnya'] },
  { weton: 'Rabu Pon', hari: 'Rabu', pasaran: 'Pon', neptu: 14, watak: 'Berwatak Lakuning Rembulan: mampu menenangkan hati orang lain, santun, cerdas dan mudah bergaul; namun posesif, suka dipuji, agak pemalas dan kurang bijak mengambil keputusan.', karir: 'Lapangan kerja luas di bidang yang bisa dilakukan sendiri seperti wirausaha/pedagang serta seni/kreatif; juga guru/dosen dan karyawan.', rejeki: 'Ekonomi cukup dan cenderung baik karena neptu 14 besar; namun perlu disiplin; kemalasan dan emosi menyulitkan rezeki.', percintaan: 'Cocok dengan neptu 10 atau 15 seperti Selasa Pon, Kamis Pon, Rabu Kliwon, Jumat Pahing, Jumat Wage, Minggu Legi; sesama Rabu Pon diprediksi kurang cocok.', masaDepan: null, sumber: ['https://katadata.co.id/lifestyle/varia/6667198219a99/weton-rabu-pon-gambaran-karier-watak-percintaan-dan-rezeki'] },
  { weton: 'Rabu Wage', hari: 'Rabu', pasaran: 'Wage', neptu: 11, watak: 'Berwatak Pancasuda Sumur Sinaba: berwawasan luas, mengayomi, setia, dapat dipercaya, penurut, periang dan cermat mengambil keputusan.', karir: 'Kurang cocok sebagai pedagang/wirausaha karena kurang mandiri; cocok sebagai karyawan yang dapat dipercaya, pengajar dan marketing/administrasi/keuangan.', rejeki: 'Cenderung baik/cukup karena gemi dan pandai berhemat; prihatin di masa kecil dan sukses di masa tua; puncak kesuksesan usia 25-30 tahun.', percintaan: 'Cocok dengan neptu 8, 13 atau 18 seperti Selasa Legi, Kamis Legi, Jumat Pon, Sabtu Wage, Sabtu Pahing, Minggu Kliwon; mudah dapat kekasih.', masaDepan: 'Hari buruk: Sabtu Legi, Sabtu Pahing, Sabtu Wage; hari baik: Minggu Pon, Senin Wage, Selasa Kliwon, Rabu Legi, Kamis Pahing, Jumat Pon.', sumber: ['https://www.orami.co.id/magazine/weton-rabu-wage'] },
  { weton: 'Rabu Kliwon', hari: 'Rabu', pasaran: 'Kliwon', neptu: 15, watak: 'Berwatak Lakuning Srengenge: cerdas, disiplin, pandai bergaul dan berjiwa pemimpin, setia dan dermawan; namun keras kepala, sulit berkompromi dan mudah terperdaya pujian.', karir: 'Cocok menjadi pemimpin/manajer, pengusaha, dosen/guru, bidang hukum, politikus/orator, serta PR/marketing/seni.', rejeki: 'Berkecukupan/stabil namun pasang surut; membaik setelah 25 tahun dengan puncak sekitar 55-60 tahun.', percintaan: 'Cocok dengan neptu 9 atau 14 seperti Minggu Wage, Minggu Pahing, Jumat Kliwon, Rabu Pon dan Sabtu Legi.', masaDepan: 'Stagnan di usia 19-awal 20-an, membaik setelah 25, menurun di usia 30-an hingga awal 40-an, puncak 55-60 tahun.', sumber: ['https://www.orami.co.id/magazine/weton-rabu-kliwon'] },
  { weton: 'Kamis Legi', hari: 'Kamis', pasaran: 'Legi', neptu: 13, watak: 'Mudah tersinggung, mudah marah dan suka membantah (Pahang Ora Pinuju Ing Ati/kuat hati); namun baik hati, penyayang, dermawan, pekerja keras dan bijaksana.', karir: 'Cocok bekerja sendiri/wirausaha, bidang kepemimpinan atau manajemen, serta bidang kreatif seperti seniman, penulis dan desain.', rejeki: 'Garis rezeki baik dan berkembang bertahap dari kerja keras; rezeki kian membaik jika neptu ayah kurang dari 13.', percintaan: 'Cocok dengan neptu 16 atau 11 seperti Kamis Kliwon, Jumat Legi, Rabu Pahing, Senin Pon, Sabtu Pon, Selasa Kliwon dan Rabu Wage.', masaDepan: 'Pangarasan Lakuning Lintang; hari was: Was Telu Sabtu Pon, Was Lima Senin Kliwon, Was Pitu Rabu Pahing, Was Gede Minggu Legi.', sumber: ['https://plus.kapanlagi.com/mengenal-weton-kamis-legi-menurut-primbon-jawa-dari-watak-rezeki-dan-jodoh-292968.html'] },
  { weton: 'Kamis Pahing', hari: 'Kamis', pasaran: 'Pahing', neptu: 17, watak: 'Hati lembut, suka mengalah, sabar dan bisa mengasuh, rajin dan bercita-cita tinggi, cerdas dan pandai berbicara; sisi buruknya tinggi hati dan mudah curiga.', karir: 'Cocok pekerjaan yang mengandalkan otak seperti guru, dokter, akuntan, dosen, peneliti dan seniman; usaha yang cocok berkaitan dengan kayu/tumbuhan.', rejeki: 'Selalu hidup berkecukupan, tidak pernah susah; neptu 17 terbesar kedua setelah Sabtu Pahing; kelahirannya mengangkat derajat rezeki orang tua.', percintaan: 'Cocok dengan neptu 7, 12 dan 17 seperti Senin Kliwon, Selasa Pahing, Selasa Wage, Rabu Legi, Kamis Wage, Kamis Pahing, Sabtu Kliwon dan Minggu Pon.', masaDepan: 'Masa kejayaan usia 24-29, 48-53 dan 78-89; arah kejayaan di utara dan barat; kategori Tibo Lungguh.', sumber: ['https://katadata.co.id/lifestyle/varia/6659556c5cd40/weton-kamis-pahing-gambaran-watak-karier-percintaan-dan-rezeki'] },
  { weton: 'Kamis Pon', hari: 'Kamis', pasaran: 'Pon', neptu: 15, watak: 'Sumur Sinaba: tertutup dan pendiam, namun peduli dan suka menolong, cerdas dan berambisi tinggi, teguh pendirian; berbahaya dan mudah tersulut emosi bila sudah tidak bisa menahan diri.', karir: 'Cocok di bidang keuangan dan ketelitian seperti bendahara, perbankan, akuntan, analisis dan manajemen keuangan; teliti dalam modal sehingga cocok berwirausaha.', rejeki: 'Garis rezeki baik karena sederhana dan pandai mengatur keuangan; rezeki keluarga meningkat jika neptu orang tua di bawah 15.', percintaan: 'Cocok dengan neptu 14 atau 9 seperti Minggu Wage, Rabu Pon, Minggu Pahing, Jumat Kliwon dan Sabtu Legi.', masaDepan: 'Fase terberat usia 37-42 tahun; masa keemasan 55-60 tahun dan mapan 61-67 tahun.', sumber: ['https://www.orami.co.id/magazine/weton-kamis-pon'] },
  { weton: 'Kamis Wage', hari: 'Kamis', pasaran: 'Wage', neptu: 12, watak: 'Lakune Kembang: tenang, ramah, suka menolong, setia dan bertanggung jawab; sisi buruknya sembrono, suka menyepelekan dan tidak dapat berpikir panjang.', karir: 'Cocok sebagai karyawan atau bawahan karena penurut dan loyal seperti administrasi, guru, ASN dan pemasaran; usaha cocok di bidang perairan.', rejeki: 'Rezeki berkembang bertahap dari kerja keras; pandai mencari uang dan hemat; berpeluang berpenghasilan dari lebih dari satu sumber.', percintaan: 'Cocok dengan neptu 9, 10, 11, 14 dan 16; diprediksi harmonis, bahagia, tentram dan langgeng.', masaDepan: 'Termasuk golongan Tulang Wangi; peluang sukses usia 37-42 tahun; peningkatan rezeki usia 49-60 tahun.', sumber: ['https://katadata.co.id/lifestyle/varia/69c869cd21dea/rezeki-weton-kamis-wage-sifat-jodoh-dan-kariernya'] },
  { weton: 'Kamis Kliwon', hari: 'Kamis', pasaran: 'Kliwon', neptu: 16, watak: 'Lakuning Banyu: tenang seperti air, sabar, murah hati, riang dan berempati tinggi, cerdas dan gigih; sisi buruknya sulit menerima pendapat karena ego tinggi serta ambisius.', karir: 'Cocok di banyak bidang terutama tenaga pendidik, penceramah dan pelatih; juga cocok menjadi pemimpin.', rejeki: 'Kehidupan mapan dan berkecukupan, terhindar dari masalah keuangan; Pancasuda Tunggak Semi yang artinya banyak rezeki.', percintaan: 'Cocok dengan neptu 8, 13 dan 18 seperti Senin Pahing, Senin Wage, Kamis Legi, Sabtu Pahing dan Sabtu Wage.', masaDepan: 'Masa Sri lahir-17 tahun, Jaya 18-28 tahun, Cilaka 29-42 tahun, Untung 43-56 tahun, Rezeki 57-70 tahun; hari buruk jatuh pada Kamis Kliwon.', sumber: ['https://www.popbela.com/relationship/single/weton-kamis-kliwon-00-m9g5t-w2frtt'] },
  { weton: 'Jumat Legi', hari: 'Jumat', pasaran: 'Legi', neptu: 11, watak: 'Sanggar Waringin: bisa dipercaya, diandalkan dan mengayomi, sabar dan berhati teduh; sisi buruknya kaku hati dan mudah kecewa.', karir: 'Cocok di bidang pertanian dan peternakan, perdagangan, serta pelayanan seperti guru, konsultan dan pekerja sosial.', rejeki: 'Keuangan kurang baik dan sulit pada awal kehidupan, membaik dengan ketekunan; rezeki tetap datang meski tidak selalu besar.', percintaan: 'Cocok dengan neptu 8, 13 atau 18 seperti Selasa Legi, Kamis Legi, Sabtu Pahing, Sabtu Wage dan Minggu Kliwon.', masaDepan: 'Masa Sri lahir-16 tahun, Rejeki 17-24 tahun, Untung 25-36 tahun, Jaya 37-40 tahun, Bencana 41-60 tahun; kategori Tibo Sri Bejo.', sumber: ['https://pekalongan.suaramerdeka.com/budaya/pr-1812912946/memahami-weton-jumat-legi-perwatakan-pekerjaan-rejeki-dan-jodoh'] },
  { weton: 'Jumat Pahing', hari: 'Jumat', pasaran: 'Pahing', neptu: 15, watak: 'Lakuning Srengenge: mudah bergaul, dermawan dan suka menolong, mandiri, tekun dan setia; sisi buruknya keras hati dan mudah kecewa.', karir: 'Cocok sebagai karyawan profesional, wirausahawan, musisi, komedian dan pemimpin; juga kreator konten karena mudah bergaul.', rejeki: 'Garis rezeki baik, stabil dan cukup sepanjang hidup; rezeki Tunggak Semi yang selalu ada dan bersemi lagi setelah habis.', percintaan: 'Cocok dengan neptu 9 dan 14 seperti Jumat Kliwon, Sabtu Legi, Minggu Pahing, Rabu Pon dan Minggu Wage.', masaDepan: 'Fase kejayaan masa awal sampai 16 tahun, tantangan usia 17-24 tahun, lalu roda kehidupan kembali positif.', sumber: ['https://katadata.co.id/lifestyle/varia/69c86298a82f9/sifat-weton-jumat-pahing-jodoh-karir-dan-rezekinya'] },
  { weton: 'Jumat Pon', hari: 'Jumat', pasaran: 'Pon', neptu: 13, watak: 'Lakuning Lintang: tutur kata baik, rendah hati, berwibawa, bijaksana dan mudah beradaptasi; cenderung pendiam dan introvert.', karir: 'Cocok bekerja di balik layar seperti petani, peneliti dan seniman; cocok bidang perdagangan, pertanian dan bisnis; hindari humas dan sales.', rejeki: 'Rezeki mengalir lancar dan mencukupi; arah keberuntungan mencari rezeki di Barat dan Selatan.', percintaan: 'Cocok dengan neptu 16 atau 11 seperti Kamis Kliwon, Sabtu Pon, Rabu Pahing, Rabu Wage, Jumat Legi, Selasa Kliwon dan Senin Pon.', masaDepan: 'Fase Sri lahir-17 tahun, Rejeki 18-24, Untung 25-36, Bencana 40-60; berpotensi Tibo Dunyo (berkecukupan hingga kaya).', sumber: ['https://www.orami.co.id/magazine/weton-jumat-pon'] },
  { weton: 'Jumat Wage', hari: 'Jumat', pasaran: 'Wage', neptu: 10, watak: 'Aras pepet: disegani, jujur, gemar menolong, tenang dan mudah bergaul; sisi buruknya sombong, suka pamer dan sulit memaafkan pengkhianatan.', karir: 'Tekun dan penurut sehingga cocok sebagai pegawai; paling cocok sebagai peternak atau petani karena penyayang.', rejeki: 'Peruntungan rezeki kurang baik dan rentan kesulitan finansial; kesuksesan diramalkan pada usia 30-35 tahun.', percintaan: 'Cocok dengan neptu 9 dan 14 seperti Sabtu Legi, Minggu Wage, Rabu Pon, Senin Legi, Jumat Kliwon dan Minggu Pahing.', masaDepan: 'Kategori Tibo Pati yang penuh perjuangan; rezeki mudah datang tetapi sulit disimpan.', sumber: ['https://katadata.co.id/lifestyle/varia/66594a3fa1f30/weton-jumat-wage-peruntungan-jodoh-karier-watak-dan-rezeki'] },
  { weton: 'Jumat Kliwon', hari: 'Jumat', pasaran: 'Kliwon', neptu: 14, watak: 'Lakuning Rembulan: mampu menentramkan hati, pandai berbicara, mudah bergaul dan kreatif; sisi buruknya mudah marah dan suka membantah.', karir: 'Cocok di bidang kreativitas, tanggung jawab besar dan kepemimpinan seperti pengusaha, pemimpin organisasi, guru atau konsultan spiritual.', rejeki: 'Cukup sulit mendapat rezeki dan bisa miskin jika malas, tetapi bisa sangat kaya melebihi weton lain jika ulet dan pantang menyerah.', percintaan: 'Cocok dengan neptu 10, 14 atau 15; dikenal setia dan serius tetapi tertutup sehingga butuh pasangan yang sabar.', masaDepan: 'Bejo lahir-16 tahun, jaya 17-24, rintangan 25-36, bahagia 37-48, kelimpahan rezeki 49-63; hari naas Senin Pahing.', sumber: ['https://www.detik.com/jatim/budaya/d-7715571/mengenal-watak-orang-yang-memiliki-weton-jumat-kliwon'] },
  { weton: 'Sabtu Legi', hari: 'Sabtu', pasaran: 'Legi', neptu: 14, watak: 'Mengayomi, mudah bergaul dan beradaptasi, berjiwa besar, loyal dan tegas sehingga cocok menjadi pemimpin; buruknya boros dan emosi sulit ditebak.', karir: 'Cocok di bidang pemasaran atau komunikasi: guru, sales/marketing, konsultan, makelar, PR/MC; berpotensi buka usaha perdagangan/jasa.', rejeki: 'Garis rezeki baik dan mandiri; hidup berkecukupan tidak kekurangan, tetapi harus hemat dan siapkan tabungan darurat.', percintaan: 'Cocok dengan neptu 10 atau 15: Jumat Wage, Minggu Legi, Selasa Pon, Kamis Pon, Rabu Kliwon, Jumat Pahing.', masaDepan: 'Usia 19-24 menyenangkan, 31-36 penurunan, 37-48 kenaikan; naungan Lakuning Rembulan.', sumber: ['https://www.detik.com/jatim/budaya/d-7974629/sifat-baik-rezeki-dan-jodoh-weton-tulang-wangi-sabtu-legi'] },
  { weton: 'Sabtu Pahing', hari: 'Sabtu', pasaran: 'Pahing', neptu: 18, watak: 'Lakuning Geni berapi-api: mudah marah, ingin menang sendiri, ambisius; cerdas, pandai menyimpan rahasia, setia dan bertanggung jawab pada keluarga.', karir: 'Tidak cocok bekerja di bawah perintah; cocok wirausaha, pedagang, pemimpin organisasi, konsultan.', rejeki: 'Neptu tertinggi 18: rezeki besar dan berkecukupan; pembawa rezeki keluarga bila neptu orang tua lebih kecil; arah rezeki Selatan.', percintaan: 'Cocok dengan neptu 11 atau 16: Senin Pon, Selasa Kliwon, Jumat Legi, Rabu Wage, Kamis Kliwon; dikenal menarik lawan jenis.', masaDepan: 'Fase lahir-18 masa kejayaan, 19-30 penuh bencana, 31-45 Sri, 46-60 rezeki; garis nasib Tibo Duno (status sosial tinggi).', sumber: ['https://www.detik.com/jateng/budaya/d-8299652/watak-weton-sabtu-pahing-pria-dan-wanita-menurut-primbon-jawa-jodohnya-apa'] },
  { weton: 'Sabtu Pon', hari: 'Sabtu', pasaran: 'Pon', neptu: 16, watak: 'Penuh tanggung jawab, sabar dan pandai mengelola emosi, tegas dan mandiri; ego besar ingin menjadi pusat perhatian, namun pemaaf dan suka berbagi.', karir: 'Cocok pekerjaan teliti: arsitek, peternak, seniman, ilmuwan; bisnis disarankan berhubungan air seperti budidaya ikan dan pertanian.', rejeki: 'Berpotensi meningkatkan perekonomian keluarga bila neptu ayah tidak lebih dari 16; umumnya stabil.', percintaan: 'Cocok dengan neptu 18, 8 atau 13: Sabtu Pahing, Selasa Legi, Minggu Pon, Selasa Pahing, Senin Kliwon.', masaDepan: 'Puncak kejayaan 55-60 tahun; naungan Satria Wirang dan Tulus Banyu.', sumber: ['https://www.orami.co.id/magazine/weton-sabtu-pon'] },
  { weton: 'Sabtu Wage', hari: 'Sabtu', pasaran: 'Wage', neptu: 13, watak: 'Lakuning Lintang: introvert dan misterius; sabar, tidak pendendam, tegar mandiri dan gemar menolong; buruknya suka membantah, pelupa dan suka kemewahan.', karir: 'Cocok pekerjaan tetap bergaji pasti: polisi, TNI, PNS, karyawan swasta; kurang cocok dipaksa wirausaha sendiri.', rejeki: 'Tunggak semi: mudah keberuntungan dan pandai mencari uang; menaikkan derajat ekonomi keluarga bila neptu ayah/kakak lebih kecil dari 13.', percintaan: 'Cocok dengan neptu 11 atau 16: Jumat Legi, Selasa Kliwon, Senin Pon; setia dan terampil mengatur rumah tangga.', masaDepan: 'Masa jaya usia 61-75 tahun; pancasuda Gedhong (kemakmuran); arah keberuntungan Barat daya dan Timur laut.', sumber: ['https://www.orami.co.id/magazine/weton-sabtu-wage'] },
  { weton: 'Sabtu Kliwon', hari: 'Sabtu', pasaran: 'Kliwon', neptu: 17, watak: 'Lakuning Bumi: pemurah, suka memberi dan melindungi; tangguh, berwibawa dan tahan uji; namun ada catatan malas bekerja dan boros.', karir: 'Cocok guru, penulis, teknisi, wirausahawan, tentara/polisi, pengacara, dosen, pekerja seni, konsultan; rezeki lewat kerja keras dan kepercayaan.', rejeki: 'Neptu 17 tinggi: rezeki besar, stabil bertahap lewat usaha keras; terjauh dari kesusahan; pembawa berkah bagi keluarga.', percintaan: 'Cocok dengan neptu 17, 12 atau 7: Selasa Wage, Selasa Pahing, Kamis Pahing, Senin Kliwon, Minggu Pon.', masaDepan: 'Alur hidup lahir-18 Untung, 19-30 Jaya, 31-45 Bencana, 46-60 Sri, 61-75 Rezeki; pancasuda Satria Wibawa.', sumber: ['https://www.detik.com/jateng/budaya/d-8647736/pangarasan-sabtu-kliwon-lengkap-ramalan-karakter-dan-kehidupannya'] },
]

export interface WukuInfo {
  no: number
  wuku: string
  dewa: string
  watak: string
}

export const WUKU: WukuInfo[] = [
  { no: 1, wuku: 'Sinta', dewa: 'Bathara Yamadipati', watak: 'Watak teguh, berwibawa, sering jadi panutan. Awal siklus pawukon.' },
  { no: 2, wuku: 'Landep', dewa: 'Bathara Mahadewa', watak: 'Tajam pikiran, kritis, pandai berbicara. Cenderung perfeksionis.' },
  { no: 3, wuku: 'Wukir', dewa: 'Bathara Mahayekti', watak: 'Kokoh seperti gunung, tenang, dipercaya orang banyak.' },
  { no: 4, wuku: 'Kurantil', dewa: 'Bathara Langsur', watak: 'Lincah, banyak akal, mudah menyesuaikan diri.' },
  { no: 5, wuku: 'Tolu', dewa: 'Bathara Bayu', watak: 'Lemah lembut, pendiam, namun pendiriannya kuat di dalam.' },
  { no: 6, wuku: 'Gumbreg', dewa: 'Bathara Cakra', watak: 'Tekun, ulet, sabar menghadapi ujian hidup.' },
  { no: 7, wuku: 'Warigalit', dewa: 'Bathara Asmara', watak: 'Penyayang, romantis, mudah jatuh hati. Pintar memikat lawan jenis.' },
  { no: 8, wuku: 'Warigagung', dewa: 'Bathara Maharesi', watak: 'Bijak, dermawan, dihormati orang tua dan tetangga.' },
  { no: 9, wuku: 'Julungwangi', dewa: 'Bathara Sambo', watak: 'Pribadi harum, banyak teman, ramah, suka membantu.' },
  { no: 10, wuku: 'Sungsang', dewa: 'Bathara Gana', watak: 'Berlawanan arus, kadang nekat, namun pemberani dan kreatif.' },
  { no: 11, wuku: 'Galungan', dewa: 'Bathara Kamajaya', watak: 'Mulia, dermawan, sering menjadi pemimpin spiritual.' },
  { no: 12, wuku: 'Kuningan', dewa: 'Bathara Indra', watak: 'Tenang, sopan, rajin beribadah.' },
  { no: 13, wuku: 'Langkir', dewa: 'Bathara Kala', watak: 'Karakter tajam, jujur apa adanya, kadang dianggap keras kepala.' },
  { no: 14, wuku: 'Mandasiya', dewa: 'Bathara Brahma', watak: 'Kreatif, banyak ide, pandai mencipta hal baru.' },
  { no: 15, wuku: 'Julungpujut', dewa: 'Bathara Guritno', watak: 'Pendiam, dalam pikiran, suka merenung dan menulis.' },
  { no: 16, wuku: 'Pahang', dewa: 'Bathara Tantra', watak: 'Tegas, suka berterus terang, kadang dianggap blak-blakan.' },
  { no: 17, wuku: 'Kuruwelut', dewa: 'Bathara Wisnu', watak: 'Pelindung, menjaga keadilan, sering jadi penengah konflik.' },
  { no: 18, wuku: 'Marakeh', dewa: 'Bathara Surenggana', watak: 'Tegar, tidak mudah menyerah, sering diuji kesabaran.' },
  { no: 19, wuku: 'Tambir', dewa: 'Bathara Siwa', watak: 'Hidup serba berlawanan; mudah berubah pendirian namun pintar.' },
  { no: 20, wuku: 'Medangkungan', dewa: 'Bathara Basuki', watak: 'Hidup sederhana, suka berbagi, namun rezeki naik turun.' },
  { no: 21, wuku: 'Maktal', dewa: 'Bathara Sakri', watak: 'Kuat fisik dan tekad. Bekerja keras tanpa banyak bicara.' },
  { no: 22, wuku: 'Wuye', dewa: 'Bathara Kuwera', watak: 'Pandai mengatur keuangan; hemat dan teliti.' },
  { no: 23, wuku: 'Manahil', dewa: 'Bathara Citragotra', watak: 'Suka membantu sesama; mudah bergaul lintas kalangan.' },
  { no: 24, wuku: 'Prangbakat', dewa: 'Bathara Bisma', watak: 'Pemberani, suka tantangan, kadang cepat marah namun cepat reda.' },
  { no: 25, wuku: 'Bala', dewa: 'Bathari Durga', watak: 'Penuh tenaga, pemberani, dan tahan banting. Mandiri dan kuat, tetapi kadang mudah terlibat perselisihan.' },
  { no: 26, wuku: 'Wugu', dewa: 'Bathara Singajalma', watak: 'Cerdas, pandai bicara, dan berwawasan luas. Bisa menjadi sumber ilmu, tetapi kadang suka membantah.' },
  { no: 27, wuku: 'Wayang', dewa: 'Bathari Sri', watak: 'Penuh pesona, berbudi halus, dan membawa ketenteraman. Disukai banyak orang dan murah rezeki.' },
  { no: 28, wuku: 'Kulawu', dewa: 'Bathara Sadana', watak: 'Berwibawa, mapan, dan pandai mengelola. Tenang menghadapi masalah dan dihormati.' },
  { no: 29, wuku: 'Dukut', dewa: 'Bathara Sakri', watak: 'Sederhana namun tahan banting; bertahan di kondisi sulit.' },
  { no: 30, wuku: 'Watugunung', dewa: 'Bathara Antaboga', watak: 'Karakter teguh seperti batu. Penutup siklus — sering dianggap sakral.' },
]

export interface JodohInfo {
  kategori: string
  angka: number[]
  makna: string
}

export const JODOH: JodohInfo[] = [
  { kategori: 'PEGAT', angka: [1, 9, 10, 18, 19, 27, 28, 36], makna: 'Rawan masalah dalam rumah tangga (ekonomi, kuasa, atau pihak ketiga). Perlu usaha ekstra, komunikasi dan kesabaran.' },
  { kategori: 'RATU', angka: [2, 11, 20, 29], makna: 'Harmonis dan disegani lingkungan, saling melengkapi, rezeki mengalir lancar.' },
  { kategori: 'JODOH', angka: [3, 12, 21, 30], makna: 'Cocok dan saling menerima kelebihan-kekurangan; rumah tangga tenang dan setia sampai tua.' },
  { kategori: 'TOPO', angka: [4, 13, 22, 31], makna: 'Susah di awal pernikahan, bahagia di akhir setelah melewati masa sulit.' },
  { kategori: 'TINARI', angka: [5, 14, 23, 32], makna: 'Mudah mencari rezeki, beruntung dan sering mendapat berkah.' },
  { kategori: 'PADU', angka: [6, 15, 24, 33], makna: 'Sering bertengkar karena hal sepele, namun tidak sampai berujung perceraian.' },
  { kategori: 'SUJANAN', angka: [7, 16, 25, 34], makna: 'Rawan cemburu dan perselingkuhan dari salah satu pihak; butuh kepercayaan dan transparansi.' },
  { kategori: 'PESTHI', angka: [8, 17, 26, 35], makna: 'Rukun, tenteram dan damai sampai tua; masalah tidak merusak keharmonisan.' },
]

// --- Kalkulasi terverifikasi ---
// Anchor pasaran: 1 Sep 2026 = Selasa Legi. Anchor wuku: Minggu 3 Mei 2026 = awal Tolu.
// Terverifikasi: 17 Agu 1945 = Jumat Legi ✓, 1 Sep 2026 = Selasa Legi ✓,
//   18 Sep 2026 = Jumat Pon ✓, pekan 20–26 Sep 2026 = Bala (ke-25) ✓.

const ANCHOR = Date.UTC(2026, 8, 1) // 1 Sep 2026 = Selasa Legi
const ANCHOR_WUKU_SUN = Date.UTC(2026, 4, 3) // Minggu 3 Mei 2026 = awal Tolu (index 4)
const TOLU_INDEX = 4
const DAY = 86400000

export interface HasilWeton {
  tanggal: string
  hari: string
  pasaran: string
  weton: string
  neptu: number
  wuku: string
  wukuNo: number
  info: WetonInfo
  wukuInfo: WukuInfo
}

export function hitungWeton(y: number, m: number, d: number): HasilWeton {
  const t = Date.UTC(y, m - 1, d)
  const dt = new Date(t)
  const hari = HARI_LIST[(dt.getUTCDay() + 6) % 7]
  const pasaran = PASARAN_LIST[(((t - ANCHOR) / DAY) % 5 + 5) % 5]
  const neptu = NEPTU_HARI[hari] + NEPTU_PASARAN[pasaran]
  const wukuIdx = (TOLU_INDEX + Math.floor((t - ANCHOR_WUKU_SUN) / DAY / 7)) % 30
  const wukuNo = ((wukuIdx % 30) + 30) % 30
  const weton = `${hari} ${pasaran}`
  return {
    tanggal: `${d}-${m}-${y}`,
    hari,
    pasaran,
    weton,
    neptu,
    wuku: WUKU[wukuNo].wuku,
    wukuNo: wukuNo + 1,
    info: WETON.find((w) => w.weton === weton)!,
    wukuInfo: WUKU[wukuNo],
  }
}

export interface HasilJodoh {
  total: number
  kategori: string
  makna: string
}

export function hitungJodoh(neptu1: number, neptu2: number): HasilJodoh {
  const total = neptu1 + neptu2
  const kat = JODOH.find((j) => j.angka.includes(total))!
  return { total, kategori: kat.kategori, makna: kat.makna }
}

// Weton yang neptunya menghasilkan kategori BAIK bila dipasangkan dengan neptu target
export function pasanganIdeal(neptu: number): { kategori: string; neptus: number[]; weton: string[] }[] {
  const baik = ['RATU', 'JODOH', 'TINARI', 'PESTHI']
  return baik.map((kat) => {
    const info = JODOH.find((j) => j.kategori === kat)!
    const neptus = info.angka.map((t) => t - neptu).filter((n) => n >= 7 && n <= 18)
    const weton = WETON.filter((w) => neptus.includes(w.neptu)).map((w) => w.weton)
    return { kategori: kat, neptus: Array.from(new Set(neptus)), weton }
  })
}
