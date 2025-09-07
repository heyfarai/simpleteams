import { useState, useEffect } from "react";
import { fetchTeams, fetchTeamFilters } from "@/lib/data/fetch-teams";
import { Team } from "@/lib/types/teams";
import { sampleTeams } from "@/lib/data/teams";

type FilterOptions = {
  divisions: string[];
  years: string[];
  sessions: string[];
  awards: string[];
};

function transformTeam(team: any): Team {
  return {
    id: team.id,
    name: team.name,
    logo: team.logo,
    division: team.division,
    coach: team.coach,
    region: team.region || "Unknown Region",
    description: team.description,
    homeVenue: team.homeVenue,
    awards: team.awards || [],
    sessionIds: team.sessionIds || [],
    stats: team.stats || {
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      gamesPlayed: 0,
      streak: [],
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
    years: [],
    sessions: [],
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
          divisions: (filtersData.divisions || []) as string[],
          years: (filtersData.years || []) as string[],
          sessions: (filtersData.sessions || []) as string[],
          awards: (filtersData.awards || []) as string[],
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
