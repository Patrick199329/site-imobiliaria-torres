'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const FASES = [
  { value: '', label: 'Todas as fases' },
  { value: 'LANCAMENTO', label: 'Lançamento' },
  { value: 'EM_CONSTRUCAO', label: 'Em construção' },
  { value: 'PRONTO', label: 'Pronto para morar' },
]

interface LancamentoFilterBarProps {
  cidades: string[]
  construtoras: string[]
  defaults: {
    fase?: string
    cidade?: string
    construtora?: string
  }
}

export function LancamentoFilterBar({ cidades, construtoras, defaults }: LancamentoFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      router.push(`/lancamentos?${params.toString()}`)
    },
    [router, searchParams]
  )

  const hasFilters = !!(defaults.fase || defaults.cidade || defaults.construtora)

  const selectClass =
    'rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-sm text-brand-cream focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20'

  return (
    <div className="border-b border-brand-cream/10 bg-brand-navy/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          {/* Fase da obra */}
          <select
            value={defaults.fase ?? ''}
            onChange={(e) => update('fase', e.target.value)}
            className={selectClass}
            aria-label="Fase da obra"
          >
            {FASES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          {/* Cidade */}
          {cidades.length > 1 && (
            <select
              value={defaults.cidade ?? ''}
              onChange={(e) => update('cidade', e.target.value)}
              className={selectClass}
              aria-label="Cidade"
            >
              <option value="">Todas as cidades</option>
              {cidades.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {/* Construtora */}
          {construtoras.length > 1 && (
            <select
              value={defaults.construtora ?? ''}
              onChange={(e) => update('construtora', e.target.value)}
              className={selectClass}
              aria-label="Construtora"
            >
              <option value="">Todas as construtoras</option>
              {construtoras.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {hasFilters && (
            <button
              onClick={() => router.push('/lancamentos')}
              className="label-caps ml-auto text-brand-cream/40 transition-colors hover:text-brand-cream"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
