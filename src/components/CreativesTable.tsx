import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { AdCreative } from '../lib/supabase'
import { fmtBRL, fmtNum, fmtPct } from '../lib/utils'

interface Props { data: AdCreative[] }
type SK = 'spend' | 'impressions' | 'link_clicks' | 'leads' | 'cpl' | 'ctr'

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
  }))
}

export default function CreativesTable({ data }: Props) {
  const [sk, setSk] = useState<SK>('spend')
  const [asc, setAsc] = useState(false)
  if (!data.length) return null

  const rows = aggregate(data).sort((a, b) => asc ? (a[sk]||0) - (b[sk]||0) : (b[sk]||0) - (a[sk]||0))
  const toggle = (k: SK) => { if (sk === k) setAsc(!asc); else { setSk(k); setAsc(false) } }
  const SI = ({ k }: { k: SK }) => sk !== k ? <ChevronDown size={10} className="text-white/10" /> : asc ? <ChevronUp size={10} className="text-emerald-400" /> : <ChevronDown size={10} className="text-emerald-400" />

  const cols: { k: SK; l: string }[] = [
    { k: 'spend', l: 'Gasto' }, { k: 'leads', l: 'Conversas' },
    { k: 'cpl', l: 'CPL' }, { k: 'ctr', l: 'CTR' },
  ]

  return (
    <div className="bg-[#12121e] border border-white/[0.06] rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h3 className="text-white/70 font-semibold text-sm">Top Criativos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-5 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider">#</th>
              <th className="text-left px-5 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider min-w-[200px]">Criativo</th>
              {cols.map(c => (
                <th key={c.k} onClick={() => toggle(c.k)}
                  className="text-right px-4 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider cursor-pointer hover:text-white/50 whitespace-nowrap">
                  <span className="inline-flex items-center gap-0.5">{c.l} <SI k={c.k} /></span>
                </th>
              ))}
              <th className="text-center px-4 py-3 text-white/30 font-medium text-[10px] uppercase tracking-wider">Link</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.ad_id || i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3 text-white/20 font-medium">{i + 1}</td>
                <td className="px-5 py-3 text-white/70 truncate max-w-[250px]" title={r.ad_name}>{r.ad_name}</td>
                <td className="px-4 py-3 text-right text-emerald-400 font-semibold">{fmtBRL(r.spend)}</td>
                <td className="px-4 py-3 text-right text-cyan-400 font-semibold">{fmtNum(r.leads)}</td>
                <td className="px-4 py-3 text-right text-purple-400">{fmtBRL(r.cpl)}</td>
                <td className="px-4 py-3 text-right text-white/50">{fmtPct(r.ctr)}</td>
                <td className="px-4 py-3 text-center">
                  {r.ig ? (
                    <a href={r.ig} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition">
                      <ExternalLink size={12} />
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
