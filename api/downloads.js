import { createClient } from '@supabase/supabase-js'

const BUCKET = 'updates'
const FILE = 'download_counts.json'

function getClients() {
  const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const anon = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET || process.env.SUPABASE_SERVICE_KEY
  // service es opcional para GET (solo necesita anon para leer public), requerido para POST
  const anonClient = url && anon ? createClient(url, anon) : null
  const serviceClient = url && serviceKey ? createClient(url, serviceKey) : anonClient
  return { anon: anonClient, service: serviceClient, url }
}

async function readCounts(service) {
  try {
    const { data, error } = await service.storage.from(BUCKET).download(FILE)
    if (error) throw error
    const text = await data.text()
    return JSON.parse(text)
  } catch {
    return { android: 0, windows_portable: 0, windows_installer: 0, linux_deb: 0, linux_appimage: 0 }
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { anon, service } = getClients()
  if (!anon && !service) return res.status(500).json({ ok:false, error:'Missing Supabase env' })

  if (req.method === 'GET') {
    const counts = await readCounts(service || anon)
    // also add total
    const total = Object.values(counts).reduce((a,b)=>a+(Number(b)||0),0)
    return res.status(200).json({ ok: true, counts, total })
  }

  if (req.method === 'POST') {
    let body = req.body
    if (typeof body === 'string') try { body = JSON.parse(body) } catch {}
    const platform = String(body?.platform || '').trim()
    const allowed = ['android','windows_portable','windows_installer','linux_deb','linux_appimage']
    if (!allowed.includes(platform)) {
      return res.status(400).json({ ok:false, error:'platform inválida', allowed })
    }
    try {
      const counts = await readCounts(service)
      counts[platform] = (Number(counts[platform])||0) + 1
      const newBlob = JSON.stringify(counts)
      const { error: upErr } = await service.storage.from(BUCKET).upload(FILE, newBlob, { contentType:'application/json', upsert:true, cacheControl:'0' })
      if (upErr) throw upErr
      const total = Object.values(counts).reduce((a,b)=>a+(Number(b)||0),0)
      return res.status(200).json({ ok:true, counts, total, incremented: platform })
    } catch (e) {
      return res.status(500).json({ ok:false, error: e.message })
    }
  }

  return res.status(405).json({ ok:false, error:'method not allowed' })
}
