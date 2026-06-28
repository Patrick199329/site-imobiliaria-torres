import Link from 'next/link'
import { Badge } from '@/components/ui'
import { formatCurrency, formatArea } from '@/lib/format'
import { StatusImovel, TipoImovel } from '@prisma/client'

interface PropertyCardProps {
  slug: string
  codigo?: number | null
  titulo: string
  preco: number | string
  areaUtil: number | string | null
  quartos: number | null
  vagas: number | null
  bairro: string
  cidade: string
  uf: string
  status: StatusImovel
  tipo: TipoImovel
  capaUrl?: string
}

const statusVariant: Record<StatusImovel, 'disponivel' | 'reservado' | 'vendido'> = {
  DISPONIVEL: 'disponivel',
  RESERVADO: 'reservado',
  VENDIDO: 'vendido',
}

const tipoLabel: Record<TipoImovel, string> = {
  APARTAMENTO: 'Apartamento',
  CASA: 'Casa',
  TERRENO: 'Terreno',
  COMERCIAL: 'Comercial',
}

export function PropertyCard({
  slug,
  codigo,
  titulo,
  preco,
  areaUtil,
  quartos,
  vagas,
  bairro,
  cidade,
  uf,
  status,
  tipo,
  capaUrl,
}: PropertyCardProps) {
  return (
    <Link
      href={`/comprar/${slug}`}
      className="group flex flex-col overflow-hidden rounded-md border border-brand-cream/10 bg-brand-navy-deep shadow-navy-card transition-all duration-300 hover:border-brand-gold/30 hover:shadow-gold-glow"
      aria-label={`Ver detalhes: ${titulo}`}
    >
      {/* Imagem */}
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-navy">
        {capaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capaUrl}
            alt={titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Placeholder com símbolo da marca */
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-navy to-brand-navy-deep">
            <svg
              viewBox="0 0 70 74"
              className="h-16 w-16 opacity-20"
              fill="none"
              aria-hidden="true"
            >
              <rect x="0" y="42" width="6" height="20" fill="#BD8338" rx="1" />
              <rect x="8" y="36" width="6" height="26" fill="#BD8338" rx="1" />
              <rect x="16" y="40" width="6" height="22" fill="#BD8338" rx="1" />
              <rect x="24" y="10" width="6" height="52" fill="#BD8338" rx="1" />
              <rect x="32" y="2" width="6" height="60" fill="#BD8338" rx="1" />
              <rect x="40" y="10" width="6" height="52" fill="#BD8338" rx="1" />
              <rect x="48" y="40" width="6" height="22" fill="#BD8338" rx="1" />
              <rect x="56" y="36" width="6" height="26" fill="#BD8338" rx="1" />
              <rect x="64" y="42" width="6" height="20" fill="#BD8338" rx="1" />
              <path
                d="M0 62 Q35 72 70 62"
                stroke="#BD8338"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        )}

        {/* Badge de status (só se não disponível) */}
        {status !== 'DISPONIVEL' && (
          <div className="absolute left-3 top-3">
            <Badge variant={statusVariant[status]} dot />
          </div>
        )}

        {/* Badge de tipo + ref */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
          <Badge variant="neutral">{tipoLabel[tipo]}</Badge>
          {codigo != null && (
            <span className="rounded bg-black/50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand-gold/90 backdrop-blur-sm">
              #{String(codigo).padStart(4, '0')}
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="label-caps text-brand-gold">
            {bairro} · {cidade}/{uf}
          </p>
          <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-brand-cream transition-colors group-hover:text-brand-gold">
            {titulo}
          </h3>
        </div>

        {/* Ficha resumida */}
        <div className="flex flex-wrap gap-3 border-t border-brand-cream/10 pt-3">
          {areaUtil && (
            <span className="flex items-center gap-1 font-sans text-xs text-brand-cream/50">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2 2h12v12H2z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path d="M2 6h12M6 2v12" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              {formatArea(areaUtil)}
            </span>
          )}
          {quartos != null && quartos > 0 && (
            <span className="flex items-center gap-1 font-sans text-xs text-brand-cream/50">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M1 9V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M1 9h14v4H1z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
              {quartos} {quartos === 1 ? 'quarto' : 'quartos'}
            </span>
          )}
          {vagas != null && vagas > 0 && (
            <span className="flex items-center gap-1 font-sans text-xs text-brand-cream/50">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect
                  x="1"
                  y="5"
                  width="14"
                  height="8"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M4 5V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              {vagas} {vagas === 1 ? 'vaga' : 'vagas'}
            </span>
          )}
        </div>

        {/* Preço */}
        <p className="mt-auto font-serif text-xl font-bold text-brand-gold">
          {formatCurrency(preco)}
        </p>
      </div>
    </Link>
  )
}
