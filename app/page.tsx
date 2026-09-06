'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Flame, Menu, Pencil, ShoppingBag, Sparkles, X, Zap } from 'lucide-react'

const products = [
  {
    id: 'neon-drip',
    name: 'Neon Drip',
    kind: 'Case motif',
    price: 'Rp 20.000',
    image: '/neon-drip-black.png',
    heroImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_42_05%20PM-2gUW7il51MvD8mqs27gsvaugVsVJ6C.png',
    tag: 'Best seller',
    accent: 'violet',
    description: 'Tekstur soft-touch dengan karakter neon yang berani.',
  },
  {
    id: 'dragon-duo',
    name: 'Dragon Duo',
    kind: 'Case motif',
    price: 'Rp 20.000',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_45_40%20PM-tJyA6aPHDrHuxAPCtmKQ090M8rwsUk.png',
    tag: 'Limited',
    accent: 'blue',
    description: 'Relief naga 3D untuk statement piece yang ikonik.',
    objectPosition: '50% 20%',
  },
  {
    id: 'your-name',
    name: 'Your Name',
    kind: 'Case custom',
    price: 'Rp 25.000',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_49_25%20PM-vYnuJFMY7Ne117XB3x1tj5GZsxzgkL.png',
    tag: 'Custom',
    accent: 'lime',
    description: 'Nama kamu, di-emboss langsung ke case favoritmu.',
  },
  {
    id: 'gothic-guardian',
    name: 'Gothic Guardian',
    kind: 'Case motif',
    price: 'Rp 20.000',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_43_40%20PM-LSxDzqXc7EloDpwQ906cQvdFUA14ie.png',
    tag: 'New drop',
    accent: 'red',
    description: 'Detail relief gelap, dibuat untuk koleksi yang beda.',
  },
]

const filters = ['Semua', 'Case motif', 'Case custom']

export default function Page() {
  const [filter, setFilter] = useState('Semua')
  const [customName, setCustomName] = useState('NAMAMU')
  const [menuOpen, setMenuOpen] = useState(false)

  const visibleProducts = useMemo(() => filter === 'Semua' ? products : products.filter((product) => product.kind === filter), [filter])

  function buy(product: typeof products[number]) {
    const url = product.kind === 'Case custom'
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
        <div className="max-w-xl"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] shadow-sm"><Sparkles className="size-3 text-[#ef4b32]" /> Accessorize your spark</div><h1 className="text-balance text-[clamp(3.7rem,8vw,7.7rem)] font-black leading-[0.84] tracking-[-0.085em]">Small flame.<br /><span className="text-[#ef4b32]">Big energy.</span></h1><p className="mt-7 max-w-md text-base leading-7 text-[#686866]">Korek api dan case yang bikin benda sehari-hari terasa lebih personal. Dirancang untuk tampil beda, dibuat untuk dipakai setiap hari.</p><div className="mt-8 flex flex-wrap items-center gap-3"><a href="#shop" className="group inline-flex items-center gap-3 rounded-full bg-[#171717] px-5 py-3.5 text-sm font-bold text-white transition hover:scale-[1.03]">Lihat koleksi <ArrowRight className="size-4 transition group-hover:translate-x-1" /></a><span className="text-xs font-semibold text-[#878782]">Pengiriman dihitung saat checkout</span></div></div>
        <div className="hero-product-wrap"><div className="hero-ring ring-one" /><div className="hero-ring ring-two" /><div className="floating-chip chip-one"><Zap className="size-3 fill-current" /> tactile finish</div><div className="floating-chip chip-two">01 / 04</div><div className="hero-product"><img src={products[0].heroImage} alt="Case Neon Drip dengan korek api" /><div className="shine" /></div></div>
      </section>

      <section id="shop" className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10"><div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#ef4b32]">The collection</p><h2 className="text-4xl font-black tracking-[-0.06em] sm:text-5xl">Pick your personality.</h2></div><div className="flex flex-wrap gap-2">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${filter === item ? 'bg-[#171717] text-white' : 'border border-black/10 bg-white text-[#777] hover:border-black/30'}`}>{item}</button>)}</div></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{visibleProducts.map((product) => <article key={product.id} className="product-card group"><div className={`product-image accent-${product.accent}`}><span className="product-tag">{product.tag}</span><img src={product.image} alt={`${product.name}, ${product.kind}`} style={product.objectPosition ? { objectPosition: product.objectPosition } : undefined} /><div className="card-shine" /></div><div className="flex items-start justify-between gap-3 pt-4"><div><p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#999]">{product.kind}</p><h3 className="text-lg font-black tracking-[-0.04em]">{product.name}</h3><p className="mt-1 text-xs leading-5 text-[#777]">{product.description}</p></div><p className="whitespace-nowrap text-sm font-black">{product.price}</p></div><button onClick={() => buy(product)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white py-3 text-xs font-black transition hover:bg-[#171717] hover:text-white">Checkout <ArrowRight className="size-3.5" /></button></article>)}</div></section>

      <section id="custom" className="relative z-10 mx-5 mb-24 overflow-hidden rounded-[2rem] bg-[#d7ff3f] px-6 py-12 sm:mx-8 sm:px-12 lg:mx-auto lg:max-w-7xl lg:px-20"><div className="absolute -right-10 -top-20 size-64 rounded-full border-[24px] border-[#171717]/[0.06]" /><div className="relative grid items-center gap-10 md:grid-cols-[1fr_0.8fr]"><div><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#171717] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#d7ff3f]"><Pencil className="size-3" /> Made for you</div><h2 className="max-w-lg text-4xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">Put your name<br />on the flame.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-black/60">Tulis nama, nickname, atau inside joke kamu. Kami emboss langsung ke case hitam bertekstur.</p><div className="mt-7 flex max-w-sm items-center rounded-full bg-white p-1.5 shadow-sm"><input value={customName} onChange={(event) => setCustomName(event.target.value.toUpperCase().slice(0, 12))} aria-label="Nama untuk case custom" className="min-w-0 flex-1 bg-transparent px-4 text-sm font-black outline-none" placeholder="TULIS NAMAMU" /><button onClick={() => buy(products[2])} className="rounded-full bg-[#171717] px-4 py-3 text-xs font-bold text-white">Coba sekarang</button></div></div><div className="custom-preview"><div className="custom-case"><span>{customName || 'NAMAMU'}</span><div className="custom-lighter" /></div><p className="mt-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-black/40">preview engraving</p></div></div></section>

      <footer className="border-t border-black/10 px-5 py-8 text-xs text-[#888] sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="font-black tracking-[-0.04em] text-[#171717]">JOGPRO</p><p className="mt-2 max-w-xs leading-5">Dikirim dari BSD, Tangerang Regency, Banten.</p></div><p>© 2026 Jogpro Studio. Handle with care.</p></div></footer>

    </main>
  )
}
