import Button from '../ui/Button'
export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="container hero-in">
        <div className="hero-copy">
          <h1>Seu estilo começa aqui.</h1>
          <p className="lead">Corte, barba e toalha quente com hora marcada. Escolha o serviço e o barbeiro e feche o seu horário em menos de um minuto.</p>
          <div className="row"><Button to="/agendar">Agendar horário</Button><Button href="#servicos" variant="ghost">Conhecer serviços</Button></div>
        </div>
      </div>
    </section>
  )
}
