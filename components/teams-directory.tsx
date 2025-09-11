"use client";

import { useState, useEffect } from "react";
import { ViewModeToggle } from "./teams/view-mode-toggle";
import { TeamGridView } from "./teams/team-grid-view";
import { TeamStandingsView } from "./teams/team-standings-view";
import { SeasonTabs } from "./filters/season-tabs";
import { ViewMode, Team } from "@/lib/types/teams";
import { fetchTeams, fetchTeamFilters } from "@/lib/data/fetch-teams";
import type { SanitySeason } from "@/lib/sanity/types";
import type { Season as UISeasonType } from "@/lib/utils/season-filters";

export function TeamsDirectory() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<SanitySeason[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState(
    "1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3"
  );

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [seasonTeams, filterData] = await Promise.all([
          fetchTeams(selectedSeasonId),
          fetchTeamFilters(),
        ]);
        setTeams(seasonTeams);
        setSeasons(filterData.seasons);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load teams data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedSeasonId]);

  const [viewMode, setViewMode] = useState<ViewMode>("standings");
  const [playoffCutoff] = useState(4);

  // Transform seasons for UI
  const availableSeasons: UISeasonType[] = (seasons || [])
    .filter((season) => season._id === "1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3")
    .map(
      (season): UISeasonType => ({
        id: season._id,
        name: season.name,
        year: `${season.year}-${(season.year + 1).toString().slice(2)}`,
        startDate: new Date(season.year, 8, 1),
        endDate: new Date(season.year + 1, 7, 31),
        isActive: Boolean(season.isActive),
        status: season.status,
      })
    );

  // Get selected season or fallback to active season
  const selectedSeason =
    selectedSeasonId || seasons?.find((s) => Boolean(s.isActive))?._id || "";

  const handleSeasonChange = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading teams...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <SeasonTabs
          seasons={availableSeasons}
          selectedSeason={selectedSeason}
          onSeasonChange={handleSeasonChange}
        />
        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Main Content */}
      {viewMode === "grid" ? (
        <TeamGridView teams={teams} />
      ) : (
        <TeamStandingsView
          teams={teams}
          playoffCutoff={playoffCutoff}
        />
      )}

      {/* No Results */}
      {teams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">No teams found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
}
