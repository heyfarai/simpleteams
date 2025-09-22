import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client with service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Admin API: Fetching teams for user:', userId)

    // Get teams that belong to this user via team_registrations
    const { data: registrations, error } = await supabaseAdmin
      .from('team_registrations')
      .select(`
        team_id,
        teams!inner (
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .not('team_id', 'is', null)

    if (error) {
      console.error('❌ Admin API: Error fetching teams:', error)
      return NextResponse.json(
        { error: 'Failed to fetch teams' },
        { status: 500 }
      )
    }

    // Transform the nested data structure to match expected format
    const teams = registrations?.map(reg => ({
      id: reg.teams.id,
      sanity_team_id: reg.teams.id, // Use Supabase ID as sanity_team_id for now
      name: reg.teams.name
    })) || []

    console.log('✅ Admin API: Found teams:', teams.length)

    return NextResponse.json({
      success: true,
      teams: teams
    })

  } catch (error) {
    console.error('❌ Admin API: Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}