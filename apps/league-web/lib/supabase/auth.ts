import { supabase, isSupabaseConfigured } from './client-safe'

export async function signInWithEmail(email: string, returnTo?: string) {
  if (!supabase || !isSupabaseConfigured()) {
    throw new Error('Supabase is not properly configured')
  }

  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_URL;
    const redirectUrl = returnTo
      ? `${baseUrl}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`
      : `${baseUrl}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectUrl
      }
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

export async function signOut() {
  if (!supabase || !isSupabaseConfigured()) {
    throw new Error('Supabase is not properly configured')
  }

  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}

export async function getCurrentUser() {
  if (!supabase || !isSupabaseConfigured()) {
    return null
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.warn('Error getting user:', error)
      return null
    }
    return user
  } catch (error) {
    console.warn('Error getting user:', error)
    return null
  }
}

// Get current user directly from database (bypasses dev context)
export async function getCurrentUserFromDB() {
  if (!supabase || !isSupabaseConfigured()) {
    return null
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.warn('Error getting user from DB:', error)
      return null
    }
    return user
  } catch (error) {
    console.warn('Error getting user from DB:', error)
    return null
  }
}

export async function getSession() {
  if (!supabase || !isSupabaseConfigured()) {
    return null
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.warn('Error getting session:', error)
      return null
    }
    return session
  } catch (error) {
    console.warn('Error getting session:', error)
    return null
  }
}

// Get user's Sanity team ID
export async function getUserSanityTeamId(userId: string): Promise<string | null> {
  if (!supabase || !isSupabaseConfigured()) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('user_team_associations')
      .select('sanity_team_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1)
      .single()

    if (error) {
      console.warn('Error getting user team association:', error)
      return null
    }

    return data?.sanity_team_id || null
  } catch (error) {
    console.warn('Error getting user team association:', error)
    return null
  }
}

// Check if user can perform action (for future use)
export async function canUserAccessTeam(userId: string, sanityTeamId: string, permission?: 'can_manage_roster' | 'can_view_payments' | 'can_edit_team_info'): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) {
    return false
  }

  try {
    const { data, error } = await supabase
      .from('user_team_associations')
      .select('*')
      .eq('user_id', userId)
      .eq('sanity_team_id', sanityTeamId)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      return false
    }

    if (!permission) {
      return true // Just checking team association
    }

    return data[permission] === true
  } catch (error) {
    return false
  }
}