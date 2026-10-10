import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck2, Clock3, Scissors } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import { appointmentService } from '../../services/appointmentService'
import ProfessionalAppointmentCard from '../../components/dashboard/ProfessionalAppointmentCard'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'
import { dateKey } from '../../utils/scheduling'

export default function ProfessionalDashboard() {
  const { user } = useAuth()
  const toast = useToast()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const load = useCallback(() => appointmentService.listByBarber(user.id)
    .then((result) => { setData(result); setError(false) })
    .catch(() => setError(true)), [user.id])

  useEffect(() => { load() }, [load])

  async function changeStatus(appointment, status) {
    setBusyId(appointment.id)
    try {
      await appointmentService.updateStatus(appointment.id, user.id, status)
      toast(status === 'CANCELADO' ? 'Agendamento recusado.' : 'Status do atendimento atualizado.')
      await load()
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setBusyId(null)
    }
  }

  if (error) return <div className="page"><p className="error">Não foi possível carregar sua agenda. Atualize a página.</p></div>
  if (!data) return <div className="page"><Skeleton h={40} /><Skeleton h={130} /><Skeleton h={180} /></div>

  const today = dateKey(new Date())
  const todayAppointments = data.upcoming.filter((a) => a.date === today)
  const pending = data.upcoming.filter((a) => a.status === 'PENDENTE').length
  const next = data.upcoming.slice(0, 3)

  return (
    <div className="page pro-page">
      <div className="pro-heading">
        <div>
          <p className="eyebrow">Painel do profissional</p>
          <h1 className="page-title">Olá, {user.name.split(' ')[0]}</h1>
          <p className="muted">Acompanhe seus horários e atendimentos.</p>
        </div>
        <Link className="btn btn-ghost" to="/profissional/agendamentos">Ver agenda completa <ArrowRight size={16} /></Link>
      </div>
      <div className="stats">
        <div className="stat"><CalendarCheck2 size={20} /><b>{todayAppointments.length}</b><span>atendimentos hoje</span></div>
        <div className="stat"><Clock3 size={20} /><b>{pending}</b><span>aguardando confirmação</span></div>
        <div className="stat"><Scissors size={20} /><b>{data.upcoming.length}</b><span>próximos agendamentos</span></div>
      </div>
      <div className="pro-section-heading">
        <div><h2 className="h-sm">Próximos atendimentos</h2><p className="muted small">Seus horários mais próximos, em ordem.</p></div>
        <Link className="link" to="/profissional/agendamentos">Ver todos <ArrowRight size={15} /></Link>
      </div>
      {next.length
        ? <div className="grid pro-appt-grid">{next.map((appointment) =>
          <ProfessionalAppointmentCard key={appointment.id} appointment={appointment} onStatusChange={changeStatus} busy={busyId === appointment.id} />)}
        </div>
        : <EmptyState title="Você não tem próximos agendamentos." />}
    </div>
  )
}
