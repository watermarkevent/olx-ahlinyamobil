import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('x-admin-password')
  if (auth !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabaseAdmin()

  // ── Total leads + per source ──────────────────────────────────────
  const { data: leads, error: leadsError } = await db
    .from('leads')
    .select('id, created_at, source, lead_quality, has_car, dominant_archetype, nama, whatsapp, car_brand, car_model, car_year, income_range, tujuan')
    .order('created_at', { ascending: false })

  if (leadsError) {
    return NextResponse.json({ error: leadsError.message }, { status: 500 })
  }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  const totalLeads = leads?.length ?? 0
  const todayLeads = leads?.filter((l) => l.created_at >= todayStart).length ?? 0

  // Per source
  const sourceMap: Record<string, number> = {}
  leads?.forEach((l) => {
    const src = l.source ?? 'direct'
    sourceMap[src] = (sourceMap[src] ?? 0) + 1
  })

  // Quality breakdown
  const qualityMap = { HOT: 0, WARM: 0, COLD: 0 }
  leads?.forEach((l) => {
    const q = (l.lead_quality as keyof typeof qualityMap) ?? 'COLD'
    qualityMap[q] = (qualityMap[q] ?? 0) + 1
  })

  // Archetype breakdown
  const archetypeMap: Record<string, number> = {}
  leads?.forEach((l) => {
    if (l.dominant_archetype) {
      archetypeMap[l.dominant_archetype] = (archetypeMap[l.dominant_archetype] ?? 0) + 1
    }
  })

  // ── Last 7 days ───────────────────────────────────────────────────
  const last7: { date: string; count: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dayStr = d.toISOString().slice(0, 10)
    const count = leads?.filter((l) => l.created_at.slice(0, 10) === dayStr).length ?? 0
    last7.push({ date: dayStr, count })
  }

  // ── Funnel events ─────────────────────────────────────────────────
  const { data: events } = await db
    .from('events')
    .select('event_type, created_at, source')

  const startedTotal = events?.filter((e) => e.event_type === 'form_started').length ?? 0
  const completedTotal = events?.filter((e) => e.event_type === 'form_completed').length ?? 0

  // ── Recent 20 leads ───────────────────────────────────────────────
  const recentLeads = leads?.slice(0, 20).map((l) => ({
    id: l.id,
    created_at: l.created_at,
    source: l.source ?? 'direct',
    lead_quality: l.lead_quality ?? 'COLD',
    nama: l.nama,
    whatsapp: l.whatsapp,
    car_brand: l.car_brand,
    car_model: l.car_model,
    car_year: l.car_year,
    dominant_archetype: l.dominant_archetype,
    income_range: l.income_range,
  })) ?? []

  return NextResponse.json({
    totalLeads,
    todayLeads,
    sourceBreakdown: sourceMap,
    qualityBreakdown: qualityMap,
    archetypeBreakdown: archetypeMap,
    last7Days: last7,
    funnel: { started: startedTotal, completed: completedTotal },
    recentLeads,
  })
}
