'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  'Menganalisa profil kamu...',
  'Menghitung nilai trade-in...',
  'Mencocokkan rekomendasi terbaik...',
  'Menyiapkan hasil untukmu...',
]

export default function LoadingScreen() {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i < STEPS.length - 1 ? i + 1 : i))
    }, 900)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh px-6"
      style={{ background: 'var(--trusted-blue)' }}
    >
      {/* Spinner */}
      <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin mb-8"
        style={{ borderColor: 'var(--confidence-blue)', borderTopColor: 'transparent' }}
      />

      <h2 className="text-2xl font-black text-white text-center mb-6">
        AI sedang menganalisa...
      </h2>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className="flex items-center gap-3 transition-all duration-300"
            style={{ opacity: i <= stepIndex ? 1 : 0.3 }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: i < stepIndex ? '#5FFFB0' : i === stepIndex ? 'var(--confidence-blue)' : '#7A9CC4' }}
            />
            <span className="text-sm font-medium" style={{ color: i <= stepIndex ? '#fff' : '#7A9CC4' }}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
