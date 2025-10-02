import { SanitySeason } from '@/lib/sanity/types';

export interface Season {
  id: string; // maps to _id
  name: string;
  year: string;
  status: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

export const sortSeasonsByDate = (seasons: Season[]): Season[] => {
  return [...seasons].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
};

export const getActiveSeasons = (seasons: Season[]): Season[] => {
  return seasons.filter((season) => season.isActive);
};

export const formatSeasonYear = (season: Season): string => {
  return season.year.toString();
};
