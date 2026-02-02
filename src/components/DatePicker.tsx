import { useState, useRef, useEffect } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { format, subDays, startOfMonth, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, ChevronDown } from 'lucide-react'
import 'react-day-picker/dist/style.css'

const START = new Date('2026-01-20')
const PRESETS = [
  { l: 'Hoje', fn: () => ({ from: new Date(), to: new Date() }) },
  { l: 'Ontem', fn: () => { const d = subDays(new Date(), 1); return { from: d, to: d } } },
  { l: 'Últimos 7 dias', fn: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { l: 'Últimos 14 dias', fn: () => ({ from: subDays(new Date(), 13), to: new Date() }) },
  { l: 'Últimos 30 dias', fn: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { l: 'Este mês', fn: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  { l: 'Mês passado', fn: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: subDays(startOfMonth(new Date()), 1) }) },
  { l: 'Todo o período', fn: () => ({ from: START, to: new Date() }) },
]

interface Props { startDate: Date; endDate: Date; onChange: (s: Date, e: Date) => void }

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
  const sel = (r: DateRange | undefined) => { setRange(r); if (r?.from && r?.to) onChange(r.from, r.to) }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-sm text-white/80 hover:border-[#b5f542]/40 transition-all">
        <Calendar size={14} className="text-[#b5f542]" />
        <span>{format(startDate, 'dd/MM/yyyy')} - {format(endDate, 'dd/MM/yyyy')}</span>
        <ChevronDown size={13} className={`text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 flex bg-[#13131d] border border-white/[0.1] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden anim">
          <div className="w-40 border-r border-white/[0.06] p-1.5">
            {PRESETS.map(p => (
              <button key={p.l} onClick={() => pick(p)}
                className="w-full text-left px-3 py-2 text-[12px] text-white/55 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors">
                {p.l}
              </button>
            ))}
          </div>
          <div className="p-3">
            <DayPicker mode="range" selected={range} onSelect={sel} locale={ptBR}
              numberOfMonths={2} defaultMonth={subMonths(new Date(), 1)} fromDate={START} toDate={new Date()} />
          </div>
        </div>
      )}
    </div>
  )
}
