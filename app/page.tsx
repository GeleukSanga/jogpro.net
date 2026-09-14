'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Flame, Menu, Pencil, ShoppingBag, Sparkles, X, Zap } from 'lucide-react'
import { fbqTrack } from '@/lib/fbPixel'

const products = [
  {
    id: 'neon-drip',
    name: 'Neon Drip',
    kind: 'Desain',
    price: 'Rp 20.000',
    image: '/neon-drip-black.png',
    heroImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_42_05%20PM-2gUW7il51MvD8mqs27gsvaugVsVJ6C.png',
    tag: 'Best seller',
    accent: 'violet',
    description: 'Case 3D dengan tekstur soft-touch dan desain neon yang standout.',
  },
  {
    id: 'dragon-duo',
    name: 'Dragon Duo',
    kind: 'Desain',
    price: 'Rp 20.000',
    image: '/dragon-duo-black.png',
    tag: 'Limited',
    accent: 'blue',
    description: 'Relief naga 3D untuk statement piece yang ikonik.',
    objectPosition: '50% 20%',
  },
  {
    id: 'your-name',
    name: 'Your Name',
    kind: 'Custom',
    price: 'Rp 25.000',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_49_25%20PM-vYnuJFMY7Ne117XB3x1tj5GZsxzgkL.png',
    tag: 'Custom',
    accent: 'lime',
    description: 'Tambahkan nama kamu langsung ke case.',
  },
  {
    id: 'gothic-guardian',
    name: 'Gothic Guardian',
    kind: 'Desain',
    price: 'Rp 20.000',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_43_40%20PM-LSxDzqXc7EloDpwQ906cQvdFUA14ie.png',
    tag: 'New drop',
    accent: 'red',
    description: 'Detail relief gelap, dibuat untuk koleksi yang beda.',
  },
  {
    id: 'koi',
    name: 'Koi',
    kind: 'Desain',
    price: 'Rp 20.000',
    image: '/koi-v2.png',
    tag: 'New',
    accent: 'orange',
    description: 'Ikan koi elegan dengan detail sirip yang dinamis.',
  },
  {
    id: 'monkey-freak',
    name: 'Monkey Freak',
    kind: 'Desain',
    price: 'Rp 20.000',
    image: '/monkey-freak-v2.png',
    tag: 'Trendy',
    accent: 'cyan',
    description: 'Monyet liar dengan ekspresi freak yang unik.',
  },
  {
    id: 'o-sign',
    name: 'O-Sign',
    kind: 'Desain',
    price: 'Rp 20.000',
    image: '/2025-08-31_4972dd651a843.png.png',
    tag: 'Premium',
    accent: 'gold',
    description: 'Desain simbol O dengan aksen metalik yang elegan.',
  },
  {
    id: 'viking-skull',
    name: 'Viking Skull',
    kind: 'Desain',
    price: 'Rp 20.000',
    image: '/viking-skull-v2.png',
    tag: 'Bold',
    accent: 'dark',
    description: 'Tengkorak Viking dengan detail helm yang garang.',
  },
  {
    id: 'hawaii',
    name: 'Hawaii',
    kind: 'Desain',
    price: 'Rp 20.000',
    image: '/hawaii-v2.png',
    tag: 'Exclusive',
    accent: 'green',
    description: 'Nuansa tropis Hawaii dengan motif bunga yang ceria.',
  },
  {
    id: 'old-skull',
    name: 'Old Skull',
    kind: 'Desain',
    price: 'Rp 20.000',
    image: '/2c3f11fc0a5b0e14.jpg.png',
    tag: 'Hot',
    accent: 'red',
    description: 'Tengkorak klasik dengan sentuhan vintage yang keren.',
  },
  {
    id: 'gator',
    name: 'Gator',
    kind: 'Desain',
    price: 'Rp 20.000',
    image: '/gator-v2.png',
    tag: 'Space',
    accent: 'purple',
    description: 'Buaya Gator dengan desain agresif yang maskulin.',
  },
]

const filters = ['Semua', 'Desain', 'Custom']

export default function Page() {
  const [filter, setFilter] = useState('Semua')
  const [customName, setCustomName] = useState('NAMAMU')
  const [menuOpen, setMenuOpen] = useState(false)

  const visibleProducts = useMemo(() => filter === 'Semua' ? products : products.filter((product) => product.kind === filter), [filter])

  useEffect(() => {
    // ViewContent tanpa value - hanya Purchase yang pakai value
    visibleProducts.forEach((p) => {
      fbqTrack('ViewContent', {
        content_name: p.name,
        content_ids: [p.id],
        content_type: 'product',
      })
    })
  }, [visibleProducts])

  function buy(product: typeof products[number]) {
    fbqTrack('InitiateCheckout', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      num_items: 1,
    })
    fbqTrack('AddToCart', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
    })
    const url = product.kind === 'Custom'
      ? `/checkout?product=${product.id}&name=${encodeURIComponent(customName)}`
      : `/checkout?product=${product.id}`
    window.location.href = url
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfbf8] text-[#171717]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-70" aria-hidden="true">
        <div className="orb orb-lime left-[-8%] top-[8%]" />
        <div className="orb orb-violet right-[-8%] top-[30%]" />
      </div>

      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <a href="#top" className="flex items-center gap-2.5 font-black tracking-[-0.06em] text-xl"><span className="grid size-8 place-items-center rounded-full bg-[#171717] text-[#d7ff3f]"><Flame className="size-4 fill-current" /></span>JOGPRO</a>
        <div className="hidden items-center gap-8 text-sm font-semibold text-[#666] md:flex"><a href="#shop" className="transition hover:text-[#171717]">Shop</a><a href="#custom" className="transition hover:text-[#171717]">Custom</a></div>
        <div className="flex items-center gap-3"><button aria-label="Keranjang" className="relative rounded-full border border-black/10 bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5"><ShoppingBag className="size-4" /><span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[#d7ff3f] text-[9px] font-black">0</span></button><button aria-label="Buka menu" className="rounded-full border border-black/10 p-2.5 md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}</button></div>
      </nav>
      {menuOpen && <div className="relative z-20 flex flex-col gap-4 border-y border-black/10 bg-white px-6 py-5 text-sm font-semibold md:hidden"><a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a><a href="#custom" onClick={() => setMenuOpen(false)}>Custom</a></div>}

      <section id="top" className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-12 sm:px-8 md:grid-cols-[1fr_0.9fr] md:pb-28 md:pt-20 lg:px-10">
        <div className="max-w-xl"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] shadow-sm"><Sparkles className="size-3 text-[#ef4b32]" /> Accessorize your spark</div><h1 className="text-balance text-[clamp(3.7rem,8vw,7.7rem)] font-black leading-[0.84] tracking-[-0.085em]">Bikin Korekmu<br /><span className="text-[#ef4b32]">Jadi Berbeda.</span></h1><p className="mt-7 max-w-md text-base leading-7 text-[#686866]">Korek dengan case 3D unik yang bikin benda sehari-hari terasa lebih personal. Pilih desain favoritmu atau buat versi custom dengan namamu sendiri.</p><div className="mt-8 flex flex-wrap items-center gap-4"><a href="#shop" className="group inline-flex items-center gap-3 rounded-full bg-[#171717] px-5 py-3.5 text-sm font-bold text-white transition hover:scale-[1.03]">Lihat koleksi <ArrowRight className="size-4 transition group-hover:translate-x-1" /></a><span className="text-xs font-black uppercase tracking-[0.16em] text-[#878782]">Small flame. Big energy.</span></div></div>
        <div className="hero-product-wrap"><div className="hero-ring ring-one" /><div className="hero-ring ring-two" /><div className="floating-chip chip-one"><Zap className="size-3 fill-current" /> tactile finish</div><div className="floating-chip chip-two">01 / 04</div><div className="hero-product"><img src={products[0].heroImage} alt="Case Neon Drip dengan korek api" /><div className="shine" /></div></div>
      </section>

      <section id="shop" className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10"><div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#ef4b32]">The collection</p><h2 className="text-4xl font-black tracking-[-0.06em] sm:text-5xl">Pilih Gaya Kamu.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#666]">Case korek 3D dengan desain unik yang dibuat untuk dipakai setiap hari.</p></div><div className="flex flex-wrap gap-2">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${filter === item ? 'bg-[#171717] text-white' : 'border border-black/10 bg-white text-[#777] hover:border-black/30'}`}>{item}</button>)}</div></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{visibleProducts.map((product) => <article key={product.id} className="product-card group"><div className={`product-image accent-${product.accent}`}><span className="product-tag">{product.tag}</span><img src={product.image} alt={`${product.name}, ${product.kind}`} style={product.objectPosition ? { objectPosition: product.objectPosition } : undefined} /><div className="card-shine" /></div><div className="flex items-start justify-between gap-3 pt-4"><div><p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#999]">{product.kind}</p><h3 className="text-lg font-black tracking-[-0.04em]">{product.name}</h3><p className="mt-1 text-xs leading-5 text-[#777]">{product.description}</p></div><p className="whitespace-nowrap text-sm font-black">{product.price}</p></div><button onClick={() => buy(product)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white py-3 text-xs font-black transition hover:bg-[#171717] hover:text-white">{product.kind === 'Custom' ? 'Custom Sekarang' : 'Pilih Punyamu'} <ArrowRight className="size-3.5" /></button></article>)}</div></section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10"><div className="rounded-[2rem] border border-black/10 bg-white/75 px-6 py-10 shadow-sm sm:px-10 sm:py-12"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#ef4b32]">Built different</p><h2 className="text-4xl font-black tracking-[-0.06em] sm:text-5xl">Kenapa JOGPRO?</h2></div><p className="max-w-xs text-sm leading-6 text-[#777]">Case kecil dengan karakter besar untuk menemani keseharianmu.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['01', '3D Printed', 'Dibuat dengan detail dan karakter yang berbeda.'], ['02', 'Custom Nama', 'Bikin case yang benar-benar personal.'], ['03', 'Desain Unik', 'Bukan case korek biasa yang pasaran.'], ['04', 'Made for Everyday', 'Ringan, praktis, dan dibuat untuk dipakai setiap hari.']].map(([number, title, description]) => <div key={number} className="rounded-2xl border border-black/10 bg-[#fbfbf8] p-5"><p className="text-2xl font-black tracking-[-0.06em] text-[#ef4b32]">{number}</p><h3 className="mt-8 text-base font-black tracking-[-0.04em]">{title}</h3><p className="mt-2 text-xs leading-5 text-[#777]">{description}</p></div>)}</div></div></section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10"><div className="rounded-[2rem] bg-[#171717] px-6 py-10 text-white sm:px-10 sm:py-12"><div className="max-w-2xl"><p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#d7ff3f]">Simple process</p><h2 className="text-4xl font-black tracking-[-0.06em] sm:text-5xl">Cara Pesan</h2><p className="mt-4 max-w-lg text-sm leading-6 text-white/60">Pilih desain, custom nama, lalu tunggu sampai case JOGPRO siap dipakai.</p></div><div className="mt-10 grid gap-4 md:grid-cols-3">{[['01', 'PILIH DESAIN', 'Pilih case yang paling cocok dengan gaya kamu.'], ['02', 'CUSTOM', 'Untuk produk custom, masukkan nama yang ingin dicetak pada case.'], ['03', 'TERIMA & PAKAI', 'Kami buat dan kirim. Setelah sampai, pasangkan dengan korekmu dan siap dipakai.']].map(([number, title, description]) => <div key={number} className="rounded-2xl border border-white/15 bg-white/[0.06] p-5"><p className="text-2xl font-black tracking-[-0.06em] text-[#d7ff3f]">{number}</p><h3 className="mt-8 text-sm font-black tracking-[0.08em]">{title}</h3><p className="mt-3 text-xs leading-5 text-white/60">{description}</p></div>)}</div><a href="#shop" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#d7ff3f] px-5 py-3.5 text-xs font-black text-[#171717] transition hover:scale-[1.03]">LIHAT KOLEKSI <ArrowRight className="size-4" /></a></div></section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10"><div className="grid gap-10 rounded-[2rem] border border-black/10 bg-white/75 px-6 py-10 shadow-sm sm:px-10 sm:py-12 lg:grid-cols-[0.75fr_1.25fr] lg:px-14"><div><p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#ef4b32]">Need to know</p><h2 className="text-4xl font-black tracking-[-0.06em] sm:text-5xl">Punya Pertanyaan?</h2><p className="mt-4 max-w-xs text-sm leading-6 text-[#777]">Jawaban singkat untuk hal-hal yang paling sering ditanyakan tentang JOGPRO.</p><a href="#shop" className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#171717] px-5 py-3.5 text-xs font-black text-white transition hover:scale-[1.03]">LIHAT SEMUA KOLEKSI <ArrowRight className="size-4" /></a></div><div className="divide-y divide-black/10">{[['Apakah koreknya sudah termasuk?', 'Ya, sudah termasuk. Setiap pembelian JOGPRO sudah mendapatkan korek + case JOGPRO, jadi kamu bisa langsung menggunakannya setelah pesanan diterima.'], ['Korek seperti apa yang saya dapat?', 'Kamu akan mendapatkan korek yang sudah dipasangkan dengan case JOGPRO sesuai desain yang kamu pilih.'], ['Apakah saya bisa memilih desain case?', 'Bisa. Pilih desain yang kamu suka dari koleksi JOGPRO yang tersedia.'], ['Bisa custom nama?', 'Bisa. Pilih produk Your Name, lalu masukkan nama yang ingin dicetak pada case kamu.'], ['Berapa lama proses pesanan?', 'Karena case JOGPRO dibuat menggunakan 3D printing, setiap pesanan membutuhkan waktu untuk diproses sebelum dikirim. Estimasi proses dan pengiriman akan mengikuti informasi yang tertera saat checkout.'], ['Apakah case bisa dilepas dan dipasang kembali?', 'Bisa. Case dirancang agar dapat digunakan bersama korek yang kompatibel dan dapat dilepas saat diperlukan.'], ['Apakah bisa request desain atau warna khusus?', 'Untuk saat ini, gunakan desain dan pilihan warna yang tersedia di website. Jika memiliki request khusus, kamu dapat menghubungi JOGPRO terlebih dahulu untuk mengecek kemungkinan produksinya.'], ['Apakah JOGPRO cocok untuk hadiah?', 'Banget. Terutama versi Your Name — kamu bisa membuat case dengan nama, panggilan, atau nama orang yang ingin kamu beri.'], ['Bagaimana cara merawat JOGPRO?', 'Gunakan seperti korek pada umumnya dan hindari panas berlebih atau kondisi yang dapat merusak material case. Bersihkan case dengan lembut jika diperlukan.']].map(([question, answer]) => <details key={question} className="group py-5 first:pt-0 last:pb-0"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-black tracking-[-0.02em] marker:hidden"><span>{question}</span><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#d7ff3f] text-lg font-normal transition group-open:rotate-45">+</span></summary><p className="max-w-xl pt-3 pr-10 text-xs leading-6 text-[#777]">{answer}</p></details>)}</div></div></section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10"><div className="relative grid overflow-hidden rounded-[2rem] bg-[#d7ff3f] px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-16"><div className="relative z-10 flex flex-col items-start justify-center"><p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#171717]/55">Final CTA — JOGPRO</p><h2 className="max-w-md text-5xl font-black leading-[0.88] tracking-[-0.08em] sm:text-7xl">Korekmu.<br />Gayamu.</h2><p className="mt-6 max-w-md text-sm leading-6 text-black/60">Bukan cuma korek biasa. Pilih desain JOGPRO yang paling cocok buat kamu — atau buat versi custom dengan namamu sendiri.</p><a href="#shop" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#171717] px-5 py-3.5 text-xs font-black text-white transition hover:scale-[1.03]">PILIH CASE-MU <ArrowRight className="size-4" /></a><p className="mt-7 text-xs font-black uppercase tracking-[0.16em] text-black/45">Small flame. Big energy.</p></div><div className="relative mt-10 min-h-[290px] sm:min-h-[370px] lg:mt-0"><div className="absolute inset-0 rounded-full bg-white/35 blur-3xl" /><div className="final-product final-product-one"><img src={products[0].image} alt="Case JOGPRO Neon Drip" /></div><div className="final-product final-product-two"><img src={products[1].image} alt="Case JOGPRO Dragon Duo" /></div><div className="final-product final-product-three"><img src={products[2].image} alt="Case JOGPRO Your Name" /></div><div className="final-product final-product-four"><img src={products[3].image} alt="Case JOGPRO Gothic Guardian" /></div></div></div></section>

      <section id="custom" className="relative z-10 mx-5 mb-24 overflow-hidden rounded-[2rem] bg-[#d7ff3f] px-6 py-12 sm:mx-8 sm:px-12 lg:mx-auto lg:max-w-7xl lg:px-20"><div className="absolute -right-10 -top-20 size-64 rounded-full border-[24px] border-[#171717]/[0.06]" /><div className="relative grid items-center gap-10 md:grid-cols-[1fr_0.8fr]"><div><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#171717] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#d7ff3f]"><Pencil className="size-3" /> Made for you</div><h2 className="max-w-lg text-4xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">Put your name<br />on the flame.</h2><div className="mt-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-black/50">Korek + Custom Case</p><p className="text-3xl font-black tracking-[-0.06em]">Rp25.000</p></div><p className="mt-4 max-w-sm text-sm leading-6 text-black/60">Tulis nama, nickname, atau inside joke kamu. Kami emboss langsung ke case hitam bertekstur.</p><div className="mt-7 flex max-w-sm items-center rounded-full bg-white p-1.5 shadow-sm"><input value={customName} onChange={(event) => setCustomName(event.target.value.toUpperCase().slice(0, 12))} aria-label="Nama untuk case custom" className="min-w-0 flex-1 bg-transparent px-4 text-sm font-black outline-none" placeholder="TULIS NAMAMU" /><button onClick={() => buy(products[2])} className="rounded-full bg-[#171717] px-4 py-3 text-xs font-black text-white">CUSTOM SEKARANG</button></div></div><div className="custom-preview"><div className="custom-case"><span>{customName || 'NAMAMU'}</span><div className="custom-lighter" /></div><p className="mt-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-black/40">preview engraving</p></div></div></section>

      <footer className="border-t border-black/10 px-5 py-8 text-xs text-[#888] sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="font-black tracking-[-0.04em] text-[#171717]">JOGPRO</p><p className="mt-2 max-w-xs leading-5">Dikirim dari BSD, Tangerang Regency, Banten.</p></div><p>© 2026 Jogpro Studio. Handle with care.</p></div></footer>

    </main>
  )
}
