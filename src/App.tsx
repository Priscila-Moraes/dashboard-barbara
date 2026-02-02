import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { Loader2, RefreshCw } from 'lucide-react'
import { fetchDaily, fetchCreatives, DailySummary, AdCreative } from './lib/supabase'
import { fmtBRL, fmtDot, fmtPct } from './lib/utils'
import DatePicker from './components/DatePicker'
import MetricCards from './components/MetricCards'
import ComboChart from './components/ComboChart'
import Funnel from './components/Funnel'
import CreativesTable from './components/CreativesTable'
import DailyTable from './components/DailyTable'

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

  const reach = Math.round(t.impr * 0.65)
  const cpm = t.impr > 0 ? (t.spend / t.impr) * 1000 : 0
  const ctr = t.impr > 0 ? (t.clicks / t.impr) * 100 : 0
  const cpc = t.clicks > 0 ? t.spend / t.clicks : 0
  const costConv = t.conv > 0 ? t.spend / t.conv : 0

  const metrics = [
    { label: 'Investimento', value: fmtBRL(t.spend) },
    { label: 'Mensagens', value: fmtDot(t.conv) },
    { label: 'Custo por msg', value: fmtBRL(costConv) },
    { label: 'Cliques', value: fmtDot(t.clicks) },
    { label: 'CPC', value: fmtBRL(cpc) },
    { label: 'Impressões', value: fmtDot(t.impr) },
    { label: 'CPM', value: fmtBRL(cpm) },
  ]

  return (
    <div className="min-h-screen bg-[#0f0c0a]">
      {/* ── HEADER ─────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0f0c0a]/90 backdrop-blur-lg border-b border-[#2a2520]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Ascensão 2026" className="h-8 object-contain" />
            <div className="hidden sm:block h-6 w-px bg-[#2a2520]"></div>
            <span className="hidden sm:block text-[#5a5048] text-xs font-medium">WhatsApp Leads</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} disabled={loading}
              className="p-2 rounded-lg bg-[#1a1512] border border-[#2a2520] hover:border-[#b86a2a]/40 text-[#5a5048] hover:text-[#b86a2a] transition disabled:opacity-40">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <DatePicker startDate={s} endDate={e} onChange={(a, b) => { setS(a); setE(b) }} />
          </div>
        </div>
      </header>

      {/* ── CONTENT ────────────────── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <Loader2 className="animate-spin text-[#b86a2a]" size={28} />
          </div>
        ) : daily.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-[#5a5048]">
            <p className="text-lg font-semibold">Sem dados para o período</p>
            <p className="text-sm mt-1">Selecione outro intervalo</p>
          </div>
        ) : (
          <>
            {/* ── Metric Cards Row ────── */}
            <MetricCards metrics={metrics} />

            {/* ── Chart + Funnel ─────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 anim" style={{ animationDelay: '150ms' }}>
              <div className="lg:col-span-2">
                <ComboChart data={daily} />
              </div>
              <div>
                <Funnel impressions={t.impr} reach={reach} clicks={t.clicks} conversations={t.conv} />
              </div>
            </div>

            {/* ── Creatives Table ─────── */}
            <CreativesTable data={creatives} />

            {/* ── Daily Table ─────────── */}
            <DailyTable data={daily} />
          </>
        )}
      </main>

      {/* ── FOOTER ─────────────────── */}
      <footer className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-t border-[#1e1a17] pt-4 flex justify-between text-[#3a3530] text-[10px]">
          <span>Dashboard Barbara — Ascensão 2026</span>
          <span>Atualizado diariamente via n8n</span>
        </div>
      </footer>
    </div>
  )
}
