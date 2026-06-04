import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const token = auth.split(' ')[1]
    const payload = jwt.verify(token, JWT_SECRET) as { id: string }

    const { data, error } = await supabase
      .from('affiliator_claims')
      .select('*')
      .eq('affiliator_id', payload.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
