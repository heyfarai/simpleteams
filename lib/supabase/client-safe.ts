import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Safe client creation that handles missing environment variables gracefully
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are missing. Using placeholder client.')
    // Return a mock client for development
    return null
  }

  try {
    return createClient<Database>(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return null
  }
}

export const supabase = createSupabaseClient()

// For server-side operations with elevated permissions
function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    return null
  }

  try {
    return createClient<Database>(
      supabaseUrl,
      serviceRoleKey || supabaseAnonKey || ''
    )
  } catch (error) {
    console.error('Failed to create Supabase admin client:', error)
    return null
  }
}

export const supabaseAdmin = createSupabaseAdminClient()

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabase !== null && supabaseAdmin !== null
}