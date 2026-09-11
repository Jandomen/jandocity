import { createClient } from '@supabase/supabase-js'

// Vite usa VITE_, pero tu .env tiene NEXT_PUBLIC_ — soportamos ambos
const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dhmqgiojukgzsrgjndyf.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_krQHFYoumMBYMtGRyyNBHg_Gh6bFaD'

export const supabase = createClient(url, key)
