import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TeamFilterState } from "@/lib/types/teams";

interface ActiveFilterBadgesProps {
  filters: TeamFilterState;
  onFilterChange: (newFilters: Partial<TeamFilterState>) => void;
  seasons?: Array<{
    _id: string;
    name: string;
  }>;
  divisions?: Array<{
    _id: string;
    name: string;
  }>;
}

export function ActiveFilterBadges({ filters, onFilterChange, seasons = [], divisions = [] }: ActiveFilterBadgesProps) {
  const hasActiveFilters = 
    filters.divisionId ||
    filters.year ||
    filters.seasonId ||
    filters.awards.length > 0 ||
    filters.searchTerm;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.searchTerm && (
        <Badge variant="secondary" className="gap-1">
          Search: {filters.searchTerm}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onFilterChange({ searchTerm: "" })}
          />
        </Badge>
      )}
      
      {filters.year && (
        <Badge variant="secondary" className="gap-1">
          Year: {filters.year}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onFilterChange({ 
              year: "",
              seasonId: "",
              divisionId: undefined,
              awards: [],
              searchTerm: ""
            })}
          />
        </Badge>
      )}
      
      {filters.seasonId && (
        <Badge variant="secondary" className="gap-1">
          Season: {seasons.find(s => s._id === filters.seasonId)?.name || filters.seasonId}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onFilterChange({ 
              year: "",
              seasonId: "",
              divisionId: undefined
            })}
          />
        </Badge>
      )}
      
      {filters.divisionId && (
        <Badge variant="secondary" className="gap-1">
          Division: {divisions.find(d => d._id === filters.divisionId)?.name || filters.divisionId}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onFilterChange({ divisionId: undefined })}
          />
        </Badge>
      )}
      
      {filters.awards.map((award) => (
        <Badge key={award} variant="secondary" className="gap-1">
          {award}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onFilterChange({ 
              awards: filters.awards.filter(a => a !== award) 
            })}
          />
        </Badge>
      ))}
    </div>
  );
}
