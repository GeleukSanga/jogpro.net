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
    const { full_name, whatsapp, city, tiktok_username, tiktok_followers, tiktok_url, instagram_url, samples } = body

    // Validasi
    if (!full_name || !whatsapp || !city || !tiktok_username || !tiktok_followers) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }
    if (parseInt(tiktok_followers) < 600) {
      return NextResponse.json({ error: 'Minimal 600 followers TikTok' }, { status: 400 })
    }
    if (!samples || samples.length === 0 || samples.length > 3) {
      return NextResponse.json({ error: 'Pilih 1-3 sampel produk' }, { status: 400 })
    }

    // Insert affiliator
    const { data: affiliator, error } = await supabase
      .from('affiliators')
      .insert({ full_name, whatsapp, city, tiktok_username, tiktok_followers: parseInt(tiktok_followers), tiktok_url, instagram_url, status: 'pending' })
      .select()
      .single()

    if (error) throw error

    // Insert samples
    const sampleRows = samples.map((product_name: string) => ({ affiliator_id: affiliator.id, product_name, status: 'requested' }))
    await supabase.from('affiliator_samples').insert(sampleRows)

    // Notif Telegram
    const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    const sampelList = samples.join(', ')
    await sendTelegram(`🎯 <b>PENDAFTAR AFFILIATOR BARU!</b>\n\nNama: ${full_name}\nWA: ${whatsapp}\nKota: ${city}\nTikTok: @${tiktok_username} (${tiktok_followers} followers)\n${instagram_url ? `Instagram: ${instagram_url}\n` : ''}Sampel: ${sampelList}\nWaktu: ${now} WIB\n\n👉 <a href="https://jogpro.net/admin/affiliator">Cek di Admin Panel</a>`)

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
