// Database-agnostic game data fetching using service layer
import { gameService, seasonService } from "@/lib/services";
import type { Game as DomainGame } from "@/lib/domain/models";
import type { Game, PaginatedGames } from "@/lib/sanity/display-types";
import { handleFetchError } from "@/lib/utils/errors";

interface GameFilters {
  season?: string;
  session?: string;
  division?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

// Transform domain model Game to legacy Game interface for backward compatibility
function transformToLegacyGame(domainGame: DomainGame): Game {
  return {
    _id: domainGame.id,
    gameNumber: 0, // Domain model doesn't have gameNumber yet
    gameDate: domainGame.date,
    gameTime: domainGame.time,
    status: domainGame.status,
    homeTeam: {
      _id: domainGame.homeTeam.id,
      name: domainGame.homeTeam.name,
      logo: domainGame.homeTeam.logo,
    },
    awayTeam: {
      _id: domainGame.awayTeam.id,
      name: domainGame.awayTeam.name,
      logo: domainGame.awayTeam.logo,
    },
    score: domainGame.homeScore !== undefined && domainGame.awayScore !== undefined ? {
      homeScore: domainGame.homeScore,
      awayScore: domainGame.awayScore,
    } : undefined,
    session: {
      _id: "default", // Domain model doesn't have session yet
      name: "Regular Season",
      type: "regular",
      startDate: domainGame.date,
    },
    season: {
      _id: domainGame.season.id,
      name: domainGame.season.name,
      year: domainGame.season.year,
      isActive: domainGame.season.status === "active",
    },
    venue: domainGame.venue?.name || "TBD",
    venueAddress: domainGame.venue?.address || "",
  };
}

// Database-agnostic functions using service layer

export async function fetchGames({
  season,
  session,
  division,
  status,
  page = 1,
  pageSize = 50,
}: GameFilters = {}): Promise<PaginatedGames> {
  try {
    let games: DomainGame[];

    // Apply filters using service layer
    if (season) {
      games = await gameService.getGamesBySeason(season);
    } else if (division) {
      games = await gameService.getGamesByDivision(division);
    } else {
      games = await gameService.getAllGames();
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
      games: paginatedGames.map(transformToLegacyGame),
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

    // For now, we don't have prev/next navigation in the service layer
    // This could be added as a business logic method in the game service
    return {
      ...transformToLegacyGame(game),
      prev: null, // TODO: Implement in game service
      next: null, // TODO: Implement in game service
    };
  } catch (error) {
    console.error("Error fetching game:", error);
    throw handleFetchError(error);
  }
}

// Additional utility functions using service layer

export async function fetchUpcomingGames(limit: number = 10): Promise<Game[]> {
  try {
    const games = await gameService.getUpcomingGames(limit);
    return games.map(transformToLegacyGame);
  } catch (error) {
    console.error("Error fetching upcoming games:", error);
    return [];
  }
}

export async function fetchCompletedGames(limit: number = 10): Promise<Game[]> {
  try {
    const games = await gameService.getCompletedGames(limit);
    return games.map(transformToLegacyGame);
  } catch (error) {
    console.error("Error fetching completed games:", error);
    return [];
  }
}

export async function fetchGamesByTeam(teamId: string): Promise<Game[]> {
  try {
    const games = await gameService.getGamesByTeam(teamId);
    return games.map(transformToLegacyGame);
  } catch (error) {
    console.error("Error fetching games by team:", error);
    return [];
  }
}

export async function fetchGamesByDateRange(startDate: string, endDate: string): Promise<Game[]> {
  try {
    const games = await gameService.getGamesByDateRange(startDate, endDate);
    return games.map(transformToLegacyGame);
  } catch (error) {
    console.error("Error fetching games by date range:", error);
    return [];
  }
}

export async function fetchRecentResults(limit: number = 5): Promise<Game[]> {
  try {
    const games = await gameService.getRecentResults(limit);
    return games.map(transformToLegacyGame);
  } catch (error) {
    console.error("Error fetching recent results:", error);
    return [];
  }
}

export async function fetchTeamSchedule(teamId: string): Promise<{ upcoming: Game[], completed: Game[] }> {
  try {
    const schedule = await gameService.getTeamSchedule(teamId);
    return {
      upcoming: schedule.upcoming.map(transformToLegacyGame),
      completed: schedule.completed.map(transformToLegacyGame),
    };
  } catch (error) {
    console.error("Error fetching team schedule:", error);
    return { upcoming: [], completed: [] };
  }
}