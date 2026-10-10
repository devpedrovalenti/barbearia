import { delay } from './http'
import { services } from '../data/services'
import { barbers } from '../data/barbers'
import { availability, timeOffs } from '../data/availability'
import { appointments } from '../data/appointments'
import { fmt, freeSlots, toMin, weekday } from '../utils/scheduling'

const ids = (barberId) => (barberId === 'any' ? barbers.map((b) => b.id) : [barberId])
const rule = (id, date) => availability[id]?.[weekday(date)] ?? null
const slotsFor = (id, date, duration, withAppts = true) =>
  freeSlots({ date, duration, rule: rule(id, date), timeOff: withAppts ? timeOffs[id] : [], appts: withAppts ? appointments.filter((a) => a.barberId === id) : [] })

export const bookingService = {
  isDayOpen: (date, barberId) => ids(barberId).some((id) => rule(id, date) && !timeOffs[id].includes(date)),
  // futuro: GET /availability?date=&serviceId=&barberId=
  async getSlots({ date, serviceId, barberId }) {
    await delay(250)
    const { duration } = services.find((s) => s.id === serviceId)
    const free = new Set(ids(barberId).flatMap((id) => slotsFor(id, date, duration)))
    const grid = new Set(ids(barberId).flatMap((id) => slotsFor(id, date, duration, false)))
    return [...grid].sort().map((time) => ({ time, free: free.has(time) }))
  },
  // futuro: POST /appointments (o backend revalida o conflito dentro de uma transação)
  async create({ clientId, serviceId, barberId, date, start }) {
    await delay(500)
    const service = services.find((s) => s.id === serviceId)
    const { duration } = service
    const chosen = ids(barberId).find((id) => slotsFor(id, date, duration).includes(start))
    if (!chosen) throw new Error('Esse horário acabou de ser ocupado. Escolha outro.')
    const appt = { id: `a${Date.now()}`, clientId, barberId: chosen, serviceId, date, start, end: fmt(toMin(start) + duration), price: service.price, status: 'PENDENTE' }
    appointments.push(appt)
    return structuredClone(appt)
  },
}
