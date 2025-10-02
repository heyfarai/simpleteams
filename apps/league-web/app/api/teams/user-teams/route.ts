import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const teamId = searchParams.get('teamId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    // Query user's team registrations
    let query = supabase
      .from('team_registrations')
      .select(`
        team_id,
        selected_package,
        selected_session_ids,
        teams!inner (
          id,
          name,
          primary_contact_email,
          created_at
        )
      `)
      .eq('user_id', userId)
      .not('team_id', 'is', null);

    // Filter by specific team if provided
    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data: registrationData, error: registrationError } = await query;

    if (registrationError) {
      console.error('Registration query error:', registrationError);
      throw new Error(`Failed to fetch user teams: ${registrationError.message}`);
    }

    // Build teams with session information
    const teamsWithSessions = [];

    for (const reg of registrationData || []) {
      const team = {
        id: reg.teams.id,
        name: reg.teams.name,
        primary_contact_email: reg.teams.primary_contact_email,
        created_at: reg.teams.created_at,
        selected_package: reg.selected_package,
        sessions: []
      };

      // Fetch session details if team has selected sessions
      if (reg.selected_session_ids && reg.selected_session_ids.length > 0) {
        const { data: sessionData, error: sessionError } = await supabase
          .from('game_sessions')
          .select('id, name, start_date, end_date, sequence, type')
          .in('id', reg.selected_session_ids)
          .order('sequence');

        if (sessionError) {
          console.error('Session query error:', sessionError);
          // Don't fail the entire request, just log the error
        } else {
          team.sessions = sessionData || [];
        }
      }

      teamsWithSessions.push(team);
    }

    return NextResponse.json(teamsWithSessions);
  } catch (error) {
    console.error('Error fetching user teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user teams' },
      { status: 500 }
    );
  }
}