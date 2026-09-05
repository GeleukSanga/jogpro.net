'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, ChevronDown, Flame, Loader2, Search, Truck } from 'lucide-react'

const products = {
  'neon-drip': { name: 'Neon Drip', kind: 'Case motif', price: 20000, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_42_05%20PM-2gUW7il51MvD8mqs27gsvaugVsVJ6C.png', colors: ['Violet', 'Lime', 'Midnight'] },
  'dragon-duo': { name: 'Dragon Duo', kind: 'Case motif', price: 20000, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_45_40%20PM-tJyA6aPHDrHuxAPCtmKQ090M8rwsUk.png', colors: ['Ivory', 'Obsidian'] },
  'your-name': { name: 'Your Name', kind: 'Case custom', price: 25000, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_49_25%20PM-vYnuJFMY7Ne117XB3x1tj5GZsxzgkL.png', colors: ['Black', 'Stone', 'Lime'] },
  'gothic-guardian': { name: 'Gothic Guardian', kind: 'Case motif', price: 20000, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_43_40%20PM-LSxDzqXc7EloDpwQ906cQvdFUA14ie.png', colors: ['Obsidian', 'Wine'] },
} as const

interface City {
  id: string | number
  name: string
  province?: string
  postal_code?: string
}

interface ShippingOption {
  courier: string
  courier_name: string
  service: string
  description: string
  cost: number
  etd: string
}

const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`

const COURIERS = [
  { id: 'jne', name: 'JNE' },
  { id: 'jnt', name: 'J&T Express' },
  { id: 'sicepat', name: 'SiCepat' },
  { id: 'anteraja', name: 'AnterAja' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const product = products[(params?.get('product') as keyof typeof products) || 'neon-drip']
  const initialName = params?.get('name') || ''

  const [color, setColor] = useState(product.colors[0])
  const [customName, setCustomName] = useState(initialName)
  const [weight] = useState('300')

  const [originSearch, setOriginSearch] = useState('')
  const [originResults, setOriginResults] = useState<City[]>([])
  const [originSelected, setOriginSelected] = useState<City | null>(null)
  const [originOpen, setOriginOpen] = useState(false)
  const [originLoading, setOriginLoading] = useState(false)

  const [destSearch, setDestSearch] = useState('')
  const [destResults, setDestResults] = useState<City[]>([])
  const [destSelected, setDestSelected] = useState<City | null>(null)
  const [destOpen, setDestOpen] = useState(false)
  const [destLoading, setDestLoading] = useState(false)

  const [courier, setCourier] = useState('jne')
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)
  const [shippingLoading, setShippingLoading] = useState(false)

  const [formError, setFormError] = useState('')

  const searchCities = useCallback(async (search: string, type: 'origin' | 'dest') => {
    if (search.length < 2) {
      if (type === 'origin') setOriginResults([])
      else setDestResults([])
      return
    }

    if (type === 'origin') setOriginLoading(true)
    else setDestLoading(true)

    try {
      const res = await fetch(`/api/shipping/destination?search=${encodeURIComponent(search)}&limit=8`)
      const data = await res.json()
      if (data.success) {
        if (type === 'origin') setOriginResults(data.data)
        else setDestResults(data.data)
      }
    } catch {
      console.error('Gagal search kota')
    } finally {
      if (type === 'origin') setOriginLoading(false)
      else setDestLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (originSearch && !originSelected) searchCities(originSearch, 'origin')
    }, 400)
    return () => clearTimeout(timer)
  }, [originSearch, originSelected, searchCities])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (destSearch && !destSelected) searchCities(destSearch, 'dest')
    }, 400)
    return () => clearTimeout(timer)
  }, [destSearch, destSelected, searchCities])

  useEffect(() => {
    if (!originSelected || !destSelected) return

    async function fetchShipping() {
      setShippingLoading(true)
      setSelectedShipping(null)
      try {
        const res = await fetch('/api/shipping/cost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: originSelected!.id,
            destination: destSelected!.id,
            weight: Number(weight),
            courier: courier,
          }),
        })
        const data = await res.json()
        if (data.success) {
          setShippingOptions(data.data)
          if (data.data.length > 0) setSelectedShipping(data.data[0])
        } else {
          setShippingOptions([])
        }
      } catch {
        console.error('Gagal hitung ongkir')
        setShippingOptions([])
      } finally {
        setShippingLoading(false)
      }
    }

    fetchShipping()
  }, [originSelected, destSelected, weight, courier])

  const shipping = selectedShipping?.cost || 0
  const total = product.price + shipping

  function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!originSelected || !destSelected || !selectedShipping) {
      setFormError('Lengkapi data pengiriman terlebih dahulu.')
      return
    }
    if (product.kind === 'case_custom' && customName.trim().length < 2) {
      setFormError('Nama custom minimal 2 karakter.')
      return
    }
    setFormError('')

    const paymentParams = new URLSearchParams({
      product: product.id,
      color,
      name: customName,
      total: String(total),
      origin: String(originSelected.id),
      destination: String(destSelected.id),
      courier: selectedShipping.courier_name,
      shipping_cost: String(shipping),
    })
    router.push(`/payment?${paymentParams.toString()}`)
  }

  return (
    <main className="min-h-screen bg-[#fbfbf8] text-[#171717]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <a href="/" className="flex items-center gap-2.5 text-xl font-black tracking-[-0.06em]">
          <span className="grid size-8 place-items-center rounded-full bg-[#171717] text-[#d7ff3f]">
            <Flame className="size-4 fill-current" />
          </span>
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
          <p className="mt-5 max-w-lg text-sm leading-6 text-[#777]">Pilih warna, personalisasi nama, lalu isi detail pengiriman. Ongkir dihitung real-time via RajaOngkir.</p>
        </div>

        <form onSubmit={submitOrder} className="grid gap-8 lg:grid-cols-[1fr_390px]">
          <div className="flex flex-col gap-6">
            {/* Produk */}
            <section className="rounded-[1.75rem] border border-black/10 bg-white p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#999]">01 / Produk</p>
                  <h2 className="mt-1 text-2xl font-black tracking-[-0.05em]">{product.name}</h2>
                  <p className="mt-1 text-sm text-[#777]">{product.kind === 'case_motif' ? 'Case motif' : 'Case custom'}</p>
                </div>
                <p className="text-lg font-black">{formatPrice(product.price)}</p>
              </div>
              <div className="mt-6 flex flex-col gap-5 sm:flex-row">
                <img src={product.image} alt={product.name} className="h-44 w-full rounded-2xl object-cover object-center sm:w-36" />
                <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#999]">Pilih warna</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.colors.map((item) => (
                      <button type="button" key={item} onClick={() => setColor(item)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition ${color === item ? 'bg-[#171717] text-white' : 'border border-black/10 bg-white text-[#777] hover:border-black/30'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                  {product.kind === 'case_custom' && (
                    <div className="mt-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#999]">Nama custom</p>
                      <input value={customName} onChange={(e) => setCustomName(e.target.value.toUpperCase().slice(0, 12))}
                        placeholder="TULIS NAMAMU" className="mt-2 w-full rounded-xl border border-black/10 bg-[#fbfbf8] px-4 py-3 text-sm font-bold outline-none focus:border-[#171717]" />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Pengiriman */}
            <section className="rounded-[1.75rem] border border-black/10 bg-white p-5 sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#999]">02 / Pengiriman</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {/* Kota Asal */}
                <div className="relative">
                  <label className="text-xs font-bold text-[#666]">Kota asal</label>
                  <div className="relative mt-2">
                    <Search className="pointer-events-none absolute left-4 top-3.5 size-4 text-[#999]" />
                    <input required value={originSearch}
                      onChange={(e) => { setOriginSearch(e.target.value); setOriginSelected(null) }}
                      onFocus={() => setOriginOpen(true)}
                      placeholder="Contoh: Tangerang"
                      className="w-full rounded-xl border border-black/10 bg-[#fbfbf8] py-3 pl-11 pr-10 text-sm outline-none focus:border-[#171717]" />
                    {originLoading && <Loader2 className="pointer-events-none absolute right-4 top-3.5 size-4 animate-spin text-[#999]" />}
                  </div>
                  {originOpen && originResults.length > 0 && !originSelected && (
                    <div className="absolute left-0 right-0 top-[4.6rem] z-10 max-h-48 overflow-auto rounded-xl border border-black/10 bg-white p-1 shadow-xl">
                      {originResults.map((city) => (
                        <button type="button" key={city.id}
                          onClick={() => { setOriginSelected(city); setOriginSearch(city.name); setOriginOpen(false) }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs hover:bg-[#d7ff3f]">
                          <span>{city.name}</span>
                          <span className="text-[9px] text-[#999]">{city.province}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Kota Tujuan */}
                <div className="relative">
                  <label className="text-xs font-bold text-[#666]">Kota tujuan</label>
                  <div className="relative mt-2">
                    <Search className="pointer-events-none absolute left-4 top-3.5 size-4 text-[#999]" />
                    <input required value={destSearch}
                      onChange={(e) => { setDestSearch(e.target.value); setDestSelected(null) }}
                      onFocus={() => setDestOpen(true)}
                      placeholder="Contoh: Jakarta"
                      className="w-full rounded-xl border border-black/10 bg-[#fbfbf8] py-3 pl-11 pr-10 text-sm outline-none focus:border-[#171717]" />
                    {destLoading && <Loader2 className="pointer-events-none absolute right-4 top-3.5 size-4 animate-spin text-[#999]" />}
                  </div>
                  {destOpen && destResults.length > 0 && !destSelected && (
                    <div className="absolute left-0 right-0 top-[4.6rem] z-10 max-h-48 overflow-auto rounded-xl border border-black/10 bg-white p-1 shadow-xl">
                      {destResults.map((city) => (
                        <button type="button" key={city.id}
                          onClick={() => { setDestSelected(city); setDestSearch(city.name); setDestOpen(false) }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs hover:bg-[#d7ff3f]">
                          <span>{city.name}</span>
                          <span className="text-[9px] text-[#999]">{city.province}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pilih Kurir */}
              <div className="mt-5">
                <p className="text-xs font-bold text-[#666]">Kurir</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {COURIERS.map((c) => (
                    <button type="button" key={c.id} onClick={() => setCourier(c.id)}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition ${courier === c.id ? 'bg-[#171717] text-white' : 'border border-black/10 bg-white text-[#777] hover:border-black/30'}`}>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hasil Ongkir */}
              {originSelected && destSelected && (
                <div className="mt-5 border-t border-black/5 pt-5">
                  {shippingLoading ? (
                    <div className="flex items-center gap-2 text-sm text-[#999]">
                      <Loader2 className="size-4 animate-spin" /> Menghitung ongkir...
                    </div>
                  ) : shippingOptions.length > 0 ? (
                    <>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#999]">Pilih layanan</p>
                      <div className="mt-3 flex flex-col gap-2">
                        {shippingOptions.map((opt, idx) => (
                          <button type="button" key={idx}
                            onClick={() => setSelectedShipping(opt)}
                            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-xs transition ${selectedShipping === opt ? 'border-[#171717] bg-[#171717] text-white' : 'border-black/10 bg-white hover:border-black/30'}`}>
                            <div>
                              <p className="font-black">{opt.courier_name} — {opt.service}</p>
                              <p className={`mt-0.5 ${selectedShipping === opt ? 'text-white/70' : 'text-[#999]'}`}>Estimasi {opt.etd} hari</p>
                            </div>
                            <p className="font-black">{formatPrice(opt.cost)}</p>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-[#999]">Tidak ada layanan tersedia untuk rute ini.</p>
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
                  <p className="text-xs text-[#999]">{color}{customName ? ` — ${customName}` : ''}</p>
                </div>
                <p className="text-sm font-black">{formatPrice(product.price)}</p>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#777]">Produk</span><span className="font-bold">{formatPrice(product.price)}</span></div>
                <div className="flex justify-between"><span className="text-[#777]">Ongkir ({selectedShipping?.courier_name || '-'})</span><span className="font-bold">{selectedShipping ? formatPrice(shipping) : '-'}</span></div>
                <div className="border-t border-black/5 pt-2 flex justify-between"><span className="font-black">Total</span><span className="font-black">{formatPrice(total)}</span></div>
              </div>

              {formError && <p className="mt-3 text-xs text-red-500">{formError}</p>}

              <button type="submit"
                disabled={!originSelected || !destSelected || !selectedShipping}
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
