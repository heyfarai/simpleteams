import { useState, useMemo, useEffect } from "react";

interface TeamRoster {
  season: {
    _id: string;
    name: string;
    year: number;
  };
  players: Array<{
    player: {
      _id: string;
      name: string;
    };
    jerseyNumber: number;
    position: string;
    status: 'active' | 'inactive' | 'injured';
  }>;
}

interface Team {
  rosters?: TeamRoster[];
}

export function useTeamSeasonFilters(team: Team | undefined) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");

  // Set default year and season when team data loads
  useEffect(() => {
    if (team?.rosters?.length && (!selectedYear || !selectedSeason)) {
      // Sort rosters by year descending to get latest
      const sortedRosters = [...team.rosters].sort((a, b) => b.season.year - a.season.year);
      const latestRoster = sortedRosters[0];
      
      setSelectedYear(latestRoster.season.year.toString());
      setSelectedSeason(latestRoster.season._id);
    }
  }, [team?.rosters, selectedYear, selectedSeason]);

  const availableYears = useMemo(() => {
    if (!team?.rosters) return [];
    const years = team.rosters.map(roster => roster.season.year.toString());
    return Array.from(new Set(years)).sort((a, b) => parseInt(b) - parseInt(a));
  }, [team?.rosters]);

  const filteredSeasons = useMemo(() => {
    if (!team?.rosters) return [];
    return team.rosters
      .filter(roster => roster.season.year.toString() === selectedYear)
      .map(roster => ({
        id: roster.season._id,
        name: roster.season.name,
        year: roster.season.year
      }))
      .sort((a, b) => b.name.localeCompare(a.name)); // Sort by name descending for latest first
  }, [team?.rosters, selectedYear]);

  const currentRoster = useMemo(() => {
    if (!team?.rosters || !selectedSeason) return null;
    return team.rosters.find(r => r.season._id === selectedSeason) || null;
  }, [team?.rosters, selectedSeason]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    // Auto-select latest season for the year
    const seasonsForYear = team?.rosters
      ?.filter(roster => roster.season.year.toString() === year)
      .sort((a, b) => b.season.name.localeCompare(a.season.name));
    
    if (seasonsForYear?.length) {
      setSelectedSeason(seasonsForYear[0].season._id);
    } else {
      setSelectedSeason("");
    }
  };

  return {
    selectedYear,
    selectedSeason,
    availableYears,
    filteredSeasons,
    currentRoster,
    setSelectedYear: handleYearChange,
    setSelectedSeason,
  };
}
