'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Flame, Loader2, MapPin, Search, Truck } from 'lucide-react'

const products = {
  'neon-drip': { id: 'neon-drip', name: 'Neon Drip', kind: 'case_motif', price: 20000, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_42_05%20PM-2gUW7il51MvD8mqs27gsvaugVsVJ6C.png', colors: ['Black', 'White', 'Beige'] },
  'dragon-duo': { id: 'dragon-duo', name: 'Dragon Duo', kind: 'case_motif', price: 20000, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_45_40%20PM-tJyA6aPHDrHuxAPCtmKQ090M8rwsUk.png', colors: ['Black', 'White', 'Beige'] },
  'your-name': { id: 'your-name', name: 'Your Name', kind: 'case_custom', price: 25000, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_49_25%20PM-vYnuJFMY7Ne117XB3x1tj5GZsxzgkL.png', colors: ['Black', 'White', 'Beige'] },
  'gothic-guardian': { id: 'gothic-guardian', name: 'Gothic Guardian', kind: 'case_motif', price: 20000, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_43_40%20PM-LSxDzqXc7EloDpwQ906cQvdFUA14ie.png', colors: ['Black', 'White', 'Beige'] },
} as const

interface City { id: string | number; name: string; subdistrict?: string; postal_code?: string }
interface ShippingOption { courier: string; courier_name: string; service: string; description: string; cost: number; etd: string }

const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`

const ORIGIN: City = { id: 73492, name: 'SERPONG, TANGERANG SELATAN', subdistrict: 'SERPONG', postal_code: '15311' }

export default function CheckoutPage() {
  const router = useRouter()
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const productKey = (params?.get('product') as keyof typeof products) || 'neon-drip'
  const product = products[productKey]
  const isCustom = product.kind === 'case_custom'

  const [color, setColor] = useState(product.colors[0])
  const [customName, setCustomName] = useState('')

  const [destSearch, setDestSearch] = useState('')
  const [destResults, setDestResults] = useState<City[]>([])
  const [destSelected, setDestSelected] = useState<City | null>(null)
  const [destOpen, setDestOpen] = useState(false)
  const [destLoading, setDestLoading] = useState(false)

  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')

  const [shippingCost, setShippingCost] = useState<ShippingOption | null>(null)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const searchDest = useCallback(async (search: string) => {
    if (search.length < 2) { setDestResults([]); return }
    setDestLoading(true)
    try {
      const res = await fetch(`/api/shipping/destination?search=${encodeURIComponent(search)}&limit=8`)
      const data = await res.json()
      if (data.success) setDestResults(data.data)
    } catch { /* empty */ } finally { setDestLoading(false) }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => { if (destSearch && !destSelected) searchDest(destSearch) }, 400)
    return () => clearTimeout(t)
  }, [destSearch, destSelected, searchDest])

  useEffect(() => {
    if (!destSelected) return
    ;(async () => {
      setShippingLoading(true)
      setShippingCost(null)
      try {
        const res = await fetch('/api/shipping/cost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin: ORIGIN.id, destination: destSelected.id, weight: 300, courier: 'jne:jnt:sicepat:anteraja' }),
        })
        const data = await res.json()
        if (data.success && data.data.length > 0) {
          const cheapest = data.data.reduce((a: ShippingOption, b: ShippingOption) => a.cost < b.cost ? a : b)
          setShippingCost(cheapest)
        }
      } catch { /* empty */ } finally { setShippingLoading(false) }
    })()
  }, [destSelected])

  const shipping = shippingCost?.cost || 0
  const total = product.price + shipping

  function submitOrder(e: React.FormEvent) {
    e.preventDefault()
    if (!destSelected) { setFormError('Pilih kota tujuan pengiriman.'); return }
    if (!recipientName.trim()) { setFormError('Nama penerima wajib diisi.'); return }
    if (!recipientPhone.trim()) { setFormError('No. HP penerima wajib diisi.'); return }
    if (!recipientAddress.trim()) { setFormError('Alamat lengkap wajib diisi.'); return }
    if (isCustom && customName.trim().length < 2) { setFormError('Nama custom minimal 2 karakter.'); return }
    if (!shippingCost) { setFormError('Menunggu perhitungan ongkir.'); return }
    setFormError('')
    const p = new URLSearchParams({
      product: product.id,
      product_name: product.name,
      color,
      name: isCustom ? customName : '',
      total: String(total),
      origin: ORIGIN.name,
      destination: `${destSelected.subdistrict}, ${destSelected.name}`,
      destination_id: String(destSelected.id),
      courier: shippingCost.courier_name,
      shipping_cost: String(shipping),
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      recipient_address: recipientAddress,
    })
    router.push(`/payment?${p.toString()}`)
  }

  return (
    <main className="min-h-screen bg-[#fbfbf8] text-[#171717]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <a href="/" className="flex items-center gap-2.5 text-xl font-black tracking-[-0.06em]">
          <span className="grid size-8 place-items-center rounded-full bg-[#171717] text-[#d7ff3f]"><Flame className="size-4 fill-current" /></span>
          JOGPRO
        </a>
        <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#666] hover:text-[#171717]">
          <ArrowLeft className="size-4" /> Kembali belanja
        </a>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-14">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ef4b32]">Checkout</p>
          <h1 className="mt-2 text-5xl font-black leading-[0.9] tracking-[-0.08em] sm:text-7xl">Make it yours.</h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-[#777]">Pilih warna, isi detail pengiriman, lalu bayar. Ongkir dihitung otomatis.</p>
        </div>

        <form onSubmit={submitOrder} className="grid gap-8 lg:grid-cols-[1fr_390px]">
          <div className="flex flex-col gap-6">

            {/* Produk */}
            <section className="rounded-[1.75rem] border border-black/10 bg-white p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#999]">01 / Produk</p>
                  <h2 className="mt-1 text-2xl font-black tracking-[-0.05em]">{product.name}</h2>
                  <p className="mt-1 text-sm text-[#777]">{isCustom ? 'Case custom' : 'Case motif'}</p>
                </div>
                <p className="text-lg font-black">{formatPrice(product.price)}</p>
              </div>
              <div className="mt-6 flex flex-col gap-5 sm:flex-row">
                <div className="w-full overflow-hidden rounded-2xl sm:w-36" style={{ aspectRatio: '9/16' }}>
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#999]">Pilih warna</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button type="button" key={c} onClick={() => setColor(c)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition ${color === c ? 'bg-[#171717] text-white' : 'border border-black/10 bg-white text-[#777] hover:border-black/30'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                  {isCustom && (
                    <div className="mt-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#999]">Nama custom</p>
                      <input required value={customName} onChange={(e) => setCustomName(e.target.value.toUpperCase().slice(0, 12))}
                        placeholder="TULIS NAMAMU" className="mt-2 w-full rounded-xl border border-black/10 bg-[#fbfbf8] px-4 py-3 text-sm font-bold outline-none focus:border-[#171717]" />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Pengiriman */}
            <section className="rounded-[1.75rem] border border-black/10 bg-white p-5 sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#999]">02 / Pengiriman</p>

              {/* Kota Asal (otomatis) */}
              <div className="mt-5 rounded-xl border border-black/10 bg-[#fbfbf8] px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-[#999]">
                  <MapPin className="size-3" /> Kota asal (otomatis)
                </div>
                <p className="mt-1 text-sm font-bold">{ORIGIN.subdistrict}, {ORIGIN.name}</p>
              </div>

              {/* Data Penerima */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-[#666]">Nama penerima <span className="text-red-500">*</span></label>
                  <input required value={recipientName} onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Nama lengkap" className="mt-2 w-full rounded-xl border border-black/10 bg-[#fbfbf8] px-4 py-3 text-sm outline-none focus:border-[#171717]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#666]">No. HP <span className="text-red-500">*</span></label>
                  <input required value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} type="tel"
                    placeholder="08xxxxxxxxxx" className="mt-2 w-full rounded-xl border border-black/10 bg-[#fbfbf8] px-4 py-3 text-sm outline-none focus:border-[#171717]" />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-xs font-bold text-[#666]">Alamat lengkap <span className="text-red-500">*</span></label>
                <textarea required value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} rows={3}
                  placeholder="Jalan, nomor, RT/RW, kelurahan, kode pos" className="mt-2 w-full rounded-xl border border-black/10 bg-[#fbfbf8] px-4 py-3 text-sm outline-none focus:border-[#171717] resize-none" />
              </div>

              {/* Kota Tujuan */}
              <div className="relative mt-4">
                <label className="text-xs font-bold text-[#666]">Kota tujuan <span className="text-red-500">*</span></label>
                <div className="relative mt-2">
                  <Search className="pointer-events-none absolute left-4 top-3.5 size-4 text-[#999]" />
                  <input required value={destSearch}
                    onChange={(e) => { setDestSearch(e.target.value); setDestSelected(null) }}
                    onFocus={() => setDestOpen(true)}
                    placeholder="Ketik nama kota atau kecamatan"
                    className="w-full rounded-xl border border-black/10 bg-[#fbfbf8] py-3 pl-11 pr-10 text-sm outline-none focus:border-[#171717]" />
                  {destLoading && <Loader2 className="pointer-events-none absolute right-4 top-3.5 size-4 animate-spin text-[#999]" />}
                </div>
                {destOpen && destResults.length > 0 && !destSelected && (
                  <div className="absolute left-0 right-0 top-[4.6rem] z-10 max-h-48 overflow-auto rounded-xl border border-black/10 bg-white p-1 shadow-xl">
                    {destResults.map((city) => (
                      <button type="button" key={city.id}
                        onClick={() => { setDestSelected(city); setDestSearch(`${city.subdistrict}, ${city.name}`); setDestOpen(false) }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs hover:bg-[#d7ff3f]">
                        <span>{city.subdistrict}, {city.name}</span>
                        <span className="text-[9px] text-[#999]">{city.postal_code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Hasil Ongkir (termurah saja) */}
              {destSelected && (
                <div className="mt-5 border-t border-black/5 pt-5">
                  {shippingLoading ? (
                    <div className="flex items-center gap-2 text-sm text-[#999]">
                      <Loader2 className="size-4 animate-spin" /> Menghitung ongkir...
                    </div>
                  ) : shippingCost ? (
                    <div className="rounded-xl border border-[#171717] bg-[#171717] p-4 text-white">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/50">Ongkir termurah</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <p className="font-black">{shippingCost.courier_name} — {shippingCost.service}</p>
                          <p className="mt-0.5 text-xs text-white/60">Estimasi {shippingCost.etd} hari</p>
                        </div>
                        <p className="font-black">{formatPrice(shippingCost.cost)}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#999]">Tidak ada layanan tersedia.</p>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Ringkasan */}
          <aside className="flex flex-col gap-5">
            <div className="sticky top-5 rounded-[1.75rem] border border-black/10 bg-white p-5 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#999]">Ringkasan</p>
              <div className="mt-4 flex items-center gap-3 border-b border-black/5 pb-4">
                <img src={product.image} alt={product.name} className="size-14 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-black">{product.name}</p>
                  <p className="text-xs text-[#999]">{color}{isCustom && customName ? ` — ${customName}` : ''}</p>
                </div>
                <p className="text-sm font-black">{formatPrice(product.price)}</p>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#777]">Produk</span><span className="font-bold">{formatPrice(product.price)}</span></div>
                <div className="flex justify-between"><span className="text-[#777]">Ongkir</span><span className="font-bold">{shippingCost ? formatPrice(shipping) : '-'}</span></div>
                <div className="border-t border-black/5 pt-2 flex justify-between"><span className="font-black">Total</span><span className="font-black">{formatPrice(total)}</span></div>
              </div>

              {formError && <p className="mt-3 text-xs text-red-500">{formError}</p>}

              <button type="submit"
                disabled={!destSelected || !shippingCost || shippingLoading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#171717] py-3.5 text-sm font-bold text-white transition hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100">
                <Truck className="size-4" /> Bayar sekarang
              </button>
              <p className="mt-3 text-center text-[10px] text-[#999]">Pembayaran manual via transfer BCA</p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  )
}
