import { client } from "@/lib/sanity/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Season ID:", process.env.NEXT_PUBLIC_ACTIVE_SEASON_ID);

    const query = `*[_type == "season" && _id == $seasonId][0]{
      _id,
      name,
      "divisions": activeDivisions[].division->{
        _id,
        name,
        ageGroup
      }
    }`;

    const result = await client.fetch(query, {
      seasonId: process.env.NEXT_PUBLIC_ACTIVE_SEASON_ID,
    });

    console.log("Season result:", result);
    console.log("Divisions:", result?.divisions);

    return NextResponse.json({
      divisions: result?.divisions || [],
      season: result,
      seasonId: process.env.NEXT_PUBLIC_ACTIVE_SEASON_ID
    });
  } catch (error) {
    console.error("Error fetching divisions:", error);
    return NextResponse.json(
      { error: "Failed to fetch divisions", details: error.message },
      { status: 500 }
    );
  }
}