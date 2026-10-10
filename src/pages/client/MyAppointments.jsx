import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import { appointmentService } from '../../services/appointmentService'
import AppointmentCard from '../../components/dashboard/AppointmentCard'
import ConfirmationModal from '../../components/ui/ConfirmationModal'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'
export default function MyAppointments() {
  const { user } = useAuth(); const toast = useToast()
  const [data, setData] = useState(null); const [error, setError] = useState(false)
  const [target, setTarget] = useState(null); const [busy, setBusy] = useState(false); const [tab, setTab] = useState('upcoming')
  const load = useCallback(() => appointmentService.listByClient(user.id).then(setData).catch(() => setError(true)), [user.id])
  useEffect(() => { load() }, [load])
  async function cancel() {
    setBusy(true)
    try { await appointmentService.cancel(target.id); toast('Agendamento cancelado. O horário foi liberado.'); setTarget(null); await load() }
    catch (e) { toast(e.message, 'error') } finally { setBusy(false) }
  }
  if (error) return <div className="page"><p className="error">Não foi possível carregar seus agendamentos.</p></div>
  if (!data) return <div className="page"><Skeleton h={40} /><br /><Skeleton h={180} /></div>
  const list = data[tab]
  return (
    <div className="page">
      <h1 className="page-title">Meus agendamentos</h1>
      <div className="tabs" role="tablist">
        {[['upcoming', 'Próximos'], ['history', 'Histórico']].map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l} ({data[k].length})</button>)}
      </div>
      {list.length === 0 ? (tab === 'upcoming' ? <EmptyState title="Você ainda não possui nenhum agendamento." action="Agendar meu primeiro horário" to="/agendar" /> : <EmptyState title="Seu histórico aparecerá aqui." />)
        : <div className="grid">{list.map((a) => <AppointmentCard key={a.id} appt={a} onCancel={setTarget} canAct={tab === 'upcoming' || a.status === 'CONCLUIDO'} />)}</div>}
      <ConfirmationModal open={!!target} busy={busy} title="Cancelar este agendamento?" confirmLabel="Sim, cancelar"
        message={target ? `${target.service.name} com ${target.barber.name} em ${target.date.split('-').reverse().join('/')} às ${target.start}. O horário ficará livre para outros clientes.` : ''}
        onConfirm={cancel} onCancel={() => setTarget(null)} />
    </div>
  )
}
