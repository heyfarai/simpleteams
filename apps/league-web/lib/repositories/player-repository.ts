// Abstract interface - no database-specific code
export interface PlayerRepository {
  findAll(): Promise<Player[]>;
  findBySeason(seasonId: string): Promise<Player[]>;
  findById(id: string): Promise<Player | null>;
  findStatLeaders(seasonId?: string): Promise<Player[]>;
  findLeadersByCategory(category: StatCategory, seasonId?: string): Promise<Player[]>;
  findFeatured(count: number): Promise<Player[]>;
}

// Domain models - database agnostic
export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  team: Team;
  jersey: number;
  position: Position;
  gradYear: number;
  height?: string;
  photo?: string;
  stats: PlayerStats;
  awards: string[];
  hasHighlight: boolean;
  division: Division;
  gamesPlayed: number;
  season: Season;
  hometown: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface Division {
  id: string;
  name: string;
  ageGroup: string;
}

export interface Season {
  id: string;
  name: string;
  year: number;
}

export interface PlayerStats {
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  mpg: number;
}

export type Position = "PG" | "SG" | "SF" | "PF" | "C";
export type StatCategory = "ppg" | "rpg" | "apg" | "spg" | "bpg" | "mpg";