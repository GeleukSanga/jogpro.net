import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function checkAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_KEY
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const { claim_id, action } = await req.json()
    if (action === 'approve') {
      const { data: claim } = await supabase.from('affiliator_claims').select('views_count').eq('id', claim_id).single()
      const commission_amount = Math.floor((claim?.views_count || 0) / 1000) * 5000
      await supabase.from('affiliator_claims').update({ status: 'approved', commission_amount, reviewed_at: new Date().toISOString() }).eq('id', claim_id)
    } else {
      await supabase.from('affiliator_claims').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', claim_id)
    }
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
