import { mock } from './http'
import { services } from '../data/services'
import { barbers } from '../data/barbers'
import { reviews } from '../data/reviews'
export const catalogService = {
  getServices: () => mock(services),   // futuro: GET /services
  getBarbers: () => mock(barbers),     // futuro: GET /barbers
  getReviews: () => mock(reviews),     // futuro: GET /reviews
}
