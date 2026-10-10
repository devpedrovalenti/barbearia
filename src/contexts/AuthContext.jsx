import { createContext, useCallback, useMemo, useState } from 'react'
import { authService } from '../services/authService'
export const AuthContext = createContext(null)
const KEY = 'barbearia:session'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null } }
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => load()?.user ?? null)
  const start = (session) => { localStorage.setItem(KEY, JSON.stringify(session)); setUser(session.user); return session.user }
  const login = useCallback(async (email, password) => start(await authService.login(email, password)), [])
  const register = useCallback(async (data) => start(await authService.register(data)), [])
  const logout = useCallback(() => { localStorage.removeItem(KEY); setUser(null) }, [])
  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
