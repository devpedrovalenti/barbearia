import { MapPin } from 'lucide-react'
import { units } from '../../data/units'
const fallback = 'linear-gradient(135deg,#4a2410,#1b1b1b)'
export default function About() {
  return (
    <section id="sobre" className="section"><div className="container about-grid">
      <div>
        <h2>Sobre nós</h2>
        <p className="muted about-p">Abrimos em 2016 com duas cadeiras e uma regra: nenhum corte com pressa. Hoje a equipe cresceu, mas o cuidado é o mesmo, com hora marcada que respeita o seu dia.</p>
        <p className="muted about-p">Toalha quente, navalha em toda barba, material esterilizado a cada cliente e um ambiente onde dá para relaxar com um café.</p>
        <div className="units">{units.map((u) => (
          <div key={u.id} className="unit"><MapPin size={34} color="var(--accent)" /><b>{u.name}</b><span className="muted">{u.address}</span></div>))}</div>
      </div>
      <div>
        <h2>Galeria de fotos</h2>
        <div className="gallery">{[1, 2, 3].map((n) => (
          <div key={n} className="shot" role="img" aria-label={`Foto ${n} da barbearia`} style={{ backgroundImage: `url(/images/galeria-${n}.jpg), ${fallback}` }} />))}</div>
      </div>
    </div></section>
  )
}
