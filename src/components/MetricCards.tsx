interface MetricItem {
  label: string
  value: string
}

interface Props {
  metrics: MetricItem[]
}

export default function MetricCards({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 anim">
      {metrics.map((m, i) => (
        <div key={m.label}
          className="bg-[#1a1512] border border-[#2a2520] rounded-xl px-4 py-4 text-center hover:border-[#b86a2a]/30 transition-all hover:bg-[#1e1815]"
          style={{ animationDelay: `${i * 50}ms` }}>
          <p className="text-[#8a7e72] text-[10px] font-semibold uppercase tracking-wider mb-2">{m.label}</p>
          <p className="text-[#e8e0d8] text-xl font-extrabold leading-none">{m.value}</p>
        </div>
      ))}
    </div>
  )
}
