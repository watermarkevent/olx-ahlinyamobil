'use client'

interface Props {
  nama: string
  carBrand: string
  carModel: string
  carYear: string
  valuationMin: number
  valuationMax: number
  onYes: () => void
  onNo: () => void
}

export default function TawarRekomendasiScreen({
  nama, carBrand, carModel, carYear,
  valuationMin, valuationMax,
  onYes, onNo,
}: Props) {
  const fmtJt = (n: number) => `Rp ${Math.round(n / 1_000_000)} jt`

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="px-5 pt-8 pb-4" style={{ background: 'var(--trusted-blue)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-white font-black text-xl">OLX</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--certified-orange)', color: '#fff' }}>
            Mobbi
          </span>
        </div>
        <h1 className="text-xl font-black text-white">
          Halo, {nama.split(' ')[0]}!
        </h1>
        <p className="text-sm mt-0.5" style={{ color: '#B8C9E8' }}>
          Estimasi harga mobilmu sudah siap
        </p>
      </div>

      <div className="flex-1 px-5 py-6 flex flex-col gap-6">
        {/* Valuation result */}
        <div className="rounded-2xl p-5 border-2" style={{ borderColor: 'var(--light-blue)', background: '#fff' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--mid-gray)' }}>
            Mobilmu Sekarang
          </p>
          <p className="font-bold" style={{ color: 'var(--trusted-blue)' }}>
            {carBrand} {carModel} {carYear}
          </p>
          <div className="mt-3 p-4 rounded-xl" style={{ background: 'var(--light-blue)' }}>
            <p className="text-xs font-semibold" style={{ color: 'var(--mid-gray)' }}>
              Estimasi Harga Jual / Trade-in
            </p>
            <p className="text-2xl font-black mt-1" style={{ color: 'var(--trusted-blue)' }}>
              {fmtJt(valuationMin)} &ndash; {fmtJt(valuationMax)}
            </p>
          </div>
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--mid-gray)' }}>
            Estimasi berdasarkan usia, kondisi, dan transmisi kendaraan.
            Temui tim OLX Mobbi untuk penawaran resmi.
          </p>
        </div>

        {/* Offer */}
        <div className="rounded-2xl p-5 border-2" style={{ borderColor: '#E5E7EB' }}>
          <p className="text-base font-black" style={{ color: 'var(--trusted-blue)' }}>
            Mau coba rekomendasi mobil baru?
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--mid-gray)' }}>
            AI kami bisa rekomendasikan mobil yang paling cocok dengan profil dan kebutuhanmu — hanya 2 menit.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-8 flex flex-col gap-3">
        <button
          onClick={onYes}
          className="w-full py-4 rounded-2xl text-lg font-black text-white transition-all active:scale-95"
          style={{ background: 'var(--confidence-blue)' }}
        >
          Ya, coba rekomendasi
        </button>
        <button
          onClick={onNo}
          className="w-full py-4 rounded-2xl text-lg font-black border-2 transition-all active:scale-95"
          style={{ borderColor: '#D1D5DB', color: 'var(--mid-gray)', background: '#fff' }}
        >
          Tidak, sudah cukup
        </button>
      </div>
    </div>
  )
}
