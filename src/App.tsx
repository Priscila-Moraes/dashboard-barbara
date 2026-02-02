import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import {
  DollarSign, MessageCircle, TrendingDown, BarChart3,
  MousePointerClick, Users, Eye, Link2, Loader2, RefreshCw
} from 'lucide-react'
import { fetchDailySummary, fetchAdCreatives, DailySummary, AdCreative } from './lib/supabase'
import { fmtCurrency, fmtNumber, fmtPct } from './lib/utils'
import DatePicker from './components/DatePicker'
import MetricCard from './components/MetricCard'
import DailyChart from './components/DailyChart'
import DailyTable from './components/DailyTable'
import CreativesTable from './components/CreativesTable'

const CAMPAIGNS = [
  'PM_ASCENSAO2026_LEAD_WHATSAPP_PF_AUTO_CBO',
  '[Leads] [WhatsApp] [F] - Ascensão 2026',
]

export default function App() {
  const [startDate, setStartDate] = useState(new Date('2026-01-20'))
  const [endDate, setEndDate] = useState(new Date())
  const [daily, setDaily] = useState<DailySummary[]>([])
  const [creatives, setCreatives] = useState<AdCreative[]>([])
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const s = format(startDate, 'yyyy-MM-dd')
      const e = format(endDate, 'yyyy-MM-dd')
      const [d, c] = await Promise.all([fetchDailySummary(s, e), fetchAdCreatives(s, e)])
      setDaily(d)
      setCreatives(c)
      setUpdatedAt(new Date())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => { load() }, [load])

  // ── Aggregated metrics ─────────────────────────
  const totals = daily.reduce((a, r) => ({
    spend: a.spend + (r.total_spend || 0),
    impressions: a.impressions + (r.total_impressions || 0),
    clicks: a.clicks + (r.total_link_clicks || 0),
    conversations: a.conversations + (r.total_leads || 0),
  }), { spend: 0, impressions: 0, clicks: 0, conversations: 0 })

  const reach = Math.round(totals.impressions * 0.65)
  const cpm = totals.impressions > 0 ? (totals.spend / totals.impressions) * 1000 : 0
  const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0
  const costConv = totals.conversations > 0 ? totals.spend / totals.conversations : 0
  const cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0

  const onDate = (s: Date, e: Date) => { setStartDate(s); setEndDate(e) }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Header ─────────────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/[0.05]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center font-extrabold text-[#0a0a0f] text-lg shadow-lg shadow-green-500/20">
                B
              </div>
              <div>
                <h1 className="text-white font-bold text-[17px] leading-tight">Barbara</h1>
                <p className="text-white/25 text-[11px]">Ascensão 2026 — WhatsApp Leads</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {updatedAt && (
                <span className="hidden md:block text-white/20 text-[11px]">
                  {format(updatedAt, 'HH:mm')}
                </span>
              )}
              <button onClick={load} disabled={loading}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white/70 transition-all disabled:opacity-40"
                title="Atualizar">
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>
              <DatePicker startDate={startDate} endDate={endDate} onChange={onDate} />
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ────────────────────── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* Campaign tags */}
        <div className="flex flex-wrap gap-2">
          {CAMPAIGNS.map(c => (
            <span key={c} className="px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-lg text-[11px] text-white/30 font-medium">{c}</span>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-green-500" size={30} />
          </div>
        ) : daily.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-white/25">
            <BarChart3 size={44} className="mb-3 opacity-25" />
            <p className="text-base font-medium">Sem dados para o período</p>
            <p className="text-sm mt-1">Selecione outro intervalo de datas</p>
          </div>
        ) : (
          <>
            {/* ── Metric Cards ────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
              <MetricCard icon={<DollarSign size={16} />}           label="Investimento"   value={fmtCurrency(totals.spend)}        accent="green"   delay={0} />
              <MetricCard icon={<MessageCircle size={16} />}        label="Conversas"       value={fmtNumber(totals.conversations)}  accent="blue"    delay={30} />
              <MetricCard icon={<TrendingDown size={16} />}         label="Custo/Conversa"  value={fmtCurrency(costConv)}            accent="purple"  delay={60} />
              <MetricCard icon={<BarChart3 size={16} />}            label="CPM"             value={fmtCurrency(cpm)}                 accent="amber"   delay={90} />
              <MetricCard icon={<MousePointerClick size={16} />}    label="CTR"             value={fmtPct(ctr)}                      accent="rose"    delay={120} />
              <MetricCard icon={<Users size={16} />}                label="Alcance"         value={fmtNumber(reach)} sub="~65% impr." accent="cyan"   delay={150} />
              <MetricCard icon={<Eye size={16} />}                  label="Impressões"      value={fmtNumber(totals.impressions)}    accent="teal"    delay={180} />
              <MetricCard icon={<Link2 size={16} />}                label="Cliques no Link" value={fmtNumber(totals.clicks)}         accent="emerald" delay={210} />
              <MetricCard icon={<DollarSign size={16} />}           label="CPC Link"        value={fmtCurrency(cpc)}                 accent="orange"  delay={240} />
            </div>

            {/* ── Chart ───────────────── */}
            <DailyChart data={daily} />

            {/* ── Creatives Table ─────── */}
            <CreativesTable data={creatives} />

            {/* ── Daily Table ─────────── */}
            <DailyTable data={daily} />
          </>
        )}
      </main>

      {/* ── Footer ─────────────────────── */}
      <footer className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-t border-white/[0.04] pt-5 flex items-center justify-between">
          <p className="text-white/15 text-[11px]">Dashboard Barbara — Ascensão 2026</p>
          <p className="text-white/15 text-[11px]">Dados atualizados diariamente via n8n</p>
        </div>
      </footer>
    </div>
  )
}
