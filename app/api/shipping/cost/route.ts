import { NextRequest, NextResponse } from 'next/server'

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY || '1623d3f9f8a48753dceae7f2002f17dc'
const RAJAONGKIR_BASE_URL = 'https://rajaongkir.komerce.id/api/v1'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destination, weight, courier } = body

    if (!origin || !destination || !weight || !courier) {
      return NextResponse.json(
        { success: false, message: 'Lengkapi semua field: origin, destination, weight, courier' },
        { status: 400 }
      )
    }

    const weightGrams = Number(weight)
    if (isNaN(weightGrams) || weightGrams <= 0) {
      return NextResponse.json(
        { success: false, message: 'Berat harus lebih dari 0 gram' },
        { status: 400 }
      )
    }

    const courierString = Array.isArray(courier) ? courier.join(':') : courier

    const formData = new URLSearchParams()
    formData.append('origin', String(origin))
    formData.append('destination', String(destination))
    formData.append('weight', String(weightGrams))
    formData.append('courier', courierString)

    const response = await fetch(`${RAJAONGKIR_BASE_URL}/calculate/domestic-cost`, {
      method: 'POST',
      headers: {
        'key': RAJAONGKIR_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Gagal menghitung ongkir' },
        { status: response.status }
      )
    }

    const shippingOptions = (data.data || []).map((item: Record<string, unknown>) => ({
      courier: item.code || item.name,
      courier_name: item.name,
      service: item.service,
      description: item.description,
      cost: typeof item.cost === 'object' && item.cost !== null
        ? (item.cost as Record<string, unknown>).value
        : item.cost,
      etd: item.etd,
    }))

    return NextResponse.json({
      success: true,
      data: shippingOptions,
    })
  } catch (error) {
    console.error('RajaOngkir API error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat menghitung ongkir' },
      { status: 500 }
    )
  }
}
