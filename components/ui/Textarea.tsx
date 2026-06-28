'use client'

import { forwardRef, TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = '', disabled, ...props }, ref) => {
    const textareaId = id ?? `textarea-${Math.random().toString(36).slice(2, 9)}`
    const errorId = `${textareaId}-error`

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="label-caps text-brand-cream/70">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          rows={4}
          className={[
            'w-full resize-y rounded border bg-brand-navy-deep text-brand-cream placeholder:text-brand-cream/30',
            'px-4 py-3 font-sans text-sm font-light leading-relaxed',
            'transition-all duration-200',
            'focus:outline-none focus:ring-1',
            error
              ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30'
              : 'border-brand-cream/15 focus:border-brand-gold focus:ring-brand-gold/20',
            disabled ? 'cursor-not-allowed opacity-40' : 'hover:border-brand-cream/30',
            className,
          ].join(' ')}
          {...props}
        />

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

Textarea.displayName = 'Textarea'

export { Textarea }
export type { TextareaProps }
