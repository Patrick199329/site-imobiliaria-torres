import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

function Card({ children, hover = false, padding = 'md', className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-md border border-brand-cream/10 bg-brand-navy-deep shadow-navy-card',
        hover
          ? 'cursor-pointer transition-all duration-300 hover:border-brand-gold/30 hover:shadow-gold-glow'
          : '',
        paddingClasses[padding],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
  return (
    <div className={`mb-4 flex items-start justify-between gap-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  as?: 'h2' | 'h3' | 'h4'
}

function CardTitle({ children, as: Tag = 'h3', className = '', ...props }: CardTitleProps) {
  return (
    <Tag className={`font-serif text-xl font-semibold text-brand-cream ${className}`} {...props}>
      {children}
    </Tag>
  )
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function CardBody({ children, className = '', ...props }: CardBodyProps) {
  return (
    <div
      className={`font-sans text-sm font-light leading-relaxed text-brand-cream/70 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function CardFooter({ children, className = '', ...props }: CardFooterProps) {
  return (
    <div
      className={`mt-4 flex items-center justify-between gap-4 border-t border-brand-cream/10 pt-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card, CardHeader, CardTitle, CardBody, CardFooter }
export type { CardProps }
