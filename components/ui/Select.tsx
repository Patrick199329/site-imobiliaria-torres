'use client'

import { forwardRef, SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, id, className = '', disabled, ...props }, ref) => {
    const selectId = id ?? `select-${Math.random().toString(36).slice(2, 9)}`
    const errorId = `${selectId}-error`

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="label-caps text-brand-cream/70">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={[
              'w-full appearance-none rounded border bg-brand-navy-deep text-brand-cream',
              'px-4 py-3 font-sans text-sm font-light',
              'transition-all duration-200',
              'focus:outline-none focus:ring-1',
              error
                ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30'
                : 'border-brand-cream/15 focus:border-brand-gold focus:ring-brand-gold/20',
              disabled ? 'cursor-not-allowed opacity-40' : 'hover:border-brand-cream/30',
              className,
            ].join(' ')}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron */}
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/40"
            aria-hidden="true"
          >
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
              <path
                d="M1 1l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {error && (
          <p id={errorId} role="alert" className="font-sans text-xs text-red-400">
            {error}
          </p>
        )}
        {hint && !error && <p className="font-sans text-xs text-brand-cream/40">{hint}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }
export type { SelectProps, SelectOption }
