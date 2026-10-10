import { CalendarDays, LayoutDashboard } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

const items = [
  { to: '/profissional', label: 'Visão geral', icon: LayoutDashboard, end: true },
  { to: '/profissional/agendamentos', label: 'Agendamentos', icon: CalendarDays },
]

export default function ProfessionalLayout() {
  return <DashboardLayout items={items} />
}
