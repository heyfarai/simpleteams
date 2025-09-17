"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X as XIcon, Minus } from "lucide-react";
import { Team } from "@/lib/types/teams";
import { getTeamLogoUrl } from "@/lib/utils/sanity-image";

interface TeamStandingsViewProps {
  teams: Team[];
  playoffCutoff?: number;
}

interface StreakBadgeProps {
  result: "W" | "L" | "T";
}

function StreakBadge({ result }: StreakBadgeProps) {
  const bgColor =
    result === "W"
      ? "bg-green-500"
      : result === "L"
      ? "bg-red-500"
      : "bg-gray-500";
  const Icon = result === "W" ? Check : result === "L" ? XIcon : Minus;

  return (
    <div
      className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center`}
    >
      <Icon className="h-3 w-3 text-white" />
    </div>
  );
}

export function TeamStandingsView({
  teams,
  playoffCutoff = 4,
}: TeamStandingsViewProps) {
  // Calculate additional stats for each team using season-specific stats
  const teamsWithStats = teams.map((team) => {
    // Find active season roster
    const activeRoster = team.rosters?.find(
      (r) => r.season._id === team.season?._id
    );

    const stats = team.stats;
    const gamesPlayed = stats.gamesPlayed ?? 0;
    const winPercentage =
      gamesPlayed > 0 ? (stats.wins / gamesPlayed) * 100 : 0;
    const ppg = gamesPlayed > 0 ? stats.pointsFor / gamesPlayed : 0;
    const oppPpg = gamesPlayed > 0 ? stats.pointsAgainst / gamesPlayed : 0;
    const pointsDiff = ppg - oppPpg;
    // Ensure showStats is always boolean
    const showStats = Boolean(team.showStats);

    return {
      ...team,
      stats,
      winPercentage,
      ppg,
      oppPpg,
      pointsDiff,
      showStats,
    };
  });

  interface TeamWithStats extends Team {
    winPercentage: number;
    ppg: number;
    oppPpg: number;
    pointsDiff: number;
    showStats: boolean;
  }

  interface DivisionGroup {
    division: { _id: string; name: string };
    teams: TeamWithStats[];
  }

  // Create a map to track unique teams by ID
  const uniqueTeams = new Map<string, TeamWithStats>();
  teamsWithStats.forEach((team) => {
    if (!uniqueTeams.has(team.id)) {
      uniqueTeams.set(team.id, team);
    }
  });

  // Group unique teams by division
  const groupedTeams = Array.from(uniqueTeams.values()).reduce<DivisionGroup[]>(
    (acc, team) => {
      if (!team.division?._id) {
        // Handle teams without division
        const unassignedGroup = acc.find(
          (g) => g.division._id === "unassigned"
        );
        if (unassignedGroup) {
          unassignedGroup.teams.push(team);
        } else {
          acc.push({
            division: { _id: "unassigned", name: "Unassigned" },
            teams: [team],
          });
        }
        return acc;
      }

      // At this point we know team.division exists due to the earlier check
      const division = team.division!;
      const existingGroup = acc.find((g) => g.division._id === division._id);
      if (existingGroup) {
        existingGroup.teams.push(team);
      } else {
        acc.push({
          division: {
            _id: division._id,
            name: division.name,
          },
          teams: [team],
        });
      }
      return acc;
    },
    []
  );

  // Sort teams within each division by win percentage
  groupedTeams.forEach((group) => {
    group.teams.sort((a, b) => {
      // Teams with no stats go to the bottom
      if (a.winPercentage === undefined && b.winPercentage === undefined)
        return 0;
      if (a.winPercentage === undefined) return 1;
      if (b.winPercentage === undefined) return -1;
      return b.winPercentage - a.winPercentage;
    });
  });

  // Sort divisions to put unassigned last
  groupedTeams.sort((a, b) => {
    if (a.division._id === "unassigned") return 1;
    if (b.division._id === "unassigned") return -1;
    return a.division.name.localeCompare(b.division.name);
  });

  return (
    <div className="space-y-8">
      {groupedTeams.map(({ division, teams }: DivisionGroup) => (
        <div key={division._id}>
          <h3 className="text-xl font-bold text-foreground mb-4">
            {division.name}
          </h3>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table
                  key={`${division._id}-table`}
                  className="w-full"
                >
                  <thead key={`${division._id}-thead`}>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold"></th>
                      <th className="text-left p-4 font-semibold">Team</th>
                      <th className="text-center p-4 font-semibold">W</th>
                      <th className="text-center p-4 font-semibold">L</th>
                      <th className="text-center p-4 font-semibold">Win %</th>
                      <th className="text-center p-4 font-semibold">PF</th>
                      <th className="text-center p-4 font-semibold">PA</th>
                      <th className="text-center p-4 font-semibold">Diff</th>
                    </tr>
                  </thead>
                  <tbody key={`${division._id}-tbody`}>
                    {teams.map((team: TeamWithStats, index: number) => (
                      <tr
                        key={team.id}
                        className={`border-b hover:bg-muted/30 transition-colors ${
                          index < playoffCutoff ? " dark:bg-green-950/20" : ""
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{index + 1}</span>
                            {index < playoffCutoff && (
                              <Badge
                                variant="secondary"
                                className="hidden text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              >
                                Playoff
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Link
                            href={`/teams/${team.id}`}
                            className="flex items-center gap-3 hover:text-primary transition-colors"
                          >
                            <img
                              src={getTeamLogoUrl(team.logo, "thumbnail")}
                              alt={`${team.name} logo`}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-semibold text-foreground text-sm leading-4">
                                {team.name}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="p-4 text-sm text-center font-semibold text-green-600">
                          {team.stats?.wins ?? "-"}
                        </td>
                        <td className="p-4 text-sm text-center font-semibold text-red-600">
                          {team.stats?.losses ?? "-"}
                        </td>
                        <td className="p-4 text-sm text-center font-semibold">
                          {team.winPercentage != null
                            ? `${team.winPercentage.toFixed(1)}%`
                            : "-"}
                        </td>
                        <td className="p-4 text-sm text-center">
                          {team.ppg != null ? team.ppg.toFixed(1) : "-"}
                        </td>
                        <td className="p-4 text-sm text-center">
                          {team.oppPpg != null ? team.oppPpg.toFixed(1) : "-"}
                        </td>
                        <td
                          className={`p-4 text-sm text-center font-semibold ${
                            team.pointsDiff != null
                              ? team.pointsDiff >= 0
                                ? "text-green-600"
                                : "text-red-600"
                              : ""
                          }`}
                        >
                          {team.pointsDiff != null
                            ? `${
                                team.pointsDiff > 0 ? "+" : ""
                              }${team.pointsDiff.toFixed(1)}`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
