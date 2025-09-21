import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllPlayers,
  fetchStatLeaders,
  fetchFilterOptions,
  fetchLeadersByCategory,
  type ShowcasePlayer,
} from "@/lib/data/fetch-players";
import { type StatCategory } from "@/lib/sanity/player-queries";
import { Season } from "@/lib/utils/season-filters";

export function usePlayersShowcase() {
  const [activeTab, setActiveTab] = useState<string>("leaders");
  const [selectedSeason, setSelectedSeason] = useState<string>("");

  // Fetch filter options
  const { data: filterOptions, isLoading: filtersLoading } = useQuery({
    queryKey: ["filter-options"],
    queryFn: fetchFilterOptions,
  });

  // Fetch all players for the "All Players" tab
  const { data: allPlayersData, isLoading: playersLoading } = useQuery({
    queryKey: ["all-players"],
    queryFn: fetchAllPlayers,
  });

  // Fetch stat leaders data
  const { data: statLeadersData, isLoading: leadersLoading } = useQuery({
    queryKey: ["stat-leaders", selectedSeason],
    queryFn: () => fetchStatLeaders(selectedSeason || "all"),
  });

  const players = allPlayersData || [];
  const statLeaders = statLeadersData || [];

  // Transform seasons data for season selector
  const availableSeasons: Season[] = (filterOptions?.seasons || [])
    .filter((season) => season.status === "active" || season.status === "completed")
    .map((season) => ({
      id: season._id,
      name: season.name,
      year: season.year,
      isActive: season.status === "active",
    }));

  // Stat category queries
  const { data: pointsLeaders, isLoading: pointsLoading } = useQuery({
    queryKey: ["leaders", "ppg", selectedSeason],
    queryFn: () => fetchLeadersByCategory("ppg", selectedSeason || undefined),
  });

  const { data: reboundsLeaders, isLoading: reboundsLoading } = useQuery({
    queryKey: ["leaders", "rpg", selectedSeason],
    queryFn: () => fetchLeadersByCategory("rpg", selectedSeason || undefined),
  });

  const { data: assistsLeaders, isLoading: assistsLoading } = useQuery({
    queryKey: ["leaders", "apg", selectedSeason],
    queryFn: () => fetchLeadersByCategory("apg", selectedSeason || undefined),
  });

  const { data: stealsLeaders, isLoading: stealsLoading } = useQuery({
    queryKey: ["leaders", "spg", selectedSeason],
    queryFn: () => fetchLeadersByCategory("spg", selectedSeason || undefined),
  });

  const { data: blocksLeaders, isLoading: blocksLoading } = useQuery({
    queryKey: ["leaders", "bpg", selectedSeason],
    queryFn: () => fetchLeadersByCategory("bpg", selectedSeason || undefined),
  });

  const { data: minutesLeaders, isLoading: minutesLoading } = useQuery({
    queryKey: ["leaders", "mpg", selectedSeason],
    queryFn: () => fetchLeadersByCategory("mpg", selectedSeason || undefined),
  });

  const getLeadersByCategory = (category: StatCategory) => {
    switch (category) {
      case "ppg":
        return pointsLeaders || [];
      case "rpg":
        return reboundsLeaders || [];
      case "apg":
        return assistsLeaders || [];
      case "spg":
        return stealsLeaders || [];
      case "bpg":
        return blocksLeaders || [];
      case "mpg":
        return minutesLeaders || [];
      default:
        return [];
    }
  };

  // Filter players based on season
  const filteredPlayers = players.filter((player) => {
    if (!selectedSeason) return true;
    return player.seasonId === selectedSeason;
  });

  // Group players by team for the "All Players" view
  const playersByTeam = filteredPlayers.reduce((acc, player) => {
    const teamName = player.team;
    if (!acc[teamName]) {
      acc[teamName] = [];
    }
    acc[teamName].push(player);
    return acc;
  }, {} as Record<string, ShowcasePlayer[]>);

  const isLoading =
    filtersLoading ||
    playersLoading ||
    leadersLoading ||
    pointsLoading ||
    reboundsLoading ||
    assistsLoading ||
    stealsLoading ||
    blocksLoading ||
    minutesLoading;

  return {
    // State
    activeTab,
    setActiveTab,
    selectedSeason,
    setSelectedSeason,

    // Data
    players,
    statLeaders,
    filteredPlayers,
    playersByTeam,
    availableSeasons,
    getLeadersByCategory,

    // Loading states
    isLoading,
    filtersLoading,
    playersLoading,
    leadersLoading,
  };
}