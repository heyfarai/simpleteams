import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    // Query all teams with their registration details (LEFT JOIN to include teams without registrations)
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select(`
        id,
        name,
        city,
        primary_contact_email,
        created_at,
        logo_url,
        primary_color,
        secondary_color,
        team_registrations (
          selected_package,
          selected_session_ids
        )
      `)
      .order('name');

    if (teamsError) {
      console.error('Teams query error:', teamsError);
      throw new Error(`Failed to fetch all teams: ${teamsError.message}`);
    }

    // Build teams with session information
    const teamsWithSessions = [];

    for (const team of teamsData || []) {
      const teamWithSessions = {
        id: team.id,
        name: team.name,
        city: team.city,
        primary_contact_email: team.primary_contact_email,
        created_at: team.created_at,
        logo_url: team.logo_url,
        primary_color: team.primary_color,
        secondary_color: team.secondary_color,
        selected_package: team.team_registrations?.[0]?.selected_package,
        sessions: []
      };

      // Fetch session details if team has selected sessions
      const selectedSessionIds = team.team_registrations?.[0]?.selected_session_ids;
      if (selectedSessionIds && selectedSessionIds.length > 0) {
        const { data: sessionData, error: sessionError } = await supabase
          .from('game_sessions')
          .select('id, name, start_date, end_date, sequence, type')
          .in('id', selectedSessionIds)
          .order('sequence');

        if (sessionError) {
          console.error('Session query error:', sessionError);
          // Don't fail the entire request, just log the error
        } else {
          teamWithSessions.sessions = sessionData || [];
        }
      }

      teamsWithSessions.push(teamWithSessions);
    }

    return NextResponse.json(teamsWithSessions);
  } catch (error) {
    console.error('Error fetching all teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch all teams' },
      { status: 500 }
    );
  }
}