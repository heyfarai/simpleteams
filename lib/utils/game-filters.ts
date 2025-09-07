export interface TransformedGame {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  division: string;
  conference: string;
  status: string;
  isTournament: boolean;
  tournamentName?: string;
  sessionName?: string;
  sessionType?: string;
  seasonName?: string;
  seasonType?: string;
  sessionId: string;
}

export interface FilterState {
  selectedDivision: string;
  selectedVenue: string;
  selectedConference: string;
  selectedSeason: string;
}

export const filterGames = (games: TransformedGame[], filters: FilterState): TransformedGame[] => {
  return games.filter((game) => {
    const matchesDivision =
      filters.selectedDivision === "all" || game.division === filters.selectedDivision;
    const matchesVenue =
      filters.selectedVenue === "all" || game.venue === filters.selectedVenue;
    const matchesConference =
      filters.selectedConference === "all" || game.conference === filters.selectedConference;
    const matchesSeason =
      filters.selectedSeason === "all" || game.seasonName === filters.selectedSeason;

    return matchesDivision && matchesVenue && matchesConference && matchesSeason;
  });
};

export const groupGamesBySessionAndDivision = (
  games: TransformedGame[],
  filters: FilterState
): Record<string, Record<string, TransformedGame[]>> => {
  const filtered = filterGames(games, filters);
  const grouped: Record<string, Record<string, TransformedGame[]>> = {};

  filtered.forEach((game) => {
    const sessionKey = game.sessionName || "Unknown Session";
    const divisionKey = game.division;

    if (!grouped[sessionKey]) {
      grouped[sessionKey] = {};
    }
    if (!grouped[sessionKey][divisionKey]) {
      grouped[sessionKey][divisionKey] = [];
    }
    grouped[sessionKey][divisionKey].push(game);
  });

  return grouped;
};

export const getActiveFiltersCount = (filters: FilterState): number => {
  return Object.values(filters).filter((filter) => filter !== "all").length;
};
