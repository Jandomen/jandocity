import { supabase } from '@/lib/supabase.js'

let timer = null
export function useKeepAlive() {
  function start() {
    if (timer) return
    // ping al abrir y cada 6 días si alguien deja la pestaña abierta
    supabase.from('rooms').select('id').limit(1).then(()=>{})
    timer = setInterval(() => {
      supabase.from('rooms').select('id').limit(1).then(()=>{})
    }, 6 * 24 * 60 * 60 * 1000)
  }
  function stop() { if (timer) clearInterval(timer); timer=null }
  return { start, stop }
}
