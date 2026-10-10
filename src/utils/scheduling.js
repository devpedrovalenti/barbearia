export const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
export const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
export const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const weekday = (key) => new Date(`${key}T00:00`).getDay()
// Horários de início possíveis para um serviço, respeitando expediente, intervalo, folgas e conflitos.
export function freeSlots({ date, duration, rule, timeOff = [], appts = [], now = new Date(), step = 30 }) {
  if (!rule || timeOff.includes(date)) return []
  const out = [], s = toMin(rule.start), e = toMin(rule.end)
  const bs = rule.breakStart ? toMin(rule.breakStart) : null, be = rule.breakEnd ? toMin(rule.breakEnd) : null
  const nowMin = now.getHours() * 60 + now.getMinutes(), today = date === dateKey(now)
  for (let t = s; t + duration <= e; t += step) {
    if (today && t <= nowMin) continue
    if (bs !== null && t < be && t + duration > bs) continue
    if (appts.some((a) => a.status !== 'CANCELADO' && a.date === date && t < toMin(a.end) && t + duration > toMin(a.start))) continue
    out.push(fmt(t))
  }
  return out
}
