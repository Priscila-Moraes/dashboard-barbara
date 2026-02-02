import { ExternalLink } from 'lucide-react'
import type { AdCreative } from '../lib/supabase'
import { formatCurrency, formatNumber, formatPercent } from '../lib/utils'

interface Props { data: AdCreative[] }

function aggregate(raw: AdCreative[]) {
  const map = new Map<string, { ad_name: string; ad_id: string; ig: string; spend: number; impressions: number; link_clicks: number; leads: number }>()
  for (const r of raw) {
    const k = r.ad_name || r.ad_id
    const p = map.get(k) || { ad_name: r.ad_name, ad_id: r.ad_id, ig: '', spend: 0, impressions: 0, link_clicks: 0, leads: 0 }
    p.spend += r.spend || 0; p.impressions += r.impressions || 0
    p.link_clicks += r.link_clicks || 0; p.leads += r.leads || 0
    if (r.instagram_permalink && !p.ig) p.ig = r.instagram_permalink
    map.set(k, p)
  }
  return Array.from(map.values())
    .map(c => ({
      ...c,
      cpl: c.leads > 0 ? c.spend / c.leads : 0,
      ctr: c.impressions > 0 ? (c.link_clicks / c.impressions) * 100 : 0,
    }))
    .sort((a, b) => b.spend - a.spend)
}

export function CreativesTable({ data }: Props) {
  if (!data.length) return null
  const rows = aggregate(data)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-3 px-4 text-left text-xs text-white/40 uppercase tracking-wide font-medium">#</th>
            <th className="py-3 px-4 text-left text-xs text-white/40 uppercase tracking-wide font-medium">Criativo</th>
            <th className="py-3 px-4 text-right text-xs text-white/40 uppercase tracking-wide font-medium">Gasto</th>
            <th className="py-3 px-4 text-right text-xs text-white/40 uppercase tracking-wide font-medium">Conversas</th>
            <th className="py-3 px-4 text-right text-xs text-white/40 uppercase tracking-wide font-medium">CPL</th>
            <th className="py-3 px-4 text-right text-xs text-white/40 uppercase tracking-wide font-medium">CTR</th>
            <th className="py-3 px-4 text-center text-xs text-white/40 uppercase tracking-wide font-medium">Link</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.ad_id || i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4 text-white/40">{i + 1}</td>
              <td className="py-3 px-4 text-white/80 font-medium">{r.ad_name}</td>
              <td className="py-3 px-4 text-right text-green-400 font-semibold">{formatCurrency(r.spend)}</td>
              <td className="py-3 px-4 text-right text-cyan-400 font-semibold">{formatNumber(r.leads)}</td>
              <td className="py-3 px-4 text-right text-purple-400">{formatCurrency(r.cpl)}</td>
              <td className="py-3 px-4 text-right text-white/60">{formatPercent(r.ctr)}</td>
              <td className="py-3 px-4 text-center">
                {r.ig ? (
                  <a href={r.ig} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition">
                    <ExternalLink size={14} />
                  </a>
                ) : <span className="text-white/20">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
