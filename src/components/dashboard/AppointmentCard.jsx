import { CalendarClock, Scissors, User } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import Button from '../ui/Button'
import { brl, longDate } from '../../utils/format'
export default function AppointmentCard({ appt, onCancel, canAct = true }) {
  const open = canAct && ['PENDENTE', 'CONFIRMADO'].includes(appt.status)
  return (
    <article className="card appt">
      <div className="card-top"><h3>{appt.service.name}</h3><StatusBadge status={appt.status} /></div>
      <p className="meta"><CalendarClock size={15} /> {longDate(appt.date)}, {appt.start} às {appt.end}</p>
      <p className="meta"><User size={15} /> {appt.barber.name}</p>
      <p className="meta"><Scissors size={15} /> {brl(appt.service.price)} · {appt.service.duration} min</p>
      {(open || appt.status === 'CONCLUIDO') && (
        <div className="row">
          <Button to={`/agendar?servico=${appt.serviceId}&profissional=${appt.barberId}`} variant="ghost">{open ? 'Reagendar' : 'Agendar de novo'}</Button>
          {open && <button className="btn btn-ghost btn-warn" onClick={() => onCancel(appt)}>Cancelar</button>}
        </div>)}
    </article>
  )
}
