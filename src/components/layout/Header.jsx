import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Button from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { homeByRole } from '../../utils/format'
const links = [['Início', '#inicio'], ['Serviços', '#servicos'], ['Profissionais', '#profissionais'], ['Sobre', '#sobre'], ['Contato', '#contato']]
export default function Header() {
  const [open, setOpen] = useState(false); const { user } = useAuth()
  return (
    <header className="header">
      <div className="container header-in">
        <Link to="/" className="logo"><span className="logo-mark" />Navalha &amp; Co.</Link>
        <nav className={`nav ${open ? 'open' : ''}`}>
          {links.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
          {user && <Link to={homeByRole[user.role]}>Minha área</Link>}
          <Button to="/agendar" className="nav-cta">Agendar horário</Button>
        </nav>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Abrir menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  )
}
