import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getOrder } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const VALID_PRODUCTS = ['neon-drip', 'dragon-duo', 'your-name', 'gothic-guardian', 'koi', 'monkey-freak', 'o-sign', 'viking-skull', 'hawaii', 'old-skull', 'gator']

const RATE_LIMIT = new Map<string, { count: number; reset: number }>()
function isRateLimited(ip: string) {
  const now = Date.now()
  const entry = RATE_LIMIT.get(ip)
  if (!entry || now > entry.reset) {
    RATE_LIMIT.set(ip, { count: 1, reset: now + 60_000 })
    return false
  }
  entry.count++
  return entry.count > 10 // max 10 orders per minute per IP
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ success: false, message: 'Terlalu banyak request, coba lagi 1 menit' }, { status: 429 })
  }
  try {
    const body = await request.json()
    const { product_id, custom_name, color, origin_city, destination_city, courier, shipping_cost, total, recipient_name, recipient_phone, recipient_address } = body

    if (!product_id || !total) {
      return NextResponse.json(
        { success: false, message: 'product_id dan total wajib diisi' },
        { status: 400 }
      )
    }

    if (!VALID_PRODUCTS.includes(product_id)) {
      return NextResponse.json(
        { success: false, message: 'Produk tidak valid' },
        { status: 400 }
      )
    }

    const orderId = await createOrder({
      product_id,
      custom_name: custom_name || null,
      color: color || null,
      origin_city: origin_city || null,
      destination_city: destination_city || null,
      courier: courier || null,
      shipping_cost: shipping_cost || null,
      total: Number(total),
      status: 'pending',
      payment_method: 'bca_transfer',
      recipient_name: recipient_name || null,
      recipient_phone: recipient_phone || null,
      recipient_address: recipient_address || null,
    })

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Gagal membuat order' },
        { status: 500 }
      )
    }

    const order = await getOrder(orderId)

    return NextResponse.json({
      success: true,
      message: 'Order berhasil dibuat',
      data: order,
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal membuat order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'ID order wajib diisi' },
      { status: 400 }
    )
  }

  try {
    const order = await getOrder(Number(id))

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data order' },
      { status: 500 }
    )
  }
}
