import { NextRequest, NextResponse } from "next/server";
import { gameService } from "@/lib/services/game-service";
import type { UpdateGameRequest } from "@/lib/repositories/interfaces";

interface UpdateGameParams {
  params: {
    id: string;
  };
}

export async function PUT(
  request: NextRequest,
  { params }: UpdateGameParams
): Promise<NextResponse> {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate required ID
    if (!id) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

    // Build update request from body
    const updateData: UpdateGameRequest = {};

    if (body.date !== undefined) updateData.date = body.date;
    if (body.time !== undefined) updateData.time = body.time;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.homeScore !== undefined) {
      const score = parseInt(body.homeScore);
      updateData.homeScore = isNaN(score) ? undefined : score;
    }
    if (body.awayScore !== undefined) {
      const score = parseInt(body.awayScore);
      updateData.awayScore = isNaN(score) ? undefined : score;
    }
    if (body.venueId !== undefined) updateData.venueId = body.venueId;
    if (body.isArchived !== undefined) updateData.isArchived = body.isArchived;

    // Update game using service layer
    const updatedGame = await gameService.updateGame(id, updateData);

    return NextResponse.json({
      success: true,
      game: updatedGame,
    });
  } catch (error) {
    console.error("Error updating game:", error);

    if (error instanceof Error) {
      // Handle specific business logic errors
      if (error.message.includes('cannot be negative')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: "Game not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: UpdateGameParams
): Promise<NextResponse> {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

    const game = await gameService.getGameById(id);

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}