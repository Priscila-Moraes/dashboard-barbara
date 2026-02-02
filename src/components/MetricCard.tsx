import { ReactNode } from 'react'

interface Props {
  label: string
  value: string
  icon: ReactNode
  color: string  // tailwind text color class
  delay?: number
}

export default function MetricCard({ label, value, icon, color, delay = 0 }: Props) {
  return (
    <div
      className="bg-[#12121e] border border-white/[0.06] rounded-2xl p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${color}`}>{label}</span>
        <span className="text-white/20">{icon}</span>
      </div>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  )
}
