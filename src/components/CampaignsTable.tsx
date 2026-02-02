import { AdCreative } from '../lib/supabase'
import { fmtBRL, fmtNum, fmtPct } from '../lib/utils'

interface Props { data: AdCreative[] }

function aggregate(raw: AdCreative[]) {
  const map = new Map<string, { name: string; spend: number; impressions: number; link_clicks: number; leads: number }>()
  for (const r of raw) {
    const k = (r as any).campaign_name || 'Sem campanha'
    const p = map.get(k) || { name: k, spend: 0, impressions: 0, link_clicks: 0, leads: 0 }
    p.spend += r.spend || 0
    p.impressions += r.impressions || 0
    p.link_clicks += r.link_clicks || 0
    p.leads += r.leads || 0
    map.set(k, p)
  }
  return Array.from(map.values())
    .map(c => ({
      ...c,
      cpl: c.leads > 0 ? c.spend / c.leads : 0,
      ctr: c.impressions > 0 ? (c.link_clicks / c.impressions) * 100 : 0,
      cpc: c.link_clicks > 0 ? c.spend / c.link_clicks : 0,
      cpm: c.impressions > 0 ? (c.spend / c.impressions) * 1000 : 0,
    }))
    .sort((a, b) => b.spend - a.spend)
}

export default function CampaignsTable({ data }: Props) {
  if (!data.length) return null
  const rows = aggregate(data)

  return (
    <div className="bg-[#12121e] border border-white/[0.06] rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '250ms' }}>
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h3 className="text-white/70 font-semibold text-sm">Campanhas</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-5 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider min-w-[250px]">Campanha</th>
              <th className="text-right px-4 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider">Gasto</th>
              <th className="text-right px-4 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider">Impressões</th>
              <th className="text-right px-4 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider">Cliques</th>
              <th className="text-right px-4 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider">Conversas</th>
              <th className="text-right px-4 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider">CPL</th>
              <th className="text-right px-4 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider">CTR</th>
              <th className="text-right px-4 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider">CPC</th>
              <th className="text-right px-4 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider">CPM</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name} className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${i % 2 !== 0 ? 'bg-white/[0.01]' : ''}`}>
                <td className="px-5 py-3 text-white/70 font-medium truncate max-w-[300px]" title={r.name}>{r.name}</td>
                <td className="px-4 py-3 text-right text-emerald-400 font-semibold">{fmtBRL(r.spend)}</td>
                <td className="px-4 py-3 text-right text-white/50">{fmtNum(r.impressions)}</td>
                <td className="px-4 py-3 text-right text-white/50">{fmtNum(r.link_clicks)}</td>
                <td className="px-4 py-3 text-right text-cyan-400 font-semibold">{fmtNum(r.leads)}</td>
                <td className="px-4 py-3 text-right text-purple-400">{fmtBRL(r.cpl)}</td>
                <td className="px-4 py-3 text-right text-rose-400">{fmtPct(r.ctr)}</td>
                <td className="px-4 py-3 text-right text-orange-400">{fmtBRL(r.cpc)}</td>
                <td className="px-4 py-3 text-right text-amber-400">{fmtBRL(r.cpm)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
