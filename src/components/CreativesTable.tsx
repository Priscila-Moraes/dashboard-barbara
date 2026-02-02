import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Image } from 'lucide-react'
import { AdCreative } from '../lib/supabase'
import { fmtBRL, fmtNum, fmtPct } from '../lib/utils'

interface Props { data: AdCreative[] }
type SK = 'spend' | 'impressions' | 'link_clicks' | 'leads' | 'cpl' | 'ctr' | 'cpa'

function aggregate(raw: AdCreative[]) {
  const map = new Map<string, { ad_name: string; ad_id: string; instagram_permalink: string; spend: number; impressions: number; link_clicks: number; leads: number }>()
  for (const r of raw) {
    const k = r.ad_id || r.ad_name
    const p = map.get(k) || { ad_name: r.ad_name, ad_id: r.ad_id, instagram_permalink: r.instagram_permalink || '', spend: 0, impressions: 0, link_clicks: 0, leads: 0 }
    p.spend += r.spend || 0; p.impressions += r.impressions || 0; p.link_clicks += r.link_clicks || 0; p.leads += r.leads || 0
    if (r.instagram_permalink && !p.instagram_permalink) p.instagram_permalink = r.instagram_permalink
    map.set(k, p)
  }
  return Array.from(map.values()).map(c => ({
    ...c,
    cpl: c.leads > 0 ? c.spend / c.leads : 0,
    ctr: c.impressions > 0 ? (c.link_clicks / c.impressions) * 100 : 0,
    cpa: c.link_clicks > 0 ? c.spend / c.link_clicks : 0,
  }))
}

const PER_PAGE = 7

export default function CreativesTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SK>('spend')
  const [sortAsc, setSortAsc] = useState(false)
  const [page, setPage] = useState(0)

  if (!data.length) return null
  const agg = aggregate(data)
  const sorted = [...agg].sort((a, b) => sortAsc ? (a[sortKey] || 0) - (b[sortKey] || 0) : (b[sortKey] || 0) - (a[sortKey] || 0))
  const totalPages = Math.ceil(sorted.length / PER_PAGE)
  const paged = sorted.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const toggle = (k: SK) => { if (sortKey === k) setSortAsc(!sortAsc); else { setSortKey(k); setSortAsc(false) }; setPage(0) }
  const SI = ({ k }: { k: SK }) => sortKey !== k ? <ChevronDown size={11} className="text-white/15" /> : sortAsc ? <ChevronUp size={11} className="text-[#b5f542]" /> : <ChevronDown size={11} className="text-[#b5f542]" />

  const cols: { k: SK; l: string }[] = [
    { k: 'impressions', l: 'Impr.' }, { k: 'link_clicks', l: 'Cliques' },
    { k: 'ctr', l: 'CTR' }, { k: 'leads', l: 'Conv.' },
    { k: 'spend', l: 'Invest.' }, { k: 'cpl', l: 'Custo/Conv.' },
  ]

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-white/60 font-semibold text-sm">Criativos</h3>
        <span className="text-white/20 text-[11px]">{sorted.length} anúncios</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-white/[0.05]">
              <th className="text-left px-4 py-2.5 text-white/30 font-medium text-[10px] uppercase tracking-wider">Ad Name</th>
              {cols.map(c => (
                <th key={c.k} onClick={() => toggle(c.k)}
                  className="text-right px-3 py-2.5 text-white/30 font-medium text-[10px] uppercase tracking-wider cursor-pointer hover:text-white/45 transition-colors whitespace-nowrap">
                  <span className="inline-flex items-center gap-0.5">{c.l} <SI k={c.k} /></span>
                </th>
              ))}
              <th className="px-3 py-2.5 text-white/30 font-medium text-[10px] uppercase tracking-wider text-center">Link</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={r.ad_id || i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                      <Image size={12} className="text-white/25" />
                    </div>
                    <span className="text-white/55 truncate max-w-[180px]" title={r.ad_name}>{r.ad_name}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-right text-white/45">{fmtNum(r.impressions)}</td>
                <td className="px-3 py-2 text-right text-white/45">{fmtNum(r.link_clicks)}</td>
                <td className="px-3 py-2 text-right text-white/45">{fmtPct(r.ctr)}</td>
                <td className="px-3 py-2 text-right text-blue-400 font-medium">{fmtNum(r.leads)}</td>
                <td className="px-3 py-2 text-right text-[#b5f542] font-medium">{fmtBRL(r.spend)}</td>
                <td className="px-3 py-2 text-right text-purple-400">{fmtBRL(r.cpl)}</td>
                <td className="px-3 py-2 text-center">
                  {r.instagram_permalink ? (
                    <a href={r.instagram_permalink} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white/35 hover:text-white/60 transition-all">
                      <ExternalLink size={11} />
                    </a>
                  ) : <span className="text-white/10">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-5 py-2.5 border-t border-white/[0.05] flex items-center justify-end gap-3">
          <span className="text-white/25 text-[11px]">{page * PER_PAGE + 1} - {Math.min((page + 1) * PER_PAGE, sorted.length)} / {sorted.length}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
              className="p-1 rounded hover:bg-white/[0.05] text-white/30 disabled:opacity-20 transition-all"><ChevronLeft size={14} /></button>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
              className="p-1 rounded hover:bg-white/[0.05] text-white/30 disabled:opacity-20 transition-all"><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  )
}
