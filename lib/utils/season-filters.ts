export interface Season {
  id: string;
  name: string; // e.g. "2024-25 Season"
  year: string; // e.g. "2024-25"
  startDate: Date;
  endDate: Date;
  status: string;
  isActive: boolean;
}

export const sortSeasonsByDate = (seasons: Season[]): Season[] => {
  return [...seasons].sort(
    (a, b) => b.startDate.getTime() - a.startDate.getTime()
  );
};

export const getActiveSeasons = (seasons: Season[]): Season[] => {
  return seasons.filter((season) => season.isActive);
};

export const formatSeasonYear = (season: Season): string => {
  return season.year;
};
