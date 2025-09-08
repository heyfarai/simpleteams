"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TeamFilters } from "@/components/teams/team-filters";
import { TeamGridView } from "@/components/teams/team-grid-view";
import { TeamStandingsView } from "@/components/teams/team-standings-view";
import { ActiveFilterBadges } from "@/components/teams/active-filter-badges";
import { ViewModeToggle } from "@/components/teams/view-mode-toggle";
import { ViewMode } from "@/lib/types/teams";
import { useTeamData } from "@/hooks/use-team-data";
import { useTeamFilters } from "@/hooks/use-team-filters";

export function TeamsDirectory() {
  const [currentSeasonId, setCurrentSeasonId] = useState<string>("");
  const { teams, filterOptions, isLoading, error } = useTeamData(currentSeasonId);
  const { filters, filteredTeams, handleFilterChange, getStandingsData } = useTeamFilters(teams, filterOptions);

  // Update season when filter changes
  useEffect(() => {
    if (filters.seasonId !== currentSeasonId) {
      setCurrentSeasonId(filters.seasonId);
    }
  }, [filters.seasonId, currentSeasonId]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("standings");
  const [playoffCutoff] = useState(4);

  if (isLoading) {
    return <div className="text-center py-8">Loading teams...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="flex gap-6">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 shrink-0 mt-14">
        <TeamFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          years={filterOptions.years}
          seasons={filterOptions.seasons as any}
          awards={filterOptions.awards}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full"
          >
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <TeamFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            years={filterOptions.years}
            seasons={filterOptions.seasons as any}
            awards={filterOptions.awards}
            isMobile
            onClose={() => setShowMobileFilters(false)}
          />
        )}

        {/* View Mode Toggle */}
        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Active Filters */}
        <ActiveFilterBadges
          filters={filters}
          onFilterChange={handleFilterChange}
          seasons={filterOptions.seasons}
          divisions={filterOptions.divisions}
        />

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
            <div className="text-muted-foreground mb-2">No teams found</div>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
