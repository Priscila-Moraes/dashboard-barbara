export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export const formatNumber = (v: number) =>
  new Intl.NumberFormat('pt-BR').format(Math.round(v))

export const formatPercent = (v: number) => v.toFixed(2).replace('.', ',') + '%'

export const formatDate = (d: string) => {
  const [, m, day] = d.split('-')
  return `${day}/${m}`
}

export const formatDateBR = (d: string) => {
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}
