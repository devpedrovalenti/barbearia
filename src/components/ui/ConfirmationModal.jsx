import { useEffect } from 'react'
export default function ConfirmationModal({ open, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Voltar', busy, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && !busy && onCancel()
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [open, busy, onCancel])
  if (!open) return null
  return (
    <div className="overlay" onClick={() => !busy && onCancel()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="m-t" onClick={(e) => e.stopPropagation()}>
        <h3 id="m-t">{title}</h3><p className="muted">{message}</p>
        <div className="row modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy} autoFocus>{cancelLabel}</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>{busy ? 'Aguarde...' : confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
