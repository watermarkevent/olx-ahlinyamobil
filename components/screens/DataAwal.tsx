'use client'

import { FormData } from '@/lib/formState'
import { DOMISILI_OPTIONS } from '@/lib/formConfig'
import ProgressBar from '@/components/ui/ProgressBar'

interface Props {
  data: FormData
  onChange: (patch: Partial<FormData>) => void
  onNext: () => void
  onBack?: () => void
  step: number
  totalSteps: number
}

export default function DataAwal({ data, onChange, onNext, onBack, step, totalSteps }: Props) {
  const valid = data.nama.trim() && data.whatsapp.trim() && data.domisili

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      {onBack && (
        <div className="px-4 pt-4">
          <button onClick={onBack} className="text-sm font-semibold" style={{ color: 'var(--mid-gray)' }}>
            &larr; Kembali
          </button>
        </div>
      )}
      <ProgressBar current={step} total={totalSteps} />

      <div className="flex-1 px-5 py-6 flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-black" style={{ color: 'var(--trusted-blue)' }}>
            Kenalan dulu, yuk!
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--mid-gray)' }}>
            Data kamu aman dan hanya digunakan untuk analisa
          </p>
        </div>

        {/* Nama */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold" style={{ color: 'var(--trusted-blue)' }}>
            Nama Lengkap
          </label>
          <input
            type="text"
            value={data.nama}
            onChange={(e) => onChange({ nama: e.target.value.replace(/[^a-zA-Z\s]/g, '') })}
            placeholder="contoh: Budi Santoso"
            className="w-full px-4 py-3.5 rounded-xl border-2 text-base outline-none transition-colors"
            style={{
              borderColor: data.nama ? 'var(--confidence-blue)' : '#D1D5DB',
              color: 'var(--trusted-blue)',
            }}
          />
        </div>

        {/* WhatsApp */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold" style={{ color: 'var(--trusted-blue)' }}>
            Nomor WhatsApp Aktif
          </label>
          <div className="flex gap-2">
            <div
              className="px-4 py-3.5 rounded-xl border-2 font-bold text-base"
              style={{ borderColor: '#D1D5DB', color: 'var(--mid-gray)', background: '#F5F7FA' }}
            >
              +62
            </div>
            <input
              type="tel"
              inputMode="numeric"
              value={data.whatsapp}
              onChange={(e) => {
                const numeric = e.target.value.replace(/\D/g, '').replace(/^0+/, '')
                onChange({ whatsapp: numeric })
              }}
              placeholder="8123456789"
              className="flex-1 px-4 py-3.5 rounded-xl border-2 text-base outline-none transition-colors"
              style={{
                borderColor: data.whatsapp ? 'var(--confidence-blue)' : '#D1D5DB',
                color: 'var(--trusted-blue)',
              }}
            />
          </div>
        </div>

        {/* Domisili */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold" style={{ color: 'var(--trusted-blue)' }}>
            Domisili
          </label>
          <select
            value={data.domisili}
            onChange={(e) => onChange({ domisili: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl border-2 text-base outline-none appearance-none"
            style={{
              borderColor: data.domisili ? 'var(--confidence-blue)' : '#D1D5DB',
              color: data.domisili ? 'var(--trusted-blue)' : 'var(--mid-gray)',
              background: '#fff',
            }}
          >
            <option value="">Pilih kota domisili</option>
            {DOMISILI_OPTIONS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-5 pb-8">
        <button
          onClick={onNext}
          disabled={!valid}
          className="w-full py-4 rounded-2xl text-lg font-black text-white transition-all active:scale-95 disabled:opacity-40"
          style={{ background: 'var(--confidence-blue)' }}
        >
          Lanjut
        </button>
      </div>
    </div>
  )
}
