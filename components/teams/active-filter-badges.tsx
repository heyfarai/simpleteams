import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TeamFilterState } from "@/lib/types/teams";

interface ActiveFilterBadgesProps {
  filters: TeamFilterState;
  onFilterChange: (newFilters: Partial<TeamFilterState>) => void;
}

export function ActiveFilterBadges({ filters, onFilterChange }: ActiveFilterBadgesProps) {
  const hasActiveFilters = 
    filters.division !== "all" ||
    filters.year !== "all" ||
    filters.session !== "all" ||
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
      
      {filters.division !== "all" && (
        <Badge variant="secondary" className="gap-1">
          Division: {filters.division}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onFilterChange({ division: "all" })}
          />
        </Badge>
      )}
      
      {filters.year !== "all" && (
        <Badge variant="secondary" className="gap-1">
          Year: {filters.year}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onFilterChange({ year: "all" })}
          />
        </Badge>
      )}
      
      {filters.session !== "all" && (
        <Badge variant="secondary" className="gap-1">
          Session: {filters.session}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onFilterChange({ session: "all" })}
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
