export interface TeamStats {
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  gamesPlayed: number;
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

export interface Team {
  id: string;
  name: string;
  logo?: string;
  division?: Division;
  season?: Season;
  coach: string;
  region?: string;
  description?: string;
  homeVenue?: string;
  awards: string[];
  stats: TeamStats;
  record?: string;
}


export interface TeamFilterState {
  searchTerm: string;
  year: string;  // Required
  seasonId: string;  // Required
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

export type ViewMode = 'grid' | 'standings';
