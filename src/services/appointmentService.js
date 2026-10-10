import { delay } from './http'
import { appointments } from '../data/appointments'
import { services } from '../data/services'
import { barbers } from '../data/barbers'
import { users } from '../data/users'
import { endOf, startOf } from '../utils/format'
const ACTIVE = ['PENDENTE', 'CONFIRMADO', 'EM_ATENDIMENTO']
const enrich = (a) => ({
  ...a,
  service: services.find((s) => s.id === a.serviceId),
  barber: barbers.find((b) => b.id === a.barberId),
  client: users.find((u) => u.id === a.clientId),
})
export const appointmentService = {
  // futuro: GET /me/appointments
  async listByClient(clientId) {
    await delay()
    const mine = appointments.filter((a) => a.clientId === clientId).map(enrich)
    const now = new Date(), isNext = (a) => ACTIVE.includes(a.status) && endOf(a) >= now
    return {
      upcoming: mine.filter(isNext).sort((a, b) => startOf(a) - startOf(b)),
      history: mine.filter((a) => !isNext(a)).sort((a, b) => startOf(b) - startOf(a)),
    }
  },
  async listByBarber(userId) {
    await delay()
    const barber = barbers.find((b) => b.userId === userId)
    if (!barber) throw new Error('Não foi possível localizar o perfil deste profissional.')
    const mine = appointments.filter((a) => a.barberId === barber.id).map(enrich)
    const now = new Date()
    const upcoming = mine.filter((a) => ACTIVE.includes(a.status) && endOf(a) >= now)
      .sort((a, b) => startOf(a) - startOf(b))
    const history = mine.filter((a) => !ACTIVE.includes(a.status) || endOf(a) < now)
      .sort((a, b) => startOf(b) - startOf(a))
    return { upcoming, history }
  },
  async updateStatus(id, userId, status) {
    await delay(300)
    const barber = barbers.find((b) => b.userId === userId)
    const appointment = appointments.find((a) => a.id === id && a.barberId === barber?.id)
    if (!appointment) throw new Error('Agendamento não encontrado para este profissional.')
    const transitions = {
      PENDENTE: ['CONFIRMADO', 'CANCELADO'],
      CONFIRMADO: ['EM_ATENDIMENTO', 'CANCELADO'],
      EM_ATENDIMENTO: ['CONCLUIDO'],
    }
    if (!transitions[appointment.status]?.includes(status)) {
      throw new Error('Esta alteração de status não é permitida.')
    }
    appointment.status = status
    return enrich(appointment)
  },
  // futuro: PATCH /appointments/:id/cancel (cancelar libera o horário)
  async cancel(id) {
    await delay(400)
    const a = appointments.find((x) => x.id === id)
    if (!a || a.status === 'CANCELADO') throw new Error('Não foi possível cancelar este agendamento.')
    a.status = 'CANCELADO'
    return enrich(a)
  },
}
