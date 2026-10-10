import { CalendarDays, LayoutDashboard, Plus, User } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
const items = [
  { to: '/cliente', label: 'Início', icon: LayoutDashboard, end: true },
  { to: '/cliente/agendamentos', label: 'Meus agendamentos', icon: CalendarDays },
  { to: '/cliente/perfil', label: 'Meu perfil', icon: User },
  { to: '/agendar', label: 'Novo agendamento', icon: Plus },
]
export default function ClientLayout() { return <DashboardLayout items={items} /> }
