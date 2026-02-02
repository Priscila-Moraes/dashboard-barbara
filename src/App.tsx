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
              <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
              <div className="hidden sm:flex items-center gap-2">
                <svg viewBox="0 0 512 512" className="w-5 h-5">
                  <path d="M115.34 217.57c-23.89 34.32-37.34 72.15-37.34 97.43 0 42.86 20.42 68.22 56.02 68.22 21.86 0 43.81-14.47 66.07-43.58L234.8 293l36.85-50.64c29.6-40.76 62.84-73.58 99.89-73.58 51.97 0 92.46 39.08 92.46 106.22 0 75.54-41.34 137-104.46 137-36.44 0-64.86-14.2-98.67-55.56l-28.47 39.14C264.48 436.72 303.26 460 359.54 460 449.78 460 512 383.36 512 275c0-92.15-55.73-143-117.64-143-48.7 0-89.61 31.42-126.28 80.58L234.8 260l-30.05 41.42c-25.3 34.97-45.72 52.42-70.73 52.42-27.58 0-42.02-19.25-42.02-50.84 0-22.66 10.28-53.56 30.37-82.43l-7.03-3zm298.2-48.79c-27.58 0-52.43 20.42-82.43 60.05l-7.57 10.1 28.65 39.41c27.58-38.72 47.83-60.23 72.34-60.23 25.12 0 42.2 18.17 42.2 49.93 0 8.58-1.17 18.53-3.5 28.48l8.76 2.33c2.92-12.27 4.67-24.89 4.67-37.14 0-51.6-24.33-92.93-63.12-92.93zM168.4 168.78c-43 0-78.77 29.56-107.83 80.76L52 246.22l7.03 3 8.58-12.83c26.47-39.23 55.73-65.28 91.8-65.28 39.78 0 71.56 30.42 71.56 88.27 0 7.93-.58 16.22-2.15 24.89l8.58 2.33c1.75-9.83 2.92-20.06 2.92-30.55 0-73.4-34.14-87.27-71.92-87.27z" fill="#0081FB"/>
                </svg>
                <span className="text-sm text-white/50 font-medium">Meta Ads</span>
              </div>
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
