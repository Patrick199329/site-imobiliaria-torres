'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ComprarParams } from '@/types/search'

const TIPOS = [
  { value: '', label: 'Todos os tipos' },
  { value: 'APARTAMENTO', label: 'Apartamento' },
  { value: 'CASA', label: 'Casa' },
  { value: 'TERRENO', label: 'Terreno' },
  { value: 'COMERCIAL', label: 'Comercial' },
]

const QUARTOS_OPTS = [
  { value: '', label: 'Quartos' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
]

const VAGAS_OPTS = [
  { value: '', label: 'Vagas' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
]

const ORDENAR_OPTS = [
  { value: '', label: 'Mais recentes' },
  { value: 'preco_asc', label: 'Menor preço' },
  { value: 'preco_desc', label: 'Maior preço' },
  { value: 'area_desc', label: 'Maior área' },
]

interface FilterBarProps {
  defaults: ComprarParams
}

const inputClass =
  'w-full rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2.5 font-sans text-sm text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20'
const selectClass =
  'w-full rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2.5 font-sans text-sm text-brand-cream focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20'
const labelClass =
  'block font-sans text-[10px] font-semibold uppercase tracking-wider text-brand-cream/40 mb-1.5'

export function FilterBar({ defaults }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [localInput, setLocalInput] = useState(defaults.localidade ?? '')
  const geoAttempted = useRef(false)

  useEffect(() => {
    if (defaults.localidade || geoAttempted.current || !navigator.geolocation) return
    geoAttempted.current = true
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=pt-BR`,
            { headers: { 'User-Agent': 'TorresImobiliaria/1.0' } }
          )
          const data = await res.json()
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.municipality ||
            data.address?.village
          if (city) setLocalInput(city)
        } catch {
          // ignore
        }
      },
      () => {},
      { timeout: 6000 }
    )
  }, [defaults.localidade])

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('pagina')
      router.push(`/comprar?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearAll = useCallback(() => {
    router.push('/comprar')
    setDrawerOpen(false)
  }, [router])

  const activeFilterCount = [
    defaults.tipo,
    defaults.precoMin,
    defaults.precoMax,
    defaults.quartos,
    defaults.vagas,
    defaults.areaMin,
  ].filter(Boolean).length

  const hasFilters = activeFilterCount > 0 || !!defaults.localidade

  return (
    <>
      <div className="sticky top-20 z-30 border-b border-brand-cream/10 bg-brand-navy/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
          {/* ── Mobile: linha única com busca + botão filtros ── */}
          <div className="flex items-center gap-2 md:hidden">
            <input
              type="text"
              placeholder="Bairro ou cidade..."
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') update('localidade', localInput)
              }}
              onBlur={() => update('localidade', localInput)}
              className="min-w-0 flex-1 rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2.5 font-sans text-sm text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold focus:outline-none"
              aria-label="Filtrar por localidade"
            />
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative flex shrink-0 items-center gap-2 rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2.5 font-sans text-sm text-brand-cream transition-colors hover:border-brand-gold"
              aria-label="Abrir filtros"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <path
                  d="M1 3h13M3.5 7.5h8M6 12h3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              Filtros
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold font-sans text-[10px] font-bold text-brand-navy-deep">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: ordenação + toggle de view (linha 2) */}
          <div className="mt-2 flex items-center justify-between gap-2 md:hidden">
            <select
              value={defaults.ordenar ?? ''}
              onChange={(e) => update('ordenar', e.target.value)}
              className="rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
              aria-label="Ordenar resultados"
            >
              {ORDENAR_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ViewToggle defaults={defaults} update={update} />
          </div>

          {/* ── Desktop: barra completa inline ── */}
          <div className="hidden md:block">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Bairro ou cidade..."
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') update('localidade', localInput)
                }}
                onBlur={() => update('localidade', localInput)}
                className="w-52 rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-sm text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
                aria-label="Filtrar por localidade"
              />
              <select
                value={defaults.tipo ?? ''}
                onChange={(e) => update('tipo', e.target.value)}
                className="rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-sm text-brand-cream focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
                aria-label="Tipo de imóvel"
              >
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="Preço mín"
                  defaultValue={defaults.precoMin ?? ''}
                  onBlur={(e) => update('precoMin', e.target.value)}
                  className="w-32 rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-sm text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
                  aria-label="Preço mínimo"
                />
                <span className="text-brand-cream/30">–</span>
                <input
                  type="number"
                  placeholder="Preço máx"
                  defaultValue={defaults.precoMax ?? ''}
                  onBlur={(e) => update('precoMax', e.target.value)}
                  className="w-32 rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-sm text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
                  aria-label="Preço máximo"
                />
              </div>
              <select
                value={defaults.quartos ?? ''}
                onChange={(e) => update('quartos', e.target.value)}
                className="rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-sm text-brand-cream focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
                aria-label="Número de quartos"
              >
                {QUARTOS_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <select
                value={defaults.vagas ?? ''}
                onChange={(e) => update('vagas', e.target.value)}
                className="rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-sm text-brand-cream focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
                aria-label="Vagas de garagem"
              >
                {VAGAS_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Área mín (m²)"
                defaultValue={defaults.areaMin ?? ''}
                onBlur={(e) => update('areaMin', e.target.value)}
                className="w-36 rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-sm text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
                aria-label="Área mínima em m²"
              />
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="label-caps ml-auto text-brand-cream/40 transition-colors hover:text-brand-cream"
                >
                  Limpar
                </button>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <select
                value={defaults.ordenar ?? ''}
                onChange={(e) => update('ordenar', e.target.value)}
                className="rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-xs text-brand-cream focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
                aria-label="Ordenar resultados"
              >
                {ORDENAR_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ViewToggle defaults={defaults} update={update} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Gaveta de filtros (mobile) ── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          {/* Painel */}
          <div className="rounded-t-2xl fixed bottom-0 left-0 right-0 z-50 border-t border-brand-cream/10 bg-brand-navy-deep px-6 pb-10 pt-5 md:hidden">
            {/* Alça */}
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-brand-cream/20" />

            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-base font-semibold text-brand-cream">Filtros</h2>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="font-sans text-xs text-brand-cream/40 underline"
                >
                  Limpar tudo
                </button>
              )}
            </div>

            <div className="flex flex-col gap-5">
              {/* Tipo */}
              <div>
                <label className={labelClass}>Tipo de imóvel</label>
                <select
                  value={defaults.tipo ?? ''}
                  onChange={(e) => update('tipo', e.target.value)}
                  className={selectClass}
                >
                  {TIPOS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Faixa de preço */}
              <div>
                <label className={labelClass}>Faixa de preço</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    defaultValue={defaults.precoMin ?? ''}
                    onBlur={(e) => update('precoMin', e.target.value)}
                    className={inputClass}
                    aria-label="Preço mínimo"
                  />
                  <span className="shrink-0 text-brand-cream/30">–</span>
                  <input
                    type="number"
                    placeholder="Máximo"
                    defaultValue={defaults.precoMax ?? ''}
                    onBlur={(e) => update('precoMax', e.target.value)}
                    className={inputClass}
                    aria-label="Preço máximo"
                  />
                </div>
              </div>

              {/* Quartos e Vagas lado a lado */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Quartos</label>
                  <select
                    value={defaults.quartos ?? ''}
                    onChange={(e) => update('quartos', e.target.value)}
                    className={selectClass}
                  >
                    {QUARTOS_OPTS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Vagas</label>
                  <select
                    value={defaults.vagas ?? ''}
                    onChange={(e) => update('vagas', e.target.value)}
                    className={selectClass}
                  >
                    {VAGAS_OPTS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Área mínima */}
              <div>
                <label className={labelClass}>Área mínima (m²)</label>
                <input
                  type="number"
                  placeholder="Ex: 80"
                  defaultValue={defaults.areaMin ?? ''}
                  onBlur={(e) => update('areaMin', e.target.value)}
                  className={inputClass}
                  aria-label="Área mínima"
                />
              </div>
            </div>

            {/* Botão fechar */}
            <button
              onClick={() => setDrawerOpen(false)}
              className="label-caps mt-6 w-full rounded bg-brand-gold py-3 font-semibold text-brand-navy-deep"
            >
              Ver resultados
            </button>
          </div>
        </>
      )}
    </>
  )
}

function ViewToggle({
  defaults,
  update,
}: {
  defaults: ComprarParams
  update: (key: string, value: string) => void
}) {
  return (
    <div
      className="flex overflow-hidden rounded border border-brand-cream/15"
      role="group"
      aria-label="Modo de visualização"
    >
      {[
        {
          value: 'grid',
          label: 'Grade',
          icon: (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect
                x="1"
                y="1"
                width="5"
                height="5"
                stroke="currentColor"
                strokeWidth="1.2"
                rx="0.5"
              />
              <rect
                x="8"
                y="1"
                width="5"
                height="5"
                stroke="currentColor"
                strokeWidth="1.2"
                rx="0.5"
              />
              <rect
                x="1"
                y="8"
                width="5"
                height="5"
                stroke="currentColor"
                strokeWidth="1.2"
                rx="0.5"
              />
              <rect
                x="8"
                y="8"
                width="5"
                height="5"
                stroke="currentColor"
                strokeWidth="1.2"
                rx="0.5"
              />
            </svg>
          ),
        },
        {
          value: 'mapa',
          label: 'Mapa',
          icon: (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M7 1C4.8 1 3 2.8 3 5c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          ),
        },
      ].map((v) => {
        const active = (defaults.view ?? 'grid') === v.value
        return (
          <button
            key={v.value}
            onClick={() => update('view', v.value === 'grid' ? '' : v.value)}
            aria-pressed={active}
            aria-label={v.label}
            className={[
              'flex items-center gap-1.5 px-3 py-2 font-sans text-xs transition-colors',
              active
                ? 'bg-brand-gold text-brand-navy-deep'
                : 'text-brand-cream/50 hover:text-brand-cream',
            ].join(' ')}
          >
            {v.icon}
            <span className="hidden sm:inline">{v.label}</span>
          </button>
        )
      })}
    </div>
  )
}
