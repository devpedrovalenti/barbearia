import { Instagram, MapPin, MessageCircle, Phone, Clock } from 'lucide-react'
export default function Footer() {
  return (
    <footer className="footer dark">
      <div className="container footer-grid">
        <div><p className="logo"><span className="logo-mark" />Navalha &amp; Co.</p><p className="muted">Corte e barba feitos com tempo e técnica.</p></div>
        <ul>
          <li><MapPin size={16} /> Rua das Tesouras, 120 – Centro</li>
          <li><Phone size={16} /> (11) 4000-1234</li>
          <li><MessageCircle size={16} /> WhatsApp (11) 90000-1234</li>
          <li><Instagram size={16} /> @navalhaeco</li>
        </ul>
        <ul>
          <li><Clock size={16} /> Seg a qui, 9h às 19h</li>
          <li><Clock size={16} /> Sex, 9h às 20h</li>
          <li><Clock size={16} /> Sáb, 9h às 18h</li>
          <li className="muted">Domingo fechado</li>
        </ul>
      </div>
      <p className="container copy muted">© {new Date().getFullYear()} Navalha &amp; Co. Todos os direitos reservados.</p>
    </footer>
  )
}
