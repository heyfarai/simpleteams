export interface TeamStats {
  streak?: ("W" | "L" | "T")[];
  wins: number;
  losses: number;
  ties?: number;
  pointsFor: number;
  pointsAgainst: number;
  gamesPlayed?: number;
  homeRecord?: string;
  awayRecord?: string;
  conferenceRecord?: string;
}

export interface Division {
  _id: string;
  name: string;
  season?: {
    _ref: string;
  };
}

export interface Season {
  _id: string;
  name: string;
  year: number;
  activeDivisions?: Array<{
    division: Division;
    status: string;
    teamLimits?: {
      min: number;
      max: number;
    };
  }>;
}

export interface TeamRoster {
  season: {
    _id: string;
    name: string;
    year: number;
  };
  seasonStats?: TeamStats;
}

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
  division?: Division;
  season?: Season;
  coach: string;
  location?: string;
  description?: string;
  homeVenue?: string;
  awards: string[];
  stats: TeamStats;
  rosters?: TeamRoster[];
  record?: string;
  showStats?: boolean;
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
}

export interface TeamFilterState {
  searchTerm: string;
  year: string; // Required
  seasonId: string; // Required
  divisionId?: string;
  awards: string[];
}

export interface TeamViewProps {
  teams: Team[];
  filters: TeamFilterState;
  onFilterChange: (filters: Partial<TeamFilterState>) => void;
  isLoading?: boolean;
  error?: string | null;
}

export type ViewMode = "grid" | "standings";
