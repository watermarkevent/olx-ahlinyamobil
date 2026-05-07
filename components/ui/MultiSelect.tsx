'use client'

interface Props {
  options: { label: string }[]
  selected: string[]
  max: number
  onChange: (val: string[]) => void
}

export default function MultiSelect({ options, selected, max, onChange }: Props) {
  const toggle = (label: string) => {
    if (selected.includes(label)) {
      onChange(selected.filter((s) => s !== label))
    } else if (selected.length < max) {
      onChange([...selected, label])
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.label)
        const disabled = !isSelected && selected.length >= max
        return (
          <button
            key={opt.label}
            onClick={() => toggle(opt.label)}
            disabled={disabled}
            className="w-full text-left px-5 py-4 rounded-2xl border-2 text-base font-semibold transition-all duration-150 min-h-[56px] flex items-center justify-between disabled:opacity-40"
            style={{
              borderColor: isSelected ? 'var(--confidence-blue)' : '#D1D5DB',
              background: isSelected ? 'var(--light-blue)' : '#FFFFFF',
              color: isSelected ? 'var(--trusted-blue)' : '#374151',
            }}
          >
            <span>{opt.label}</span>
            {isSelected && (
              <span className="text-sm font-bold" style={{ color: 'var(--confidence-blue)' }}>&#10003;</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
