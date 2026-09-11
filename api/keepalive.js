import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return res.status(500).json({ ok: false, error: 'no env' })
  const supabase = createClient(url, key)
  try {
    await supabase.from('rooms').select('id').limit(1)
    return res.status(200).json({ ok: true, keptAlive: new Date().toISOString(), url: 'https://jandocity.vercel.app' })
  } catch (e) {
    return res.status(200).json({ ok: false, error: e.message })
  }
}
