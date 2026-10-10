import { useEffect, useState } from 'react'
export function useAsync(fn) {
  const [state, set] = useState({ data: null, loading: true, error: null })
  useEffect(() => { let on = true
    fn().then((data) => on && set({ data, loading: false, error: null })).catch((error) => on && set({ data: null, loading: false, error }))
    return () => { on = false } }, [])
  return state
}
