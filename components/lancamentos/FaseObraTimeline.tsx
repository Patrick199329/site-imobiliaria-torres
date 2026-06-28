type FaseObra = 'LANCAMENTO' | 'EM_CONSTRUCAO' | 'PRONTO'

const ETAPAS: { key: FaseObra; label: string; sub: string }[] = [
  { key: 'LANCAMENTO', label: 'Lançamento', sub: 'Pré-venda aberta' },
  { key: 'EM_CONSTRUCAO', label: 'Em construção', sub: 'Obras em andamento' },
  { key: 'PRONTO', label: 'Pronto para morar', sub: 'Entrega realizada' },
]

const ORDER: Record<FaseObra, number> = {
  LANCAMENTO: 0,
  EM_CONSTRUCAO: 1,
  PRONTO: 2,
}

interface FaseObraTimelineProps {
  fase: FaseObra
  dataPrevistaEntrega?: string | null
}

export function FaseObraTimeline({ fase, dataPrevistaEntrega }: FaseObraTimelineProps) {
  const currentIdx = ORDER[fase]

  return (
    <div className="rounded-md border border-brand-cream/10 bg-brand-navy-deep p-6">
      <h3 className="mb-5 font-serif text-base font-semibold text-brand-cream">Fase da obra</h3>

      <div className="relative flex items-start justify-between">
        {/* Linha de progresso */}
        <div className="absolute left-5 right-5 top-5 h-px bg-brand-cream/10" aria-hidden="true">
          <div
            className="h-full bg-brand-gold transition-all duration-700"
            style={{ width: `${(currentIdx / (ETAPAS.length - 1)) * 100}%` }}
          />
        </div>

        {ETAPAS.map((etapa, idx) => {
          const done = idx < currentIdx
          const active = idx === currentIdx

          return (
            <div key={etapa.key} className="relative flex flex-1 flex-col items-center gap-2">
              {/* Círculo */}
              <div
                className={[
                  'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                  active
                    ? 'border-brand-gold bg-brand-gold text-brand-navy-deep'
                    : done
                      ? 'border-brand-gold bg-brand-gold/20 text-brand-gold'
                      : 'border-brand-cream/20 bg-brand-navy text-brand-cream/30',
                ].join(' ')}
                aria-current={active ? 'step' : undefined}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M2.5 7l3 3 6-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="font-sans text-xs font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Labels */}
              <div className="text-center">
                <p
                  className={[
                    'font-sans text-xs font-semibold',
                    active
                      ? 'text-brand-gold'
                      : done
                        ? 'text-brand-cream/60'
                        : 'text-brand-cream/30',
                  ].join(' ')}
                >
                  {etapa.label}
                </p>
                <p className="mt-0.5 font-sans text-xs text-brand-cream/30">{etapa.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {dataPrevistaEntrega && fase !== 'PRONTO' && (
        <p className="mt-5 border-t border-brand-cream/10 pt-4 text-center font-sans text-xs text-brand-cream/40">
          Previsão de entrega:{' '}
          <span className="text-brand-cream/70">
            {new Date(dataPrevistaEntrega).toLocaleDateString('pt-BR', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </p>
      )}
    </div>
  )
}
