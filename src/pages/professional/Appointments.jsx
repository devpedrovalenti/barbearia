import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import { appointmentService } from '../../services/appointmentService'
import ProfessionalAppointmentCard from '../../components/dashboard/ProfessionalAppointmentCard'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'

const tabs = [['upcoming', 'Próximos'], ['history', 'Histórico']]

export default function ProfessionalAppointments() {
  const { user } = useAuth()
  const toast = useToast()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [tab, setTab] = useState('upcoming')
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

  if (error) return <div className="page"><p className="error">Não foi possível carregar seus agendamentos. Atualize a página.</p></div>
  if (!data) return <div className="page"><Skeleton h={40} /><Skeleton h={180} /></div>

  return (
    <div className="page pro-page">
      <div>
        <p className="eyebrow">Sua agenda</p>
        <h1 className="page-title">Agendamentos</h1>
        <p className="muted">Consulte os clientes e acompanhe o andamento de cada horário.</p>
      </div>
      <div className="tabs" role="tablist">
        {tabs.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}>
            {label} ({data[key].length})
          </button>
        ))}
      </div>
      {data[tab].length
        ? <div className="grid pro-appt-grid">{data[tab].map((appointment) =>
          <ProfessionalAppointmentCard key={appointment.id} appointment={appointment} onStatusChange={changeStatus} busy={busyId === appointment.id} />)}
        </div>
        : <EmptyState title={tab === 'upcoming' ? 'Você não tem próximos agendamentos.' : 'Seu histórico de atendimentos aparecerá aqui.'} />}
    </div>
  )
}
