'use client'

import ResultCard from '@/components/ui/ResultCard'

export interface HasilData {
  nama: string
  whatsapp: string
  tujuan?: string
  hasCar: boolean
  carBrand?: string
  carModel?: string
  carYear?: string
  valuationMin?: number
  valuationMax?: number
  primaryBrand: string
  primaryModel: string
  primaryPriceMin: number
  altBrand: string
  altModel: string
  altPriceMin: number
  gapAmount: number
  dominantArchetype: string
  narrative?: string
  source?: string
}

interface Props {
  hasil: HasilData
  onSendWA: () => void
  waSending: boolean
  waSent: boolean
  countdown: number | null
  onReset: () => void
}

export default function Hasil({ hasil, onSendWA, waSending, waSent, countdown, onReset }: Props) {
  const fmtJt = (n: number) => `Rp ${Math.round(n / 1_000_000)} jt`
  const showValuation = hasil.hasCar === true && hasil.valuationMin && hasil.valuationMax
  const showRecommendation = hasil.tujuan !== 'harga' && hasil.primaryBrand
  const showGap = hasil.tujuan === 'tradein' && hasil.hasCar === true
  const showArchetype = hasil.tujuan !== 'harga' && hasil.dominantArchetype

  const archetypeLabel: Record<string, string> = {
    URBAN: 'City Driver',
    FAMILY: 'Family First',
    ADVENTURE: 'Adventure Seeker',
    PREMIUM: 'Premium Taste',
  }

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: 'var(--light-gray)' }}>
      {/* Header */}
      <div className="px-5 pt-8 pb-4" style={{ background: 'var(--trusted-blue)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-white font-black text-xl">OLX</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--certified-orange)', color: '#fff' }}
          >
            Mobbi
          </span>
        </div>
        <h1 className="text-2xl font-black text-white">
          Halo, {hasil.nama.split(' ')[0]}!
        </h1>
        <p className="text-sm mt-1" style={{ color: '#B8C9E8' }}>
          Ini hasil analisa AI untukmu
        </p>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-4">
        {/* Trade-in valuation */}
        {showValuation && (
          <div className="rounded-2xl p-5 border-2" style={{ background: '#fff', borderColor: 'var(--light-blue)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--mid-gray)' }}>
              Mobilmu Sekarang
            </p>
            <p className="font-bold" style={{ color: 'var(--trusted-blue)' }}>
              {hasil.carBrand} {hasil.carModel} {hasil.carYear}
            </p>
            <div className="mt-2 p-3 rounded-xl" style={{ background: 'var(--light-blue)' }}>
              <p className="text-xs font-semibold" style={{ color: 'var(--mid-gray)' }}>
                Estimasi Harga Jual / Trade-in
              </p>
              <p className="text-xl font-black mt-0.5" style={{ color: 'var(--trusted-blue)' }}>
                {fmtJt(hasil.valuationMin!)} &ndash; {fmtJt(hasil.valuationMax!)}
              </p>
            </div>
            {hasil.tujuan === 'harga' && (
              <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--mid-gray)' }}>
                Harga ini adalah estimasi berdasarkan usia, kondisi, dan transmisi.
                Temui tim OLX Mobbi untuk penawaran resmi.
              </p>
            )}
          </div>
        )}

        {/* Recommendations */}
        {showRecommendation && (
          <>
            <ResultCard
              title="Rekomendasi Utama"
              brand={hasil.primaryBrand}
              model={hasil.primaryModel}
              priceMin={hasil.primaryPriceMin}
              badge="Cashback GIIAS 2026"
              accent
            />
            {hasil.narrative && (
              <div className="rounded-2xl px-5 py-4" style={{ background: 'var(--light-blue)' }}>
                <p className="text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--confidence-blue)' }}>
                  Mengapa ini cocok untukmu?
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--trusted-blue)' }}>
                  {hasil.narrative}
                </p>
              </div>
            )}
            <ResultCard
              title="Alternatif"
              brand={hasil.altBrand}
              model={hasil.altModel}
              priceMin={hasil.altPriceMin}
            />
          </>
        )}

        {/* Gap analysis */}
        {showGap && (
          <div className="rounded-2xl p-5" style={{ background: '#fff' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--mid-gray)' }}>
              Estimasi Top-up
            </p>
            <p className="text-2xl font-black" style={{ color: hasil.gapAmount > 0 ? 'var(--certified-orange)' : '#16A34A' }}>
              {hasil.gapAmount > 0 ? `+/- ${fmtJt(hasil.gapAmount)}` : 'Trade-in sudah cukup'}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--mid-gray)' }}>
              {hasil.gapAmount > 0
                ? 'Selisih dari estimasi trade-in ke rekomendasi utama'
                : 'Nilai trade-in mobilmu melebihi harga rekomendasi'}
            </p>
          </div>
        )}

        {/* Archetype */}
        {showArchetype && (
          <div className="rounded-2xl p-4" style={{ background: 'var(--light-blue)' }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--mid-gray)' }}>
              Profil Kamu
            </p>
            <p className="font-black text-lg mt-0.5" style={{ color: 'var(--trusted-blue)' }}>
              {archetypeLabel[hasil.dominantArchetype] ?? hasil.dominantArchetype}
            </p>
          </div>
        )}

        {/* CTA booth */}
        <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--trusted-blue)' }}>
          <p className="text-white font-black text-lg">Temui Tim OLX Mobbi</p>
          <p className="text-sm mt-1" style={{ color: '#B8C9E8' }}>di Booth Hall A &mdash; GIIAS 2026</p>
          <p className="text-sm mt-1 font-bold" style={{ color: 'var(--certified-orange)' }}>
            Penawaran trade-in terbaik menantimu!
          </p>
        </div>

        {/* Send WA */}
        <button
          onClick={onSendWA}
          disabled={waSending || waSent}
          className="w-full py-4 rounded-2xl text-lg font-black text-white transition-all active:scale-95 disabled:opacity-60"
          style={{ background: waSent ? '#16A34A' : '#25D366' }}
        >
          {waSent ? 'Terkirim!' : waSending ? 'Mengirim...' : 'Kirim ke WhatsApp Saya'}
        </button>

        {/* Auto-reset with countdown */}
        <button
          onClick={onReset}
          className="w-full py-4 rounded-2xl text-base font-bold border-2 transition-all active:scale-95"
          style={{ borderColor: '#D1D5DB', color: 'var(--mid-gray)', background: '#fff' }}
        >
          {countdown !== null
            ? `Kembali ke Halaman Awal (${countdown}s)`
            : 'Kembali ke Halaman Awal'}
        </button>

        <p className="text-center text-xs pb-6" style={{ color: 'var(--mid-gray)' }}>
          OLX Mobbi x GIIAS 2026
        </p>
      </div>
    </div>
  )
}
