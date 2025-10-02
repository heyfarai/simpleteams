import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import type { Season } from "@/lib/domain/models";

interface ShowcaseFiltersProps {
  availableSeasons: { id: string; name: string; year: number; isActive: boolean }[];
  selectedSeason: string;
  onSeasonChange: (season: string) => void;
  onDebugData?: () => void;
}

export function ShowcaseFilters({
  availableSeasons,
  selectedSeason,
  onSeasonChange,
  onDebugData,
}: ShowcaseFiltersProps) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="season-select" className="text-sm">
            Season:
          </label>
          <Select value={selectedSeason} onValueChange={onSeasonChange}>
            <SelectTrigger id="season-select" className="w-[200px]">
              <SelectValue placeholder="All seasons" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All seasons</SelectItem>
              {availableSeasons.map((season) => (
                <SelectItem key={season.id} value={season.id}>
                  {season.name} {season.isActive && "(Active)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {onDebugData && (
          <Button variant="outline" size="sm" onClick={onDebugData}>
            Debug Data
          </Button>
        )}
      </div>
    </div>
  );
}