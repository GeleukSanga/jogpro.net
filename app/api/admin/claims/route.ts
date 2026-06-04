import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function checkAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_KEY
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const status = req.nextUrl.searchParams.get('status') || 'pending'
  const { data, error } = await supabase
    .from('affiliator_claims')
    .select('*, affiliators(full_name, tiktok_username)')
    .eq('status', status)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}
