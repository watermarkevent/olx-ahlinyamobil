'use client'

interface Props {
  onStart: () => void
}

export default function Landing({ onStart }: Props) {
  return (
    <div className="flex flex-col min-h-dvh" style={{ background: 'var(--trusted-blue)' }}>
      {/* Header */}
      <div className="px-6 pt-10 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white font-black text-2xl tracking-tight">OLX</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--certified-orange)', color: '#fff' }}
          >
            Mobbi
          </span>
        </div>
        <p className="text-xs font-semibold" style={{ color: 'var(--confidence-blue)' }}>
          x GIIAS 2026
        </p>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--certified-orange)' }}>
          #PilihYangAhli
        </p>
        <h1 className="text-4xl font-black text-white leading-tight mb-4">
          AHLI PILIH MOBIL<br />kamu ada di sini.
        </h1>
        <p className="text-base leading-relaxed" style={{ color: '#B8C9E8' }}>
          Dapatkan <strong className="text-white">estimasi trade-in</strong> mobilmu dan{' '}
          <strong className="text-white">rekomendasi mobil baru</strong> yang sesuai profil hidupmu
          — hanya dalam 30 detik.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-l-2 pl-3" style={{ borderColor: 'var(--confidence-blue)' }}>
            <span className="text-sm text-white font-medium">AI analisa profil kamu secara personal</span>
          </div>
          <div className="flex items-center gap-3 border-l-2 pl-3" style={{ borderColor: 'var(--confidence-blue)' }}>
            <span className="text-sm text-white font-medium">Estimasi trade-in real-time</span>
          </div>
          <div className="flex items-center gap-3 border-l-2 pl-3" style={{ borderColor: 'var(--confidence-blue)' }}>
            <span className="text-sm text-white font-medium">Hasil dikirim ke WhatsApp kamu</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-10">
        <button
          onClick={onStart}
          className="w-full py-5 rounded-2xl text-xl font-black text-white transition-transform active:scale-95"
          style={{ background: 'var(--certified-orange)' }}
        >
          Mulai Sekarang
        </button>
        <p className="text-center text-xs mt-3" style={{ color: '#7A9CC4' }}>
          Gratis &middot; Tidak perlu daftar &middot; 30 detik
        </p>
      </div>
    </div>
  )
}
