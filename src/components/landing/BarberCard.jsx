import Avatar from '../ui/Avatar'
import Stars from '../ui/Stars'
import Button from '../ui/Button'
export default function BarberCard({ barber }) {
  return (
    <article className="card barber">
      <Avatar name={barber.name} size={72} />
      <h3>{barber.name}</h3>
      <p className="muted">{barber.specialties.join(' · ')}</p>
      <p className="meta"><Stars value={barber.rating} /> {barber.rating} · {barber.appointments.toLocaleString('pt-BR')} atendimentos</p>
      <Button to={`/agendar?profissional=${barber.id}`} variant="ghost">Agendar com este profissional</Button>
    </article>
  )
}
