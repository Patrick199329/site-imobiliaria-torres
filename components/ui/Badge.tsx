import { HTMLAttributes } from 'react'

type BadgeVariant =
  | 'disponivel'
  | 'reservado'
  | 'vendido'
  | 'lancamento'
  | 'construcao'
  | 'pronto'
  | 'gold'
  | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  disponivel: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  reservado: 'bg-brand-gold/15 text-brand-gold border-brand-gold/30',
  vendido: 'bg-brand-cream/10 text-brand-cream/50 border-brand-cream/20',
  lancamento: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  construcao: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  pronto: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  gold: 'bg-brand-gold/20 text-brand-gold-light border-brand-gold/40',
  neutral: 'bg-brand-cream/10 text-brand-cream/60 border-brand-cream/20',
}

const dotColors: Record<BadgeVariant, string> = {
  disponivel: 'bg-emerald-400',
  reservado: 'bg-brand-gold',
  vendido: 'bg-brand-cream/50',
  lancamento: 'bg-violet-400',
  construcao: 'bg-sky-400',
  pronto: 'bg-emerald-400',
  gold: 'bg-brand-gold-light',
  neutral: 'bg-brand-cream/50',
}

const labelMap: Record<BadgeVariant, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  vendido: 'Vendido',
  lancamento: 'Lançamento',
  construcao: 'Em construção',
  pronto: 'Pronto para morar',
  gold: '',
  neutral: '',
}

function Badge({
  variant = 'neutral',
  dot = false,
  children,
  className = '',
  ...props
}: BadgeProps) {
  const label = children ?? labelMap[variant]

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5',
        'label-caps text-2xs',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} aria-hidden="true" />
      )}
      {label}
    </span>
  )
}

export { Badge }
export type { BadgeProps, BadgeVariant }
