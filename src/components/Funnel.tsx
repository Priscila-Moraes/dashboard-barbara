import { fmtDot } from '../lib/utils'

interface Props {
  impressions: number
  reach: number
  clicks: number
  conversations: number
}

export default function Funnel({ impressions, reach, clicks, conversations }: Props) {
  const steps = [
    { label: 'Impressões Gerais', value: fmtDot(impressions) },
    { label: 'Alcance', value: fmtDot(reach) },
    { label: 'Cliques Gerais', value: fmtDot(clicks) },
    { label: 'Leads Gerais', value: fmtDot(conversations) },
  ]

  // Blue gradient like the reference screenshot
  const colors = ['#4f9cf7', '#3b82f6', '#2563eb', '#1d4ed8']

  return (
    <div className="bg-dark-800/60 border border-white/[0.06] rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-6">Funil de Conversão</h3>

      <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
        {steps.map((step, i) => {
          const widths = [100, 80, 58, 40]
          const w = widths[i]

          return (
            <div key={step.label} className="w-full flex flex-col items-center">
              <div
                className="relative flex flex-col items-center justify-center py-3.5 transition-all"
                style={{
                  width: `${w}%`,
                  background: `linear-gradient(135deg, ${colors[i]}, ${colors[i]}cc)`,
                  clipPath: i === 0
                    ? 'polygon(0% 0%, 100% 0%, 94% 100%, 6% 100%)'
                    : i === steps.length - 1
                    ? 'polygon(5% 0%, 95% 0%, 88% 100%, 12% 100%)'
                    : 'polygon(4% 0%, 96% 0%, 94% 100%, 6% 100%)',
                  borderRadius: i === 0 ? '10px 10px 0 0' : i === steps.length - 1 ? '0 0 8px 8px' : '0',
                }}
              >
                <span className="text-white/60 text-[9px] font-semibold uppercase tracking-wider">{step.label}</span>
                <span className="text-white text-xl font-black mt-0.5">{step.value}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
