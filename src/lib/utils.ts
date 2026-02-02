export const fmtBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v)

export const fmtNum = (v: number) => {
  if (v >= 1e6) return (v / 1e6).toFixed(1).replace('.', ',') + 'M'
  if (v >= 1e3) return (v / 1e3).toFixed(1).replace('.', ',') + 'K'
  return new Intl.NumberFormat('pt-BR').format(Math.round(v))
}

export const fmtDot = (v: number) => new Intl.NumberFormat('pt-BR').format(Math.round(v))

export const fmtPct = (v: number) => v.toFixed(2).replace('.', ',') + '%'

export const fmtDateBR = (d: string) => { const [y, m, day] = d.split('-'); return `${day}/${m}/${y}` }
export const fmtDateShort = (d: string) => { const [, m, day] = d.split('-'); return `${day}/${m}` }
