"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ViewModeToggle } from "./teams/view-mode-toggle";
import { TeamGridView } from "./teams/team-grid-view";
import { TeamStandingsView } from "./teams/team-standings-view";
import { SeasonTabs } from "./filters/season-tabs";
import { teamService, seasonService } from "@/lib/services";
import type { Team as DomainTeam, Season } from "@/lib/domain/models";
import type { Team as UITeam } from "@/lib/types/teams";
import type { Season as UISeasonType } from "@/lib/utils/season-filters";

type ViewMode = "grid" | "standings";

// Helper function to convert domain team to UI team format
function transformTeamForUI(team: DomainTeam): UITeam {
  return {
    id: team.id,
    _id: team.id,
    name: team.name,
    shortName: team.shortName || team.name,
    logo: team.logo || "",
    coach: team.headCoach || "",
    region: team.location?.city || "Unknown",
    homeVenue: "TBA", // We don't have venue info in domain model yet
    awards: [], // We don't have awards in domain model yet
    status: team.status,
    description: "",
    rosters: [],
    stats: team.stats || {
      wins: 0,
      losses: 0,
      ties: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      gamesPlayed: 0,
    },
    showStats: Boolean(team.stats),
    division: team.division
      ? {
          _id: team.division.id,
          name: team.division.name,
          season: team.season ? { _ref: team.season.id } : undefined,
        }
      : undefined,
  };
}
import { EmptyTabRecruit } from "./teams/empty-tab-recruit";

export function TeamsDirectory() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [teams, setTeams] = useState<UITeam[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");
  const [playoffCutoff] = useState(4);

  // Get season and view mode from URL or use defaults
  const seasonFromUrl = searchParams.get("season");
  const viewModeFromUrl = searchParams.get("view") as ViewMode;
  const [viewMode, setViewMode] = useState<ViewMode>(
    viewModeFromUrl || "standings"
  );

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        // Get all seasons (including 2025-2026 for tab display)
        const allSeasons = await seasonService.getAllSeasons();
        setSeasons(allSeasons);

        // Set season from URL or first season as default
        const defaultSeasonId =
          seasonFromUrl || selectedSeasonId || allSeasons[0]?.id || "";
        if (defaultSeasonId !== selectedSeasonId) {
          setSelectedSeasonId(defaultSeasonId);
        }

        // Get teams for the selected season (only if it's not the 2025-2026 season)
        if (
          defaultSeasonId &&
          defaultSeasonId !== "01ecf97e-2b9a-49eb-a80a-3fe2be6a36ad"
        ) {
          const seasonTeams = await teamService.getTeamsBySeason(
            defaultSeasonId
          );
          // Only show active teams with divisions and transform to UI format
          const activeTeams = seasonTeams
            .filter((team) => team.status === "active" && team.division) // Filter out teams without divisions
            .map(transformTeamForUI);
          setTeams(activeTeams);
        } else if (defaultSeasonId === "01ecf97e-2b9a-49eb-a80a-3fe2be6a36ad") {
          // Clear teams for 2025-2026 season since we'll show UpcomingSeason component
          setTeams([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load teams data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedSeasonId, seasonFromUrl]);

  // Update view mode when URL changes
  useEffect(() => {
    if (viewModeFromUrl && viewModeFromUrl !== viewMode) {
      setViewMode(viewModeFromUrl);
    }
  }, [viewModeFromUrl, viewMode]);

  // Handler for view mode changes that updates URL
  const handleViewModeChange = (newViewMode: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", newViewMode);
    router.push(`?${params.toString()}`, { scroll: false });
    setViewMode(newViewMode);
  };

  // Transform seasons for UI
  const availableSeasons: UISeasonType[] = (seasons || []).map(
    (season): UISeasonType => ({
      id: season.id,
      name: season.name,
      year: `${season.year}-${(season.year + 1).toString().slice(2)}`,
      startDate: new Date(season.year, 8, 1),
      endDate: new Date(season.year + 1, 7, 31),
      isActive: true, // All seasons in this list should be displayed
      status: season.status,
    })
  );

  // Get selected season or fallback to active season
  const selectedSeason =
    selectedSeasonId || seasons?.find((s) => s.status === "active")?.id || "";

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
            onViewModeChange={handleViewModeChange}
          />
        )}
      </div>

      {/* Main Content */}
      {selectedSeasonId === "01ecf97e-2b9a-49eb-a80a-3fe2be6a36ad" ? (
        <EmptyTabRecruit />
      ) : (
        <>
          {viewMode === "grid" ? (
            <TeamGridView teams={teams} />
          ) : (
            <TeamStandingsView
              teams={teams}
              playoffCutoff={playoffCutoff}
            />
          )}

          {/* No Results for non-2025-2026 seasons - show recruitment */}
          {teams.length === 0 && <EmptyTabRecruit />}
        </>
      )}
    </div>
  );
}
