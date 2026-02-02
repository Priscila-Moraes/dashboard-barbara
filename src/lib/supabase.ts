import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lwskyzalynytxtwebbue.supabase.co'
const supabaseAnonKey = 'sb_publishable_5rTyenDQRSubpnnIle2C6g_Y2XGNbuA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Types ──────────────────────────────────────────
export interface DailySummary {
  id: number
  date: string
  account_id: string
  product_name: string
  client_name: string
  total_spend: number
  total_impressions: number
  total_link_clicks: number
  total_page_views: number
  total_leads: number
  cpm: number
  ctr: number
  cpl: number
  cpa: number
}

export interface AdCreative {
  id: number
  date: string
  ad_id: string
  ad_name: string
  product_name: string
  spend: number
  impressions: number
  link_clicks: number
  leads: number
  cpl: number
  cpa: number
  ctr: number
  instagram_permalink: string
}

// ── Fetchers ───────────────────────────────────────
const PRODUCT = 'barbara-ascensao2026-whatsapp'

export async function fetchDailySummary(start: string, end: string): Promise<DailySummary[]> {
  const { data, error } = await supabase
    .from('daily_summary')
    .select('*')
    .eq('product_name', PRODUCT)
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: true })

  if (error) { console.error('daily_summary error:', error); return [] }
  return data || []
}

export async function fetchAdCreatives(start: string, end: string): Promise<AdCreative[]> {
  const { data, error } = await supabase
    .from('ad_creatives')
    .select('*')
    .eq('product_name', PRODUCT)
    .gte('date', start)
    .lte('date', end)
    .order('spend', { ascending: false })

  if (error) { console.error('ad_creatives error:', error); return [] }
  return data || []
}
