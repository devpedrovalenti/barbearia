import { useState } from 'react'
import { Instagram, MessageCircle, Phone } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useToast } from '../../contexts/ToastContext'
import { minLen, required, validate } from '../../utils/validators'
export default function Contact() {
  const toast = useToast(); const [v, setV] = useState({ name: '', contact: '', message: '' }); const [errors, setErrors] = useState({})
  const on = (k) => (e) => setV({ ...v, [k]: e.target.value })
  function submit(e) {
    e.preventDefault()
    const errs = validate(v, { name: [required], contact: [required], message: [required, minLen(10)] }); setErrors(errs)
    if (Object.keys(errs).length) return
    toast('Mensagem enviada! Respondemos em breve.'); setV({ name: '', contact: '', message: '' }) // futuro: POST /contact
  }
  return (
    <section id="contato" className="section"><div className="container contact-grid">
      <div>
        <h2>Formulário de contato</h2>
        <form onSubmit={submit} noValidate className="form">
          <Input label="Nome" value={v.name} onChange={on('name')} error={errors.name} />
          <Input label="WhatsApp ou e-mail" value={v.contact} onChange={on('contact')} error={errors.contact} />
          <div className="field"><label htmlFor="msg">Mensagem</label><textarea id="msg" rows="4" value={v.message} onChange={on('message')} aria-invalid={!!errors.message} />
            {errors.message && <p className="field-error">{errors.message}</p>}</div>
          <Button type="submit">Enviar mensagem</Button>
        </form>
      </div>
      <div>
        <h2>Social e agendamentos</h2>
        <div className="social">
          <Button to="/agendar">Agendar horário</Button>
          <Button href="https://wa.me/5511900001234" variant="ghost"><MessageCircle size={18} />&nbsp;WhatsApp</Button>
          <Button href="https://instagram.com/" variant="ghost"><Instagram size={18} />&nbsp;Instagram</Button>
          <p className="muted"><Phone size={15} /> (11) 4000-1234 · Seg a sáb, 9h às 19h</p>
        </div>
      </div>
    </div></section>
  )
}
