import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data produk' },
      { status: 500 }
    )
  }
}
