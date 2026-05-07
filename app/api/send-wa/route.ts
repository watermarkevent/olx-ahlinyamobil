import { NextRequest, NextResponse } from 'next/server'

function fmtJt(n: number) {
  return `Rp ${Math.round(n / 1_000_000)} jt`
}

export async function POST(req: NextRequest) {
  const data = await req.json()

  const wa = String(data.whatsapp ?? '')
    .replace(/^0/, '').replace(/^\+62/, '').replace(/^62/, '')
  const target = `62${wa}`

  const carLine = data.hasCar === true && data.carBrand
    ? `🚗 *Mobilmu sekarang*\n${data.carBrand} ${data.carModel} ${data.carYear}\n💰 Estimasi trade-in: *${fmtJt(data.valuationMin)} – ${fmtJt(data.valuationMax)}*\n\n`
    : ''

  const gapLine = data.hasCar === true && data.gapAmount > 0
    ? `\n📊 *Estimasi top-up kamu: ± ${fmtJt(data.gapAmount)}*`
    : ''

  const message = `Halo ${data.nama}! 👋

Ini hasil *OLX AhlinyaMobil* kamu di GIIAS 2026:

${carLine}⭐ *Rekomendasi Utama*
${data.primaryBrand} ${data.primaryModel}
Harga mulai *${fmtJt(data.primaryPriceMin)}*
✅ Cashback Eksklusif tersedia di GIIAS 2026!

💡 *Alternatif*
${data.altBrand} ${data.altModel} – mulai ${fmtJt(data.altPriceMin)}${gapLine}

Temui tim OLX Mobbi di *Booth Hall A*
untuk penawaran trade-in terbaik! 🙌

_OLX Mobbi × GIIAS 2026_`

  const fonnteKey = process.env.FONNTE_API_KEY
  if (!fonnteKey) {
    console.warn('FONNTE_API_KEY not set, skipping WA send')
    return NextResponse.json({ ok: true, skipped: true })
  }

  const res = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      Authorization: fonnteKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ target, message, countryCode: '62' }),
  })

  const result = await res.json()
  return NextResponse.json({ ok: true, fonnte: result })
}
