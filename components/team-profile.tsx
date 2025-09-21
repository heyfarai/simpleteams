"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTeamDetails } from "@/lib/data/fetch-teams";
import { useFavoriteTeam } from "@/hooks/use-favorite-team";
import { useTeamSeasonFilters } from "@/hooks/use-team-season-filters";
import { Season } from "@/lib/utils/season-filters";

import { TeamHeader } from "./team-profile/team-header";
import { SeasonFilters } from "./team-profile/season-filters";
import { TeamStatsOverview } from "./team-profile/team-stats-overview";
import { TeamRoster } from "./team-profile/team-roster";

interface TeamProfileProps {
  teamId: string;
}

export function TeamProfile({ teamId }: TeamProfileProps) {
  const { isFollowing, toggleFollow } = useFavoriteTeam(teamId);

  const {
    data: team,
    isLoading,
    error,
  } = useQuery({
    enabled: !!teamId,
    queryKey: ["team", teamId],
    queryFn: () => fetchTeamDetails(teamId),
  });

  const { selectedSeason, availableSeasons, currentRoster, setSelectedSeason } =
    useTeamSeasonFilters(team);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-48">
        <div className="text-center py-8">Loading team data...</div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="container mx-auto px-4 py-8 mt-48">
        <div className="text-center py-8 text-red-500">
          {error ? "Error loading team data" : "Team not found"}
        </div>
      </div>
    );
  }

  const hasRosters = team.rosters?.length > 0;
  const currentSeasonName =
    availableSeasons.find((s) => s.id === selectedSeason)?.name || "";

  return (
    <div className="container mx-auto px-4 py-8 mt-16 md:mt-24">
      {/* Team Header */}
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <TeamHeader team={team} />
        </div>

        {/* Team Stats Overview */}
        <TeamStatsOverview seasonStats={currentRoster?.seasonStats} />
      </div>

      <div className="space-y-8">
        {/* Roster Section - only show if team has rosters */}
        {hasRosters && currentRoster ? (
          <TeamRoster
            players={currentRoster.players || null}
            seasonName={currentSeasonName}
            year={currentRoster.season.year.toString()}
          />
        ) : null}

        {/* No roster message */}
        {!hasRosters && (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">No Roster Data</h3>
            <p className="text-muted-foreground">
              This team doesn't have any roster information yet.
            </p>
          </div>
        )}

        {/* Placeholder sections for future features */}
        <div className="hidden lg:grid-cols-2 gap-6">
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Schedule</h3>
            <p className="text-muted-foreground">Coming soon</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Game Results</h3>
            <p className="text-muted-foreground">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
