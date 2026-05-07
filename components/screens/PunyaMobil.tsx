'use client'

import { FormData } from '@/lib/formState'
import ProgressBar from '@/components/ui/ProgressBar'

interface Props {
  data: FormData
  onChange: (patch: Partial<FormData>) => void
  onSelect: (hasCar: boolean) => void
  onBack: () => void
  step: number
  totalSteps: number
}

export default function PunyaMobil({ data, onChange, onSelect, onBack, step, totalSteps }: Props) {
  const select = (val: boolean) => {
    onChange({ hasCar: val })
    setTimeout(() => onSelect(val), 180)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="px-4 pt-4">
        <button onClick={onBack} className="text-sm font-semibold" style={{ color: 'var(--mid-gray)' }}>
          &larr; Kembali
        </button>
      </div>
      <ProgressBar current={step} total={totalSteps} />

      <div className="flex-1 px-5 py-6 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-black" style={{ color: 'var(--trusted-blue)' }}>
            Kamu punya mobil sekarang?
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--mid-gray)' }}>
            Kalau punya, kita bantu hitung estimasi trade-in-nya
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <button
            onClick={() => select(true)}
            className="w-full rounded-2xl border-2 p-6 text-left transition-all active:scale-95"
            style={{
              borderColor: data.hasCar === true ? 'var(--confidence-blue)' : '#E5E7EB',
              background: data.hasCar === true ? 'var(--light-blue)' : '#fff',
            }}
          >
            <p className="text-lg font-black" style={{ color: 'var(--trusted-blue)' }}>
              Ya, punya mobil
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--mid-gray)' }}>
              Hitung estimasi trade-in + rekomendasi upgrade
            </p>
          </button>

          <button
            onClick={() => select(false)}
            className="w-full rounded-2xl border-2 p-6 text-left transition-all active:scale-95"
            style={{
              borderColor: data.hasCar === false ? 'var(--confidence-blue)' : '#E5E7EB',
              background: data.hasCar === false ? 'var(--light-blue)' : '#fff',
            }}
          >
            <p className="text-lg font-black" style={{ color: 'var(--trusted-blue)' }}>
              Belum punya mobil
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--mid-gray)' }}>
              Langsung dapat rekomendasi mobil pertamamu
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
