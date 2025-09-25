import { NextRequest, NextResponse } from 'next/server';
import { sessionService } from '@/lib/services/session-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ seasonId: string }> }
) {
  try {
    const { seasonId } = await params;

    if (!seasonId) {
      return NextResponse.json(
        { error: 'Season ID is required' },
        { status: 400 }
      );
    }

    const sessions = await sessionService.getSessionsBySeason(seasonId);

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