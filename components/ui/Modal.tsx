'use client'

import { useEffect, useCallback, useState, ReactNode, HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

function Modal({ open, onClose, title, description, children, size = 'md' }: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open || !mounted) return null

  const modalId = 'modal-title'
  const descId = 'modal-desc'

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? modalId : undefined}
      aria-describedby={description ? descId : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in bg-brand-navy-deep/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={[
          'relative w-full rounded-md border border-brand-cream/15 bg-brand-navy shadow-gold-glow',
          'animate-fade-in p-6',
          sizeClasses[size],
        ].join(' ')}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 id={modalId} className="font-serif text-xl font-semibold text-brand-cream">
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className="mt-1 font-sans text-sm font-light text-brand-cream/60">
                {description}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex-shrink-0 rounded p-1 text-brand-cream/40 transition-colors hover:text-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M1 1l16 16M17 1L1 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Divisor */}
        <hr className="divider-gold mb-4" />

        {/* Conteúdo */}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  )
}

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function ModalFooter({ children, className = '', ...props }: ModalFooterProps) {
  return (
    <div
      className={`mt-6 flex items-center justify-end gap-3 border-t border-brand-cream/10 pt-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export { Modal, ModalFooter }
export type { ModalProps }
