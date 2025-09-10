"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SeasonFiltersProps {
  selectedSeason: string;
  availableSeasons: Array<{
    id: string;
    name: string;
    year: number;
  }>;
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
      <Select value={selectedSeason} onValueChange={onSeasonChange}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select Season" />
        </SelectTrigger>
        <SelectContent>
          {availableSeasons.map((season) => (
            <SelectItem key={season.id} value={season.id}>
              {season.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
