import { ref } from 'vue'

const counts = ref({ android: 0, windows_portable: 0, windows_installer: 0, linux_deb: 0, linux_appimage: 0 })
const total = ref(0)
const loading = ref(false)

const API = '/api/downloads'
const STORAGE_URL = 'https://adqhqvzkqdhujjipabgf.supabase.co/storage/v1/object/public/updates/download_counts.json'

async function fetchCounts() {
  loading.value = true
  try {
    // intenta API primero (más fresca), fallback a storage directo
    const r = await fetch(API, { cache:'no-store' }).catch(()=>null)
    if (r && r.ok) {
      const j = await r.json()
      if (j?.counts) {
        counts.value = { ...counts.value, ...j.counts }
        total.value = j.total || Object.values(j.counts).reduce((a,b)=>a+(Number(b)||0),0)
        return j.counts
      }
    }
    const r2 = await fetch(STORAGE_URL, { cache:'no-store' })
    if (r2.ok) {
      const j2 = await r2.json()
      counts.value = { ...counts.value, ...j2 }
      total.value = Object.values(j2).reduce((a,b)=>a+(Number(b)||0),0)
    }
  } catch {} finally { loading.value = false }
}

async function track(platform) {
  try {
    const r = await fetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ platform }) })
    if (r.ok) {
      const j = await r.json()
      if (j?.counts) {
        counts.value = { ...counts.value, ...j.counts }
        total.value = j.total
      }
    } else {
      // fallback optimista local
      counts.value[platform] = (Number(counts.value[platform])||0)+1
      total.value = Object.values(counts.value).reduce((a,b)=>a+(Number(b)||0),0)
    }
  } catch {
    counts.value[platform] = (Number(counts.value[platform])||0)+1
    total.value = Object.values(counts.value).reduce((a,b)=>a+(Number(b)||0),0)
  }
}

export function useDownloads() {
  return { counts, total, loading, fetchCounts, track }
}
