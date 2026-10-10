import { Star } from 'lucide-react'
export default function Stars({ value }) {
  return <span className="stars" role="img" aria-label={`${value} de 5`}>{[1,2,3,4,5].map((i) => <Star key={i} size={15} fill={i <= Math.round(value) ? 'currentColor' : 'none'} />)}</span>
}
