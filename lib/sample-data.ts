// Sample data structure matching the new hierarchy: Games -> Sessions -> Seasons

// Import sample data from separate files
import { samplePlayers } from "./data/players";
import { sampleTeams } from "./data/teams";
import { sampleGames } from "./data/games";
import { sampleLocations } from "./data/locations";

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  jerseyNumber: number;
  gradYear: string;
  height: string;
  weight: string;
  photo: string;
  stats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    minutes: number;
    fieldGoalPercentage: number;
    gamesPlayed: number;
  };
  yearlyStats: Array<{
    year: number;
    season: string;
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    minutes: number;
    fieldGoalPercentage: number;
    gamesPlayed: number;
  }>;
  sessionHighs: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
  };
  awards: string[];
  bio: string;
  highlightVideo?: string;
  highlightVideos?: string[];
  region: string;
  hometown: string;
  division: string;
  scoutingNotes: string;
  social: {
    instagram?: string;
    twitter?: string;
    hudl?: string;
  };
  contactEmail: string;
  seasons?: string[]; // Season IDs this player is active in
}

export interface Season {
  id: string;
  name: string;
  type: "Regular" | "Summer";
  year: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  status: "draft" | "active" | "completed" | "archived";
  locations: string[]; // Location IDs assigned to this season
  officials: string[]; // Official IDs assigned to this season
  createdAt: string;
  updatedAt: string;
}

export interface Conference {
  id: string;
  name: string;
  seasonId: string;
  divisions: Division[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Division {
  id: string;
  name: string;
  conferenceId: string;
  seasonId: string;
  teams: string[]; // Team IDs assigned to this division
  maxTeams?: number;
  minTeams?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  name: string;
  type: "regular" | "playoff" | "Regular" | "Playoff" | "Tournament";
  seasonId: string;
  startDate: string;
  endDate: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: string;
  sessionId: string;
  seasonId: string;
  divisionId?: string;
  homeTeamId: string;
  awayTeamId: string;
  locationId?: string;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  assignedOfficials?: string[]; // Official IDs
  status:
    | "scheduled"
    | "live"
    | "completed"
    | "cancelled"
    | "postponed"
    | "in-progress";
  homeScore?: number;
  awayScore?: number;
  division: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamRosterPlayer {
  player: {
    _ref: string;
    name: string;
  };
  jerseyNumber: number;
  position: string;
  status: 'active' | 'inactive' | 'injured';
}

export interface TeamRoster {
  season: {
    _ref: string;
    name: string;
  };
  players: TeamRosterPlayer[];
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  city?: string;
  region?: string;
  primaryColors?: string[];
  division: string;
  divisionId?: string;
  seasonId?: string;
  coach: string;
  coaches?: Coach[];
  contacts?: Contact[];
  record: string;
  description: string;
  founded: string;
  homeVenue: string;
  awards: string[];
  sessionIds: string[];
  status?: "active" | "inactive" | "pending";
  registrationDate?: string;
  isPersistent?: boolean; // Teams persist across seasons
  rosters?: TeamRoster[];
  stats?: {
    wins: number;
    losses: number;
    pointsFor: number;
    pointsAgainst: number;
    gamesPlayed: number;
    streak: Array<"W" | "L" | "T">; // Last 5 games
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Coach {
  id: string;
  name: string;
  role: "head" | "assistant" | "volunteer";
  email?: string;
  phone?: string;
  certifications?: string[];
}

export interface Contact {
  id: string;
  name: string;
  role: "manager" | "parent" | "coordinator";
  email: string;
  phone?: string;
  isPrimary: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity?: number;
  facilities: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Official {
  id: string;
  name: string;
  email: string;
  phone?: string;
  certificationLevel: "certified" | "trainee" | "veteran";
  specialties: string[];
  availability: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Sample Seasons
export const sampleSeasons: Season[] = [
  {
    id: "1",
    name: "Summer Series 2025",
    type: "Summer",
    year: 2025,
    startDate: "2025-06-06",
    endDate: "2025-08-10",
    isActive: true,
    status: "active",
    locations: ["loc-1", "loc-2", "loc-3"],
    officials: ["off-1", "off-2", "off-3"],
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-09-20T00:00:00Z",
  },
  {
    id: "2",
    name: "2025-26 Regular Season",
    type: "Regular",
    year: 2025,
    startDate: "2025-11-01",
    endDate: "2026-03-31",
    isActive: false,
    status: "completed",
    locations: ["loc-1", "loc-4"],
    officials: ["off-1", "off-4"],
    createdAt: "2024-04-15T00:00:00Z",
    updatedAt: "2024-08-31T00:00:00Z",
  },
  {
    id: "3",
    name: "2024-25 Regular Season",
    type: "Regular",
    year: 2024,
    startDate: "2024-11-01",
    endDate: "2025-03-31",
    isActive: false,
    status: "completed",
    locations: ["loc-1", "loc-4"],
    officials: ["off-1", "off-4"],
    createdAt: "2024-04-15T00:00:00Z",
    updatedAt: "2024-08-31T00:00:00Z",
  },
];

// Sample Conferences
export const sampleConferences: Conference[] = [
  {
    id: "conf-1",
    name: "Eastern Conference",
    seasonId: "1",
    divisions: [
      {
        id: "div-1",
        name: "Diamond",
        conferenceId: "conf-1",
        seasonId: "1",
        teams: ["1", "2", "5", "7"],
        maxTeams: 6,
        minTeams: 4,
        description: "Top-tier competitive division",
        createdAt: "2024-09-01T00:00:00Z",
        updatedAt: "2024-09-15T00:00:00Z",
      },
      {
        id: "div-2",
        name: "Premier",
        conferenceId: "conf-1",
        seasonId: "1",
        teams: ["3", "4", "6", "8"],
        maxTeams: 6,
        minTeams: 4,
        description: "Competitive division for developing teams",
        createdAt: "2024-09-01T00:00:00Z",
        updatedAt: "2024-09-15T00:00:00Z",
      },
    ],
    description: "Primary conference for established teams",
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2024-09-15T00:00:00Z",
  },
  {
    id: "conf-2",
    name: "Western Conference",
    seasonId: "1",
    divisions: [
      {
        id: "div-3",
        name: "Development Division",
        conferenceId: "conf-2",
        seasonId: "1",
        teams: [],
        maxTeams: 8,
        minTeams: 4,
        description: "Entry-level division for new teams",
        createdAt: "2024-09-01T00:00:00Z",
        updatedAt: "2024-09-15T00:00:00Z",
      },
    ],
    description: "Conference for developing and new teams",
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2024-09-15T00:00:00Z",
  },
];

// Sample Sessions
export const sampleSessions: Session[] = [
  {
    id: "1",
    name: "Session 1",
    type: "regular",
    seasonId: "2",
    startDate: "2025-11-01",
    endDate: "2025-11-02",
    description: "West Capital - Opening weekend of the championship season",
    isActive: true,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Session 2",
    type: "regular",
    seasonId: "2",
    startDate: "2025-12-19",
    endDate: "2025-12-20",
    description: "West Capital - Second weekend of regular season play",
    isActive: true,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "3",
    name: "Session 3",
    type: "regular",
    seasonId: "2",
    startDate: "2026-01-31",
    endDate: "2026-02-01",
    description: "East Capital - Third weekend of regular season play",
    isActive: true,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "4",
    name: "Session 4",
    type: "regular",
    seasonId: "2",
    startDate: "2026-02-28",
    endDate: "2026-03-01",
    description: "Quebec - Fourth weekend of regular season play",
    isActive: true,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "5",
    name: "Session 5",
    type: "regular",
    seasonId: "2",
    startDate: "2026-03-27",
    endDate: "2026-03-28",
    description: "Ontario East - Fifth weekend of regular season play",
    isActive: true,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "6",
    name: "Play-offs",
    type: "Tournament",
    seasonId: "2",
    startDate: "2026-04-27",
    endDate: "2026-04-28",
    description: "Season championship playoffs",
    isActive: false,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
];

// Sample Officials
export const sampleOfficials: Official[] = [
  {
    id: "off-1",
    name: "Referee Johnson",
    email: "johnson@officials.com",
    phone: "(555) 200-0001",
    certificationLevel: "veteran",
    specialties: ["Championship Games", "Playoff Officiating"],
    availability: ["weekends", "evenings"],
    isActive: true,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-09-15T00:00:00Z",
  },
  {
    id: "off-2",
    name: "Referee Smith",
    email: "smith@officials.com",
    phone: "(555) 200-0002",
    certificationLevel: "certified",
    specialties: ["Youth Games", "Regular Season"],
    availability: ["weekends"],
    isActive: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-08-20T00:00:00Z",
  },
];

// Helper functions
export function getTeamById(id: string): Team | undefined {
  return sampleTeams.find((team) => team.id === id);
}

export function getSessionById(id: string): Session | undefined {
  return sampleSessions.find((session) => session.id === id);
}

export function getSeasonById(id: string): Season | undefined {
  return sampleSeasons.find((season) => season.id === id);
}

export function getGamesBySession(sessionId: string): Game[] {
  return sampleGames.filter((game) => game.sessionId === sessionId);
}

export function getSessionsBySeason(seasonId: string): Session[] {
  return sampleSessions.filter((session) => session.seasonId === seasonId);
}

export function getTeamsBySession(sessionId: string): Team[] {
  return sampleTeams.filter((team) => team.sessionIds.includes(sessionId));
}

export function getLocationById(id: string): Location | undefined {
  return sampleLocations.find((location) => location.id === id);
}

export function getOfficialById(id: string): Official | undefined {
  return sampleOfficials.find((official) => official.id === id);
}

export function getConferencesBySeason(seasonId: string): Conference[] {
  return sampleConferences.filter(
    (conference) => conference.seasonId === seasonId
  );
}

export function getDivisionsByConference(conferenceId: string): Division[] {
  const conference = sampleConferences.find((conf) => conf.id === conferenceId);
  return conference?.divisions || [];
}

export function getPlayersByTeam(teamId: string): Player[] {
  return samplePlayers.filter((player) => player.teamId === teamId);
}

export const sampleData = {
  seasons: sampleSeasons,
  conferences: sampleConferences,
  sessions: sampleSessions,
  teams: sampleTeams,
  games: sampleGames,
  locations: sampleLocations,
  officials: sampleOfficials,
  divisions: [
    { id: "div-1", name: "Diamond" },
    { id: "div-2", name: "Premier" },
    { id: "div-3", name: "Supreme" },
    { id: "div-4", name: "Ascent" },
  ],
};

// Re-export sample data to make them available to components
export { samplePlayers, sampleTeams, sampleGames, sampleLocations };
