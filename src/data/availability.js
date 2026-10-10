const std = { start: '09:00', end: '19:00', breakStart: '12:00', breakEnd: '13:00' }
const week = { 1: std, 2: std, 3: std, 4: std, 5: { ...std, end: '20:00' }, 6: { ...std, end: '18:00', breakStart: null, breakEnd: null } }
export const availability = { b1: week, b2: week, b3: { ...week, 2: null } } // chave = dia da semana (0 = domingo); null = folga
export const timeOffs = { b1: [], b2: [], b3: [] } // datas específicas indisponíveis (AAAA-MM-DD)
