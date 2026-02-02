export function fmtCurrency(v: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(v)
}

export function fmtNumber(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace('.', ',') + 'M'
  if (v >= 1_000) return (v / 1_000).toFixed(1).replace('.', ',') + 'K'
  return new Intl.NumberFormat('pt-BR').format(Math.round(v))
}

export function fmtPct(v: number): string {
  return v.toFixed(2).replace('.', ',') + '%'
}

export function fmtDateBR(d: string): string {
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

export function fmtDateShort(d: string): string {
  const [, m, day] = d.split('-')
  return `${day}/${m}`
}
