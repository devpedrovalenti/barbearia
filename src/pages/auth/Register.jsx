import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/layout/AuthShell'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { email, minLen, phone, required, sameAs, validate } from '../../utils/validators'
import { homeByRole } from '../../utils/format'
const rules = { name: [required, minLen(3)], email: [required, email], phone: [required, phone], password: [required, minLen(8)], confirm: [required, sameAs('password', 'As senhas não coincidem.')] }
export default function Register() {
  const { user, register } = useAuth(); const nav = useNavigate(); const loc = useLocation()
  const [v, setV] = useState({ name: '', email: '', phone: '', password: '', confirm: '' }); const [errors, setErrors] = useState({})
  const [fail, setFail] = useState(''); const [busy, setBusy] = useState(false)
  const back = loc.state?.from ? loc.state.from.pathname + loc.state.from.search : null
  if (user) return <Navigate to={back || homeByRole[user.role]} replace />
  const on = (k) => (e) => setV({ ...v, [k]: e.target.value })
  async function submit(e) {
    e.preventDefault(); setFail('')
    const errs = validate(v, rules); setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    try { await register(v); nav(back || '/cliente', { replace: true }) } catch (err) { setFail(err.message) } finally { setBusy(false) }
  }
  return (
    <AuthShell title="Criar conta" subtitle="Leva menos de um minuto." footer={<>Já tem conta? <Link to="/login" state={loc.state}>Entrar</Link></>}>
      <form onSubmit={submit} noValidate>
        <Input label="Nome completo" autoComplete="name" value={v.name} onChange={on('name')} error={errors.name} />
        <Input label="E-mail" type="email" autoComplete="email" value={v.email} onChange={on('email')} error={errors.email} />
        <Input label="Telefone" type="tel" autoComplete="tel" placeholder="(11) 90000-0000" value={v.phone} onChange={on('phone')} error={errors.phone} />
        <Input label="Senha" type="password" autoComplete="new-password" value={v.password} onChange={on('password')} error={errors.password} />
        <Input label="Confirmar senha" type="password" autoComplete="new-password" value={v.confirm} onChange={on('confirm')} error={errors.confirm} />
        {fail && <p className="field-error" role="alert">{fail}</p>}
        <Button type="submit" disabled={busy}>{busy ? 'Criando conta...' : 'Criar conta'}</Button>
      </form>
    </AuthShell>
  )
}
