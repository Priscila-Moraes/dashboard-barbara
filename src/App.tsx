import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { fetchDaily, fetchCreatives } from './lib/supabase'
import type { DailySummary, AdCreative } from './lib/supabase'
import { formatCurrency, formatNumber, formatPercent } from './lib/utils'
import { DatePicker } from './components/DatePicker'
import { Funnel } from './components/Funnel'
import { MetricCard } from './components/MetricCard'
import { DailyChart } from './components/DailyChart'
import { CampaignsTable } from './components/CampaignsTable'
import { CreativesTable } from './components/CreativesTable'
import {
  DollarSign, Eye, MousePointer, Users, TrendingDown, Gauge, RefreshCw
} from 'lucide-react'

export default function App() {
  const [dateRange, setDateRange] = useState({ start: '2026-01-20', end: format(new Date(), 'yyyy-MM-dd') })
  const [daily, setDaily] = useState<DailySummary[]>([])
  const [creatives, setCreatives] = useState<AdCreative[]>([])
  const [loading, setLoading] = useState(true)

  async function loadData() {
    setLoading(true)
    try {
      const [d, c] = await Promise.all([
        fetchDaily(dateRange.start, dateRange.end),
        fetchCreatives(dateRange.start, dateRange.end),
      ])
      setDaily(d); setCreatives(c)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [dateRange])

  // Aggregate
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

  const startDate = new Date(dateRange.start + 'T12:00:00')
  const endDate = new Date(dateRange.end + 'T12:00:00')

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white/60">Carregando dados...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Ascensão 2026" className="h-8 object-contain" />
            </div>
            <div className="flex items-center gap-4">
              <button onClick={loadData} disabled={loading}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/40 hover:text-white transition-all">
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
              <DatePicker startDate={startDate} endDate={endDate} onChange={setDateRange} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">

          {/* Top Row - Funnel + Key Metrics */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Funnel */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-sm font-medium text-white/60 mb-4">Funil de Conversão</h3>
              <Funnel
                impressions={t.impr}
                clicks={t.clicks}
                conversations={t.conv}
              />
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <MetricCard label="Investimento" value={formatCurrency(t.spend)}
                icon={<DollarSign className="w-5 h-5" />} color="blue" />
              <MetricCard label="CPM" value={formatCurrency(cpm)}
                icon={<Eye className="w-5 h-5" />} color="gray" />
              <MetricCard label="CTR" value={formatPercent(ctr)}
                icon={<MousePointer className="w-5 h-5" />} color="blue" />
              <MetricCard label="CPC Link" value={formatCurrency(cpc)}
                icon={<TrendingDown className="w-5 h-5" />} color="yellow" />
              <MetricCard label="Custo/Conv." value={formatCurrency(costConv)}
                icon={<Gauge className="w-5 h-5" />} color="green" />
              <MetricCard label="Conversas" value={formatNumber(t.conv)}
                icon={<Users className="w-5 h-5" />} color="purple" />
            </div>
          </div>

          {/* Daily Chart */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 mb-4">Evolução Diária</h3>
            <DailyChart data={daily} />
          </div>

          {/* Campaigns Table */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 mb-4">Campanhas</h3>
            <CampaignsTable data={creatives} />
          </div>

          {/* Creatives Table */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 mb-4">Top Criativos</h3>
            <CreativesTable data={creatives} />
          </div>
        </div>
      </main>
    </div>
  )
}
