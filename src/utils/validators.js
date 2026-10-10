export const required = (v) => (v?.trim() ? null : 'Campo obrigatório.')
export const email = (v) => (/^\S+@\S+\.\S+$/.test(v || '') ? null : 'Informe um e-mail válido.')
export const phone = (v) => ((v || '').replace(/\D/g, '').length >= 10 ? null : 'Informe DDD e número.')
export const minLen = (n) => (v) => ((v || '').length >= n ? null : `Use pelo menos ${n} caracteres.`)
export const sameAs = (f, msg) => (v, all) => (v === all[f] ? null : msg)
export function validate(values, rules) {
  const errors = {}
  for (const k in rules) for (const r of rules[k]) { const m = r(values[k], values); if (m) { errors[k] = m; break } }
  return errors
}
