import { NextResponse } from 'next/server';
import { league } from '@simpleteams/services'; // was: @simpleteams/services/league';

export async function GET() {
  try {
    const currentSeason = await league.getCurrentSeason();

    return NextResponse.json({
      season: currentSeason
    });
  } catch (error) {
    console.error('[API] Error fetching current season:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current season' },
      { status: 500 }
    );
  }
}