import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { playerService, filterService } from "@/lib/services";
import type { StatCategory } from "@/lib/domain/models";

// Clean hook with no database coupling - uses service layer
export function usePlayersShowcase() {
  const [activeTab, setActiveTab] = useState<string>("leaders");
  const [selectedSeason, setSelectedSeason] = useState<string>("");

  // Filter options
  const { data: filterOptions, isLoading: filtersLoading } = useQuery({
    queryKey: ["filter-options"],
    queryFn: () => filterService.getFilterOptions(),
  });

  // All players data
  const { data: allPlayers = [], isLoading: playersLoading } = useQuery({
    queryKey: ["players", "all"],
    queryFn: () => playerService.getAllPlayers(),
  });

  // Season filtered players
  const { data: seasonPlayers = [], isLoading: seasonLoading } = useQuery({
    queryKey: ["players", "season", selectedSeason],
    queryFn: () => playerService.getPlayersBySeason(selectedSeason),
    enabled: !!selectedSeason,
  });

  // Players grouped by team
  const { data: playersByTeam = {}, isLoading: teamLoading } = useQuery({
    queryKey: ["players", "by-team", selectedSeason],
    queryFn: () => playerService.getPlayersByTeamGrouped(selectedSeason),
  });

  // Stat leaders by category
  const { data: pointsLeaders = [] } = useQuery({
    queryKey: ["leaders", "ppg", selectedSeason],
    queryFn: () => playerService.getLeadersByCategory("ppg", selectedSeason),
  });

  const { data: reboundsLeaders = [] } = useQuery({
    queryKey: ["leaders", "rpg", selectedSeason],
    queryFn: () => playerService.getLeadersByCategory("rpg", selectedSeason),
  });

  const { data: assistsLeaders = [] } = useQuery({
    queryKey: ["leaders", "apg", selectedSeason],
    queryFn: () => playerService.getLeadersByCategory("apg", selectedSeason),
  });

  const { data: stealsLeaders = [] } = useQuery({
    queryKey: ["leaders", "spg", selectedSeason],
    queryFn: () => playerService.getLeadersByCategory("spg", selectedSeason),
  });

  const { data: blocksLeaders = [] } = useQuery({
    queryKey: ["leaders", "bpg", selectedSeason],
    queryFn: () => playerService.getLeadersByCategory("bpg", selectedSeason),
  });

  const { data: minutesLeaders = [] } = useQuery({
    queryKey: ["leaders", "mpg", selectedSeason],
    queryFn: () => playerService.getLeadersByCategory("mpg", selectedSeason),
  });

  const getLeadersByCategory = (category: StatCategory) => {
    switch (category) {
      case "ppg": return pointsLeaders;
      case "rpg": return reboundsLeaders;
      case "apg": return assistsLeaders;
      case "spg": return stealsLeaders;
      case "bpg": return blocksLeaders;
      case "mpg": return minutesLeaders;
      default: return [];
    }
  };

  // Transform seasons data for season selector
  const availableSeasons = (filterOptions?.seasons || [])
    .filter((season) => season.status === "active" || season.status === "completed")
    .map((season) => ({
      id: season.id,
      name: season.name,
      year: season.year,
      isActive: season.status === "active",
    }));

  const players = selectedSeason ? seasonPlayers : allPlayers;
  const filteredPlayers = players; // For backwards compatibility
  const isLoading = filtersLoading || playersLoading || seasonLoading || teamLoading;

  return {
    // State
    activeTab,
    setActiveTab,
    selectedSeason,
    setSelectedSeason,

    // Data
    players,
    filteredPlayers,
    playersByTeam,
    availableSeasons,
    getLeadersByCategory,

    // Loading states
    isLoading,
    filtersLoading,
    playersLoading,
  };
}