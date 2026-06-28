'use client'

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, id, className = '', disabled, ...props }, ref) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="label-caps text-brand-cream/70">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className="pointer-events-none absolute left-3 text-brand-cream/40"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              [error ? errorId : '', hint ? hintId : ''].filter(Boolean).join(' ') || undefined
            }
            className={[
              'w-full rounded border bg-brand-navy-deep text-brand-cream placeholder:text-brand-cream/30',
              'px-4 py-3 font-sans text-sm font-light',
              'transition-all duration-200',
              'focus:outline-none focus:ring-1',
              error
                ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30'
                : 'border-brand-cream/15 focus:border-brand-gold focus:ring-brand-gold/20',
              disabled ? 'cursor-not-allowed opacity-40' : 'hover:border-brand-cream/30',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              className,
            ].join(' ')}
            {...props}
          />

          {rightIcon && (
            <span
              className="pointer-events-none absolute right-3 text-brand-cream/40"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} role="alert" className="font-sans text-xs text-red-400">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="font-sans text-xs text-brand-cream/40">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }
