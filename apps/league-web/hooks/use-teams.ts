import { useQuery } from "@tanstack/react-query";
import { teamService } from "@/lib/services";
import type { Team } from "@/lib/domain/models";

export function useTeams() {
  const { data: teams = [], isLoading, error } = useQuery({
    queryKey: ["teams"],
    queryFn: () => teamService.getAllTeams(),
  });

  return {
    teams,
    isLoading,
    error,
  };
}

export function useTeam(id: string) {
  const { data: team, isLoading, error } = useQuery({
    queryKey: ["team", id],
    queryFn: () => teamService.getTeam(id),
    enabled: !!id,
  });

  return {
    team,
    isLoading,
    error,
  };
}

export function useTeamsBySeason(seasonId: string) {
  const { data: teams = [], isLoading, error } = useQuery({
    queryKey: ["teams", "season", seasonId],
    queryFn: () => teamService.getTeamsBySeason(seasonId),
    enabled: !!seasonId,
  });

  return {
    teams,
    isLoading,
    error,
  };
}

export function useTeamsWithRosters(seasonId?: string) {
  const { data: teams = [], isLoading, error } = useQuery({
    queryKey: ["teams", "rosters", seasonId],
    queryFn: () => teamService.getTeamsWithRosters(seasonId),
  });

  return {
    teams,
    isLoading,
    error,
  };
}

export function useTeamStandings(seasonId?: string) {
  const { data: standings = [], isLoading, error } = useQuery({
    queryKey: ["teams", "standings", seasonId],
    queryFn: () => teamService.getTeamStandings(seasonId),
  });

  return {
    standings,
    isLoading,
    error,
  };
}

export function useActiveTeams() {
  const { data: teams = [], isLoading, error } = useQuery({
    queryKey: ["teams", "active"],
    queryFn: () => teamService.getActiveTeams(),
  });

  return {
    teams,
    isLoading,
    error,
  };
}