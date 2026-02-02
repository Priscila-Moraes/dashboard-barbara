import { DailySummary } from '../lib/supabase'
import { fmtCurrency, fmtNumber, fmtPct, fmtDateBR } from '../lib/utils'

interface Props { data: DailySummary[] }

export default function DailyTable({ data }: Props) {
  if (!data.length) return null
  const rows = [...data].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden anim-fade-up" style={{ animationDelay: '350ms' }}>
      <div className="px-6 py-4 border-b border-white/[0.05]">
        <h3 className="text-white/70 font-semibold text-[15px]">Dados Diários</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {['Data','Investimento','Impressões','Cliques','Conversas','Custo/Conv.','CPM','CTR','CPC Link'].map(h => (
                <th key={h} className={`px-4 py-3 text-white/35 font-medium text-[11px] uppercase tracking-wider ${h === 'Data' ? 'text-left' : 'text-right'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.date} className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${i % 2 ? 'bg-white/[0.01]' : ''}`}>
                <td className="px-4 py-2.5 text-white/60 font-medium">{fmtDateBR(r.date)}</td>
                <td className="px-4 py-2.5 text-right text-green-400 font-medium">{fmtCurrency(r.total_spend || 0)}</td>
                <td className="px-4 py-2.5 text-right text-white/50">{fmtNumber(r.total_impressions || 0)}</td>
                <td className="px-4 py-2.5 text-right text-white/50">{fmtNumber(r.total_link_clicks || 0)}</td>
                <td className="px-4 py-2.5 text-right text-blue-400 font-medium">{fmtNumber(r.total_leads || 0)}</td>
                <td className="px-4 py-2.5 text-right text-purple-400">{fmtCurrency(r.cpl || 0)}</td>
                <td className="px-4 py-2.5 text-right text-amber-400">{fmtCurrency(r.cpm || 0)}</td>
                <td className="px-4 py-2.5 text-right text-rose-400">{fmtPct(r.ctr || 0)}</td>
                <td className="px-4 py-2.5 text-right text-orange-400">{fmtCurrency(r.cpa || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
