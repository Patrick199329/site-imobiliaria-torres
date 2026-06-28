import Link from 'next/link'
import { Badge } from '@/components/ui'
import { formatCurrency } from '@/lib/format'
import type { BadgeVariant } from '@/components/ui'

const FASE_BADGE: Record<string, BadgeVariant> = {
  LANCAMENTO: 'lancamento',
  EM_CONSTRUCAO: 'construcao',
  PRONTO: 'pronto',
}

const FASE_LABEL: Record<string, string> = {
  LANCAMENTO: 'Lançamento',
  EM_CONSTRUCAO: 'Em construção',
  PRONTO: 'Pronto para morar',
}

interface LancamentoCardProps {
  slug: string
  nome: string
  construtora: string
  bairro: string
  cidade: string
  uf: string
  faseObra: string
  capaUrl?: string
  precoMin?: string | null
  precoMax?: string | null
  unidadesDisponiveis: number
}

export function LancamentoCard({
  slug,
  nome,
  construtora,
  bairro,
  cidade,
  uf,
  faseObra,
  capaUrl,
  precoMin,
  precoMax,
  unidadesDisponiveis,
}: LancamentoCardProps) {
  return (
    <Link
      href={`/lancamentos/${slug}`}
      className="group flex flex-col overflow-hidden rounded-md border border-brand-cream/10 bg-brand-navy-deep transition-all duration-300 hover:border-brand-gold/30 hover:shadow-gold-glow"
    >
      {/* Imagem / placeholder */}
      <div className="relative aspect-[16/9] overflow-hidden bg-brand-navy">
        {capaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capaUrl}
            alt={nome}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              aria-hidden="true"
              className="text-brand-gold/15"
            >
              <rect x="4" y="32" width="6" height="16" rx="1" fill="currentColor" />
              <rect x="13" y="24" width="6" height="24" rx="1" fill="currentColor" />
              <rect x="22" y="18" width="6" height="30" rx="1" fill="currentColor" />
              <rect x="31" y="10" width="6" height="38" rx="1" fill="currentColor" />
              <rect x="40" y="22" width="6" height="26" rx="1" fill="currentColor" />
              <path
                d="M2 48 Q28 54 54 48"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
            </svg>
          </div>
        )}

        <div className="absolute left-3 top-3">
          <Badge variant={FASE_BADGE[faseObra] ?? 'neutral'} dot>
            {FASE_LABEL[faseObra]}
          </Badge>
        </div>

        {unidadesDisponiveis > 0 && (
          <div className="absolute bottom-3 right-3 rounded bg-black/50 px-2 py-0.5 font-sans text-xs text-white backdrop-blur-sm">
            {unidadesDisponiveis} unid. disponíveis
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="label-caps mb-1 text-brand-cream/40">{construtora}</p>
          <h3 className="font-serif text-lg font-semibold leading-snug text-brand-cream transition-colors group-hover:text-brand-gold-light">
            {nome}
          </h3>
          <p className="mt-1 font-sans text-sm text-brand-cream/50">
            {bairro} · {cidade}, {uf}
          </p>
        </div>

        {/* Faixa de preço */}
        {precoMin && (
          <div className="mt-auto border-t border-brand-cream/10 pt-3">
            <p className="label-caps mb-0.5 text-brand-cream/30">a partir de</p>
            <p className="font-serif text-xl font-bold text-brand-gold">
              {formatCurrency(precoMin)}
              {precoMax && precoMax !== precoMin && (
                <span className="ml-1 font-sans text-sm font-normal text-brand-cream/40">
                  até {formatCurrency(precoMax)}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}
