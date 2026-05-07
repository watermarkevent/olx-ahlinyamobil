'use client'

import { FormData } from '@/lib/formState'
import ProgressBar from '@/components/ui/ProgressBar'

interface Props {
  data: FormData
  onChange: (patch: Partial<FormData>) => void
  onSelect: (tujuan: 'harga' | 'rekomendasi' | 'tradein') => void
  onBack: () => void
  step: number
  totalSteps: number
}

const OPTIONS = [
  {
    value: 'harga' as const,
    title: 'Ingin tau harga mobilku sekarang',
    desc: 'Estimasi nilai jual / trade-in mobilmu saat ini',
  },
  {
    value: 'rekomendasi' as const,
    title: 'Ingin tau rekomendasi mobil baru',
    desc: 'AI analisa profil dan rekomendasikan mobil yang cocok',
  },
  {
    value: 'tradein' as const,
    title: 'Saran trade-in lengkap',
    desc: 'Estimasi trade-in + rekomendasi + analisa selisih harga',
  },
]

export default function TujuanScreen({ data, onChange, onSelect, onBack, step, totalSteps }: Props) {
  const select = (val: typeof OPTIONS[number]['value']) => {
    onChange({ tujuan: val })
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

      <div className="flex-1 px-5 py-4 flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-black" style={{ color: 'var(--trusted-blue)' }}>
            Kamu mau tau apa?
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--mid-gray)' }}>
            Pilih sesuai kebutuhanmu
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              className="w-full rounded-2xl border-2 p-5 text-left transition-all active:scale-95"
              style={{
                borderColor: data.tujuan === opt.value ? 'var(--confidence-blue)' : '#E5E7EB',
                background: data.tujuan === opt.value ? 'var(--light-blue)' : '#fff',
              }}
            >
              <p className="text-base font-black" style={{ color: 'var(--trusted-blue)' }}>{opt.title}</p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--mid-gray)' }}>{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
