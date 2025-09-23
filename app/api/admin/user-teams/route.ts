import { NextResponse } from "next/server";
import { teamRepository } from "@/lib/repositories";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Use repository to get teams for user (includes logo_url)
    const teams = await teamRepository.findByUserId(userId);

    // Transform from domain model to API format
    const apiTeams = teams.map((team) => ({
      id: team.id,
      sanity_team_id: team.id, // Use Supabase ID as sanity_team_id for now
      name: team.name,
      logo_url: team.logo,
    }));

    return NextResponse.json({
      success: true,
      teams: apiTeams,
    });
  } catch (error) {
    console.error("❌ Admin API: Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
