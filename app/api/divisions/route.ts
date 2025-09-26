import { NextResponse } from 'next/server';
import { divisionService } from '@/lib/services/division-service';

export async function GET() {
  try {
    const divisions = await divisionService.getActiveDivisions();

    return NextResponse.json(divisions);
  } catch (error) {
    console.error('[API] Error fetching divisions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch divisions' },
      { status: 500 }
    );
  }
}