import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import Hero from '../../components/landing/Hero'
import Section from '../../components/landing/Section'
import ServiceCard from '../../components/landing/ServiceCard'
import BarberCard from '../../components/landing/BarberCard'
import About from '../../components/landing/About'
import Contact from '../../components/landing/Contact'
import Avatar from '../../components/ui/Avatar'
import Stars from '../../components/ui/Stars'
import Skeleton from '../../components/ui/Skeleton'
import Button from '../../components/ui/Button'
import { useAsync } from '../../hooks/useAsync'
import { catalogService } from '../../services/catalogService'

function List({ source, render, h, cls = 'grid' }) {
  const { data, loading, error } = useAsync(source)
  if (error) return <p className="error">Não foi possível carregar. Atualize a página para tentar de novo.</p>
  if (loading) return <div className={cls}>{[1, 2, 3, 4].map((i) => <Skeleton key={i} h={h} />)}</div>
  return <div className={cls}>{data.map(render)}</div>
}

export default function Landing() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Section id="servicos" title="Serviços" center>
          <List cls="services" source={catalogService.getServices} h={150} render={(s) => <ServiceCard key={s.id} service={s} />} />
        </Section>
        <About />
        <Section id="profissionais" title="Nossa equipe">
          <List source={catalogService.getBarbers} h={240} render={(b) => <BarberCard key={b.id} barber={b} />} />
        </Section>
        <Section id="avaliacoes" title="Avaliações" center>
          <List source={catalogService.getReviews} h={160} render={(r) => (
            <figure key={r.id} className="card review"><Stars value={r.rating} /><blockquote>{r.text}</blockquote>
              <figcaption><Avatar name={r.name} size={36} />{r.name}</figcaption></figure>)} />
        </Section>
        <section className="cta"><div className="container"><h2>Pronto para renovar o visual?</h2><Button to="/agendar">Agendar agora</Button></div></section>
        <Contact />
      </main>
      <Footer />
    </>
  )
}
