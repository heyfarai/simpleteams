import { NextRequest, NextResponse } from 'next/server';
import { sessionService } from '@simpleteams/services'; // was: @simpleteams/services/session-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('seasonId');
    const active = searchParams.get('active') === 'true';

    let sessions;

    if (seasonId) {
      if (active) {
        sessions = await sessionService.getActiveSessionsBySeason(seasonId);
      } else {
        sessions = await sessionService.getSessionsBySeason(seasonId);
      }
    } else if (active) {
      sessions = await sessionService.getActiveSessions();
    } else {
      sessions = await sessionService.getAllSessions();
    }

    return NextResponse.json({
      sessions,
      count: sessions.length
    });

  } catch (error) {
    console.error('[API] Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      seasonId,
      name,
      sequence,
      startDate,
      endDate,
      type = 'regular',
      maxTeams
    } = body;

    // Validate required fields
    if (!seasonId || !name || sequence === undefined || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: seasonId, name, sequence, startDate, endDate' },
        { status: 400 }
      );
    }

    if (!['regular', 'playoffs'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "regular" or "playoffs"' },
        { status: 400 }
      );
    }

    const session = await sessionService.createSession({
      seasonId,
      name,
      sequence,
      startDate,
      endDate,
      type,
      maxTeams
    });

    return NextResponse.json({ session }, { status: 201 });

  } catch (error) {
    console.error('[API] Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}