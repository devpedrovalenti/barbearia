import { Link } from 'react-router-dom'
import { ArrowRight, Crown, Eye, Flame, Scissors, Sparkles, Zap } from 'lucide-react'
import { brl } from '../../utils/format'
const icons = { s1: Scissors, s2: Flame, s3: Crown, s4: Zap, s5: Eye, s6: Sparkles }
export default function ServiceCard({ service }) {
  const Icon = icons[service.id] ?? Scissors
  return (
    <article className="svc">
      <span className="svc-ico"><Icon size={34} strokeWidth={1.6} /></span>
      <div>
        <h3>{service.name}</h3>
        <p className="muted">{service.description}</p>
        <p className="svc-meta"><span className="svc-price">{brl(service.price)}</span><span className="muted">{service.duration} min</span></p>
        <Link className="svc-cta" to={`/agendar?servico=${service.id}`}>Agendar <ArrowRight size={15} /></Link>
      </div>
    </article>
  )
}
