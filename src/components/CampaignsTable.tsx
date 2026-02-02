import type { AdCreative } from '../lib/supabase'
import { formatCurrency, formatNumber, formatPercent } from '../lib/utils'

interface Props { data: AdCreative[] }

function aggregate(raw: AdCreative[]) {
  const map = new Map<string, { name: string; spend: number; impressions: number; link_clicks: number; leads: number }>()
  for (const r of raw) {
    const k = r.campaign_name || 'Sem campanha'
    const p = map.get(k) || { name: k, spend: 0, impressions: 0, link_clicks: 0, leads: 0 }
    p.spend += r.spend || 0; p.impressions += r.impressions || 0
    p.link_clicks += r.link_clicks || 0; p.leads += r.leads || 0
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
    .sort((a, b) => b.leads - a.leads)
}

export function CampaignsTable({ data }: Props) {
  if (!data.length) return null
  const rows = aggregate(data)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {['Campanha','Gasto','Impressões','Cliques','Conversas','CPL','CTR','CPC','CPM'].map((h, i) => (
              <th key={h} className={`py-3 px-4 text-xs text-white/40 uppercase tracking-wide font-medium ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4 text-white/80 font-medium">{r.name}</td>
              <td className="py-3 px-4 text-right text-green-400 font-semibold">{formatCurrency(r.spend)}</td>
              <td className="py-3 px-4 text-right text-white/60">{formatNumber(r.impressions)}</td>
              <td className="py-3 px-4 text-right text-white/60">{formatNumber(r.link_clicks)}</td>
              <td className="py-3 px-4 text-right text-cyan-400 font-semibold">{formatNumber(r.leads)}</td>
              <td className="py-3 px-4 text-right text-purple-400">{formatCurrency(r.cpl)}</td>
              <td className="py-3 px-4 text-right text-white/60">{formatPercent(r.ctr)}</td>
              <td className="py-3 px-4 text-right text-orange-400">{formatCurrency(r.cpc)}</td>
              <td className="py-3 px-4 text-right text-yellow-400">{formatCurrency(r.cpm)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
