import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { homeByRole } from '../utils/format'
export default function ProtectedRoute({ roles }) {
  const { user } = useAuth(); const loc = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />
  if (!roles.includes(user.role)) return <Navigate to={homeByRole[user.role]} replace />
  return <Outlet />
}
