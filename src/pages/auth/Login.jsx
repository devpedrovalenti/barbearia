import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/layout/AuthShell'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { email, required, validate } from '../../utils/validators'
import { homeByRole } from '../../utils/format'
export default function Login() {
  const { user, login } = useAuth(); const nav = useNavigate(); const loc = useLocation()
  const [v, setV] = useState({ email: '', password: '' }); const [errors, setErrors] = useState({})
  const [fail, setFail] = useState(''); const [busy, setBusy] = useState(false)
  const back = loc.state?.from ? loc.state.from.pathname + loc.state.from.search : null
  if (user) return <Navigate to={back || homeByRole[user.role]} replace />
  const on = (k) => (e) => setV({ ...v, [k]: e.target.value })
  async function submit(e) {
    e.preventDefault(); setFail('')
    const errs = validate(v, { email: [required, email], password: [required] }); setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    try { const u = await login(v.email, v.password); nav(back || homeByRole[u.role], { replace: true }) }
    catch (err) { setFail(err.message) } finally { setBusy(false) }
  }
  return (
    <AuthShell title="Entrar" subtitle="Acesse para agendar e acompanhar seus horários." footer={<>Ainda não tem conta? <Link to="/cadastro" state={loc.state}>Criar conta</Link></>}>
      <form onSubmit={submit} noValidate>
        <Input label="E-mail" type="email" autoComplete="email" value={v.email} onChange={on('email')} error={errors.email} />
        <Input label="Senha" type="password" autoComplete="current-password" value={v.password} onChange={on('password')} error={errors.password} />
        {fail && <p className="field-error" role="alert">{fail}</p>}
        <Button type="submit" disabled={busy}>{busy ? 'Entrando...' : 'Entrar'}</Button>
        <Link to="/login" className="muted small">Esqueci minha senha</Link>
      </form>
      <p className="muted small">Teste: cliente@demo.com, barbeiro@demo.com, diego@demo.com, lucas@demo.com ou admin@demo.com (qualquer senha).</p>
    </AuthShell>
  )
}
