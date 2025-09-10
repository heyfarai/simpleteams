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
  seasonStats?: {
    wins?: number;
    losses?: number;
    ties?: number;
    pointsFor?: number;
    pointsAgainst?: number;
  };
}

interface Team {
  rosters?: TeamRoster[];
}

export function useTeamSeasonFilters(team: Team | undefined) {
  const [selectedSeason, setSelectedSeason] = useState("");

  // Set default season when team data loads
  useEffect(() => {
    if (team?.rosters?.length && !selectedSeason) {
      // Sort rosters by year and name descending to get latest
      const sortedRosters = [...team.rosters].sort((a, b) => {
        const yearDiff = b.season.year - a.season.year;
        return yearDiff !== 0 ? yearDiff : b.season.name.localeCompare(a.season.name);
      });
      setSelectedSeason(sortedRosters[0].season._id);
    }
  }, [team?.rosters, selectedSeason]);

  const availableSeasons = useMemo(() => {
    if (!team?.rosters) return [];
    return team.rosters
      .map(roster => ({
        id: roster.season._id,
        name: `${roster.season.name} ${roster.season.year}`,
        year: roster.season.year
      }))
      .sort((a, b) => {
        const yearDiff = b.year - a.year;
        return yearDiff !== 0 ? yearDiff : b.name.localeCompare(a.name);
      });
  }, [team?.rosters]);

  const currentRoster = useMemo(() => {
    if (!team?.rosters || !selectedSeason) return null;
    return team.rosters.find(r => r.season._id === selectedSeason) || null;
  }, [team?.rosters, selectedSeason]);

  return {
    selectedSeason,
    availableSeasons,
    currentRoster,
    setSelectedSeason,
  };
}
