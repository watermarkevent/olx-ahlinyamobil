'use client'

interface Props {
  label: string
  selected: boolean
  onClick: () => void
}

export default function OptionButton({ label, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-5 py-4 rounded-2xl border-2 text-base font-semibold transition-all duration-150 min-h-[56px] flex items-center justify-between"
      style={{
        borderColor: selected ? 'var(--confidence-blue)' : '#D1D5DB',
        background: selected ? 'var(--light-blue)' : '#FFFFFF',
        color: selected ? 'var(--trusted-blue)' : '#374151',
      }}
    >
      <span>{label}</span>
      {selected && (
        <span className="text-sm font-bold" style={{ color: 'var(--confidence-blue)' }}>&#10003;</span>
      )}
    </button>
  )
}
