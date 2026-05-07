import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const HIGH_INCOME = new Set(['Rp 10–20 jt', 'Rp 20–50 jt', '> Rp 50 jt'])

function calcLeadQuality(form: Record<string, unknown>): 'HOT' | 'WARM' | 'COLD' {
  const hasCar = form.hasCar === true
  const tujuan = form.tujuan as string | undefined
  const wantsTradeOrRekomendasi = tujuan === 'tradein' || tujuan === 'rekomendasi'
  const highIncome = HIGH_INCOME.has(form.incomeRange as string)

  if (hasCar && wantsTradeOrRekomendasi && highIncome) return 'HOT'
  if (hasCar || highIncome) return 'WARM'
  return 'COLD'
}

async function sendManagerAlert(form: Record<string, unknown>, quality: string) {
  const managerWa = process.env.MANAGER_WHATSAPP
  const fonnteToken = process.env.FONNTE_TOKEN
  if (!managerWa || !fonnteToken || quality !== 'HOT') return

  const wa = (form.whatsapp as string).replace(/^0/, '').replace(/^\+62/, '').replace(/^62/, '')
  const normalizedWa = `62${wa}`
  const src = (form.source as string) ?? 'direct'

  const msg = [
    `🔥 *HOT LEAD ALERT* — OLX AhlinyaMobil`,
    ``,
    `Nama  : ${form.nama}`,
    `WA    : +${normalizedWa}`,
    `Source: ${src}`,
    `Mobil : ${form.carBrand ?? '-'} ${form.carModel ?? '-'} ${form.carYear ?? ''}`.trim(),
    `Income: ${form.incomeRange ?? '-'}`,
    `Tujuan: ${form.tujuan ?? '-'}`,
  ].join('\n')

  try {
    await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { Authorization: fonnteToken },
      body: new URLSearchParams({ target: managerWa, message: msg }),
    })
  } catch (e) {
    console.error('Manager WA alert failed:', e)
  }
}

export async function POST(req: NextRequest) {
  const { form, valuation, recommendation, source } = await req.json()

  const wa = (form.whatsapp as string).replace(/^0/, '').replace(/^\+62/, '').replace(/^62/, '')
  const normalizedWa = `62${wa}`

  const gapAmount = recommendation
    ? (valuation
        ? Math.max(0, recommendation.primary.priceMin - valuation.max)
        : recommendation.primary.priceMin)
    : null

  const leadQuality = calcLeadQuality({ ...form, source })

  const { error } = await supabaseAdmin().from('leads').insert({
    nama: form.nama,
    whatsapp: normalizedWa,
    domisili: form.domisili,
    source: source ?? null,
    lead_quality: leadQuality,
    has_car: form.hasCar,
    tujuan: form.tujuan || null,
    car_brand: form.carBrand || null,
    car_model: form.carModel || null,
    car_year: form.carYear ? parseInt(form.carYear) : null,
    car_transmission: form.carTransmission || null,
    car_variant: form.carVariant || null,
    car_province: form.carProvince || null,
    car_kilometer: form.carKilometer || null,
    car_condition: form.carCondition || null,
    estimated_value_min: valuation?.min ?? null,
    estimated_value_max: valuation?.max ?? null,
    job: form.job || null,
    hobbies: form.hobbies?.length ? form.hobbies : null,
    income_range: form.incomeRange || null,
    family_status: form.familyStatus || null,
    kids_count: form.kidsCount || null,
    car_usage: form.carUsage || null,
    car_priority: form.carPriority || null,
    dominant_archetype: recommendation?.dominantArchetype ?? null,
    recommended_primary: recommendation
      ? `${recommendation.primary.brand} ${recommendation.primary.model}`
      : null,
    recommended_alt: recommendation
      ? `${recommendation.alternative.brand} ${recommendation.alternative.model}`
      : null,
    gap_amount: gapAmount,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Non-blocking manager alert
  sendManagerAlert({ ...form, source }, leadQuality)

  return NextResponse.json({ ok: true, leadQuality })
}
