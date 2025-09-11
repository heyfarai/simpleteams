import { useState, useEffect } from "react";
import { fetchTeams, fetchTeamFilters } from "@/lib/data/fetch-teams";
import { Team } from "@/lib/types/teams";
import { sampleTeams } from "@/lib/data/teams";

interface Season {
  _id: string;
  name: string;
  year: number;
  isActive: boolean;
  activeDivisions: Array<{
    division: { _ref: string };
    status: string;
  }>;
}

interface Division {
  _id: string;
  name: string;
  season: { _ref: string };
}

type FilterOptions = {
  divisions: Division[];
  seasons: Season[];
  years: string[];
  awards: string[];
};

function transformTeam(team: any, seasonId?: string): Team {
  // Debug team data transformation
  if (team._id === '13111760-ab34-4d1e-a512-cfe0c830312e') {
    const activeRoster = team.rosters?.find((r: any) => seasonId ? r.season._id === seasonId : true);
    console.log('transformTeam debug:', {
      teamId: team._id,
      seasonId,
      activeRoster,
      foundSeason: activeRoster?.season
    });
  }
  return {
    id: team._id,
    name: team.name,
    logo: team.logo,
    division: team.division
      ? {
          _id: team.division._id,
          name: team.division.name,
        }
      : undefined,
    season: team.rosters?.find((r: { season: { _id: string } }) => seasonId ? r.season._id === seasonId : true)?.season ?? undefined,
    coach: team.coach || "TBA",
    region: team.region || "Unknown Region",
    description: team.description,
    homeVenue: team.homeVenue,
    awards: team.awards || [],
    stats: team.stats || {
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      gamesPlayed: 0,
    },
    record: team.record,
    rosters: team.rosters || [], // Preserve rosters
    showStats: team.showStats || false, // Preserve showStats
  };
}

export function useTeamData(seasonId?: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    divisions: [],
    seasons: [],
    years: [],
    awards: [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [teamsData, filtersData] = await Promise.all([
          fetchTeams(seasonId),
          fetchTeamFilters(),
        ]);
        // Debug raw data
        const targetTeam = teamsData.find((t) => t.id === '13111760-ab34-4d1e-a512-cfe0c830312e');
        if (targetTeam) {
          console.log('useTeamData - before transform:', {
            team: targetTeam
          });
        }

        // Debug seasonId
        console.log('useTeamData - seasonId:', { seasonId });
        
        const transformedTeams = (
          teamsData.length > 0 ? teamsData : sampleTeams
        ).map((team: any) => {
          const transformed = transformTeam(team, seasonId);
          if (team._id === '13111760-ab34-4d1e-a512-cfe0c830312e') {
            console.log('useTeamData - after transform:', {
              teamId: team._id,
              seasonId,
              transformed
            });
          }
          return transformed;
        });
        // Remove duplicate debug logging since we have it in the map above
        setTeams(transformedTeams);
        setFilterOptions({
          divisions: filtersData.divisions || [],
          seasons: filtersData.seasons || [],
          years: Array.from(
            new Set(
              filtersData.seasons?.map((s: Season) => s.year.toString()) || []
            )
          ),
          awards: Array.from(new Set((filtersData.awards || []) as string[])),
        });
      } catch (err) {
        console.error("Error loading teams:", err);
        setError("Failed to load teams data");
        setTeams(sampleTeams.map((team: any) => transformTeam(team, seasonId)));
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [seasonId]);

  return {
    teams,
    filterOptions,
    isLoading,
    error,
  };
}
