import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';

export async function POST(request: Request) {
  try {
    const { teamId, divisionId } = await request.json();

    // Get active season
    const season = await client.fetch(`
      *[_type == "season" && isActive == true][0] {
        _id,
        name,
        "activeDivisions": activeDivisions[] {
          "division": division->{_id, name},
          teamLimits,
          teams
        }
      }
    `);

    if (!season) {
      return NextResponse.json({ error: 'No active season found' }, { status: 400 });
    }

    // Find selected division
    const selectedDivision = season.activeDivisions?.find(
      (d: any) => d.division._id === divisionId
    );

    if (!selectedDivision) {
      return NextResponse.json({ error: 'Division not found in active season' }, { status: 400 });
    }

    // Check team limits
    const currentTeams = selectedDivision.teams?.length || 0;
    const maxTeams = selectedDivision.teamLimits?.max || 12;

    if (currentTeams >= maxTeams) {
      return NextResponse.json({ 
        error: 'Division is full',
        details: {
          division: selectedDivision.division.name,
          currentTeams,
          maxTeams
        }
      }, { status: 400 });
    }

    // Add team to division
    await client
      .patch(season._id)
      .setIfMissing({ activeDivisions: [] })
      .insert('after', `activeDivisions[division._ref=="${divisionId}"].teams[-1]`, [
        {
          _key: `${Math.random().toString(36).substr(2, 9)}`,
          _type: 'reference',
          _ref: teamId
        }
      ])
      .commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error assigning team to division:', error);
    return NextResponse.json({ error: 'Failed to assign team to division' }, { status: 500 });
  }
}
