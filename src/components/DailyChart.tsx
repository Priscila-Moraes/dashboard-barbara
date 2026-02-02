import { useState } from 'react'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { fmtDateShort, fmtBRL, fmtNum, fmtPct } from '../lib/utils'
import { DailySummary } from '../lib/supabase'

interface Props { data: DailySummary[] }
type K = 'spend' | 'conv' | 'cpl' | 'cpm' | 'ctr' | 'clicks'

const TABS: { k: K; l: string; c: string; fmt: (n: number) => string; bar?: boolean }[] = [
  { k: 'spend', l: 'Investimento', c: '#b5f542', fmt: fmtBRL, bar: true },
  { k: 'conv',  l: 'Conversas',   c: '#3b82f6', fmt: fmtNum, bar: true },
  { k: 'cpl',   l: 'Custo/Conv.', c: '#a855f7', fmt: fmtBRL },
  { k: 'cpm',   l: 'CPM',         c: '#f59e0b', fmt: fmtBRL },
  { k: 'ctr',   l: 'CTR',         c: '#f43f5e', fmt: fmtPct },
  { k: 'clicks',l: 'Cliques',     c: '#06b6d4', fmt: fmtNum, bar: true },
]

function v(r: DailySummary, k: K): number {
  switch (k) {
    case 'spend': return r.total_spend || 0
    case 'conv': return r.total_leads || 0
    case 'cpl': return r.cpl || 0
    case 'cpm': return r.cpm || 0
    case 'ctr': return r.ctr || 0
    case 'clicks': return r.total_link_clicks || 0
  }
}

export default function DailyChart({ data }: Props) {
  const [sel, setSel] = useState<K>('spend')
  const tab = TABS.find(t => t.k === sel)!
  const pts = data.map(r => ({ d: fmtDateShort(r.date), v: v(r, sel) }))

  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-[#1a1a26] border border-white/10 rounded-lg px-3 py-2 shadow-xl text-xs">
        <p className="text-white/35 mb-0.5">{label}</p>
        <p className="text-white font-bold">{tab.fmt(payload[0].value)}</p>
      </div>
    )
  }

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h3 className="text-white/60 font-semibold text-sm">Evolução Diária</h3>
        <div className="flex flex-wrap gap-1">
          {TABS.map(t => (
            <button key={t.k} onClick={() => setSel(t.k)}
              className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                sel === t.k ? 'text-black' : 'text-white/30 hover:text-white/50 hover:bg-white/[0.04]'
              }`}
              style={sel === t.k ? { backgroundColor: t.c, color: '#000' } : {}}>
              {t.l}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0" style={{ minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {tab.bar ? (
            <BarChart data={pts} margin={{ top: 4, right: 0, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="d" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(n: number) => n >= 1e6 ? (n/1e6).toFixed(0)+'M' : n >= 1e3 ? (n/1e3).toFixed(0)+'K' : String(n)} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="v" fill={tab.c} radius={[3, 3, 0, 0]} fillOpacity={0.85} />
            </BarChart>
          ) : (
            <AreaChart data={pts} margin={{ top: 4, right: 0, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id={`g${sel}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tab.c} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={tab.c} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="d" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(n: number) => n >= 1e3 ? (n/1e3).toFixed(1)+'K' : n.toFixed(2)} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="v" stroke={tab.c} strokeWidth={2} fill={`url(#g${sel})`} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
