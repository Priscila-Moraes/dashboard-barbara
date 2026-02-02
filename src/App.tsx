import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import {
  Loader2, RefreshCw, DollarSign, Eye, BarChart3,
  MousePointerClick, TrendingDown, Gauge
} from 'lucide-react'
import { fetchDaily, fetchCreatives, DailySummary, AdCreative } from './lib/supabase'
import { fmtBRL, fmtDot, fmtPct } from './lib/utils'
import DatePicker from './components/DatePicker'
import MetricCard from './components/MetricCard'
import Funnel from './components/Funnel'
import SidePanel from './components/SidePanel'
import DailyChart from './components/DailyChart'
import CampaignsTable from './components/CampaignsTable'
import CreativesTable from './components/CreativesTable'

export default function App() {
  const [s, setS] = useState(new Date('2026-01-20'))
  const [e, setE] = useState(new Date())
  const [daily, setDaily] = useState<DailySummary[]>([])
  const [creatives, setCreatives] = useState<AdCreative[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [d, c] = await Promise.all([
        fetchDaily(format(s, 'yyyy-MM-dd'), format(e, 'yyyy-MM-dd')),
        fetchCreatives(format(s, 'yyyy-MM-dd'), format(e, 'yyyy-MM-dd')),
      ])
      setDaily(d); setCreatives(c)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [s, e])

  useEffect(() => { load() }, [load])

  const t = daily.reduce((a, r) => ({
    spend: a.spend + (r.total_spend || 0),
    impr: a.impr + (r.total_impressions || 0),
    clicks: a.clicks + (r.total_link_clicks || 0),
    conv: a.conv + (r.total_leads || 0),
  }), { spend: 0, impr: 0, clicks: 0, conv: 0 })

  const cpm = t.impr > 0 ? (t.spend / t.impr) * 1000 : 0
  const ctr = t.impr > 0 ? (t.clicks / t.impr) * 100 : 0
  const cpc = t.clicks > 0 ? t.spend / t.clicks : 0
  const costConv = t.conv > 0 ? t.spend / t.conv : 0

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* ── HEADER ─────────────── */}
      <header className="sticky top-0 z-40 bg-[#0a0a12]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Ascensão 2026" className="h-7 object-contain" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} disabled={loading}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all disabled:opacity-40">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <DatePicker startDate={s} endDate={e} onChange={(a, b) => { setS(a); setE(b) }} />
          </div>
        </div>
      </header>

      {/* ── CONTENT ────────────── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <Loader2 className="animate-spin text-emerald-500" size={28} />
          </div>
        ) : daily.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-white/30">
            <p className="text-lg font-semibold">Sem dados para o período</p>
            <p className="text-sm mt-1">Selecione outro intervalo</p>
          </div>
        ) : (
          <>
            {/* ── ROW 1: Funnel + Metrics + SidePanel ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-fade-in-up">
              {/* Funnel - 4 cols */}
              <div className="lg:col-span-4">
                <Funnel impressions={t.impr} clicks={t.clicks} conversations={t.conv} />
              </div>

              {/* Metric Cards - 2x3 grid - 5 cols */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                <MetricCard label="Investimento" value={fmtBRL(t.spend)}
                  icon={<DollarSign size={18} />} color="text-emerald-400" delay={0} />
                <MetricCard label="CPM" value={fmtBRL(cpm)}
                  icon={<Eye size={18} />} color="text-amber-400" delay={40} />
                <MetricCard label="CTR" value={fmtPct(ctr)}
                  icon={<MousePointerClick size={18} />} color="text-purple-400" delay={80} />
                <MetricCard label="CPC Link" value={fmtBRL(cpc)}
                  icon={<TrendingDown size={18} />} color="text-cyan-400" delay={120} />
                <MetricCard label="Custo/Conv." value={fmtBRL(costConv)}
                  icon={<Gauge size={18} />} color="text-rose-400" delay={160} />
                <MetricCard label="Impressões" value={fmtDot(t.impr)}
                  icon={<BarChart3 size={18} />} color="text-blue-400" delay={200} />
              </div>

              {/* Side Panel - 3 cols */}
              <div className="lg:col-span-3">
                <SidePanel
                  conversations={t.conv}
                  costPerConv={costConv}
                  cpc={cpc}
                  ctr={ctr}
                  clicks={t.clicks}
                />
              </div>
            </div>

            {/* ── ROW 2: Chart ── */}
            <DailyChart data={daily} />

            {/* ── ROW 3: Campanhas ── */}
            <CampaignsTable data={creatives} />

            {/* ── ROW 4: Criativos ── */}
            <CreativesTable data={creatives} />
          </>
        )}
      </main>

      {/* ── FOOTER ─────────────── */}
      <footer className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-t border-white/5 pt-4 flex justify-between text-white/15 text-[10px]">
          <span>Dashboard Barbara — Ascensão 2026</span>
          <span>Atualizado diariamente via n8n</span>
        </div>
      </footer>
    </div>
  )
}
