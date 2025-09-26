import { NextRequest, NextResponse } from "next/server";
import { gameService } from "@/lib/services";
import type { CreateGameRequest } from "@/lib/repositories/interfaces";

export async function POST(request: NextRequest) {
  try {
    const body: CreateGameRequest = await request.json();

    // Validate required fields
    if (!body.date || !body.time || !body.homeTeamId || !body.awayTeamId || !body.seasonId) {
      return NextResponse.json(
        { error: "Missing required fields: date, time, homeTeamId, awayTeamId, seasonId" },
        { status: 400 }
      );
    }

    // Create the game through the service layer
    const newGame = await gameService.createGame(body);

    return NextResponse.json(
      { message: "Game created successfully", game: newGame },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create game" },
      { status: 500 }
    );
  }
}