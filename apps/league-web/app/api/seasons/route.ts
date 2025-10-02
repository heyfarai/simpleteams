import { NextResponse } from 'next/server';
import { seasonService } from '@simpleteams/services'; // was: @simpleteams/services/season-service';

export async function GET() {
  try {
    const seasons = await seasonService.getAllSeasons();

    return NextResponse.json(seasons);
  } catch (error) {
    console.error('[API] Error fetching all seasons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seasons' },
      { status: 500 }
    );
  }
}