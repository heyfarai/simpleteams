"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SeasonFiltersProps {
  selectedYear: string;
  selectedSeason: string;
  availableYears: string[];
  filteredSeasons: Array<{
    id: string;
    name: string;
    year: number;
  }>;
  onYearChange: (year: string) => void;
  onSeasonChange: (seasonId: string) => void;
}

export function SeasonFilters({
  selectedYear,
  selectedSeason,
  availableYears,
  filteredSeasons,
  onYearChange,
  onSeasonChange,
}: SeasonFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Filter by Year
        </label>
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Filter by Season
        </label>
        <Select value={selectedSeason} onValueChange={onSeasonChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Season" />
          </SelectTrigger>
          <SelectContent>
            {filteredSeasons.map((season) => (
              <SelectItem key={season.id} value={season.id}>
                {season.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
