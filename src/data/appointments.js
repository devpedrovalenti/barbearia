import { dateKey } from '../utils/scheduling'
const day = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return dateKey(d) }
export const appointments = [
  { id: 'a1', clientId: 'u1', barberId: 'b1', serviceId: 's3', date: day(1), start: '10:00', end: '11:15', price: 65, status: 'CONFIRMADO' },
  { id: 'a2', clientId: 'u1', barberId: 'b2', serviceId: 's1', date: day(1), start: '15:00', end: '15:45', price: 40, status: 'PENDENTE' },
  { id: 'a3', clientId: 'u1', barberId: 'b1', serviceId: 's2', date: day(-14), start: '09:30', end: '10:00', price: 30, status: 'CONCLUIDO' },
]
