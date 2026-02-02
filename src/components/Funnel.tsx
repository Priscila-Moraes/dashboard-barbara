import { fmtDot, fmtBRL, fmtPct } from '../lib/utils'

interface Props {
  impressions: number
  clicks: number
  conversations: number
  spend: number
}

export default function Funnel({ impressions, clicks, conversations, spend }: Props) {
  const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
  const cpc = clicks > 0 ? spend / clicks : 0
  const convRate = clicks > 0 ? (conversations / clicks) * 100 : 0
  const costConv = conversations > 0 ? spend / conversations : 0

  const steps = [
    { label: 'Impressions', value: fmtDot(impressions), width: '100%' },
    { label: 'Link Clicks', value: fmtDot(clicks), width: '75%' },
    { label: 'Conversas WhatsApp', value: fmtDot(conversations), width: '50%' },
  ]

  const metrics = [
    { label: 'CPM', value: fmtBRL(cpm), pos: 0 },
    { label: 'CTR', value: fmtPct(ctr), pos: 0.5 },
    { label: 'CPC Link', value: fmtBRL(cpc), pos: 1 },
    { label: 'Conv. Rate', value: fmtPct(convRate), pos: 1.5 },
    { label: 'Custo/Conversa', value: fmtBRL(costConv), pos: 2 },
  ]

  return (
    <div className="flex items-start gap-6 w-full">
      {/* Funnel steps */}
      <div className="flex flex-col items-center gap-1.5 flex-1">
        {steps.map((s, i) => (
          <div key={i} className="w-full flex justify-center" style={{ maxWidth: s.width }}>
            <div
              className="funnel-step w-full"
              style={{
                background: i === 0
                  ? 'linear-gradient(135deg, #b5f542, #8fd92a)'
                  : i === 1
                  ? 'linear-gradient(135deg, #a0e636, #7cc520)'
                  : 'linear-gradient(135deg, #8ad42a, #68a818)',
                minHeight: '68px',
              }}
            >
              <span className="text-[11px] font-semibold text-black/60 uppercase tracking-wide">{s.label}</span>
              <span className="text-2xl font-black text-black/90 leading-tight">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics sidebar */}
      <div className="flex flex-col justify-between py-1 min-w-[130px]" style={{ height: `${steps.length * 68 + (steps.length - 1) * 6}px` }}>
        {metrics.map((m, i) => (
          <div key={i} className="text-right">
            <p className="text-[10px] text-white/35 uppercase tracking-wider font-medium">{m.label}</p>
            <p className="text-[17px] font-bold text-white/90">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
