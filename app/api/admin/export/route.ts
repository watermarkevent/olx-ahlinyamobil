import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('x-admin-password')
  if (auth !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabaseAdmin()

  const { data: leads, error } = await db
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const headers = [
    'id', 'created_at', 'source', 'lead_quality',
    'nama', 'whatsapp', 'domisili',
    'has_car', 'car_brand', 'car_model', 'car_year', 'car_variant',
    'car_transmission', 'car_province', 'car_kilometer', 'car_condition',
    'estimated_value_min', 'estimated_value_max',
    'job', 'income_range', 'family_status', 'kids_count',
    'car_usage', 'car_priority', 'hobbies',
    'dominant_archetype', 'recommended_primary', 'recommended_alt', 'gap_amount',
  ]

  const escape = (v: unknown): string => {
    if (v === null || v === undefined) return ''
    const s = Array.isArray(v) ? v.join(';') : String(v)
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }

  const rows = [
    headers.join(','),
    ...(leads ?? []).map((row) =>
      headers.map((h) => escape(row[h])).join(',')
    ),
  ]

  const csv = rows.join('\n')
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
