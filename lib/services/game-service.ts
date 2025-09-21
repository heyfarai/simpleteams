// Game service - all game business logic, database agnostic
import type { Game } from "../domain/models";
import { gameRepository } from "../repositories/factory";

export class GameService {
  async getAllGames(): Promise<Game[]> {
    return gameRepository.findAll();
  }

  async getGameById(id: string): Promise<Game | null> {
    return gameRepository.findById(id);
  }

  async getGamesBySeason(seasonId: string): Promise<Game[]> {
    console.log('[DEBUG] GameService.getGamesBySeason called with:', seasonId);
    const games = await gameRepository.findBySeason(seasonId);
    console.log('[DEBUG] GameRepository returned:', games.length, 'games');
    return games;
  }

  async getGamesByTeam(teamId: string): Promise<Game[]> {
    return gameRepository.findByTeam(teamId);
  }

  async getGamesByDivision(divisionId: string): Promise<Game[]> {
    return gameRepository.findByDivision(divisionId);
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