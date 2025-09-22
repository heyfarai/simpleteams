// Domain models - database agnostic interfaces

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
  shortName?: string;
  logo?: string;
  location?: Location;
  colors?: TeamColors;
  headCoach?: string;
  staff?: StaffMember[];
  stats?: TeamStats;
  status: TeamStatus;
  division?: Division;
  season?: Season;
}

export interface Division {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  skillLevel?: SkillLevel;
  conference: Conference;
  teamLimits?: TeamLimits;
}

export interface Season {
  id: string;
  name: string;
  year: number;
  startDate?: string;
  endDate?: string;
  status: SeasonStatus;
  isActive?: boolean;
}

export interface Conference {
  id: string;
  name: string;
  season: Season;
  description?: string;
  commissioner?: Commissioner;
}

export interface Game {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: Venue;
  homeTeam: Team;
  awayTeam: Team;
  division: Division;
  season: Season;
  status: GameStatus;
  homeScore?: number;
  awayScore?: number;
  score?: {
    homeScore: number;
    awayScore: number;
  };
  officials?: Official[];
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  region?: string;
  coordinates?: Coordinates;
}

export interface Official {
  id: string;
  name: string;
  level: string;
  contact?: ContactInfo;
}

// Supporting interfaces
export interface PlayerStats {
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  mpg: number;
  fgPercentage?: number;
  ftPercentage?: number;
  threePointPercentage?: number;
}

export interface TeamStats {
  wins: number;
  losses: number;
  ties?: number;
  pointsFor?: number;
  pointsAgainst?: number;
  gamesPlayed?: number;
  conferenceRecord?: string;
}

export interface Location {
  city: string;
  region?: string;
  homeVenue?: Venue;
}

export interface TeamColors {
  primary: string;
  secondary?: string;
  accent?: string;
}

export interface StaffMember {
  name: string;
  role: StaffRole;
  email?: string;
  phone?: string;
}

export interface TeamLimits {
  maxTeams: number;
  minTeams: number;
  currentTeams?: number;
}

export interface Commissioner {
  name: string;
  email?: string;
  phone?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface FilterOptions {
  sessions: Session[];
  seasons: Season[];
  divisions: Division[];
  teams: Pick<Team, "id" | "name" | "shortName">[];
  positions: Position[];
}

export interface Session {
  id: string;
  name: string;
  type?: string;
  startDate?: string;
  isActive?: boolean;
}

// Enums and types
export type Position = "PG" | "SG" | "SF" | "PF" | "C" | "P";
export type StatCategory = "ppg" | "rpg" | "apg" | "spg" | "bpg" | "mpg";
export type AgeGroup = "ascent" | "supreme" | "premier" | "diamond";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "elite";
export type TeamStatus = "active" | "inactive" | "pending" | "suspended";
export type SeasonStatus = "active" | "completed" | "upcoming" | "cancelled";
export type GameStatus = "scheduled" | "live" | "completed" | "cancelled" | "postponed";
export type StaffRole = "head-coach" | "assistant-coach" | "manager" | "trainer" | "volunteer";
export type PlayerStatus = "active" | "inactive" | "injured";