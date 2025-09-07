export interface TeamStats {
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  gamesPlayed: number;
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  division: string;
  coach: string;
  region?: string;
  description?: string;
  homeVenue?: string;
  awards: string[];
  sessionIds: string[];
  stats: TeamStats;
  record?: string;
}


export interface TeamFilterState {
  searchTerm: string;
  division: string;
  year: string;
  session: string;
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
