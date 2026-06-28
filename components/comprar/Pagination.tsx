import Link from 'next/link'
import type { ComprarParams } from '@/types/search'

interface PaginationProps {
  currentPage: number
  totalPages: number
  params: ComprarParams
}

export function Pagination({ currentPage, totalPages, params }: PaginationProps) {
  if (totalPages <= 1) return null

  function buildUrl(page: number) {
    const p = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v && k !== 'pagina') p.set(k, v)
    })
    if (page > 1) p.set('pagina', String(page))
    const qs = p.toString()
    return `/comprar${qs ? `?${qs}` : ''}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const showPages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  )

  return (
    <nav
      className="flex items-center justify-center gap-2 py-12"
      aria-label="Paginação de resultados"
    >
      {/* Anterior */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded border border-brand-cream/15 text-brand-cream/50 transition-colors hover:border-brand-gold hover:text-brand-gold"
          aria-label="Página anterior"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M9 2L4 7l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      ) : (
        <span
          className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded border border-brand-cream/10 text-brand-cream/20"
          aria-disabled="true"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M9 2L4 7l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}

      {/* Páginas */}
      {showPages.map((page, idx) => {
        const prev = showPages[idx - 1]
        const gap = prev && page - prev > 1
        return (
          <span key={page} className="flex items-center gap-2">
            {gap && <span className="label-caps text-brand-cream/20">…</span>}
            {page === currentPage ? (
              <span
                className="flex h-9 w-9 items-center justify-center rounded border border-brand-gold bg-brand-gold font-sans text-sm font-semibold text-brand-navy-deep"
                aria-current="page"
              >
                {page}
              </span>
            ) : (
              <Link
                href={buildUrl(page)}
                className="flex h-9 w-9 items-center justify-center rounded border border-brand-cream/15 font-sans text-sm text-brand-cream/50 transition-colors hover:border-brand-gold hover:text-brand-gold"
              >
                {page}
              </Link>
            )}
          </span>
        )
      })}

      {/* Próxima */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded border border-brand-cream/15 text-brand-cream/50 transition-colors hover:border-brand-gold hover:text-brand-gold"
          aria-label="Próxima página"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M5 2l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      ) : (
        <span
          className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded border border-brand-cream/10 text-brand-cream/20"
          aria-disabled="true"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M5 2l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </nav>
  )
}
