import { supabase } from './supabase'

export type Setting = {
  key: string
  value: string
  label: string
  description?: string
  category: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'color' | 'time' | 'email' | 'phone' | 'url'
  options?: string
  is_public: boolean
  updated_at: string
}

// Cache to avoid re-fetching on every call within a session
let _cache: Record<string, string> | null = null
let _cacheTime = 0
const CACHE_TTL = 60_000 // 1 minute

export async function getAllSettings(): Promise<Record<string, string>> {
  const now = Date.now()
  if (_cache && now - _cacheTime < CACHE_TTL) return _cache

  const { data, error } = await supabase.from('settings').select('key, value')
  if (error || !data) return _cache || {}

  _cache = Object.fromEntries(data.map(s => [s.key, s.value]))
  _cacheTime = now
  return _cache!
}

export async function getSetting(key: string, fallback = ''): Promise<string> {
  const all = await getAllSettings()
  return all[key] ?? fallback
}

export async function getSettingBool(key: string, fallback = false): Promise<boolean> {
  const val = await getSetting(key, String(fallback))
  return val === 'true'
}

export async function getSettingNumber(key: string, fallback = 0): Promise<number> {
  const val = await getSetting(key, String(fallback))
  return parseFloat(val) || fallback
}

// Get all settings for a specific category (used in admin settings page)
export async function getSettingsByCategory(): Promise<Record<string, Setting[]>> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .order('category')
    .order('key')

  if (error || !data) return {}

  return data.reduce((acc: Record<string, Setting[]>, s: Setting) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})
}

// Update a single setting (admin only)
export async function updateSetting(key: string, value: string): Promise<boolean> {
  const { error } = await supabase
    .from('settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)
  return !error
}

// Update multiple settings at once — uses individual updates, not upsert
export async function updateSettings(updates: Record<string, string>): Promise<boolean> {
  const timestamp = new Date().toISOString()
  const results = await Promise.all(
    Object.entries(updates).map(([key, value]) =>
      supabase
        .from('settings')
        .update({ value, updated_at: timestamp })
        .eq('key', key)
    )
  )
  const hasError = results.some(r => r.error)
  if (!hasError) _cache = null
  return !hasError
}

// Get delivery fee for a specific region
export async function getDeliveryFee(region: string): Promise<number> {
  const regionKey = region.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_')
  const specificKey = `delivery_fee_${regionKey}`
  const all = await getAllSettings()

  // Try region-specific fee first, fall back to default
  if (all[specificKey]) return parseFloat(all[specificKey])
  return parseFloat(all['delivery_fee_default'] || '15')
}

// Invalidate cache (call after admin updates a setting)
export function invalidateSettingsCache() {
  _cache = null
  _cacheTime = 0
}
