import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isConfigured = Boolean(url && key)
export const supabase = isConfigured ? createClient(url, key) : null

export function configMessage() {
  return 'Connect a Supabase project to enable live boards. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
}
