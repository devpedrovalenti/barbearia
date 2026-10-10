import { Check, CheckCircle2, Clock, Scissors, XCircle } from 'lucide-react'
const map = {
  PENDENTE: ['Pendente', Clock, 'warn'], CONFIRMADO: ['Confirmado', CheckCircle2, 'ok'],
  EM_ATENDIMENTO: ['Em atendimento', Scissors, 'info'], CONCLUIDO: ['Concluído', Check, 'done'], CANCELADO: ['Cancelado', XCircle, 'bad'],
}
export default function StatusBadge({ status }) {
  const [label, Icon, tone] = map[status]
  return <span className={`badge badge-${tone}`}><Icon size={13} /> {label}</span>
}
