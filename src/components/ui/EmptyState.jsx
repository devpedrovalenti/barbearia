import Button from './Button'
export default function EmptyState({ title, action, to }) {
  return <div className="empty"><p>{title}</p>{action && <Button to={to}>{action}</Button>}</div>
}
