// Updated services to use Supabase repositories
import { SupabaseTeamRepository, SupabaseSeasonRepository, SupabaseGameRepository } from '@simpleteams/database';
import type {
  Team,
  Season,
  Game,
  FilterOptions,
  Division,
  Player,
  PlayerStats
} from '@simpleteams/types';

// Team Service using Supabase
export class SupabaseTeamService {
  private teamRepository = new SupabaseTeamRepository();

  async getAllTeams(): Promise<Team[]> {
    return this.teamRepository.getAllTeams();
  }

  async getActiveTeams(): Promise<Team[]> {
    return this.teamRepository.getActiveTeams();
  }

  async getTeamsBySeason(seasonId: string): Promise<Team[]> {
    return this.teamRepository.getTeamsBySeason(seasonId);
  }

  async getTeamsByDivision(divisionId: string): Promise<Team[]> {
    return this.teamRepository.getTeamsByDivision(divisionId);
  }

  async getTeamById(teamId: string): Promise<Team | null> {
    return this.teamRepository.getTeamById(teamId);
  }

  async searchTeams(query: string): Promise<Team[]> {
    return this.teamRepository.searchTeams(query);
  }

  async getTopTeamsByWins(seasonId?: string, limit: number = 10): Promise<Team[]> {
    return this.teamRepository.getTopTeamsByWins(seasonId, limit);
  }

  async createTeam(teamData: Partial<Team>): Promise<Team> {
    return this.teamRepository.createTeam(teamData);
  }

  // Real-time subscriptions
  subscribeToTeamUpdates(teamId: string, callback: (team: Team) => void) {
    return this.teamRepository.subscribeToTeamUpdates(teamId, callback);
  }

  subscribeToTeamStatsUpdates(teamId: string, callback: (stats: any) => void) {
    return this.teamRepository.subscribeToTeamStatsUpdates(teamId, callback);
  }
}

// Season Service using Supabase
export class SupabaseSeasonService {
  private seasonRepository = new SupabaseSeasonRepository();

  async getAllSeasons(): Promise<Season[]> {
    return this.seasonRepository.getAllSeasons();
  }

  async getCurrentSeason(): Promise<Season | null> {
    return this.seasonRepository.getCurrentSeason();
  }

  async getSeasonById(seasonId: string): Promise<Season | null> {
    return this.seasonRepository.getSeasonById(seasonId);
  }

  async getActiveSeasons(): Promise<Season[]> {
    return this.seasonRepository.getActiveSeasons();
  }

  async getDivisionsBySeason(seasonId: string): Promise<Division[]> {
    return this.seasonRepository.getDivisionsBySeason(seasonId);
  }

  async createSeason(seasonData: Partial<Season>): Promise<Season> {
    return this.seasonRepository.createSeason(seasonData);
  }

  async updateSeason(seasonId: string, updates: Partial<Season>): Promise<Season> {
    return this.seasonRepository.updateSeason(seasonId, updates);
  }

  async setActiveSeason(seasonId: string): Promise<void> {
    return this.seasonRepository.setActiveSeason(seasonId);
  }

  // Real-time subscriptions
  subscribeToSeasonUpdates(callback: (seasons: Season[]) => void) {
    return this.seasonRepository.subscribeToSeasonUpdates(callback);
  }

  subscribeToCurrentSeason(callback: (season: Season | null) => void) {
    return this.seasonRepository.subscribeToCurrentSeason(callback);
  }
}

// Game Service using Supabase
export class SupabaseGameService {
  private gameRepository = new SupabaseGameRepository();

  async getAllGames(): Promise<Game[]> {
    return this.gameRepository.getAllGames();
  }

  async getGamesBySeason(seasonId: string): Promise<Game[]> {
    return this.gameRepository.getGamesBySeason(seasonId);
  }

  async getGamesByTeam(teamId: string): Promise<Game[]> {
    return this.gameRepository.getGamesByTeam(teamId);
  }

  async getGameById(gameId: string): Promise<Game | null> {
    return this.gameRepository.getGameById(gameId);
  }

  async getLiveGames(): Promise<Game[]> {
    return this.gameRepository.getLiveGames();
  }

  async createGame(gameData: Partial<Game>): Promise<Game> {
    return this.gameRepository.createGame(gameData);
  }

  async updateGameScore(gameId: string, homeScore: number, awayScore: number): Promise<Game> {
    return this.gameRepository.updateGameScore(gameId, homeScore, awayScore);
  }

  async startGame(gameId: string): Promise<Game> {
    return this.gameRepository.startGame(gameId);
  }

  async endGame(gameId: string): Promise<Game> {
    return this.gameRepository.endGame(gameId);
  }

  // Game Events
  async addGameEvent(event: any): Promise<any> {
    return this.gameRepository.addGameEvent(event);
  }

  async getGameEvents(gameId: string): Promise<any[]> {
    return this.gameRepository.getGameEvents(gameId);
  }

  // Real-time subscriptions
  subscribeToGameUpdates(gameId: string, callback: (game: Game) => void) {
    return this.gameRepository.subscribeToGameUpdates(gameId, callback);
  }

  subscribeToGameEvents(gameId: string, callback: (event: any) => void) {
    return this.gameRepository.subscribeToGameEvents(gameId, callback);
  }

  subscribeToLiveGames(callback: (games: Game[]) => void) {
    return this.gameRepository.subscribeToLiveGames(callback);
  }
}

// Filter Service using Supabase
export class SupabaseFilterService {
  private seasonRepository = new SupabaseSeasonRepository();
  private teamRepository = new SupabaseTeamRepository();

  async getFilterOptions(): Promise<FilterOptions> {
    try {
      // Get all seasons
      const seasons = await this.seasonRepository.getAllSeasons();

      // Get divisions for the current/latest season
      const currentSeason = await this.seasonRepository.getCurrentSeason();
      const divisions = currentSeason
        ? await this.seasonRepository.getDivisionsBySeason(currentSeason.id)
        : [];

      // Get a sample of teams for filtering
      const teams = await this.teamRepository.getAllTeams();

      return {
        sessions: [], // TODO: Implement sessions if needed
        seasons,
        divisions,
        teams: teams.map(team => ({
          id: team.id,
          name: team.name,
          shortName: team.shortName,
        })),
        positions: ['PG', 'SG', 'SF', 'PF', 'C', 'P'],
      };
    } catch (error) {
      console.error('Error getting filter options:', error);
      return {
        sessions: [],
        seasons: [],
        divisions: [],
        teams: [],
        positions: ['PG', 'SG', 'SF', 'PF', 'C', 'P'],
      };
    }
  }
}

// Player Service placeholder (to be implemented)
export class SupabasePlayerService {
  async getAllPlayers(): Promise<Player[]> {
    // TODO: Implement Supabase player repository
    return [];
  }

  async getPlayerById(playerId: string): Promise<Player | null> {
    // TODO: Implement
    return null;
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    // TODO: Implement
    return [];
  }

  async searchPlayers(query: string): Promise<Player[]> {
    // TODO: Implement
    return [];
  }

  async getTopPlayersByStat(statCategory: string, seasonId?: string, limit: number = 10): Promise<Player[]> {
    // TODO: Implement
    return [];
  }
}

// Export singleton instances
export const supabaseTeamService = new SupabaseTeamService();
export const supabaseSeasonService = new SupabaseSeasonService();
export const supabaseGameService = new SupabaseGameService();
export const supabaseFilterService = new SupabaseFilterService();
export const supabasePlayerService = new SupabasePlayerService();

// Export for easy switching between Sanity and Supabase
export const teamService = supabaseTeamService;
export const seasonService = supabaseSeasonService;
export const gameService = supabaseGameService;
export const filterService = supabaseFilterService;
export const playerService = supabasePlayerService;