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
  const [filters, setFilters] = useState<TeamFilterState>({
    searchTerm: "",
    year: "",  // Required
    seasonId: "",  // Required
    divisionId: undefined,
    awards: [],
  });

  // Set default filters when filterOptions are available
  useEffect(() => {
    if (filterOptions && filterOptions.seasons.length > 0) {
      // Only set defaults if no filters are set at all
      if (!filters.year && !filters.seasonId && !filters.divisionId && !filters.searchTerm && filters.awards.length === 0) {
        // Find the latest year and season
        const latestYear = Math.max(...filterOptions.seasons.map(s => s.year)).toString();
        const latestSeason = filterOptions.seasons
          .filter(s => s.year.toString() === latestYear)
          .sort((a, b) => b.name.localeCompare(a.name))[0]; // Sort by name descending to get latest
        
        setFilters(prev => ({
          ...prev,
          year: latestYear,
          seasonId: latestSeason._id
        }));
      }
    }
  }, [filterOptions]);

  const handleFilterChange = (newFilters: Partial<TeamFilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      
      // If year changed, auto-select the latest season for that year
      if (newFilters.year && newFilters.year !== prev.year && filterOptions) {
        const seasonsForYear = filterOptions.seasons.filter(s => s.year.toString() === newFilters.year);
        if (seasonsForYear.length > 0) {
          const latestSeason = seasonsForYear.sort((a, b) => b.name.localeCompare(a.name))[0];
          updated.seasonId = latestSeason._id;
          updated.divisionId = undefined; // Clear division when season changes
        }
      }
      
      return updated;
    });
  };

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      // Match by search term
      const matchesSearch = !filters.searchTerm || [
        team.name,
        team.region || '',
        team.coach || ''
      ].some(field => 
        field.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
      
      // Match by division if selected
      const matchesDivision = !filters.divisionId || 
        (team.division && team.division._id === filters.divisionId);
      
      // Match by season - only filter if seasonId is set
      const matchesSeason = !filters.seasonId || 
        (team.season && team.season._id === filters.seasonId);
      
      // Match by awards
      const matchesAwards = filters.awards.length === 0 ||
        filters.awards.some((award) => 
          Array.isArray(team.awards) && team.awards.includes(award)
        );

      return (
        matchesSearch &&
        matchesDivision &&
        matchesSeason &&
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
      new Set(teamStats.map((team) => team.division?._id))
    ).filter((id): id is string => id !== undefined);

    return divisions.map((divisionId) => {
      const divisionTeams = teamStats.filter((team) => team.division?._id === divisionId);
      const divisionName = divisionTeams[0]?.division?.name || 'Unknown Division';
      
      return {
        division: {
          _id: divisionId,
          name: divisionName
        },
        teams: divisionTeams.sort((a, b) => b.winPercentage - a.winPercentage),
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
