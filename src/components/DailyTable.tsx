import { DailySummary } from '../lib/supabase'
import { fmtBRL, fmtNum, fmtPct, fmtDateBR } from '../lib/utils'

interface Props { data: DailySummary[] }

export default function DailyTable({ data }: Props) {
  if (!data.length) return null
  const rows = [...data].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="bg-[#1a1512] border border-[#2a2520] rounded-xl overflow-hidden anim" style={{ animationDelay: '400ms' }}>
      <div className="px-5 py-3.5 border-b border-[#2a2520]">
        <h3 className="text-[#8a7e72] text-[11px] font-semibold uppercase tracking-wider">Dados Diários</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#2a2520]">
              {['Data','Investimento','Impressões','Cliques','Conversas','Custo/Conv.','CPM','CTR','CPC Link'].map((h, i) => (
                <th key={h} className={`px-4 py-2.5 text-[#5a5048] font-medium text-[10px] uppercase tracking-wider ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.date} className="border-b border-[#1e1a17] hover:bg-[#b86a2a]/5 transition-colors">
                <td className="px-4 py-2.5 text-[#8a7e72] font-medium">{fmtDateBR(r.date)}</td>
                <td className="px-4 py-2.5 text-right text-[#b86a2a] font-semibold">{fmtBRL(r.total_spend || 0)}</td>
                <td className="px-4 py-2.5 text-right text-[#8a7e72]">{fmtNum(r.total_impressions || 0)}</td>
                <td className="px-4 py-2.5 text-right text-[#8a7e72]">{fmtNum(r.total_link_clicks || 0)}</td>
                <td className="px-4 py-2.5 text-right text-[#c4a882] font-semibold">{fmtNum(r.total_leads || 0)}</td>
                <td className="px-4 py-2.5 text-right text-[#8a7e72]">{fmtBRL(r.cpl || 0)}</td>
                <td className="px-4 py-2.5 text-right text-[#8a7e72]">{fmtBRL(r.cpm || 0)}</td>
                <td className="px-4 py-2.5 text-right text-[#8a7e72]">{fmtPct(r.ctr || 0)}</td>
                <td className="px-4 py-2.5 text-right text-[#8a7e72]">{fmtBRL(r.cpa || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
