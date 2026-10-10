import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Users } from 'lucide-react'
import Calendar from '../../components/booking/Calendar'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../hooks/useAuth'
import { catalogService } from '../../services/catalogService'
import { bookingService } from '../../services/bookingService'
import { brl } from '../../utils/format'
const titles = ['', 'O que vamos fazer hoje?', 'Com quem você prefere?', 'Qual dia fica bom?', 'Qual horário combina?', 'Tudo certo? Confira os detalhes']
const long = (d) => new Date(`${d}T00:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

export default function Booking() {
  const [params, setParams] = useSearchParams(); const { user } = useAuth(); const loc = useLocation(); const nav = useNavigate()
  const svc = useAsync(catalogService.getServices); const bar = useAsync(catalogService.getBarbers)
  const [slots, setSlots] = useState(null); const [busy, setBusy] = useState(false); const [fail, setFail] = useState(''); const [done, setDone] = useState(null)
  const q = Object.fromEntries(params) // servico, profissional, data, hora = fonte da verdade do fluxo
  const step = !q.servico ? 1 : !q.profissional ? 2 : !q.data ? 3 : !q.hora ? 4 : 5
  const set = (patch) => setParams({ ...q, ...patch }, { replace: true })
  const back = () => { const order = ['servico', 'profissional', 'data', 'hora']; const { [order[step - 2]]: _, ...rest } = q; setFail(''); setParams(rest) }

  useEffect(() => {
    if (step !== 4) return; let on = true; setSlots(null)
    bookingService.getSlots({ date: q.data, serviceId: q.servico, barberId: q.profissional }).then((s) => on && setSlots(s))
    return () => { on = false }
  }, [step, q.data, q.servico, q.profissional])

  if (svc.loading || bar.loading) return <main className="container book"><Skeleton h={320} /></main>
  const service = svc.data.find((s) => s.id === q.servico), barber = bar.data.find((b) => b.id === q.profissional)

  async function confirm() {
    setBusy(true); setFail('')
    try { setDone(await bookingService.create({ clientId: user.id, serviceId: q.servico, barberId: q.profissional, date: q.data, start: q.hora })) }
    catch (e) { setFail(e.message); setParams({ ...q, hora: '' }) } finally { setBusy(false) }
  }

  if (done) {
    const who = bar.data.find((b) => b.id === done.barberId)
    return (
      <main className="container book success">
        <CheckCircle2 size={48} color="var(--accent)" /><h1>Horário reservado</h1>
        <p className="muted">{service.name} com {who.name}, {long(done.date)}, às {done.start}. Você receberá a confirmação em breve.</p>
        <div className="row"><Button to="/cliente/agendamentos">Ver meus agendamentos</Button><Button to="/" variant="ghost">Voltar ao início</Button></div>
      </main>
    )
  }
  return (
    <main className="container book">
      <div className="book-top">{step > 1 ? <button className="link" onClick={back}><ArrowLeft size={16} /> Voltar</button> : <Link to="/" className="link"><ArrowLeft size={16} /> Início</Link>}<span className="muted">Passo {step} de 5</span></div>
      <div className="bar"><i style={{ width: `${step * 20}%` }} /></div>
      <h1 className="book-title">{titles[step]}</h1>

      {step === 1 && <div className="options">{svc.data.map((s) => (
        <button key={s.id} className="opt" onClick={() => set({ servico: s.id })}><span><strong>{s.name}</strong><small className="muted">{s.duration} min</small></span><b className="price">{brl(s.price)}</b></button>))}</div>}

      {step === 2 && <div className="options">
        <button className="opt" onClick={() => set({ profissional: 'any' })}><span><strong><Users size={16} /> Qualquer profissional disponível</strong><small className="muted">Mais horários para escolher</small></span></button>
        {bar.data.map((b) => <button key={b.id} className="opt" onClick={() => set({ profissional: b.id })}><span className="opt-who"><Avatar name={b.name} size={40} /><span><strong>{b.name}</strong><small className="muted">{b.specialties.join(' · ')}</small></span></span></button>)}</div>}

      {step === 3 && <Calendar value={q.data} onChange={(d) => set({ data: d })} isDisabled={(d) => !bookingService.isDayOpen(d, q.profissional)} />}

      {step === 4 && (!slots ? <Skeleton h={120} /> : slots.length === 0 ? <p className="muted">Não há horários neste dia. <button className="link" onClick={back}>Escolher outro dia</button></p> :
        <div className="slots">{slots.map((s) => <button key={s.time} disabled={!s.free} className="slot" onClick={() => set({ hora: s.time })}>{s.time}</button>)}</div>)}

      {step === 5 && (
        <div className="summary">
          <dl><div><dt>Serviço</dt><dd>{service.name}</dd></div><div><dt>Profissional</dt><dd>{barber?.name ?? 'Qualquer disponível'}</dd></div>
            <div><dt>Data</dt><dd>{long(q.data)}</dd></div><div><dt>Horário</dt><dd>{q.hora}</dd></div>
            <div><dt>Duração</dt><dd>{service.duration} min</dd></div><div><dt>Preço</dt><dd>{brl(service.price)}</dd></div></dl>
          {fail && <p className="field-error" role="alert">{fail}</p>}
          {user ? <Button onClick={confirm} disabled={busy}>{busy ? 'Confirmando...' : 'Confirmar agendamento'}</Button>
            : <Button onClick={() => nav('/login', { state: { from: loc } })}>Entrar para confirmar</Button>}
        </div>)}
    </main>
  )
}
