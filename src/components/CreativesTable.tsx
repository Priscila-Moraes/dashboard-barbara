import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { AdCreative } from '../lib/supabase'
import { fmtBRL, fmtNum, fmtPct } from '../lib/utils'

interface Props { data: AdCreative[] }
type SK = 'spend' | 'impressions' | 'link_clicks' | 'leads' | 'cpl' | 'ctr' | 'cpa'

function aggregate(raw: AdCreative[]) {
  const map = new Map<string, { ad_name: string; ad_id: string; ig: string; spend: number; impressions: number; link_clicks: number; leads: number }>()
  for (const r of raw) {
    const k = r.ad_id || r.ad_name
    const p = map.get(k) || { ad_name: r.ad_name, ad_id: r.ad_id, ig: '', spend: 0, impressions: 0, link_clicks: 0, leads: 0 }
    p.spend += r.spend || 0; p.impressions += r.impressions || 0; p.link_clicks += r.link_clicks || 0; p.leads += r.leads || 0
    if (r.instagram_permalink && !p.ig) p.ig = r.instagram_permalink
    map.set(k, p)
  }
  return Array.from(map.values()).map(c => ({
    ...c,
    cpl: c.leads > 0 ? c.spend / c.leads : 0,
    ctr: c.impressions > 0 ? (c.link_clicks / c.impressions) * 100 : 0,
    cpa: c.link_clicks > 0 ? c.spend / c.link_clicks : 0,
  }))
}

export default function CreativesTable({ data }: Props) {
  const [sk, setSk] = useState<SK>('spend')
  const [asc, setAsc] = useState(false)
  if (!data.length) return null

  const rows = aggregate(data).sort((a, b) => asc ? (a[sk]||0) - (b[sk]||0) : (b[sk]||0) - (a[sk]||0))
  const toggle = (k: SK) => { if (sk === k) setAsc(!asc); else { setSk(k); setAsc(false) } }
  const SI = ({ k }: { k: SK }) => sk !== k ? <ChevronDown size={10} className="text-white/10" /> : asc ? <ChevronUp size={10} className="text-accent-400" /> : <ChevronDown size={10} className="text-accent-400" />

  const cols: { k: SK; l: string }[] = [
    { k: 'spend', l: 'Invest.' }, { k: 'impressions', l: 'Impr.' }, { k: 'link_clicks', l: 'Cliques' },
    { k: 'leads', l: 'Conv.' }, { k: 'cpl', l: 'CPL' }, { k: 'ctr', l: 'CTR' }, { k: 'cpa', l: 'CPC' },
  ]

  return (
    <div className="bg-dark-800/60 border border-white/[0.06] rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">Criativos</h3>
        <span className="text-white/20 text-[11px]">{rows.length} anúncios</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-4 py-2.5 text-white/30 font-medium text-[10px] uppercase tracking-wider">#</th>
              <th className="text-left px-4 py-2.5 text-white/30 font-medium text-[10px] uppercase tracking-wider min-w-[180px]">Anúncio</th>
              {cols.map(c => (
                <th key={c.k} onClick={() => toggle(c.k)}
                  className="text-right px-3 py-2.5 text-white/30 font-medium text-[10px] uppercase tracking-wider cursor-pointer hover:text-white/50 whitespace-nowrap">
                  <span className="inline-flex items-center gap-0.5">{c.l} <SI k={c.k} /></span>
                </th>
              ))}
              <th className="text-center px-3 py-2.5 text-white/30 font-medium text-[10px] uppercase tracking-wider">IG</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.ad_id || i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-2.5 text-white/20">{i + 1}</td>
                <td className="px-4 py-2.5 text-white/70 truncate max-w-[220px]" title={r.ad_name}>{r.ad_name}</td>
                <td className="px-3 py-2.5 text-right text-accent-400 font-semibold">{fmtBRL(r.spend)}</td>
                <td className="px-3 py-2.5 text-right text-white/50">{fmtNum(r.impressions)}</td>
                <td className="px-3 py-2.5 text-right text-white/50">{fmtNum(r.link_clicks)}</td>
                <td className="px-3 py-2.5 text-right text-blue-400 font-semibold">{fmtNum(r.leads)}</td>
                <td className="px-3 py-2.5 text-right text-purple-400">{fmtBRL(r.cpl)}</td>
                <td className="px-3 py-2.5 text-right text-white/50">{fmtPct(r.ctr)}</td>
                <td className="px-3 py-2.5 text-right text-white/50">{fmtBRL(r.cpa)}</td>
                <td className="px-3 py-2.5 text-center">
                  {r.ig ? (
                    <a href={r.ig} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center justify-center w-6 h-6 rounded bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 transition">
                      <ExternalLink size={11} />
                    </a>
                  ) : <span className="text-white/10">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
