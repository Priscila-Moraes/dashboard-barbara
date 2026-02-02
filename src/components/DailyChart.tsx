import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { fmtDateShort, fmtCurrency, fmtNumber, fmtPct } from '../lib/utils'
import { DailySummary } from '../lib/supabase'

interface Props { data: DailySummary[] }

type MKey = 'spend' | 'conv' | 'cpl' | 'cpm' | 'ctr' | 'impr' | 'clicks' | 'cpc'

const TABS: { k: MKey; label: string; color: string; fmt: (n: number) => string; bar?: boolean }[] = [
  { k: 'spend',  label: 'Investimento',   color: '#22c55e', fmt: fmtCurrency },
  { k: 'conv',   label: 'Conversas',      color: '#3b82f6', fmt: fmtNumber, bar: true },
  { k: 'cpl',    label: 'Custo/Conv.',    color: '#a855f7', fmt: fmtCurrency },
  { k: 'cpm',    label: 'CPM',            color: '#f59e0b', fmt: fmtCurrency },
  { k: 'ctr',    label: 'CTR',            color: '#f43f5e', fmt: fmtPct },
  { k: 'impr',   label: 'Impressões',     color: '#06b6d4', fmt: fmtNumber, bar: true },
  { k: 'clicks', label: 'Cliques',        color: '#10b981', fmt: fmtNumber, bar: true },
  { k: 'cpc',    label: 'CPC Link',       color: '#f97316', fmt: fmtCurrency },
]

function val(r: DailySummary, k: MKey): number {
  switch (k) {
    case 'spend':  return r.total_spend || 0
    case 'conv':   return r.total_leads || 0
    case 'cpl':    return r.cpl || 0
    case 'cpm':    return r.cpm || 0
    case 'ctr':    return r.ctr || 0
    case 'impr':   return r.total_impressions || 0
    case 'clicks': return r.total_link_clicks || 0
    case 'cpc':    return r.cpa || 0
  }
}

export default function DailyChart({ data }: Props) {
  const [sel, setSel] = useState<MKey>('spend')
  const tab = TABS.find(t => t.k === sel)!
  const pts = data.map(r => ({ date: fmtDateShort(r.date), v: val(r, sel) }))

  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-[#16161f] border border-white/10 rounded-xl px-4 py-2.5 shadow-xl text-xs">
        <p className="text-white/40 mb-0.5">{label}</p>
        <p className="text-white font-semibold">{tab.fmt(payload[0].value)}</p>
      </div>
    )
  }

  const axisProps = {
    tick: { fill: 'rgba(255,255,255,0.3)', fontSize: 11 },
    axisLine: false as const,
    tickLine: false as const,
  }

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 anim-fade-up" style={{ animationDelay: '250ms' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-white/70 font-semibold text-[15px]">Evolução Diária</h3>
        <div className="flex flex-wrap gap-1">
          {TABS.map(t => (
            <button key={t.k} onClick={() => setSel(t.k)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                sel === t.k ? 'text-white' : 'text-white/35 hover:text-white/55 hover:bg-white/[0.04]'
              }`}
              style={sel === t.k ? { backgroundColor: t.color + '18', color: t.color } : {}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {tab.bar ? (
            <BarChart data={pts} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" {...axisProps} axisLine={{ stroke: 'rgba(255,255,255,0.04)' }} interval="preserveStartEnd" />
              <YAxis {...axisProps} tickFormatter={(v: number) => v >= 1e6 ? (v/1e6).toFixed(0)+'M' : v >= 1e3 ? (v/1e3).toFixed(0)+'K' : String(v)} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="v" fill={tab.color} radius={[3, 3, 0, 0]} fillOpacity={0.75} />
            </BarChart>
          ) : (
            <AreaChart data={pts} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id={`g-${sel}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tab.color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={tab.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" {...axisProps} axisLine={{ stroke: 'rgba(255,255,255,0.04)' }} interval="preserveStartEnd" />
              <YAxis {...axisProps} tickFormatter={(v: number) => v >= 1e6 ? (v/1e6).toFixed(1)+'M' : v >= 1e3 ? (v/1e3).toFixed(1)+'K' : v.toFixed(2)} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="v" stroke={tab.color} strokeWidth={2} fill={`url(#g-${sel})`} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
