// Troque por fetch/axios com baseURL e JWT quando o backend existir.
export const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))
export async function mock(data) { await delay(); return structuredClone(data) }
