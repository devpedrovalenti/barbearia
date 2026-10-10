import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Placeholder from '../pages/Placeholder'
import Landing from '../pages/public/Landing'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Booking from '../pages/client/Booking'
import ClientLayout from './ClientLayout'
import Dashboard from '../pages/client/Dashboard'
import MyAppointments from '../pages/client/MyAppointments'
import ProfessionalLayout from './ProfessionalLayout'
import ProfessionalDashboard from '../pages/professional/Dashboard'
import ProfessionalAppointments from '../pages/professional/Appointments'
const P = (title) => <Placeholder title={title} />
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/servicos" element={P('Serviços')} />
      <Route path="/profissionais" element={P('Profissionais')} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/agendar" element={<Booking />} />
      <Route element={<ProtectedRoute roles={['CLIENTE']} />}>
        <Route element={<ClientLayout />}>
          <Route path="/cliente" element={<Dashboard />} />
          <Route path="/cliente/agendamentos" element={<MyAppointments />} />
          <Route path="/cliente/perfil" element={P('Meu perfil')} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute roles={['PROFISSIONAL']} />}>
        <Route element={<ProfessionalLayout />}>
          <Route path="/profissional" element={<ProfessionalDashboard />} />
          <Route path="/profissional/agenda" element={<ProfessionalAppointments />} />
          <Route path="/profissional/agendamentos" element={<ProfessionalAppointments />} />
        </Route>
        <Route path="/profissional/disponibilidade" element={P('Disponibilidade')} />
      </Route>
      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route path="/admin" element={P('Administração')} />
      </Route>
      <Route path="*" element={P('Página não encontrada')} />
    </Routes>
  )
}
