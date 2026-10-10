import { createContext, useCallback, useContext, useState } from 'react'
const ToastContext = createContext(() => {})
export const useToast = () => useContext(ToastContext)
export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const push = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setItems((l) => [...l, { id, message, type }])
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 4000)
  }, [])
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">{items.map((t) => <p key={t.id} className={`toast toast-${t.type}`}>{t.message}</p>)}</div>
    </ToastContext.Provider>
  )
}
