import { Link } from 'react-router-dom'
export default function Placeholder({ title }) {
  return <main className="container" style={{ padding: '6rem 0' }}><h1>{title}</h1><p className="muted">Próxima etapa do desenvolvimento.</p><Link className="btn btn-ghost" to="/">Voltar ao início</Link></main>
}
