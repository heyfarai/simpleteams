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
import { divisions } from "./home/league-divisions/division-data";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function TeamsDirectory() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<SanitySeason[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const filterData = await fetchTeamFilters();
        setSeasons(filterData.seasons);

        // Set first season as default if no season is selected
        const defaultSeasonId =
          selectedSeasonId || filterData.seasons[0]?._id || "";
        if (!selectedSeasonId && defaultSeasonId) {
          setSelectedSeasonId(defaultSeasonId);
        }

        const seasonTeams = await fetchTeams(defaultSeasonId, true); // Only active teams
        setTeams(seasonTeams);
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
  const availableSeasons: UISeasonType[] = (seasons || []).map(
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
        {teams.length > 0 && (
          <ViewModeToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        )}
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
          {selectedSeasonId === "01ecf97e-2b9a-49eb-a80a-3fe2be6a36ad" ? (
            <div className="max-w-6xl mx-auto">
              <div className="text-muted-foreground mb-8">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to compete in the 2025-2026 season?
                </h3>
                <p className="text-lg mb-8">
                  Registration is open. Choose your division below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {divisions.map((division) => {
                  const Icon = division.icon;
                  return (
                    <div
                      key={division.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                        <h4 className="text-xl font-semibold">
                          {division.name}
                        </h4>
                        {division.isNew && (
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground mb-3">
                          Eligible categories:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {division.categories.map((category, index) => (
                            <span
                              key={index}
                              className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link href="/register">
                <Button
                  size="lg"
                  className="px-8"
                >
                  Register Your Team
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="text-muted-foreground mb-2">No teams found</div>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
