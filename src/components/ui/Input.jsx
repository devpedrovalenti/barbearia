import { useId } from 'react'
export default function Input({ label, error, ...rest }) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} {...rest} />
      {error && <p id={`${id}-e`} className="field-error">{error}</p>}
    </div>
  )
}
