import { useState, useMemo, useEffect } from "react";
import { Team, TeamFilterState } from "@/lib/types/teams";

interface FilterOptions {
  seasons: Array<{
    _id: string;
    name: string;
    year: number;
  }>;
  years: string[];
}

export function useTeamFilters(teams: Team[], filterOptions?: FilterOptions) {
  const firstSeason = filterOptions?.seasons?.[0];
  const [filters, setFilters] = useState<TeamFilterState>({
    searchTerm: "",
    year: firstSeason?.year.toString() || "",
    seasonId: firstSeason?._id || "",
    divisionId: undefined,
    awards: [],
  });

  const handleFilterChange = (newFilters: Partial<TeamFilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };

      // If year changed, auto-select the latest season for that year
      if (newFilters.year && newFilters.year !== prev.year && filterOptions) {
        const seasonsForYear = filterOptions.seasons.filter(
          (s) => s.year.toString() === newFilters.year
        );
        if (seasonsForYear.length > 0) {
          const latestSeason = seasonsForYear.sort((a, b) =>
            b.name.localeCompare(a.name)
          )[0];
          updated.seasonId = latestSeason._id;
          updated.divisionId = undefined; // Clear division when season changes
        }
      }

      return updated;
    });
  };

  const filteredTeams = useMemo(() => {
    // Debug incoming teams
    const targetTeam = teams.find(t => t.id === '13111760-ab34-4d1e-a512-cfe0c830312e');
    if (targetTeam) {
      console.log('useTeamFilters - incoming teams:', {
        team: targetTeam,
        filters
      });
    }

    const filtered = teams.filter((team) => {
      // Match by search term
      const matchesSearch =
        !filters.searchTerm ||
        [team.name, team.region || "", team.coach || ""].some((field) =>
          field.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );

      // Match by division if selected
      const matchesDivision =
        !filters.divisionId ||
        (team.division && team.division._id === filters.divisionId);

      // Match by season - only filter if seasonId is set
      const matchesSeason =
        !filters.seasonId ||
        (team.season && team.season._id === filters.seasonId);

      // Debug season matching
      if (team.id === '13111760-ab34-4d1e-a512-cfe0c830312e') {
        console.log('Season match debug:', {
          filterSeasonId: filters.seasonId,
          teamSeason: team.season,
          teamRosters: team.rosters,
          hasActiveSeason: Boolean(team.season),
          seasonMatches: team.season?._id === filters.seasonId
        });
      }

      // Match by awards
      const matchesAwards =
        filters.awards.length === 0 ||
        filters.awards.some(
          (award) => Array.isArray(team.awards) && team.awards.includes(award)
        );

      const matches = matchesSearch && matchesDivision && matchesSeason && matchesAwards;
      
      // Debug why team might be filtered out
      if (team.id === '13111760-ab34-4d1e-a512-cfe0c830312e') {
        console.log('useTeamFilters - filter matches:', {
          matchesSearch,
          matchesDivision,
          matchesSeason,
          matchesAwards,
          seasonId: filters.seasonId,
          teamSeasonId: team.season?._id
        });
      }
      
      return matches;
    });

    // Debug filtered results
    const targetFiltered = filtered.find(t => t.id === '13111760-ab34-4d1e-a512-cfe0c830312e');
    if (targetFiltered || targetTeam) {
      console.log('useTeamFilters - after filtering:', {
        found: Boolean(targetFiltered),
        team: targetFiltered
      });
    }

    return filtered;
  }, [teams, filters]);

  const getStandingsData = useMemo(() => {
    if (!filteredTeams) return [];
    
    const teamStats = filteredTeams.map((team: Team) => {
      const stats = team.stats || {
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        gamesPlayed: 0,
        streak: [],
      };

      const gamesPlayed = stats.gamesPlayed ?? 0;
      const winPercentage = gamesPlayed > 0 ? (stats.wins / gamesPlayed) * 100 : 0;
      const ppg = gamesPlayed > 0 ? stats.pointsFor / gamesPlayed : 0;
      const oppPpg = gamesPlayed > 0 ? stats.pointsAgainst / gamesPlayed : 0;
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
      new Set(teamStats.map((team) => team.division?._id))
    ).filter((id): id is string => id !== undefined);

    return divisions.map((divisionId) => {
      const divisionTeams = teamStats.filter(
        (team: Team) => team.division?._id === divisionId
      );
      const divisionName =
        divisionTeams[0]?.division?.name || "Unknown Division";

      return {
        division: {
          _id: divisionId,
          name: divisionName,
        },
        teams: divisionTeams.sort((a: any, b: any) => b.winPercentage - a.winPercentage),
      };
    });
  }, [filteredTeams]);

  return {
    filters,
    filteredTeams,
    handleFilterChange,
    getStandingsData,
  };
}
