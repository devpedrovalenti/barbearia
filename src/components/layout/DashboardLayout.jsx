import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../hooks/useAuth'
export default function DashboardLayout({ items }) {
  const [open, setOpen] = useState(false); const { user, logout } = useAuth(); const nav = useNavigate()
  return (
    <div className="shell">
      <header className="shell-bar"><Link to="/" className="logo"><span className="logo-mark" />Navalha</Link>
        <button className="burger" style={{ display: 'block' }} onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button></header>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <aside className={`side dark ${open ? 'open' : ''}`}>
        <Link to="/" className="logo"><span className="logo-mark" />Navalha &amp; Co.</Link>
        <nav>{items.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}><Icon size={18} /> {label}</NavLink>))}</nav>
        <div className="side-user"><Avatar name={user.name} size={36} /><span>{user.name}</span>
          <button onClick={() => { logout(); nav('/') }} aria-label="Sair"><LogOut size={18} /></button></div>
      </aside>
      <div className="shell-main"><Outlet /></div>
    </div>
  )
}
