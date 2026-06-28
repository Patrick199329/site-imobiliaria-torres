'use client'

import { forwardRef, InputHTMLAttributes } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className = '', disabled, ...props }, ref) => {
    const checkboxId = id ?? `checkbox-${Math.random().toString(36).slice(2, 9)}`

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label
          htmlFor={checkboxId}
          className={[
            'group flex cursor-pointer select-none items-center gap-3',
            disabled ? 'cursor-not-allowed opacity-40' : '',
          ].join(' ')}
        >
          <div className="relative flex-shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              disabled={disabled}
              aria-invalid={!!error}
              className="peer sr-only"
              {...props}
            />
            {/* Custom checkbox box */}
            <div
              className={[
                'h-5 w-5 rounded-sm border transition-all duration-200',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-gold peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-brand-navy',
                error
                  ? 'border-red-500/70 peer-checked:border-red-500 peer-checked:bg-red-500'
                  : 'border-brand-cream/25 group-hover:border-brand-cream/50 peer-checked:border-brand-gold peer-checked:bg-brand-gold',
              ].join(' ')}
            />
            {/* Checkmark */}
            <svg
              className="pointer-events-none absolute inset-0 m-auto h-3 w-3 opacity-0 transition-opacity peer-checked:opacity-100"
              viewBox="0 0 12 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 5l3.5 3.5L11 1"
                stroke="#0A1626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="font-sans text-sm font-light text-brand-cream/80 transition-colors group-hover:text-brand-cream">
            {label}
          </span>
        </label>

        {error && (
          <p role="alert" className="pl-8 font-sans text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
export type { CheckboxProps }
