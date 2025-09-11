"use client";

import { TeamFilterState } from "@/lib/types/teams";
import { SeasonTabs } from "@/components/filters/season-tabs";

interface TeamSeason {
  _id: string;
  name: string;
  year: number;
  isActive?: boolean;
}

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
      seasons={seasons.filter(season => season.isActive).map((season) => ({
        id: season._id,
        name: season.name,
        year: `${season.year}-${(season.year + 1).toString().slice(2)}`,
        startDate: new Date(season.year, 8, 1),
        endDate: new Date(season.year + 1, 7, 31),
        isActive: season.isActive || false,
      }))}
      selectedSeason={filters.seasonId || seasons.find(s => s.isActive)?._id || ""}
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
