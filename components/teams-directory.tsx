"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TeamFilters } from "./teams/team-filters";
import { ViewModeToggle } from "./teams/view-mode-toggle";
import { TeamGridView } from "./teams/team-grid-view";
import { TeamStandingsView } from "./teams/team-standings-view";
import { ActiveFilterBadges } from "./teams/active-filter-badges";
import { SeasonTabs } from "./filters/season-tabs";
import { ViewMode } from "@/lib/types/teams";
import { useTeamData } from "@/hooks/use-team-data";
import { useTeamFilters } from "@/hooks/use-team-filters";
import { Season as UISeasonType } from "@/lib/utils/season-filters";
import { useQuery } from "@tanstack/react-query";
import { fetchFilterData } from "@/lib/data/fetch-filters";
import type { FilterOptions } from "@/lib/sanity/types";

export function TeamsDirectory() {
  const { teams, isLoading: teamsLoading, error: teamsError } = useTeamData();
  const { data: filterOptions, isLoading: filtersLoading } =
    useQuery<FilterOptions>({
      queryKey: ["filter-options"],
      queryFn: () => fetchFilterData(),
    });

  const { filters, filteredTeams, handleFilterChange, getStandingsData } =
    useTeamFilters(teams, filterOptions);

  // Update currentSeasonId when filter changes
  const [currentSeasonId, setCurrentSeasonId] = useState<string>(
    filters.seasonId
  );
  useEffect(() => {
    if (filters.seasonId !== currentSeasonId) {
      setCurrentSeasonId(filters.seasonId);
    }
  }, [filters.seasonId, currentSeasonId]);
  const [viewMode, setViewMode] = useState<ViewMode>("standings");
  const [playoffCutoff] = useState(4);

  if (teamsLoading || filtersLoading) {
    return <div className="text-center py-8">Loading teams...</div>;
  }

  if (teamsError) {
    return <div className="text-center py-8 text-red-500">{teamsError}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <SeasonTabs
          seasons={
            (filterOptions?.seasons || []).map(
              (season): UISeasonType => ({
                id: season._id,
                name: season.name,
                year: `${season.year}-${(season.year + 1).toString().slice(2)}`,
                startDate: new Date(season.year, 8, 1),
                endDate: new Date(season.year + 1, 7, 31),
                isActive: Boolean(season.isActive),
              })
            ) || []
          }
          selectedSeason={
            filters.seasonId ||
            filterOptions?.seasons?.filter((s) => Boolean(s.isActive))?.[0]
              ?._id ||
            ""
          }
          onSeasonChange={(seasonId: string) => {
            handleFilterChange({
              seasonId,
              divisionId: undefined,
              awards: [],
              searchTerm: "",
            });
          }}
        />
        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Main Content */}
      {viewMode === "grid" ? (
        <TeamGridView teams={filteredTeams} />
      ) : (
        <TeamStandingsView
          teams={filteredTeams}
          playoffCutoff={playoffCutoff}
        />
      )}

      {/* No Results */}
      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <p>No teams found</p>
          <div className="text-muted-foreground mb-2">No teams found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
}
