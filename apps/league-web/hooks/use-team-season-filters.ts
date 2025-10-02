import { useState, useMemo, useEffect } from "react";
import { Season } from "@/lib/utils/season-filters";

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
        year: `${roster.season.year}-${(roster.season.year + 1).toString().slice(2)}`,
        startDate: new Date(roster.season.year, 8, 1), // Season starts Sept 1
        endDate: new Date(roster.season.year + 1, 7, 31), // Ends Aug 31
        isActive: true // We'll assume all seasons are active for now
      } as Season))
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
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
