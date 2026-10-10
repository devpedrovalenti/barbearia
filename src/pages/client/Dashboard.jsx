import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../hooks/useAuth'
import { appointmentService } from '../../services/appointmentService'
import AppointmentCard from '../../components/dashboard/AppointmentCard'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'
import Button from '../../components/ui/Button'
export default function Dashboard() {
  const { user } = useAuth()
  const { data, loading, error } = useAsync(() => appointmentService.listByClient(user.id))
  if (loading) return <div className="page"><Skeleton h={40} /><br /><Skeleton h={200} /></div>
  if (error) return <div className="page"><p className="error">Não foi possível carregar seus dados. Atualize a página.</p></div>
  const done = data.history.filter((a) => a.status === 'CONCLUIDO'), next = data.upcoming[0]
  return (
    <div className="page">
      <h1 className="page-title">Oi, {user.name.split(' ')[0]}</h1>
      {!next && !data.history.length ? <EmptyState title="Você ainda não possui nenhum agendamento." action="Agendar meu primeiro horário" to="/agendar" /> : (<>
        <h2 className="h-sm">Próximo agendamento</h2>
        {next ? <AppointmentCard appt={next} canAct={false} /> : <EmptyState title="Nenhum horário marcado." action="Agendar horário" to="/agendar" />}
        {next && <div className="row"><Button to="/cliente/agendamentos" variant="ghost">Ver detalhes e cancelar</Button></div>}
        <div className="stats">
          <div className="stat"><b>{done.length}</b><span>atendimentos realizados</span></div>
          <div className="stat"><b>{done[0]?.service.name ?? '—'}</b><span>último serviço</span></div>
          <div className="stat"><b>{data.history.length + data.upcoming.length}</b><span>agendamentos no total</span></div>
        </div></>)}
    </div>
  )
}
