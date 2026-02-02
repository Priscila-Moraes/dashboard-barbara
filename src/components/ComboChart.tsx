import {
  ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { fmtDateShort, fmtBRL, fmtDot } from '../lib/utils'
import { DailySummary } from '../lib/supabase'

interface Props { data: DailySummary[] }

export default function ComboChart({ data }: Props) {
  const pts = data.map(r => ({
    date: fmtDateShort(r.date),
    mensagens: r.total_leads || 0,
    custoMsg: r.cpl || 0,
  }))

  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-[#1a1512] border border-[#2a2520] rounded-lg px-4 py-3 shadow-2xl text-xs">
        <p className="text-[#8a7e72] mb-2 font-medium">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
            <span className="text-[#8a7e72]">{p.dataKey === 'mensagens' ? 'Mensagens' : 'Custo/msg'}:</span>
            <span className="text-[#e8e0d8] font-semibold">
              {p.dataKey === 'mensagens' ? fmtDot(p.value) : fmtBRL(p.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const CustomLabel = ({ x, y, value }: any) => (
    <text x={x} y={y - 8} fill="#b86a2a" fontSize={10} fontWeight={600} textAnchor="middle">
      {fmtBRL(value)}
    </text>
  )

  return (
    <div className="bg-[#1a1512] border border-[#2a2520] rounded-xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#8a7e72] text-[11px] font-semibold uppercase tracking-wider">Mensagens por dia</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#b86a2a]"></span>
            <span className="text-[#8a7e72] text-[10px]">Mensagens</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#e8e0d8] rounded"></span>
            <span className="text-[#8a7e72] text-[10px]">Custo por mensagem</span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0" style={{ minHeight: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={pts} margin={{ top: 25, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,106,42,0.08)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#5a5048', fontSize: 10 }}
              axisLine={{ stroke: '#2a2520' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#5a5048', fontSize: 10 }}
              axisLine={false} tickLine={false}
              tickFormatter={(v: number) => v >= 1e3 ? (v/1e3).toFixed(0) + ' mil' : String(v)}
            />
            <YAxis
              yAxisId="right" orientation="right"
              tick={{ fill: '#5a5048', fontSize: 10 }}
              axisLine={false} tickLine={false}
              tickFormatter={(v: number) => `R$${v.toFixed(0)}`}
            />
            <Tooltip content={<Tip />} />
            <Bar
              yAxisId="left" dataKey="mensagens"
              fill="#b86a2a" radius={[4, 4, 0, 0]} fillOpacity={0.85}
              barSize={32}
            />
            <Line
              yAxisId="right" dataKey="custoMsg"
              stroke="#e8e0d8" strokeWidth={2} dot={{ r: 3.5, fill: '#e8e0d8', stroke: '#1a1512', strokeWidth: 2 }}
              label={<CustomLabel />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
