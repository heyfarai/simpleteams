import { useState, useEffect } from "react";
import { fetchTeams, fetchTeamFilters } from "@/lib/data/fetch-teams";
import { Team } from "@/lib/types/teams";
import { sampleTeams } from "@/lib/data/teams";

interface Season {
  _id: string;
  name: string;
  year: number;
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

function transformTeam(team: any): Team {
  return {
    id: team._id,
    name: team.name,
    logo: team.logo,
    division: team.division ? {
      _id: team.division._id,
      name: team.division.name
    } : undefined,
    season: team.season ? {
      _id: team.season._id,
      name: team.season.name,
      year: team.season.year
    } : undefined,
    coach: team.coach || 'TBA',
    region: team.region || "Unknown Region",
    description: team.description,
    homeVenue: team.homeVenue,
    awards: team.awards || [],
    stats: team.stats || {
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      gamesPlayed: 0
    },
    record: team.record,
  };
}

export function useTeamData() {
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
          fetchTeams(),
          fetchTeamFilters(),
        ]);
        const transformedTeams = (teamsData.length > 0 ? teamsData : sampleTeams)
          .map(transformTeam);
        setTeams(transformedTeams);
        setFilterOptions({
          divisions: filtersData.divisions || [],
          seasons: filtersData.seasons || [],
          years: Array.from(new Set(filtersData.seasons?.map((s: Season) => s.year.toString()) || [])),
          awards: Array.from(new Set((filtersData.awards || []) as string[])),
        });
      } catch (err) {
        console.error('Error loading teams:', err);
        setError('Failed to load teams data');
        setTeams(sampleTeams.map(transformTeam));
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return {
    teams,
    filterOptions,
    isLoading,
    error,
  };
}
