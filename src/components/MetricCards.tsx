interface MetricItem { label: string; value: string }
interface Props { metrics: MetricItem[] }

export default function MetricCards({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {metrics.map((m, i) => (
        <div key={m.label}
          className="bg-dark-800/60 border border-white/[0.06] rounded-2xl px-4 py-5 text-center hover:border-accent-500/20 transition-all animate-fade-in-up"
          style={{ animationDelay: `${i * 40}ms` }}>
          <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2.5">{m.label}</p>
          <p className="text-white text-[1.35rem] font-extrabold leading-none">{m.value}</p>
        </div>
      ))}
    </div>
  )
}
