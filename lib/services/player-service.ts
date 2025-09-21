// Business logic layer - no database coupling
import { playerRepository } from "../repositories";
import type { Player, StatCategory } from "../repositories/player-repository";

export class PlayerService {
  // Business logic methods that work with any database
  async getAllPlayers(): Promise<Player[]> {
    return playerRepository.findAll();
  }

  async getPlayersBySeason(seasonId?: string): Promise<Player[]> {
    if (!seasonId || seasonId === "all") {
      return this.getAllPlayers();
    }
    return playerRepository.findBySeason(seasonId);
  }

  async getPlayer(id: string): Promise<Player | null> {
    return playerRepository.findById(id);
  }

  async getStatLeaders(seasonId?: string): Promise<Player[]> {
    return playerRepository.findStatLeaders(seasonId);
  }

  async getLeadersByCategory(category: StatCategory, seasonId?: string): Promise<Player[]> {
    return playerRepository.findLeadersByCategory(category, seasonId);
  }

  async getFeaturedPlayers(count: number = 4): Promise<Player[]> {
    return playerRepository.findFeatured(count);
  }

  // Business logic methods
  async getPlayersByTeam(seasonId?: string): Promise<Record<string, Player[]>> {
    const players = await this.getPlayersBySeason(seasonId);

    return players.reduce((acc, player) => {
      const teamName = player.team.name;
      if (!acc[teamName]) {
        acc[teamName] = [];
      }
      acc[teamName].push(player);
      return acc;
    }, {} as Record<string, Player[]>);
  }

  async getTopPerformers(category: StatCategory, limit: number = 5): Promise<Player[]> {
    const players = await this.getAllPlayers();

    return players
      .filter(player => player.stats[category] > 0)
      .sort((a, b) => b.stats[category] - a.stats[category])
      .slice(0, limit);
  }

  // Add more business logic as needed
  async searchPlayers(query: string): Promise<Player[]> {
    const players = await this.getAllPlayers();
    const searchTerm = query.toLowerCase();

    return players.filter(player =>
      player.name.toLowerCase().includes(searchTerm) ||
      player.team.name.toLowerCase().includes(searchTerm) ||
      player.position.toLowerCase().includes(searchTerm)
    );
  }
}

// Singleton service instance
export const playerService = new PlayerService();