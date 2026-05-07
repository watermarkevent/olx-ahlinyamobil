'use client'

interface Props {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full px-4 pt-4 pb-2">
      <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--mid-gray)' }}>
        <span>Langkah {current} dari {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 rounded-full" style={{ background: 'var(--light-blue)' }}>
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: 'var(--confidence-blue)' }}
        />
      </div>
    </div>
  )
}
