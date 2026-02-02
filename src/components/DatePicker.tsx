import { useState, useRef, useEffect } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { format, subDays, startOfMonth, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, ChevronDown } from 'lucide-react'
import 'react-day-picker/dist/style.css'

interface Props { startDate: Date; endDate: Date; onChange: (s: Date, e: Date) => void }
const D0 = new Date('2026-01-20')
const PRESETS = [
  { label: 'Hoje', fn: () => ({ from: new Date(), to: new Date() }) },
  { label: 'Ontem', fn: () => { const d = subDays(new Date(), 1); return { from: d, to: d } } },
  { label: 'Últimos 7 dias', fn: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: 'Últimos 14 dias', fn: () => ({ from: subDays(new Date(), 13), to: new Date() }) },
  { label: 'Últimos 30 dias', fn: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: 'Este mês', fn: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  { label: 'Mês passado', fn: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: subDays(startOfMonth(new Date()), 1) }) },
  { label: 'Todo período', fn: () => ({ from: D0, to: new Date() }) },
]

export default function DatePicker({ startDate, endDate, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>({ from: startDate, to: endDate })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])

  const pick = (p: typeof PRESETS[0]) => {
    const { from, to } = p.fn(); setRange({ from, to }); onChange(from!, to!); setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-transparent border border-white/10 rounded-xl text-sm text-white/80 hover:border-white/20 transition-all">
        <Calendar size={14} className="text-white/50" />
        <span className="text-[13px]">
          {format(startDate, "dd 'de' MMM. 'de' yyyy", { locale: ptBR })} - {format(endDate, "dd 'de' MMM. 'de' yyyy", { locale: ptBR })}
        </span>
        <ChevronDown size={13} className={`text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 flex bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-fade-in-up">
          <div className="w-44 border-r border-white/10 p-2">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => pick(p)}
                className="w-full text-left px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">{p.label}</button>
            ))}
          </div>
          <div className="p-4">
            <DayPicker mode="range" selected={range} onSelect={(r) => { setRange(r); if (r?.from && r?.to) onChange(r.from, r.to) }}
              locale={ptBR} numberOfMonths={2} defaultMonth={subMonths(new Date(), 1)} fromDate={D0} toDate={new Date()} />
          </div>
        </div>
      )}
    </div>
  )
}
