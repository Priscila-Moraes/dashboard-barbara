import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp, Image } from 'lucide-react'
import { AdCreative } from '../lib/supabase'
import { fmtCurrency, fmtNumber, fmtPct } from '../lib/utils'

interface Props { data: AdCreative[] }

type SortKey = 'spend' | 'impressions' | 'link_clicks' | 'leads' | 'cpl' | 'ctr' | 'cpa'

// Aggregate creatives by ad_name (sum across dates)
function aggregate(raw: AdCreative[]) {
  const map = new Map<string, {
    ad_name: string; ad_id: string; instagram_permalink: string
    spend: number; impressions: number; link_clicks: number; leads: number
  }>()

  for (const r of raw) {
    const key = r.ad_id || r.ad_name
    const prev = map.get(key) || {
      ad_name: r.ad_name, ad_id: r.ad_id,
      instagram_permalink: r.instagram_permalink || '',
      spend: 0, impressions: 0, link_clicks: 0, leads: 0,
    }
    prev.spend += r.spend || 0
    prev.impressions += r.impressions || 0
    prev.link_clicks += r.link_clicks || 0
    prev.leads += r.leads || 0
    if (r.instagram_permalink && !prev.instagram_permalink) prev.instagram_permalink = r.instagram_permalink
    map.set(key, prev)
  }

  return Array.from(map.values()).map(c => ({
    ...c,
    cpl: c.leads > 0 ? c.spend / c.leads : 0,
    ctr: c.impressions > 0 ? (c.link_clicks / c.impressions) * 100 : 0,
    cpa: c.link_clicks > 0 ? c.spend / c.link_clicks : 0,
  }))
}

export default function CreativesTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('spend')
  const [sortAsc, setSortAsc] = useState(false)

  if (!data.length) return null

  const agg = aggregate(data)

  const sorted = [...agg].sort((a, b) => {
    const va = a[sortKey] || 0
    const vb = b[sortKey] || 0
    return sortAsc ? va - vb : vb - va
  })

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortAsc(!sortAsc)
    else { setSortKey(k); setSortAsc(false) }
  }

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronDown size={12} className="text-white/20" />
    return sortAsc ? <ChevronUp size={12} className="text-green-400" /> : <ChevronDown size={12} className="text-green-400" />
  }

  const cols: { k: SortKey; label: string }[] = [
    { k: 'spend', label: 'Investimento' },
    { k: 'impressions', label: 'Impressões' },
    { k: 'link_clicks', label: 'Cliques' },
    { k: 'leads', label: 'Conversas' },
    { k: 'cpl', label: 'Custo/Conv.' },
    { k: 'ctr', label: 'CTR' },
    { k: 'cpa', label: 'CPC Link' },
  ]

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden anim-fade-up" style={{ animationDelay: '450ms' }}>
      <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
        <h3 className="text-white/70 font-semibold text-[15px]">Criativos</h3>
        <span className="text-white/25 text-xs">{sorted.length} anúncios</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.05]">
              <th className="text-left px-4 py-3 text-white/35 font-medium text-[11px] uppercase tracking-wider min-w-[220px]">Anúncio</th>
              {cols.map(c => (
                <th key={c.k}
                  onClick={() => toggleSort(c.k)}
                  className="text-right px-4 py-3 text-white/35 font-medium text-[11px] uppercase tracking-wider cursor-pointer hover:text-white/50 transition-colors whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">{c.label} <SortIcon k={c.k} /></span>
                </th>
              ))}
              <th className="text-center px-4 py-3 text-white/35 font-medium text-[11px] uppercase tracking-wider">Link</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={r.ad_id || i} className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${i % 2 ? 'bg-white/[0.01]' : ''}`}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                      <Image size={14} className="text-white/30" />
                    </div>
                    <span className="text-white/60 truncate max-w-[200px]" title={r.ad_name}>{r.ad_name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right text-green-400 font-medium">{fmtCurrency(r.spend)}</td>
                <td className="px-4 py-2.5 text-right text-white/50">{fmtNumber(r.impressions)}</td>
                <td className="px-4 py-2.5 text-right text-white/50">{fmtNumber(r.link_clicks)}</td>
                <td className="px-4 py-2.5 text-right text-blue-400 font-medium">{fmtNumber(r.leads)}</td>
                <td className="px-4 py-2.5 text-right text-purple-400">{fmtCurrency(r.cpl)}</td>
                <td className="px-4 py-2.5 text-right text-rose-400">{fmtPct(r.ctr)}</td>
                <td className="px-4 py-2.5 text-right text-orange-400">{fmtCurrency(r.cpa)}</td>
                <td className="px-4 py-2.5 text-center">
                  {r.instagram_permalink ? (
                    <a href={r.instagram_permalink} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white/70 transition-all">
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <span className="text-white/15">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
