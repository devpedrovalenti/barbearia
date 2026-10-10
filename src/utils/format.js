export const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
export const initials = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('')
export const homeByRole = { CLIENTE: '/cliente', PROFISSIONAL: '/profissional', ADMIN: '/admin' }
export const longDate = (d) => new Date(`${d}T00:00`).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
export const startOf = (a) => new Date(`${a.date}T${a.start}`)
export const endOf = (a) => new Date(`${a.date}T${a.end}`)
