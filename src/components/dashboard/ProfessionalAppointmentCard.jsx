import { CalendarDays, Clock3, Scissors, UserRound } from 'lucide-react'
import { brl, longDate } from '../../utils/format'
import StatusBadge from '../ui/StatusBadge'
import Button from '../ui/Button'

const actions = {
  PENDENTE: ['CONFIRMADO', 'Confirmar'],
  CONFIRMADO: ['EM_ATENDIMENTO', 'Iniciar atendimento'],
  EM_ATENDIMENTO: ['CONCLUIDO', 'Concluir atendimento'],
}

export default function ProfessionalAppointmentCard({ appointment, onStatusChange, busy = false }) {
  const action = actions[appointment.status]
  return (
    <article className="card pro-appt">
      <div className="card-top">
        <h3>{appointment.client?.name ?? 'Cliente'}</h3>
        <StatusBadge status={appointment.status} />
      </div>
      <p className="meta"><CalendarDays size={15} /> {longDate(appointment.date)}</p>
      <p className="meta"><Clock3 size={15} /> {appointment.start} às {appointment.end}</p>
      <p className="meta"><Scissors size={15} /> {appointment.service.name} · {appointment.service.duration} min</p>
      <p className="meta"><UserRound size={15} /> {brl(appointment.price ?? appointment.service.price)}</p>
      {appointment.notes && <p className="pro-appt-notes">Observações: {appointment.notes}</p>}
      {action && (
        <div className="row">
          <Button disabled={busy} onClick={() => onStatusChange(appointment, action[0])}>{action[1]}</Button>
          {appointment.status === 'PENDENTE' && (
            <Button disabled={busy} variant="ghost" className="btn-warn" onClick={() => onStatusChange(appointment, 'CANCELADO')}>Recusar</Button>
          )}
        </div>
      )}
    </article>
  )
}
