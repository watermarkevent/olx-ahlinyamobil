import { NextRequest, NextResponse } from 'next/server'

function fmtJt(n: number) {
  return `Rp ${Math.round(n / 1_000_000)} jt`
}

export async function POST(req: NextRequest) {
  const data = await req.json()

  const wa = String(data.whatsapp ?? '')
    .replace(/^0/, '').replace(/^\+62/, '').replace(/^62/, '')
  const target = `62${wa}`

  // ── Build message based on tujuan ──────────────────────────────
  const carLine = data.hasCar === true && data.carBrand
    ? `🚗 *Mobilmu sekarang*\n${data.carBrand} ${data.carModel} ${data.carYear}\n`
    : ''

  const valuationLine = data.valuationMin && data.valuationMax
    ? `💰 Estimasi trade-in: *${fmtJt(data.valuationMin)} – ${fmtJt(data.valuationMax)}*\n`
    : ''

  const recommendationBlock = data.primaryBrand && data.primaryModel
    ? `\n⭐ *Rekomendasi Utama*\n${data.primaryBrand} ${data.primaryModel}\nHarga mulai *${fmtJt(data.primaryPriceMin)}*\n✅ Cashback Eksklusif tersedia di GIIAS 2026!\n\n💡 *Alternatif*\n${data.altBrand} ${data.altModel} – mulai ${fmtJt(data.altPriceMin)}`
    : ''

  const gapLine = data.hasCar === true && data.gapAmount > 0 && data.primaryBrand
    ? `\n📊 *Estimasi top-up kamu: ± ${fmtJt(data.gapAmount)}*`
    : ''

  const message = `Halo ${data.nama}! 👋

Ini hasil *OLX AhlinyaMobil* kamu di GIIAS 2026:

${carLine}${valuationLine}${recommendationBlock}${gapLine}

Temui tim OLXmobbi di *Booth Hall A*
untuk penawaran trade-in terbaik! 🙌

_OLXmobbi × GIIAS 2026_`

  const fonnteToken = process.env.FONNTE_TOKEN
  if (!fonnteToken) {
    console.warn('FONNTE_TOKEN not set, skipping WA send')
    return NextResponse.json({ ok: true, skipped: true })
  }

  const res = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { Authorization: fonnteToken },
    body: new URLSearchParams({ target, message, countryCode: '62' }),
  })

  const result = await res.json()
  return NextResponse.json({ ok: true, fonnte: result })
}
