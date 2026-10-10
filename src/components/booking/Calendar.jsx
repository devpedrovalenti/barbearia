import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { dateKey } from '../../utils/scheduling'
const names = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
export default function Calendar({ value, onChange, isDisabled }) {
  const [view, setView] = useState(() => { const d = value ? new Date(`${value}T00:00`) : new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const today = dateKey(new Date()), first = view.getDay(), total = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const shift = (n) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1))
  const atStart = dateKey(view) <= dateKey(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" onClick={() => shift(-1)} disabled={atStart} aria-label="Mês anterior"><ChevronLeft size={18} /></button>
        <strong>{view.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</strong>
        <button type="button" onClick={() => shift(1)} aria-label="Próximo mês"><ChevronRight size={18} /></button>
      </div>
      <div className="cal-grid">
        {names.map((n, i) => <span key={i} className="cal-dow">{n}</span>)}
        {Array.from({ length: first }, (_, i) => <span key={`b${i}`} />)}
        {Array.from({ length: total }, (_, i) => {
          const key = dateKey(new Date(view.getFullYear(), view.getMonth(), i + 1)), off = key < today || isDisabled(key)
          return <button type="button" key={key} disabled={off} aria-pressed={key === value} className={`cal-day ${key === value ? 'on' : ''} ${key === today ? 'today' : ''}`} onClick={() => onChange(key)}>{i + 1}</button>
        })}
      </div>
    </div>
  )
}
