import {
  ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { fmtDateShort, fmtBRL, fmtDot } from '../lib/utils'
import { DailySummary } from '../lib/supabase'

interface Props { data: DailySummary[] }

export default function DailyChart({ data }: Props) {
  const pts = data.map(r => ({
    date: fmtDateShort(r.date),
    investimento: r.total_spend || 0,
    conversas: r.total_leads || 0,
  }))

  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-[#0f0f1a] border border-white/10 rounded-xl px-4 py-3 shadow-2xl text-xs">
        <p className="text-white/40 mb-2 font-medium">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.stroke }}></span>
            <span className="text-white/40">{p.dataKey === 'investimento' ? 'Investimento' : 'Conversas'}:</span>
            <span className="text-white font-semibold">
              {p.dataKey === 'investimento' ? fmtBRL(p.value) : fmtDot(p.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-[#12121e] border border-white/[0.06] rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <h3 className="text-white/70 font-semibold text-sm mb-6">Evolução Diária</h3>
      <div style={{ minHeight: 280 }}>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={pts} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradInvest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradConv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v: number) => `R$ ${v >= 1e3 ? (v/1e3).toFixed(0) + 'K' : v}`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <Area yAxisId="left" type="monotone" dataKey="investimento" stroke="#3b82f6" strokeWidth={2} fill="url(#gradInvest)" />
            <Area yAxisId="right" type="monotone" dataKey="conversas" stroke="#06b6d4" strokeWidth={2} fill="url(#gradConv)" />
            <Legend
              verticalAlign="bottom"
              formatter={(v: string) => <span className="text-white/40 text-xs ml-1">{v === 'investimento' ? 'Investimento' : 'Conversas'}</span>}
              iconType="circle"
              iconSize={8}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
