"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrentUser } from "@/lib/supabase/auth";
import { TeamLogo } from "@/components/team-logo";

interface TeamData {
  id: string;
  name: string;
  sanity_team_id: string;
  logo_url?: string;
}

interface CachedTeamInfo {
  supabaseId: string;
  sanityId: string;
  name: string;
}

interface TeamSelectorProps {
  onTeamChange?: (teamId: string) => void;
}

export function TeamSelector({ onTeamChange }: TeamSelectorProps) {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserTeams = async () => {
      try {
        // Get current user
        const user = await getCurrentUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Call admin endpoint to get user teams
        const response = await fetch(`/api/admin/user-teams?userId=${user.id}`);

        if (!response.ok) {
          console.error(
            "❌ TeamSelector: Admin API error:",
            response.status,
            response.statusText
          );
          setIsLoading(false);
          return;
        }

        const result = await response.json();

        if (!result.success) {
          console.error("❌ TeamSelector: Error from admin API:", result.error);
          setIsLoading(false);
          return;
        }

        setTeams(result.teams || []);

        // Set selected team from localStorage or default to first team
        const storedTeamId = localStorage.getItem("selectedTeamId");
        const teamToSelect =
          storedTeamId &&
          result.teams?.find((t: TeamData) => t.id === storedTeamId)
            ? storedTeamId
            : result.teams?.[0]?.id || null;

        if (teamToSelect) {
          const selectedTeamData = result.teams.find(
            (t: TeamData) => t.id === teamToSelect
          );

          setSelectedTeam(teamToSelect);
          localStorage.setItem("selectedTeamId", teamToSelect);

          // Cache team info for other components
          if (selectedTeamData) {
            const teamInfo: CachedTeamInfo = {
              supabaseId: selectedTeamData.id,
              sanityId: selectedTeamData.sanity_team_id,
              name: selectedTeamData.name,
            };
            localStorage.setItem("selectedTeamInfo", JSON.stringify(teamInfo));

            // Don't auto-navigate - let the redirect page handle it
          }

          onTeamChange?.(teamToSelect);
        } else {
        }
      } catch (error) {
        console.error("❌ TeamSelector: Error loading teams:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserTeams();
  }, [onTeamChange]);

  const handleTeamChange = (teamId: string) => {
    const selectedTeamData = teams.find((t) => t.id === teamId);

    setSelectedTeam(teamId);
    localStorage.setItem("selectedTeamId", teamId);

    // Cache team info for other components
    if (selectedTeamData) {
      const teamInfo: CachedTeamInfo = {
        supabaseId: selectedTeamData.id,
        sanityId: selectedTeamData.sanity_team_id,
        name: selectedTeamData.name,
      };
      localStorage.setItem("selectedTeamInfo", JSON.stringify(teamInfo));

      // Trigger storage events to update components that use useSelectedTeam() hook
      // This applies to all dashboard pages including roster
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "selectedTeamId",
          newValue: teamId,
          oldValue: localStorage.getItem("selectedTeamId"),
        })
      );

      // Also dispatch for team info
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "selectedTeamInfo",
          newValue: JSON.stringify(teamInfo),
          oldValue: localStorage.getItem("selectedTeamInfo"),
        })
      );
    }

    onTeamChange?.(teamId);
  };

  if (isLoading) {
    return (
      <div className="px-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="px-4">
        <p className="text-sm text-gray-500">No teams found</p>
      </div>
    );
  }

  // If only one team, show team name without selector
  if (teams.length === 1) {
    const team = teams[0];
    return (
      <div className="px-4">
        <div className="flex items-center">
          <TeamLogo
            teamName={team.name}
            logoUrl={team.logo_url}
            size="sm"
            className="rounded-full"
          />
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">{team.name}</h2>
            <p className="text-sm text-gray-500">Team</p>
          </div>
        </div>
      </div>
    );
  }

  // Multiple teams - show selector
  const selectedTeamData = teams.find((t) => t.id === selectedTeam);

  return (
    <div className="px-4 w-full">
      <Select
        value={selectedTeam || ""}
        onValueChange={handleTeamChange}
      >
        <SelectTrigger className="w-full border-none shadow-none p-0 h-auto">
          <SelectValue asChild>
            <div className="flex items-center">
              <TeamLogo
                teamName={selectedTeamData?.name || "Unknown Team"}
                logoUrl={selectedTeamData?.logo_url}
                size="sm"
                className="rounded-full"
              />
              <div className="ml-3 flex-1 text-left">
                <p className="text-lg font-semibold text-gray-900">
                  {selectedTeamData?.name || "Select Team"}
                </p>
              </div>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem
              key={team.id}
              value={team.id}
            >
              <div className="flex items-center">
                <TeamLogo
                  teamName={team.name}
                  logoUrl={team.logo_url}
                  size="xs"
                  className="rounded-full mr-3"
                />
                <div>
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-gray-500">Team</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Hook to get currently selected team
export function useSelectedTeam() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedTeamId");
    setSelectedTeamId(stored);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "selectedTeamId") {
        setSelectedTeamId(e.newValue);
      }
    };

    // Listen to storage events (both real cross-window and programmatically dispatched)
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return selectedTeamId;
}

// Hook to get currently selected team info (including Sanity ID)
export function useSelectedTeamInfo(): CachedTeamInfo | null {
  const [teamInfo, setTeamInfo] = useState<CachedTeamInfo | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedTeamInfo");
    if (stored) {
      try {
        setTeamInfo(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing team info from localStorage:", error);
        setTeamInfo(null);
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "selectedTeamInfo") {
        if (e.newValue) {
          try {
            setTeamInfo(JSON.parse(e.newValue));
          } catch (error) {
            console.error("Error parsing team info from storage event:", error);
            setTeamInfo(null);
          }
        } else {
          setTeamInfo(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return teamInfo;
}
