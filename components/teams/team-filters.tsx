"use client";

import { TeamFilterState } from "@/lib/types/teams";
import { SeasonTabs } from "@/components/filters/season-tabs";

import { SanitySeason } from '@/lib/sanity/types';

type TeamSeason = SanitySeason;

interface TeamFiltersProps {
  filters: TeamFilterState;
  onFilterChange: (filters: Partial<TeamFilterState>) => void;
  seasons: TeamSeason[];
}

export function TeamFilters({
  filters,
  onFilterChange,
  seasons,
}: TeamFiltersProps) {
  return (
    <SeasonTabs
      seasons={seasons
        .filter((season) => season.isActive)
        .map((season) => ({
          id: season._id,
          name: season.name,
          year: season.year.toString(),
          startDate: new Date(season.startDate),
          endDate: new Date(season.endDate),
          status: season.status,
          isActive: season.isActive || false,
        }))}
      selectedSeason={
        filters.seasonId || seasons.find((s) => s.isActive)?._id || ""
      }
      onSeasonChange={(seasonId) => {
        onFilterChange({
          seasonId,
          divisionId: undefined,
          awards: [],
          searchTerm: "",
        });
      }}
    />
  );
}
