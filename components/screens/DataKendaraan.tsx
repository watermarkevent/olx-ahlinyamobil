'use client'

import { FormData } from '@/lib/formState'
import { getBrands, getModelsByBrand, getYearsByBrandModel } from '@/lib/carDatabase'
import ProgressBar from '@/components/ui/ProgressBar'

interface Props {
  data: FormData
  onChange: (patch: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
  step: number
  totalSteps: number
}

const PROVINCE_OPTIONS = [
  'Jabodetabek', 'Banten', 'Bandung', 'Surabaya & Malang',
  'Semarang', 'Palembang', 'Pekanbaru', 'Medan', 'Balikpapan', 'Denpasar',
]

const KILOMETER_OPTIONS = [
  '< 20.000 km',
  '20.001 – 50.000 km',
  '50.001 – 100.000 km',
  '100.001 – 150.000 km',
  '> 150.000 km',
]

const CONDITIONS = ['Sangat Baik', 'Baik', 'Cukup', 'Perlu Perbaikan']
const CONDITION_DESC: Record<string, string> = {
  'Sangat Baik': 'Seperti baru, tidak ada cacat',
  'Baik': 'Minor scratches, mesin bagus',
  'Cukup': 'Beberapa perbaikan kecil diperlukan',
  'Perlu Perbaikan': 'Butuh perbaikan signifikan',
}

const selectClass = 'w-full px-4 py-3.5 rounded-xl border-2 text-base outline-none appearance-none'

export default function DataKendaraan({ data, onChange, onNext, onBack, step, totalSteps }: Props) {
  const brands = getBrands()
  const models = data.carBrand ? getModelsByBrand(data.carBrand) : []
  const years = data.carBrand && data.carModel
    ? getYearsByBrandModel(data.carBrand, data.carModel)
    : []

  const valid = data.carBrand && data.carModel && data.carYear && data.carTransmission && data.carProvince && data.carKilometer && data.carCondition

  const fieldStyle = (val: string) => ({
    borderColor: val ? 'var(--confidence-blue)' : '#D1D5DB',
    color: val ? 'var(--trusted-blue)' : 'var(--mid-gray)',
    background: '#fff',
  })

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="px-4 pt-4">
        <button onClick={onBack} className="text-sm font-semibold" style={{ color: 'var(--mid-gray)' }}>
          &larr; Kembali
        </button>
      </div>
      <ProgressBar current={step} total={totalSteps} />

      <div className="flex-1 px-5 py-6 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: 'var(--trusted-blue)' }}>
            Data kendaraanmu
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--mid-gray)' }}>
            Untuk estimasi trade-in yang akurat
          </p>
        </div>

        {/* Merek */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold" style={{ color: 'var(--trusted-blue)' }}>Merek</label>
          <select
            value={data.carBrand}
            onChange={(e) => onChange({ carBrand: e.target.value, carModel: '', carYear: '' })}
            className={selectClass}
            style={fieldStyle(data.carBrand)}
          >
            <option value="">Pilih merek</option>
            {brands.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>

        {/* Model */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold" style={{ color: 'var(--trusted-blue)' }}>Model</label>
          <select
            value={data.carModel}
            onChange={(e) => onChange({ carModel: e.target.value, carYear: '' })}
            disabled={!data.carBrand}
            className={selectClass}
            style={fieldStyle(data.carModel)}
          >
            <option value="">Pilih model</option>
            {models.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>

        {/* Tahun */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold" style={{ color: 'var(--trusted-blue)' }}>Tahun</label>
          <select
            value={data.carYear}
            onChange={(e) => onChange({ carYear: e.target.value })}
            disabled={!data.carModel}
            className={selectClass}
            style={fieldStyle(data.carYear)}
          >
            <option value="">Pilih tahun</option>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>

        {/* Transmisi */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold" style={{ color: 'var(--trusted-blue)' }}>Transmisi</label>
          <div className="flex gap-3">
            {['Otomatis', 'Manual'].map((t) => (
              <button
                key={t}
                onClick={() => onChange({ carTransmission: t })}
                className="flex-1 py-3.5 rounded-xl border-2 font-bold text-base transition-all"
                style={{
                  borderColor: data.carTransmission === t ? 'var(--confidence-blue)' : '#D1D5DB',
                  background: data.carTransmission === t ? 'var(--light-blue)' : '#fff',
                  color: data.carTransmission === t ? 'var(--trusted-blue)' : '#374151',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Varian */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold" style={{ color: 'var(--trusted-blue)' }}>
            Varian <span className="font-normal" style={{ color: 'var(--mid-gray)' }}>(opsional)</span>
          </label>
          <input
            type="text"
            value={data.carVariant}
            onChange={(e) => onChange({ carVariant: e.target.value })}
            placeholder="Contoh: 2.5 G Bensin-AT"
            className="w-full px-4 py-3.5 rounded-xl border-2 text-base outline-none transition-colors"
            style={{
              borderColor: data.carVariant ? 'var(--confidence-blue)' : '#D1D5DB',
              color: 'var(--trusted-blue)',
            }}
          />
        </div>

        {/* Provinsi */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold" style={{ color: 'var(--trusted-blue)' }}>Provinsi</label>
          <select
            value={data.carProvince}
            onChange={(e) => onChange({ carProvince: e.target.value })}
            className={selectClass}
            style={fieldStyle(data.carProvince)}
          >
            <option value="">Pilih provinsi / kota</option>
            {PROVINCE_OPTIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        {/* Kilometer */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold" style={{ color: 'var(--trusted-blue)' }}>Kilometer</label>
          <select
            value={data.carKilometer}
            onChange={(e) => onChange({ carKilometer: e.target.value })}
            className={selectClass}
            style={fieldStyle(data.carKilometer)}
          >
            <option value="">Pilih jarak tempuh</option>
            {KILOMETER_OPTIONS.map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>

        {/* Kondisi */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold" style={{ color: 'var(--trusted-blue)' }}>Kondisi</label>
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => onChange({ carCondition: c })}
              className="w-full text-left px-4 py-3 rounded-xl border-2 transition-all"
              style={{
                borderColor: data.carCondition === c ? 'var(--confidence-blue)' : '#D1D5DB',
                background: data.carCondition === c ? 'var(--light-blue)' : '#fff',
              }}
            >
              <span className="font-bold text-sm" style={{ color: 'var(--trusted-blue)' }}>{c}</span>
              <span className="text-xs block" style={{ color: 'var(--mid-gray)' }}>{CONDITION_DESC[c]}</span>
            </button>
          ))}
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
