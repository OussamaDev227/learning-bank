import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local — falling back to a placeholder client so the UI still renders; data calls will fail until real credentials are set.'
  )
}

// Falls back to the Supabase CLI's local dev port (connection-refused fails fast)
// rather than a fake hostname (DNS-lookup failures can take 15-20s to surface).
export const supabase = createClient(
  supabaseUrl || 'http://127.0.0.1:54321',
  supabaseAnonKey || 'placeholder-anon-key'
)
