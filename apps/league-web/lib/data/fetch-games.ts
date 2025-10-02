// Database-agnostic game data fetching using service layer
import { gameService, seasonService } from "@/lib/services";
import type { Game } from "@/lib/domain/models";
import { handleFetchError } from "@/lib/utils/errors";

export interface PaginatedGames {
  total: number;
  games: Game[];
}

interface GameFilters {
  season?: string;
  session?: string;
  division?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  includeArchived?: boolean;
}

// Database-agnostic functions using service layer

export async function fetchGames({
  season,
  session,
  division,
  status,
  page = 1,
  pageSize = 50,
  includeArchived = false,
}: GameFilters = {}): Promise<PaginatedGames> {
  try {
    let games: Game[];

    // Apply filters using service layer
    if (season) {
      games = await gameService.getGamesBySeason(season, includeArchived);
    } else if (division) {
      games = await gameService.getGamesByDivision(division, includeArchived);
    } else {
      games = await gameService.getAllGames(includeArchived);
    }

    // Apply status filter
    if (status) {
      games = games.filter(game => game.status === status);
    }

    // Apply pagination
    const total = games.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedGames = games.slice(start, end);

    return {
      total,
      games: paginatedGames,
    };
  } catch (error) {
    console.error("Error fetching games:", error);
    throw handleFetchError(error);
  }
}

export async function fetchGameById(id: string): Promise<Game | null> {
  try {
    const game = await gameService.getGameById(id);

    if (!game) return null;

    return game;
  } catch (error) {
    console.error("Error fetching game:", error);
    throw handleFetchError(error);
  }
}

// Additional utility functions using service layer

export async function fetchUpcomingGames(limit: number = 10): Promise<Game[]> {
  try {
    const games = await gameService.getUpcomingGames(limit);
    return games;
  } catch (error) {
    console.error("Error fetching upcoming games:", error);
    return [];
  }
}

export async function fetchCompletedGames(limit: number = 10): Promise<Game[]> {
  try {
    const games = await gameService.getCompletedGames(limit);
    return games;
  } catch (error) {
    console.error("Error fetching completed games:", error);
    return [];
  }
}

export async function fetchGamesByTeam(teamId: string): Promise<Game[]> {
  try {
    const games = await gameService.getGamesByTeam(teamId);
    return games;
  } catch (error) {
    console.error("Error fetching games by team:", error);
    return [];
  }
}

export async function fetchGamesByDateRange(startDate: string, endDate: string): Promise<Game[]> {
  try {
    const games = await gameService.getGamesByDateRange(startDate, endDate);
    return games;
  } catch (error) {
    console.error("Error fetching games by date range:", error);
    return [];
  }
}

export async function fetchRecentResults(limit: number = 5): Promise<Game[]> {
  try {
    const games = await gameService.getRecentResults(limit);
    return games;
  } catch (error) {
    console.error("Error fetching recent results:", error);
    return [];
  }
}

export async function fetchTeamSchedule(teamId: string): Promise<{ upcoming: Game[], completed: Game[] }> {
  try {
    const schedule = await gameService.getTeamSchedule(teamId);
    return {
      upcoming: schedule.upcoming,
      completed: schedule.completed,
    };
  } catch (error) {
    console.error("Error fetching team schedule:", error);
    return { upcoming: [], completed: [] };
  }
}