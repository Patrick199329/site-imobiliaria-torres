import Link from 'next/link'
import { ReactNode } from 'react'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  icon?: ReactNode
}

function DefaultIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="text-brand-gold/40"
    >
      {/* Skyline minimalista — alinhado ao símbolo da marca */}
      <rect x="4" y="28" width="5" height="12" rx="1" fill="currentColor" />
      <rect x="11" y="22" width="5" height="18" rx="1" fill="currentColor" />
      <rect x="18" y="18" width="5" height="22" rx="1" fill="currentColor" />
      <rect x="25" y="12" width="5" height="28" rx="1" fill="currentColor" />
      <rect x="32" y="20" width="5" height="20" rx="1" fill="currentColor" />
      <rect x="39" y="26" width="5" height="14" rx="1" fill="currentColor" />
      <path
        d="M2 40 Q24 46 46 40"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  )
}

function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-brand-cream/10 bg-brand-navy-deep px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-gold/5">
        {icon ?? <DefaultIcon />}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-lg font-semibold text-brand-cream">{title}</h3>
        {description && (
          <p className="max-w-xs font-sans text-sm font-light text-brand-cream/50">{description}</p>
        )}
      </div>

      {action &&
        (action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center justify-center rounded border border-brand-cream/30 px-4 py-2 font-sans text-xs uppercase tracking-widest text-brand-cream/70 transition-colors hover:border-brand-cream hover:text-brand-cream"
          >
            {action.label}
          </Link>
        ) : (
          <Button variant="secondary" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps }
