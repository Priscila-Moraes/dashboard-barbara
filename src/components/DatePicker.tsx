import { useState, useRef, useEffect } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { format, subDays, startOfMonth, startOfWeek, endOfWeek, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, ChevronDown } from 'lucide-react'
import 'react-day-picker/dist/style.css'

interface Props {
  startDate: Date
  endDate: Date
  onChange: (s: Date, e: Date) => void
}

const DATA_START = new Date('2026-01-20')

const PRESETS = [
  { label: 'Hoje', fn: () => ({ from: new Date(), to: new Date() }) },
  { label: 'Ontem', fn: () => { const d = subDays(new Date(), 1); return { from: d, to: d } } },
  { label: 'Últimos 7 dias', fn: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: 'Últimos 14 dias', fn: () => ({ from: subDays(new Date(), 13), to: new Date() }) },
  { label: 'Últimos 30 dias', fn: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: 'Esta semana', fn: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: new Date() }) },
  { label: 'Este mês', fn: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  { label: 'Mês passado', fn: () => {
    const s = startOfMonth(subMonths(new Date(), 1))
    const e = subDays(startOfMonth(new Date()), 1)
    return { from: s, to: e }
  }},
  { label: 'Todo o período', fn: () => ({ from: DATA_START, to: new Date() }) },
]

export default function DatePicker({ startDate, endDate, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>({ from: startDate, to: endDate })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const pick = (p: typeof PRESETS[0]) => {
    const { from, to } = p.fn()
    setRange({ from, to })
    onChange(from!, to!)
    setOpen(false)
  }

  const sel = (r: DateRange | undefined) => {
    setRange(r)
    if (r?.from && r?.to) onChange(r.from, r.to)
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/80 hover:border-green-500/30 hover:bg-white/[0.06] transition-all">
        <Calendar size={15} className="text-green-400" />
        <span className="hidden sm:inline">{format(startDate, 'dd/MM/yyyy')} — {format(endDate, 'dd/MM/yyyy')}</span>
        <span className="sm:hidden">{format(startDate, 'dd/MM')} — {format(endDate, 'dd/MM')}</span>
        <ChevronDown size={13} className={`text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 flex bg-[#12121a] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden anim-fade-up">
          <div className="w-44 border-r border-white/[0.06] p-2 flex flex-col">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => pick(p)}
                className="text-left px-3 py-2 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors">
                {p.label}
              </button>
            ))}
          </div>
          <div className="p-4">
            <DayPicker mode="range" selected={range} onSelect={sel} locale={ptBR}
              numberOfMonths={2} defaultMonth={subMonths(new Date(), 1)}
              fromDate={DATA_START} toDate={new Date()} />
          </div>
        </div>
      )}
    </div>
  )
}
