'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Check, Clipboard, Flame, Loader2 } from 'lucide-react'

const formatPrice = (value: string | null) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`

export default function PaymentContent() {
  const searchParams = useSearchParams()
  const total = searchParams.get('total') || '0'
  const product = searchParams.get('product') || ''
  const productName = searchParams.get('product_name') || 'Pesanan JOGPRO'
  const color = searchParams.get('color') || ''
  const name = searchParams.get('name') || ''
  const destination = searchParams.get('destination') || ''
  const courier = searchParams.get('courier') || ''
  const shippingCost = searchParams.get('shipping_cost') || '0'
  const recipientName = searchParams.get('recipient_name') || ''
  const recipientPhone = searchParams.get('recipient_phone') || ''
  const recipientAddress = searchParams.get('recipient_address') || ''

  const [copied, setCopied] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function copyAccount() {
    await navigator.clipboard.writeText('7805380306')
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  async function confirmPayment() {
    setLoading(true)
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product,
          custom_name: name || null,
          color: color || null,
          origin_city: 'SERPONG, TANGERANG SELATAN',
          destination_city: destination || null,
          courier: courier || null,
          shipping_cost: Number(shippingCost),
          total: Number(total),
          recipient_name: recipientName,
          recipient_phone: recipientPhone,
          recipient_address: recipientAddress,
        }),
      })
      setConfirmed(true)
    } catch {
      console.error('Gagal simpan order')
      setConfirmed(true)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return (
    <main className="grid min-h-screen place-items-center bg-[#fbfbf8]">
      <Loader2 className="size-8 animate-spin text-[#999]" />
    </main>
  )

  if (confirmed) return (
    <main className="grid min-h-screen place-items-center bg-[#fbfbf8] px-5 text-[#171717]">
      <div className="w-full max-w-lg rounded-[2rem] bg-[#d7ff3f] p-8 text-center shadow-xl sm:p-12">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#171717] text-[#d7ff3f]">
          <Check className="size-8" />
        </span>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-black/50">Konfirmasi terkirim</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.07em]">Terima kasih.</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-black/60">
          Tim JOGPRO akan memeriksa pembayaranmu dan menghubungi kamu untuk proses pengiriman.
        </p>
        <a href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#171717] px-5 py-3.5 text-sm font-bold text-white">
          <ArrowLeft className="size-4" /> Kembali ke home
        </a>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#fbfbf8] text-[#171717]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="flex items-center gap-2.5 text-xl font-black tracking-[-0.06em]">
          <span className="grid size-8 place-items-center rounded-full bg-[#171717] text-[#d7ff3f]">
            <Flame className="size-4 fill-current" />
          </span>
          JOGPRO
        </a>
        <a href="/checkout" className="inline-flex items-center gap-2 text-sm font-bold text-[#666] hover:text-[#171717]">
          <ArrowLeft className="size-4" /> Kembali
        </a>
      </header>

      <div className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:px-8 lg:pt-16">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ef4b32]">Pembayaran</p>
          <h1 className="mt-2 text-5xl font-black leading-[0.9] tracking-[-0.08em] sm:text-7xl">Selesaikan transfer.</h1>
          <p className="mt-5 text-sm leading-6 text-[#777]">Transfer sesuai jumlah di bawah ini ke rekening BCA JOGPRO. Simpan bukti transfer untuk konfirmasi.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[1.75rem] border border-black/10 bg-white p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#999]">Total yang harus dibayar</p>
            <p className="mt-3 text-5xl font-black tracking-[-0.08em]">{formatPrice(total)}</p>

            <div className="mt-8 border-t border-black/10 pt-6">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#999]">Detail pesanan</p>
              <p className="mt-2 text-sm font-bold">{productName}</p>
              {color && <p className="mt-1 text-xs text-[#888]">Warna: {color}</p>}
              {name && <p className="mt-1 text-xs text-[#888]">Custom: {name}</p>}
              {courier && <p className="mt-1 text-xs text-[#888]">Kurir: {courier}</p>}
              <p className="mt-1 text-xs text-[#888]">Pembayaran manual via transfer bank</p>
            </div>

            {recipientName && (
              <div className="mt-6 border-t border-black/10 pt-6">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#999]">Pengiriman ke</p>
                <p className="mt-2 text-sm font-bold">{recipientName}</p>
                <p className="mt-1 text-xs text-[#888]">{recipientPhone}</p>
                <p className="mt-1 text-xs text-[#888]">{recipientAddress}</p>
                <p className="mt-1 text-xs text-[#888]">{destination}</p>
              </div>
            )}
          </section>

          <section className="rounded-[1.75rem] bg-[#171717] p-6 text-white sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/50">Transfer ke</p>
            <p className="mt-5 text-sm font-bold text-white/60">Bank BCA</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-3xl font-black tracking-[0.04em]">7805 3803 06</p>
              <button type="button" onClick={copyAccount}
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 transition hover:bg-white/20">
                {copied ? <Check className="size-4 text-[#d7ff3f]" /> : <Clipboard className="size-4" />}
              </button>
            </div>
            <p className="mt-3 text-xs text-white/40">a.n. Yohanes Laurensius</p>

            <div className="mt-6 rounded-xl bg-white/5 p-4">
              <p className="text-xs text-white/50">Nominal transfer</p>
              <p className="mt-1 text-xl font-black text-[#d7ff3f]">{formatPrice(total)}</p>
            </div>

            <p className="mt-4 text-[10px] leading-5 text-white/30">
              Transfer dengan nominal yang tepat. Setelah transfer, klik tombol konfirmasi di bawah.
            </p>

            <button type="button" onClick={confirmPayment} disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#d7ff3f] py-3.5 text-sm font-bold text-[#171717] transition hover:scale-[1.02] disabled:opacity-40">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              {loading ? 'Mengirim...' : 'Sudah transfer'}
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}
