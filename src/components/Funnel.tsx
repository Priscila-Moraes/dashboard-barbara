import { fmtDot } from '../lib/utils'

interface Props {
  impressions: number
  reach: number
  clicks: number
  conversations: number
}

export default function Funnel({ impressions, reach, clicks, conversations }: Props) {
  const steps = [
    { label: 'Impressões Gerais', value: fmtDot(impressions), pct: 100 },
    { label: 'Alcance', value: fmtDot(reach), pct: impressions > 0 ? (reach / impressions) * 100 : 0 },
    { label: 'Cliques Gerais', value: fmtDot(clicks), pct: impressions > 0 ? (clicks / impressions) * 100 : 0 },
    { label: 'Leads Gerais', value: fmtDot(conversations), pct: impressions > 0 ? (conversations / impressions) * 100 : 0 },
  ]

  // Colors from light copper to deep copper
  const colors = ['#d4935a', '#c47d3e', '#b86a2a', '#9a5422']
  const glows = ['rgba(212,147,90,0.3)', 'rgba(196,125,62,0.25)', 'rgba(184,106,42,0.2)', 'rgba(154,84,34,0.15)']

  return (
    <div className="bg-[#1a1512] border border-[#2a2520] rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-[#8a7e72] text-[11px] font-semibold uppercase tracking-wider mb-6">Funil de Conversão</h3>

      <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
        {steps.map((step, i) => {
          // Width: 100% → 78% → 56% → 38%  (inverted funnel visual)
          const widths = [100, 78, 56, 38]
          const w = widths[i]

          return (
            <div key={step.label} className="w-full flex flex-col items-center">
              <div
                className="relative flex flex-col items-center justify-center py-3.5 transition-all cursor-default group"
                style={{
                  width: `${w}%`,
                  background: `linear-gradient(135deg, ${colors[i]}, ${colors[i]}dd)`,
                  clipPath: i === 0
                    ? 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)'
                    : i === steps.length - 1
                    ? 'polygon(4% 0%, 96% 0%, 92% 100%, 8% 100%)'
                    : 'polygon(3% 0%, 97% 0%, 95% 100%, 5% 100%)',
                  borderRadius: i === 0 ? '10px 10px 0 0' : i === steps.length - 1 ? '0 0 6px 6px' : '0',
                  boxShadow: `0 4px 20px ${glows[i]}`,
                }}
              >
                <span className="text-white/70 text-[9px] font-semibold uppercase tracking-wider">{step.label}</span>
                <span className="text-white text-xl font-black mt-0.5">{step.value}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
