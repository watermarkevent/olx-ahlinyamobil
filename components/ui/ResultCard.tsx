'use client'

interface Props {
  title: string
  brand: string
  model: string
  priceMin: number
  badge?: string
  accent?: boolean
}

export default function ResultCard({ title, brand, model, priceMin, badge, accent }: Props) {
  const jt = Math.round(priceMin / 1_000_000)
  return (
    <div
      className="rounded-2xl p-5 border-2"
      style={{
        borderColor: accent ? 'var(--confidence-blue)' : '#E5E7EB',
        background: accent ? 'var(--light-blue)' : '#FFFFFF',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--mid-gray)' }}>
          {title}
        </p>
        {badge && (
          <span
            className="text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap"
            style={{ background: 'var(--certified-orange)', color: '#fff' }}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="text-xl font-bold mt-1" style={{ color: 'var(--trusted-blue)' }}>
        {brand} {model}
      </p>
      <p className="text-sm mt-1" style={{ color: 'var(--mid-gray)' }}>
        Mulai <span className="font-bold text-base" style={{ color: 'var(--trusted-blue)' }}>Rp {jt} jt</span>
      </p>
    </div>
  )
}
