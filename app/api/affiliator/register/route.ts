import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7313902869'

async function sendTelegram(text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' })
    })
  } catch {}
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, whatsapp, city, tiktok_username, tiktok_followers, tiktok_url, instagram_url, samples, tiktokshop_screenshot, tiktokshop_filename } = body

    // Validasi
    if (!full_name || !whatsapp || !city || !tiktok_username || !tiktok_followers) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }
    // Validasi format & sanitasi
    if (typeof full_name !== 'string' || full_name.length > 100) return NextResponse.json({ error: 'Nama maksimal 100 karakter' }, { status: 400 })
    if (typeof whatsapp !== 'string' || !/^08[0-9]{8,13}$/.test(whatsapp)) return NextResponse.json({ error: 'Format WhatsApp tidak valid (08xxxxxxxxxx)' }, { status: 400 })
    if (typeof city !== 'string' || city.length > 50) return NextResponse.json({ error: 'Nama kota maksimal 50 karakter' }, { status: 400 })
    if (typeof tiktok_username !== 'string' || !/^[a-zA-Z0-9_.]{3,30}$/.test(tiktok_username)) return NextResponse.json({ error: 'Username TikTok tidak valid' }, { status: 400 })
    if (typeof samples !== 'object' || !Array.isArray(samples) || samples.some((s: unknown) => typeof s !== 'string' || s.length > 50)) {
      return NextResponse.json({ error: 'Format sampel tidak valid' }, { status: 400 })
    }
    // Sanitasi: hapus tag HTML
    const sanitize = (s: string) => s.replace(/<[^>]*>/g, '').trim()
    const safeName = sanitize(full_name)
    const safeCity = sanitize(city)
    const safeUsername = tiktok_username.trim()
    if (parseInt(tiktok_followers) < 600) {
      return NextResponse.json({ error: 'Minimal 600 followers TikTok' }, { status: 400 })
    }
    if (!samples || samples.length === 0 || samples.length > 3) {
      return NextResponse.json({ error: 'Pilih 1-3 sampel produk' }, { status: 400 })
    }

    // Insert affiliator
    const { data: affiliator, error } = await supabase
      .from('affiliators')
      .insert({ full_name: safeName, whatsapp: whatsapp.trim(), city: safeCity, tiktok_username: safeUsername, tiktok_followers: parseInt(tiktok_followers), tiktok_url, instagram_url, status: 'pending' })
      .select()
      .single()

    if (error) throw error

    // Insert samples
    const sampleRows = samples.map((product_name: string) => ({ affiliator_id: affiliator.id, product_name, status: 'requested' }))
    await supabase.from('affiliator_samples').insert(sampleRows)

    // Notif Telegram
    const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    const sampelList = samples.join(', ')
    await sendTelegram(`🎯 <b>PENDAFTAR AFFILIATOR BARU!</b>\n\nNama: ${safeName}\nWA: ${whatsapp.trim()}\nKota: ${safeCity}\nTikTok: @${safeUsername} (${tiktok_followers} followers)\n${instagram_url ? `Instagram: ${instagram_url}\n` : ''}Sampel: ${sampelList}\nWaktu: ${now} WIB\n\n👉 <a href="https://jogpro.net/admin">Cek di Admin Panel</a>`)

    // Kirim screenshot TikTok Shop jika ada
    if (tiktokshop_screenshot) {
      try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            photo: `data:image/jpeg;base64,${tiktokshop_screenshot}`,
            caption: `🛒 Screenshot TikTok Shop dari ${safeName} — ${tiktokshop_filename || 'tanpa nama'}`
          })
        })
      } catch {}
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
