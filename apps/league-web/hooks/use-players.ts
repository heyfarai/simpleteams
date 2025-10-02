import { useQuery } from "@tanstack/react-query";
import { playerService } from "@/lib/services";
import type { StatCategory } from "@/lib/domain/models";

export function usePlayers() {
  const { data: players = [], isLoading, error } = useQuery({
    queryKey: ["players"],
    queryFn: () => playerService.getAllPlayers(),
  });

  return {
    players,
    isLoading,
    error,
  };
}

export function usePlayer(id: string) {
  const { data: player, isLoading, error } = useQuery({
    queryKey: ["player", id],
    queryFn: () => playerService.getPlayer(id),
    enabled: !!id,
  });

  return {
    player,
    isLoading,
    error,
  };
}

export function usePlayersBySeason(seasonId?: string) {
  const { data: players = [], isLoading, error } = useQuery({
    queryKey: ["players", "season", seasonId],
    queryFn: () => playerService.getPlayersBySeason(seasonId),
  });

  return {
    players,
    isLoading,
    error,
  };
}

export function usePlayersByTeam(teamId: string) {
  const { data: players = [], isLoading, error } = useQuery({
    queryKey: ["players", "team", teamId],
    queryFn: () => playerService.getPlayersByTeam(teamId),
    enabled: !!teamId,
  });

  return {
    players,
    isLoading,
    error,
  };
}

export function useStatLeaders(seasonId?: string) {
  const { data: leaders = [], isLoading, error } = useQuery({
    queryKey: ["players", "leaders", seasonId],
    queryFn: () => playerService.getStatLeaders(seasonId),
  });

  return {
    leaders,
    isLoading,
    error,
  };
}

export function useLeadersByCategory(category: StatCategory, seasonId?: string) {
  const { data: leaders = [], isLoading, error } = useQuery({
    queryKey: ["players", "leaders", category, seasonId],
    queryFn: () => playerService.getLeadersByCategory(category, seasonId),
  });

  return {
    leaders,
    isLoading,
    error,
  };
}

export function useFeaturedPlayers(count: number = 4) {
  const { data: players = [], isLoading, error } = useQuery({
    queryKey: ["players", "featured", count],
    queryFn: () => playerService.getFeaturedPlayers(count),
  });

  return {
    players,
    isLoading,
    error,
  };
}

export function useTopPerformers(category: StatCategory, limit: number = 5) {
  const { data: players = [], isLoading, error } = useQuery({
    queryKey: ["players", "top", category, limit],
    queryFn: () => playerService.getTopPerformers(category, limit),
  });

  return {
    players,
    isLoading,
    error,
  };
}

export function usePlayersWithHighlights() {
  const { data: players = [], isLoading, error } = useQuery({
    queryKey: ["players", "highlights"],
    queryFn: () => playerService.getPlayersWithHighlights(),
  });

  return {
    players,
    isLoading,
    error,
  };
}

export function useAwardWinners() {
  const { data: players = [], isLoading, error } = useQuery({
    queryKey: ["players", "awards"],
    queryFn: () => playerService.getAwardWinners(),
  });

  return {
    players,
    isLoading,
    error,
  };
}