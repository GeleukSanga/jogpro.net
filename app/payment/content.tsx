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

  function confirmPayment() {
    const message = `Halo JOGPRO, saya sudah transfer!\n\nProduk: ${productName}\nWarna: ${color}\nTotal: ${formatPrice(total)}\n\nMohon dicek ya. Terima kasih!`
    const whatsappUrl = `https://wa.me/628972523968?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setConfirmed(true)
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
          Kamu akan diarahkan ke WhatsApp JOGPRO untuk konfirmasi pembayaran. Tim kami akan memeriksa dan menghubungi kamu untuk proses pengiriman.
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
              Transfer dengan nominal yang tepat. Setelah transfer, klik tombol konfirmasi di bawah untuk chat WhatsApp.
            </p>

            <button type="button" onClick={confirmPayment}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#d7ff3f] py-3.5 text-sm font-bold text-[#171717] transition hover:scale-[1.02]">
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Konfirmasi via WhatsApp
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}
