'use client'

import { FormData } from '@/lib/formState'
import { ProfilingQuestion } from '@/lib/formConfig'
import ProgressBar from '@/components/ui/ProgressBar'
import OptionButton from '@/components/ui/OptionButton'
import MultiSelect from '@/components/ui/MultiSelect'

interface Props {
  question: ProfilingQuestion
  data: FormData
  onChange: (patch: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
  step: number
  totalSteps: number
}

export default function ProfilingStep({ question, data, onChange, onNext, onBack, step, totalSteps }: Props) {
  const value = data[question.id as keyof FormData]
  const isMulti = question.type === 'multi'
  const multiVal = Array.isArray(value) ? value : []
  const singleVal = typeof value === 'string' ? value : ''

  const canContinue = question.optional
    ? true
    : isMulti
    ? multiVal.length > 0
    : singleVal !== ''

  const handleSingle = (label: string) => {
    onChange({ [question.id]: label } as Partial<FormData>)
    setTimeout(onNext, 180)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="px-4 pt-4">
        <button onClick={onBack} className="text-sm font-semibold" style={{ color: 'var(--mid-gray)' }}>
          &larr; Kembali
        </button>
      </div>
      <ProgressBar current={step} total={totalSteps} />

      <div className="flex-1 px-5 py-6 flex flex-col gap-5 overflow-y-auto">
        <h2 className="text-2xl font-black leading-snug" style={{ color: 'var(--trusted-blue)' }}>
          {question.question}
        </h2>

        {isMulti ? (
          <>
            <MultiSelect
              options={question.options}
              selected={multiVal}
              max={question.max ?? 2}
              onChange={(val) => onChange({ [question.id]: val } as Partial<FormData>)}
            />
            {question.optional && (
              <button
                onClick={onNext}
                className="text-sm font-semibold underline"
                style={{ color: 'var(--mid-gray)' }}
              >
                Lewati pertanyaan ini
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-3">
            {question.options.map((opt) => (
              <OptionButton
                key={opt.label}
                label={opt.label}
                selected={singleVal === opt.label}
                onClick={() => handleSingle(opt.label)}
              />
            ))}
          </div>
        )}
      </div>

      {isMulti && (
        <div className="px-5 pb-8">
          <button
            onClick={onNext}
            disabled={!canContinue}
            className="w-full py-4 rounded-2xl text-lg font-black text-white transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'var(--confidence-blue)' }}
          >
            Lanjut
          </button>
        </div>
      )}
    </div>
  )
}
