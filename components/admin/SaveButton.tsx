'use client'

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved'

const CONFIG: Record<SaveStatus, { label: string; className: string; disabled: boolean }> = {
  idle: {
    label: 'Salvar',
    className: 'bg-brand-cream/10 text-brand-cream/25 cursor-not-allowed border border-transparent',
    disabled: true,
  },
  dirty: {
    label: 'Salvar',
    className:
      'bg-brand-gold text-brand-navy-deep hover:opacity-90 cursor-pointer border border-transparent',
    disabled: false,
  },
  saving: {
    label: 'Salvando…',
    className: 'bg-brand-gold/50 text-brand-navy-deep cursor-not-allowed border border-transparent',
    disabled: true,
  },
  saved: {
    label: '✓ Salvo!',
    className: 'bg-green-600 text-white cursor-not-allowed border border-transparent',
    disabled: true,
  },
}

export function SaveButton({ status }: { status: SaveStatus }) {
  const { label, className, disabled } = CONFIG[status]
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`flex items-center gap-2 rounded px-5 py-2 font-sans text-xs font-semibold transition-all duration-200 ${className}`}
    >
      {status === 'saving' && (
        <svg
          className="h-3.5 w-3.5 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeOpacity="0.25"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {label}
    </button>
  )
}
