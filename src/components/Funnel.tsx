import { fmtDot } from '../lib/utils'

interface Props {
  impressions: number
  clicks: number
  conversations: number
}

export default function Funnel({ impressions, clicks, conversations }: Props) {
  const steps = [
    { label: 'Impressões', value: impressions, color: '#22c55e' },
    { label: 'Cliques', value: clicks, color: '#06b6d4' },
    { label: 'Conversas', value: conversations, color: '#10b981' },
  ]

  const max = Math.max(...steps.map(s => s.value), 1)

  return (
    <div className="bg-[#12121e] border border-white/[0.06] rounded-2xl p-6 h-full">
      <h3 className="text-white/70 font-semibold text-sm mb-6">Funil de Conversão</h3>
      <div className="space-y-4">
        {steps.map((step, i) => {
          const pct = (step.value / max) * 100
          const convRate = i > 0 ? ((step.value / steps[i - 1].value) * 100) : 100
          return (
            <div key={step.label}>
              {/* Rate label */}
              {i > 0 && (
                <div className="text-white/30 text-[11px] mb-1.5 ml-1">
                  {convRate.toFixed(1)}%
                </div>
              )}
              {/* Bar */}
              <div className="flex items-center gap-3">
                <div
                  className="relative h-11 rounded-lg flex items-center px-4 transition-all duration-500"
                  style={{
                    width: `${Math.max(pct, 25)}%`,
                    background: `linear-gradient(90deg, ${step.color}, ${step.color}99)`,
                  }}
                >
                  <span className="text-white font-semibold text-[13px] whitespace-nowrap">{step.label}</span>
                </div>
                <span className="text-white font-bold text-base whitespace-nowrap">{fmtDot(step.value)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
