import { Link } from 'react-router-dom'
export default function AuthShell({ title, subtitle, footer, children }) {
  return (
    <main className="auth">
      <div className="auth-card">
        <Link to="/" className="logo"><span className="logo-mark" />Navalha &amp; Co.</Link>
        <h1>{title}</h1><p className="muted">{subtitle}</p>
        {children}
        <p className="muted auth-foot">{footer}</p>
      </div>
    </main>
  )
}
