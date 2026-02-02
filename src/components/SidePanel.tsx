import { fmtBRL, fmtDot, fmtPct } from '../lib/utils'
import { MessageCircle, TrendingUp, DollarSign, BarChart3 } from 'lucide-react'

interface Props {
  conversations: number
  costPerConv: number
  cpc: number
  ctr: number
  clicks: number
}

export default function SidePanel({ conversations, costPerConv, cpc, ctr, clicks }: Props) {
  return (
    <div className="space-y-4">
      {/* Conversas highlight */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5">
        <div className="flex items-center gap-1.5 mb-1">
          <MessageCircle size={14} className="text-white/70" />
          <span className="text-white/80 text-[11px] font-bold uppercase tracking-wider">Conversas</span>
        </div>
        <p className="text-white text-3xl font-black">{fmtDot(conversations)}</p>
      </div>

      {/* Custo por Conversa highlight */}
      <div className="bg-[#12121e] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center gap-1.5 mb-1">
          <DollarSign size={14} className="text-purple-400/70" />
          <span className="text-purple-400 text-[11px] font-bold uppercase tracking-wider">Custo / Conversa</span>
        </div>
        <p className="text-white text-3xl font-black">{fmtBRL(costPerConv)}</p>
      </div>

      {/* Extra metrics */}
      <div className="bg-[#12121e] border border-white/[0.06] rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign size={13} className="text-white/30" />
            <span className="text-white/50 text-sm">CPC Link</span>
          </div>
          <span className="text-white font-bold text-sm">{fmtBRL(cpc)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={13} className="text-white/30" />
            <span className="text-white/50 text-sm">CTR</span>
          </div>
          <span className="text-white font-bold text-sm">{fmtPct(ctr)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={13} className="text-white/30" />
            <span className="text-white/50 text-sm">Cliques</span>
          </div>
          <span className="text-white font-bold text-sm">{fmtDot(clicks)}</span>
        </div>
      </div>

      {/* Conversion bar */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/[0.06] rounded-2xl p-5">
        <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mb-3">Taxa de Conversão</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min((conversations / Math.max(clicks, 1)) * 100, 100)}%` }}
            ></div>
          </div>
          <span className="text-white font-bold text-sm">
            {((conversations / Math.max(clicks, 1)) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}
