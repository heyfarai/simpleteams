// Game service - all game business logic, database agnostic
import type { Game } from "@simpleteams/types";
import type { UpdateGameRequest, CreateGameRequest } from "@simpleteams/database";
import { gameRepository } from "@simpleteams/database";

export class GameService {
  async getAllGames(includeArchived = false): Promise<Game[]> {
    return gameRepository.findAll(includeArchived);
  }

  async getGameById(id: string): Promise<Game | null> {
    return gameRepository.findById(id);
  }

  async getGamesBySeason(seasonId: string, includeArchived = false): Promise<Game[]> {
    return gameRepository.findBySeason(seasonId, includeArchived);
  }

  async getGamesByTeam(teamId: string): Promise<Game[]> {
    return gameRepository.findByTeam(teamId);
  }

  async getGamesByDivision(divisionId: string, includeArchived = false): Promise<Game[]> {
    return gameRepository.findByDivision(divisionId, includeArchived);
  }

  async getUpcomingGames(limit = 10): Promise<Game[]> {
    return gameRepository.findUpcoming(limit);
  }

  async getCompletedGames(limit = 10): Promise<Game[]> {
    return gameRepository.findCompleted(limit);
  }

  async getGamesByDateRange(startDate: string, endDate: string): Promise<Game[]> {
    return gameRepository.findByDateRange(startDate, endDate);
  }

  // Update operations
  async updateGame(id: string, gameData: UpdateGameRequest): Promise<Game> {
    // Add business logic validations here if needed
    if (gameData.homeScore !== undefined && gameData.homeScore < 0) {
      throw new Error('Home score cannot be negative');
    }
    if (gameData.awayScore !== undefined && gameData.awayScore < 0) {
      throw new Error('Away score cannot be negative');
    }

    return gameRepository.update(id, gameData);
  }

  async createGame(gameData: CreateGameRequest): Promise<Game> {
    // Add business logic validations here if needed
    if (!gameData.date || !gameData.time) {
      throw new Error('Date and time are required');
    }
    if (!gameData.homeTeamId || !gameData.awayTeamId) {
      throw new Error('Home and away teams are required');
    }
    if (gameData.homeTeamId === gameData.awayTeamId) {
      throw new Error('Home and away teams cannot be the same');
    }

    // Set default status if not provided
    if (!gameData.status) {
      gameData.status = 'upcoming';
    }

    return gameRepository.create(gameData);
  }

  // Business logic methods
  async getRecentResults(limit = 5): Promise<Game[]> {
    const completed = await this.getCompletedGames(limit);
    return completed.filter(game => game.homeScore !== undefined && game.awayScore !== undefined);
  }

  async getTeamSchedule(teamId: string): Promise<{ upcoming: Game[], completed: Game[] }> {
    const allGames = await this.getGamesByTeam(teamId);
    const now = new Date();

    return {
      upcoming: allGames.filter(game => new Date(game.date) >= now),
      completed: allGames.filter(game => new Date(game.date) < now)
    };
  }
}

// Export singleton instance
export const gameService = new GameService();