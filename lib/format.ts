export function formatCurrency(value: number | string): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export function formatArea(value: number | string | null): string {
  if (!value) return '—'
  return `${Number(value).toFixed(0)} m²`
}
