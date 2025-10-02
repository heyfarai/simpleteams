"use client";

import { SeasonSelect } from "@/components/filters/season-select";

import { Season } from '@/lib/utils/season-filters';

interface SeasonFiltersProps {
  selectedSeason: string;
  availableSeasons: Season[];
  onSeasonChange: (seasonId: string) => void;
}

export function SeasonFilters({
  selectedSeason,
  availableSeasons,
  onSeasonChange,
}: SeasonFiltersProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">
        Season
      </label>
      <SeasonSelect
        selectedSeason={selectedSeason}
        seasons={availableSeasons}
        onChange={onSeasonChange}
        className="w-64"
      />
    </div>
  );
}
