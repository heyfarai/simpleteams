// Repository interfaces - define what we need, not how we get it
import type {
  Player,
  Team,
  Game,
  Division,
  Season,
  Conference,
  FilterOptions,
  StatCategory,
  Official,
  Venue,
} from "../domain/models";

export interface PlayerRepository {
  findAll(): Promise<Player[]>;
  findById(id: string): Promise<Player | null>;
  findBySeason(seasonId: string): Promise<Player[]>;
  findByTeam(teamId: string): Promise<Player[]>;
  findStatLeaders(seasonId?: string): Promise<Player[]>;
  findLeadersByCategory(category: StatCategory, seasonId?: string): Promise<Player[]>;
  findFeatured(count: number): Promise<Player[]>;
  search(query: string): Promise<Player[]>;
}

export interface TeamRepository {
  findAll(): Promise<Team[]>;
  findById(id: string): Promise<Team | null>;
  findBySeason(seasonId: string): Promise<Team[]>;
  findByDivision(divisionId: string): Promise<Team[]>;
  findWithRosters(seasonId?: string): Promise<Team[]>;
  search(query: string): Promise<Team[]>;
}

export interface GameRepository {
  findAll(): Promise<Game[]>;
  findById(id: string): Promise<Game | null>;
  findBySeason(seasonId: string): Promise<Game[]>;
  findByTeam(teamId: string): Promise<Game[]>;
  findByDivision(divisionId: string): Promise<Game[]>;
  findByDateRange(startDate: string, endDate: string): Promise<Game[]>;
  findUpcoming(limit?: number): Promise<Game[]>;
  findCompleted(limit?: number): Promise<Game[]>;
}

export interface DivisionRepository {
  findAll(): Promise<Division[]>;
  findById(id: string): Promise<Division | null>;
  findBySeason(seasonId: string): Promise<Division[]>;
  findByConference(conferenceId: string): Promise<Division[]>;
}

export interface SeasonRepository {
  findAll(): Promise<Season[]>;
  findById(id: string): Promise<Season | null>;
  findActive(): Promise<Season[]>;
  findCompleted(): Promise<Season[]>;
  findCurrent(): Promise<Season | null>;
}

export interface ConferenceRepository {
  findAll(): Promise<Conference[]>;
  findById(id: string): Promise<Conference | null>;
  findBySeason(seasonId: string): Promise<Conference[]>;
}

export interface FilterRepository {
  getFilterOptions(): Promise<FilterOptions>;
}

export interface OfficialRepository {
  findAll(): Promise<Official[]>;
  findById(id: string): Promise<Official | null>;
  findByGame(gameId: string): Promise<Official[]>;
}

export interface VenueRepository {
  findAll(): Promise<Venue[]>;
  findById(id: string): Promise<Venue | null>;
  search(query: string): Promise<Venue[]>;
}