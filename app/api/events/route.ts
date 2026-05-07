import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { sessionId, source, eventType, metadata } = await req.json()

  const { error } = await supabaseAdmin().from('events').insert({
    session_id: sessionId,
    source: source ?? null,
    event_type: eventType,
    metadata: metadata ?? {},
  })

  if (error) {
    console.error('events insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
