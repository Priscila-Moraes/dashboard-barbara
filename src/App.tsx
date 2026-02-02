import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { Loader2, RefreshCw } from 'lucide-react'
import { fetchDaily, fetchCreatives, DailySummary, AdCreative } from './lib/supabase'
import { fmtBRL } from './lib/utils'
import DatePicker from './components/DatePicker'
import Funnel from './components/Funnel'
import DailyChart from './components/DailyChart'
import CreativesTable from './components/CreativesTable'

export default function App() {
  const [startDate, setStartDate] = useState(new Date('2026-01-20'))
  const [endDate, setEndDate] = useState(new Date())
  const [daily, setDaily] = useState<DailySummary[]>([])
  const [creatives, setCreatives] = useState<AdCreative[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const s = format(startDate, 'yyyy-MM-dd'), e = format(endDate, 'yyyy-MM-dd')
      const [d, c] = await Promise.all([fetchDaily(s, e), fetchCreatives(s, e)])
      setDaily(d); setCreatives(c)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [startDate, endDate])

  useEffect(() => { load() }, [load])

  const t = daily.reduce((a, r) => ({
    spend: a.spend + (r.total_spend || 0),
    impressions: a.impressions + (r.total_impressions || 0),
    clicks: a.clicks + (r.total_link_clicks || 0),
    conversations: a.conversations + (r.total_leads || 0),
  }), { spend: 0, impressions: 0, clicks: 0, conversations: 0 })

  const onDate = (s: Date, e: Date) => { setStartDate(s); setEndDate(e) }

  return (
    <div className="min-h-screen bg-[#0c0c14]">
      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="border-b border-white/[0.06] bg-[#0c0c14]">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Logo + Meta badge + Spend */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#b5f542] to-[#7cc520] flex items-center justify-center">
                  <span className="text-black font-black text-sm">B</span>
                </div>
                <span className="text-white/80 font-bold text-sm hidden sm:block">Barbara</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/25 text-xs hidden md:block">∞ Meta</span>
              </div>
              {/* Total Spend Badge */}
              {!loading && daily.length > 0 && (
                <div className="px-4 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg">
                  <span className="text-[10px] text-white/30 uppercase tracking-wider block leading-tight">Valor Gasto</span>
                  <span className="text-white font-extrabold text-lg leading-tight">{fmtBRL(t.spend)}</span>
                </div>
              )}
            </div>

            {/* Right: Refresh + DatePicker */}
            <div className="flex items-center gap-2">
              <button onClick={load} disabled={loading}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/35 hover:text-white/60 transition-all disabled:opacity-30">
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
              <DatePicker startDate={startDate} endDate={endDate} onChange={onDate} />
            </div>
          </div>
        </div>
      </header>

      {/* ── CONTENT ────────────────────────────────────── */}
      <main className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <Loader2 className="animate-spin text-[#b5f542]" size={30} />
          </div>
        ) : daily.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-white/20">
            <p className="text-lg font-medium">Sem dados para o período selecionado</p>
            <p className="text-sm mt-1">Selecione outro intervalo de datas</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Row 1: Chart + Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 anim">
              {/* Chart */}
              <DailyChart data={daily} />

              {/* Funnel */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex flex-col">
                <h3 className="text-white/60 font-semibold text-sm mb-5">Funil de Conversão</h3>
                <div className="flex-1 flex items-center">
                  <Funnel
                    impressions={t.impressions}
                    clicks={t.clicks}
                    conversations={t.conversations}
                    spend={t.spend}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Creatives Table */}
            <div className="anim" style={{ animationDelay: '150ms' }}>
              <CreativesTable data={creatives} />
            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-t border-white/[0.04] pt-4 flex items-center justify-between">
          <p className="text-white/12 text-[10px]">Dashboard Barbara — Ascensão 2026</p>
          <p className="text-white/12 text-[10px]">Atualizado diariamente via n8n</p>
        </div>
      </footer>
    </div>
  )
}
