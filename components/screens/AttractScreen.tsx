'use client'

interface Props {
  onTap: () => void
}

export default function AttractScreen({ onTap }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh cursor-pointer select-none"
      style={{ background: 'var(--trusted-blue)' }}
      onClick={onTap}
      onTouchStart={onTap}
    >
      {/* Pulsing ring animation */}
      <div className="relative flex items-center justify-center mb-12">
        <span
          className="absolute inline-flex rounded-full opacity-25 animate-ping"
          style={{
            width: 160,
            height: 160,
            background: 'var(--certified-orange)',
          }}
        />
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: 128,
            height: 128,
            background: 'var(--certified-orange)',
          }}
        >
          {/* Simple car icon via SVG */}
          <svg width="56" height="56" viewBox="0 0 24 24" fill="white">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"/>
            <circle cx="7.5" cy="14.5" r="1.5"/>
            <circle cx="16.5" cy="14.5" r="1.5"/>
          </svg>
        </div>
      </div>

      <div className="text-center px-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--certified-orange)' }}>
          #PilihYangAhli
        </p>
        <h1 className="text-4xl font-black text-white leading-tight mb-4">
          Sentuh untuk<br />Mulai
        </h1>
        <p className="text-base leading-relaxed" style={{ color: '#B8C9E8' }}>
          Dapatkan estimasi trade-in &amp;<br />rekomendasi mobil baru<br />dalam 2 menit
        </p>
      </div>

      <div className="mt-16 flex flex-col items-center gap-2">
        <div
          className="px-8 py-4 rounded-2xl text-xl font-black text-white animate-bounce"
          style={{ background: 'var(--certified-orange)' }}
        >
          Tap di mana saja
        </div>
        <p className="text-xs mt-2" style={{ color: '#7A9CC4' }}>
          OLXmobbi × GIIAS 2026
        </p>
      </div>
    </div>
  )
}
