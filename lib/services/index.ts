// Service layer - business logic without database coupling
import { playerRepository, teamRepository, filterRepository } from "../repositories/factory";
import type {
  Player,
  Team,
  FilterOptions,
  StatCategory,
} from "../domain/models";

export class PlayerService {
  async getAllPlayers(): Promise<Player[]> {
    return playerRepository.findAll();
  }

  async getPlayer(id: string): Promise<Player | null> {
    return playerRepository.findById(id);
  }

  async getPlayersBySeason(seasonId?: string): Promise<Player[]> {
    if (!seasonId || seasonId === "all") {
      return this.getAllPlayers();
    }
    return playerRepository.findBySeason(seasonId);
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    return playerRepository.findByTeam(teamId);
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

  async searchPlayers(query: string): Promise<Player[]> {
    return playerRepository.search(query);
  }

  // Business logic methods
  async getPlayersByTeamGrouped(seasonId?: string): Promise<Record<string, Player[]>> {
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

  async getPlayerStats(playerId: string): Promise<Player["stats"] | null> {
    const player = await this.getPlayer(playerId);
    return player?.stats || null;
  }

  async getPlayersWithHighlights(): Promise<Player[]> {
    const players = await this.getAllPlayers();
    return players.filter(player => player.hasHighlight);
  }

  async getAwardWinners(): Promise<Player[]> {
    const players = await this.getAllPlayers();
    return players.filter(player => player.awards.length > 0);
  }
}

export class TeamService {
  async getAllTeams(): Promise<Team[]> {
    return teamRepository.findAll();
  }

  async getTeam(id: string): Promise<Team | null> {
    return teamRepository.findById(id);
  }

  async getTeamsBySeason(seasonId: string): Promise<Team[]> {
    return teamRepository.findBySeason(seasonId);
  }

  async getTeamsByDivision(divisionId: string): Promise<Team[]> {
    return teamRepository.findByDivision(divisionId);
  }

  async getTeamsWithRosters(seasonId?: string): Promise<Team[]> {
    return teamRepository.findWithRosters(seasonId);
  }

  async searchTeams(query: string): Promise<Team[]> {
    return teamRepository.search(query);
  }

  // Business logic methods
  async getActiveTeams(): Promise<Team[]> {
    const teams = await this.getAllTeams();
    return teams.filter(team => team.status === "active");
  }

  async getTeamStandings(seasonId?: string): Promise<Team[]> {
    const teams = await this.getTeamsBySeason(seasonId || "current");

    return teams
      .filter(team => team.stats)
      .sort((a, b) => {
        const aWinPct = a.stats!.wins / (a.stats!.wins + a.stats!.losses);
        const bWinPct = b.stats!.wins / (b.stats!.wins + b.stats!.losses);
        return bWinPct - aWinPct;
      });
  }

  async getTeamsByLocation(city: string): Promise<Team[]> {
    const teams = await this.getAllTeams();
    return teams.filter(team =>
      team.location?.city.toLowerCase().includes(city.toLowerCase())
    );
  }
}

export class FilterService {
  async getFilterOptions(): Promise<FilterOptions> {
    return filterRepository.getFilterOptions();
  }

  async getActiveSeasons(): Promise<FilterOptions["seasons"]> {
    const options = await this.getFilterOptions();
    return options.seasons.filter(season => season.status === "active");
  }

  async getDivisionsByConference(conferenceId: string): Promise<FilterOptions["divisions"]> {
    const options = await this.getFilterOptions();
    return options.divisions.filter(division => division.conference.id === conferenceId);
  }
}

// Import and export additional services
export { gameService } from "./game-service";
export { seasonService } from "./season-service";

// Import new services
export { PaymentService } from "./payment-service";
export { RegistrationService } from "./registration-service";
export { StripeService } from "./stripe-service";

// Singleton service instances
export const playerService = new PlayerService();
export const teamService = new TeamService();
export const filterService = new FilterService();

// Note: PaymentService, RegistrationService, and StripeService require
// repository/configuration injection and should be instantiated as needed