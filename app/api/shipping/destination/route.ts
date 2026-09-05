import { NextRequest, NextResponse } from 'next/server'

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY || '1623d3f9f8a48753dceae7f2002f17dc'
const RAJAONGKIR_BASE_URL = 'https://rajaongkir.komerce.id/api/v1'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const limit = searchParams.get('limit') || '10'

  if (!search || search.length < 2) {
    return NextResponse.json(
      { success: false, message: 'Minimal 2 karakter untuk pencarian' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${RAJAONGKIR_BASE_URL}/destination/domestic-destination?search=${encodeURIComponent(search)}&limit=${limit}`,
      {
        headers: {
          'key': RAJAONGKIR_API_KEY,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Gagal mencari lokasi' },
        { status: response.status }
      )
    }

    const destinations = (data.data || []).map((item: Record<string, unknown>) => ({
      id: item.city_id || item.id,
      name: item.city_name || item.name,
      province: item.province,
      type: item.type,
      postal_code: item.postal_code,
      subdistrict_id: item.subdistrict_id,
      subdistrict_name: item.subdistrict_name,
    }))

    return NextResponse.json({
      success: true,
      data: destinations,
    })
  } catch (error) {
    console.error('RajaOngkir API error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat menghubungi server' },
      { status: 500 }
    )
  }
}
