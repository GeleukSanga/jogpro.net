import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('jogpro_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data: data || [] })
  } catch (e) {
    console.error('Admin list orders error', e)
    return NextResponse.json({ success: false, message: 'Gagal ambil orders' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const ids = searchParams.get('ids') // batch comma separated

    if (ids) {
      const list = ids.split(',').map((s) => Number(s.trim())).filter(Boolean)
      if (list.length === 0) return NextResponse.json({ success: false, message: 'ids kosong' }, { status: 400 })
      const { error } = await supabase.from('jogpro_orders').delete().in('id', list)
      if (error) throw error
      return NextResponse.json({ success: true, deleted: list })
    }

    if (!id) return NextResponse.json({ success: false, message: 'id required' }, { status: 400 })
    const { error } = await supabase.from('jogpro_orders').delete().eq('id', Number(id))
    if (error) throw error
    return NextResponse.json({ success: true, deleted: Number(id) })
  } catch (e) {
    console.error('Delete error', e)
    return NextResponse.json({ success: false, message: 'Gagal hapus' }, { status: 500 })
  }
}
