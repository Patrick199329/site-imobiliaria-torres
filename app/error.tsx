'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-navy px-6 text-center">
      <svg
        width="80"
        height="56"
        viewBox="0 0 80 56"
        fill="none"
        aria-hidden="true"
        className="mb-8 text-brand-gold/15"
      >
        <rect x="4" y="32" width="7" height="18" rx="1" fill="currentColor" />
        <rect x="14" y="24" width="7" height="26" rx="1" fill="currentColor" />
        <rect x="24" y="16" width="7" height="34" rx="1" fill="currentColor" />
        <rect x="34" y="8" width="7" height="42" rx="1" fill="currentColor" />
        <rect x="44" y="18" width="7" height="32" rx="1" fill="currentColor" />
        <rect x="54" y="26" width="7" height="24" rx="1" fill="currentColor" />
        <rect x="64" y="32" width="7" height="18" rx="1" fill="currentColor" />
        <path
          d="M2 50 Q40 56 78 50"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>

      <p className="label-caps mb-3 text-brand-gold">Erro inesperado</p>
      <h1 className="font-serif text-3xl font-semibold text-brand-cream">Algo deu errado</h1>
      <p className="mt-3 max-w-sm font-sans text-sm font-light text-brand-cream/60">
        Ocorreu um erro ao carregar esta página. Tente novamente ou volte para o início.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="label-caps rounded bg-brand-gold px-6 py-3 font-semibold text-brand-navy-deep transition-opacity hover:opacity-90"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="label-caps rounded border border-brand-cream/20 px-6 py-3 text-brand-cream/70 transition-colors hover:border-brand-cream hover:text-brand-cream"
        >
          Página inicial
        </Link>
      </div>
    </main>
  )
}
