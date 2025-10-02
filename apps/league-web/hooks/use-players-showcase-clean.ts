import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { playerService } from "@/lib/services/player-service";
import type { StatCategory } from "@/lib/repositories/player-repository";

// Clean hook with no database coupling
export function usePlayersShowcase() {
  const [activeTab, setActiveTab] = useState<string>("leaders");
  const [selectedSeason, setSelectedSeason] = useState<string>("");

  // All data fetching through service layer
  const { data: allPlayers = [], isLoading: playersLoading } = useQuery({
    queryKey: ["players", "all"],
    queryFn: () => playerService.getAllPlayers(),
  });

  const { data: seasonPlayers = [], isLoading: seasonLoading } = useQuery({
    queryKey: ["players", "season", selectedSeason],
    queryFn: () => playerService.getPlayersBySeason(selectedSeason),
    enabled: !!selectedSeason,
  });

  const { data: playersByTeam = {}, isLoading: teamLoading } = useQuery({
    queryKey: ["players", "by-team", selectedSeason],
    queryFn: () => playerService.getPlayersByTeam(selectedSeason),
  });

  // Stat leaders
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

  const players = selectedSeason ? seasonPlayers : allPlayers;
  const isLoading = playersLoading || seasonLoading || teamLoading;

  return {
    // State
    activeTab,
    setActiveTab,
    selectedSeason,
    setSelectedSeason,

    // Data
    players,
    playersByTeam,
    getLeadersByCategory,

    // Loading
    isLoading,
  };
}