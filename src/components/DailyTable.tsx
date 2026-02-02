import { DailySummary } from '../lib/supabase'
import { fmtBRL, fmtNum, fmtPct, fmtDateBR } from '../lib/utils'

interface Props { data: DailySummary[] }

export default function DailyTable({ data }: Props) {
  if (!data.length) return null
  const rows = [...data].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="bg-[#12121e] border border-white/[0.06] rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h3 className="text-white/70 font-semibold text-sm">Dados Diários</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Data','Investimento','Impressões','Cliques','Conversas','Custo/Conv.','CPM','CTR','CPC'].map((h, i) => (
                <th key={h} className={`px-4 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.date} className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${i % 2 !== 0 ? 'bg-white/[0.01]' : ''}`}>
                <td className="px-4 py-3 text-white/60 font-medium">{fmtDateBR(r.date)}</td>
                <td className="px-4 py-3 text-right text-emerald-400 font-medium">{fmtBRL(r.total_spend || 0)}</td>
                <td className="px-4 py-3 text-right text-white/50">{fmtNum(r.total_impressions || 0)}</td>
                <td className="px-4 py-3 text-right text-white/50">{fmtNum(r.total_link_clicks || 0)}</td>
                <td className="px-4 py-3 text-right text-cyan-400 font-medium">{fmtNum(r.total_leads || 0)}</td>
                <td className="px-4 py-3 text-right text-purple-400">{fmtBRL(r.cpl || 0)}</td>
                <td className="px-4 py-3 text-right text-amber-400">{fmtBRL(r.cpm || 0)}</td>
                <td className="px-4 py-3 text-right text-rose-400">{fmtPct(r.ctr || 0)}</td>
                <td className="px-4 py-3 text-right text-orange-400">{fmtBRL(r.cpa || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
