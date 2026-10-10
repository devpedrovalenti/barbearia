import { delay } from './http'
import { users } from '../data/users'
export const authService = {
  // futuro: POST /auth/login -> { user, token }
  async login(email) {
    await delay()
    const user = users.find((u) => u.email === email.trim().toLowerCase())
    if (!user) throw new Error('E-mail ou senha incorretos.')
    return { user, token: 'mock-jwt' }
  },
  // futuro: POST /auth/register
  async register({ name, email, phone }) {
    await delay()
    if (users.some((u) => u.email === email.trim().toLowerCase())) throw new Error('Já existe uma conta com este e-mail.')
    const user = { id: `u${Date.now()}`, name: name.trim(), email: email.trim().toLowerCase(), phone, role: 'CLIENTE' }
    users.push(user)
    return { user, token: 'mock-jwt' }
  },
}
