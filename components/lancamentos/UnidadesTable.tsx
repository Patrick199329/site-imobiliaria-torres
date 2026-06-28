import { formatCurrency, formatArea } from '@/lib/format'

type StatusUnidade = 'DISPONIVEL' | 'RESERVADA' | 'VENDIDA'

interface Unidade {
  id: string
  tipologia: string
  areaPrivativa: string
  valor: string
  status: StatusUnidade
  bloco?: string | null
  andar?: number | null
}

const STATUS_STYLE: Record<StatusUnidade, string> = {
  DISPONIVEL: 'text-emerald-400',
  RESERVADA: 'text-brand-gold',
  VENDIDA: 'text-brand-cream/30 line-through',
}

const STATUS_LABEL: Record<StatusUnidade, string> = {
  DISPONIVEL: 'Disponível',
  RESERVADA: 'Reservada',
  VENDIDA: 'Vendida',
}

interface UnidadesTableProps {
  unidades: Unidade[]
}

export function UnidadesTable({ unidades }: UnidadesTableProps) {
  if (unidades.length === 0) {
    return <p className="font-sans text-sm text-brand-cream/40">Nenhuma unidade cadastrada.</p>
  }

  return (
    <div className="overflow-hidden rounded-md border border-brand-cream/10">
      <table className="w-full font-sans text-sm">
        <thead>
          <tr className="border-b border-brand-cream/10 bg-brand-navy-deep">
            <th className="label-caps px-4 py-3 text-left text-brand-cream/40">Tipologia</th>
            <th className="label-caps px-4 py-3 text-left text-brand-cream/40">Área</th>
            <th className="label-caps hidden px-4 py-3 text-left text-brand-cream/40 sm:table-cell">
              Bloco/Andar
            </th>
            <th className="label-caps px-4 py-3 text-right text-brand-cream/40">Valor</th>
            <th className="label-caps px-4 py-3 text-right text-brand-cream/40">Status</th>
          </tr>
        </thead>
        <tbody>
          {unidades.map((u, i) => (
            <tr
              key={u.id}
              className={[
                'border-b border-brand-cream/5 transition-colors last:border-0',
                u.status === 'DISPONIVEL' ? 'hover:bg-brand-cream/5' : '',
                i % 2 === 0 ? '' : 'bg-brand-navy/30',
              ].join(' ')}
            >
              <td className="px-4 py-3 font-medium text-brand-cream">{u.tipologia}</td>
              <td className="px-4 py-3 text-brand-cream/70">{formatArea(u.areaPrivativa)}</td>
              <td className="hidden px-4 py-3 text-brand-cream/50 sm:table-cell">
                {u.bloco || u.andar
                  ? [u.bloco && `Bloco ${u.bloco}`, u.andar && `${u.andar}º andar`]
                      .filter(Boolean)
                      .join(' · ')
                  : '—'}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-brand-gold">
                {formatCurrency(u.valor)}
              </td>
              <td className={`px-4 py-3 text-right text-xs font-medium ${STATUS_STYLE[u.status]}`}>
                {STATUS_LABEL[u.status]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
