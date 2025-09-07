import { useState, useMemo } from "react";
import { Team, TeamFilterState } from "@/lib/types/teams";

export function useTeamFilters(teams: Team[]) {
  const [filters, setFilters] = useState<TeamFilterState>({
    searchTerm: "",
    division: "all",
    year: "all",
    session: "all",
    awards: [],
  });

  const handleFilterChange = (newFilters: Partial<TeamFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesSearch = filters.searchTerm
        ? team.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          (team.region?.toLowerCase() || "").includes(filters.searchTerm.toLowerCase()) ||
          team.coach.toLowerCase().includes(filters.searchTerm.toLowerCase())
        : true;
      
      const matchesDivision =
        filters.division === "all" || team.division === filters.division;
      
      const matchesYear =
        filters.year === "all" ||
        team.sessionIds.some(() => true); // Temporary pass-through until we have session data
      
      const matchesSession =
        filters.session === "all" ||
        team.sessionIds.some(() => true); // Temporary pass-through until we have session data
      
      const matchesAwards =
        filters.awards.length === 0 ||
        filters.awards.some((award) => team.awards.includes(award));

      return (
        matchesSearch &&
        matchesDivision &&
        matchesYear &&
        matchesSession &&
        matchesAwards
      );
    });
  }, [teams, filters]);

  const getStandingsData = useMemo(() => {
    const teamStats = filteredTeams.map((team) => {
      const stats = team.stats || {
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        gamesPlayed: 0,
        streak: [],
      };

      const winPercentage =
        stats.gamesPlayed > 0 ? (stats.wins / stats.gamesPlayed) * 100 : 0;
      const ppg =
        stats.gamesPlayed > 0 ? stats.pointsFor / stats.gamesPlayed : 0;
      const oppPpg =
        stats.gamesPlayed > 0 ? stats.pointsAgainst / stats.gamesPlayed : 0;
      const pointsDiff = ppg - oppPpg;

      return {
        ...team,
        winPercentage,
        ppg,
        oppPpg,
        pointsDiff,
        stats,
      };
    });

    // Group by division and sort by win percentage
    const divisions = Array.from(
      new Set(teamStats.map((team) => team.division))
    );
    return divisions.map((division) => ({
      division,
      teams: teamStats
        .filter((team) => team.division === division)
        .sort((a, b) => b.winPercentage - a.winPercentage),
    }));
  }, [filteredTeams]);

  return {
    filters,
    filteredTeams,
    handleFilterChange,
    getStandingsData,
  };
}
