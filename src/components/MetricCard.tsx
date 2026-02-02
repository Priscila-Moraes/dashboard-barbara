import { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  label: string
  value: string
  sub?: string
  accent: string   // tailwind color name: green, blue, purple, amber, rose, cyan, teal, emerald, orange
  delay?: number
}

const palette: Record<string, { card: string; iconBox: string; val: string }> = {
  green:   { card: 'border-green-500/15 bg-green-500/[0.04]',   iconBox: 'bg-green-500/10 text-green-400',   val: 'text-green-400' },
  blue:    { card: 'border-blue-500/15 bg-blue-500/[0.04]',     iconBox: 'bg-blue-500/10 text-blue-400',     val: 'text-blue-400' },
  purple:  { card: 'border-purple-500/15 bg-purple-500/[0.04]', iconBox: 'bg-purple-500/10 text-purple-400', val: 'text-purple-400' },
  amber:   { card: 'border-amber-500/15 bg-amber-500/[0.04]',   iconBox: 'bg-amber-500/10 text-amber-400',   val: 'text-amber-400' },
  rose:    { card: 'border-rose-500/15 bg-rose-500/[0.04]',     iconBox: 'bg-rose-500/10 text-rose-400',     val: 'text-rose-400' },
  cyan:    { card: 'border-cyan-500/15 bg-cyan-500/[0.04]',     iconBox: 'bg-cyan-500/10 text-cyan-400',     val: 'text-cyan-400' },
  teal:    { card: 'border-teal-500/15 bg-teal-500/[0.04]',     iconBox: 'bg-teal-500/10 text-teal-400',     val: 'text-teal-400' },
  emerald: { card: 'border-emerald-500/15 bg-emerald-500/[0.04]', iconBox: 'bg-emerald-500/10 text-emerald-400', val: 'text-emerald-400' },
  orange:  { card: 'border-orange-500/15 bg-orange-500/[0.04]', iconBox: 'bg-orange-500/10 text-orange-400', val: 'text-orange-400' },
}

export default function MetricCard({ icon, label, value, sub, accent, delay = 0 }: Props) {
  const c = palette[accent] || palette.green
  return (
    <div className={`border rounded-2xl p-5 anim-fade-up hover:scale-[1.02] transition-transform ${c.card}`}
         style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.iconBox}`}>{icon}</div>
        <span className="text-white/40 text-[11px] font-semibold uppercase tracking-wider leading-tight">{label}</span>
      </div>
      <div className={`text-[22px] font-bold leading-none ${c.val}`}>{value}</div>
      {sub && <div className="text-white/25 text-[11px] mt-1.5">{sub}</div>}
    </div>
  )
}
