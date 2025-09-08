"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X as XIcon, Minus } from "lucide-react";
import { Team } from "@/lib/types/teams";

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

export function TeamStandingsView({ teams, playoffCutoff = 4 }: TeamStandingsViewProps) {
  // Calculate additional stats for each team
  const teamsWithStats = teams.map((team) => {
    const winPercentage =
      team.stats.gamesPlayed > 0
        ? (team.stats.wins / team.stats.gamesPlayed) * 100
        : 0;
    const ppg =
      team.stats.gamesPlayed > 0
        ? team.stats.pointsFor / team.stats.gamesPlayed
        : 0;
    const oppPpg =
      team.stats.gamesPlayed > 0
        ? team.stats.pointsAgainst / team.stats.gamesPlayed
        : 0;
    const pointsDiff = ppg - oppPpg;

    return {
      ...team,
      winPercentage,
      ppg,
      oppPpg,
      pointsDiff,
    };
  });

  interface DivisionGroup {
    division: { _id: string; name: string };
    teams: typeof teamsWithStats;
  }

  // Create a map to track unique teams by ID
  const uniqueTeams = new Map<string, typeof teamsWithStats[0]>();
  teamsWithStats.forEach(team => {
    if (!uniqueTeams.has(team.id)) {
      uniqueTeams.set(team.id, team);
    }
  });

  // Group unique teams by division
  const groupedTeams = Array.from(uniqueTeams.values()).reduce<DivisionGroup[]>((acc, team) => {
    if (!team.division?._id) {
      // Handle teams without division
      const unassignedGroup = acc.find(g => g.division._id === 'unassigned');
      if (unassignedGroup) {
        unassignedGroup.teams.push(team);
      } else {
        acc.push({
          division: { _id: 'unassigned', name: 'Unassigned' },
          teams: [team]
        });
      }
      return acc;
    }

    // At this point we know team.division exists due to the earlier check
    const division = team.division!;
    const existingGroup = acc.find(g => g.division._id === division._id);
    if (existingGroup) {
      existingGroup.teams.push(team);
    } else {
      acc.push({
        division: {
          _id: division._id,
          name: division.name
        },
        teams: [team]
      });
    }
    return acc;
  }, []);

  // Sort teams within each division by win percentage
  groupedTeams.forEach(group => {
    group.teams.sort((a, b) => b.winPercentage - a.winPercentage);
  });

  // Sort divisions to put unassigned last
  groupedTeams.sort((a, b) => {
    if (a.division._id === 'unassigned') return 1;
    if (b.division._id === 'unassigned') return -1;
    return a.division.name.localeCompare(b.division.name);
  });

  return (
    <div className="space-y-8">
      {groupedTeams.map(({ division, teams }: DivisionGroup) => (
        <div key={division._id}>
          <h3 className="text-xl font-bold text-foreground mb-4">{division.name}</h3>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table key={`${division._id}-table`} className="w-full">
                  <thead key={`${division._id}-thead`}>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Rank</th>
                      <th className="text-left p-4 font-semibold">Team</th>
                      <th className="text-center p-4 font-semibold">W</th>
                      <th className="text-center p-4 font-semibold">L</th>
                      <th className="text-center p-4 font-semibold">Win %</th>
                      <th className="text-center p-4 font-semibold">PPG</th>
                      <th className="text-center p-4 font-semibold">OPP PPG</th>
                      <th className="text-center p-4 font-semibold">Diff</th>
                      <th className="text-center p-4 font-semibold">Streak</th>
                    </tr>
                  </thead>
                  <tbody key={`${division._id}-tbody`}>
                    {teams.map((team: typeof teamsWithStats[0], index: number) => (
                      <tr
                        key={team.id}
                        className={`border-b hover:bg-muted/30 transition-colors ${
                          index < playoffCutoff
                            ? "bg-green-50 dark:bg-green-950/20"
                            : ""
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{index + 1}</span>
                            {index < playoffCutoff && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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
                              src={team.logo || "/placeholder.svg"}
                              alt={`${team.name} logo`}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-semibold text-foreground">
                                {team.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {team.coach}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="p-4 text-center font-semibold text-green-600">
                          {team.stats.wins}
                        </td>
                        <td className="p-4 text-center font-semibold text-red-600">
                          {team.stats.losses}
                        </td>
                        <td className="p-4 text-center font-semibold">
                          {team.winPercentage.toFixed(1)}%
                        </td>
                        <td className="p-4 text-center">{team.ppg.toFixed(1)}</td>
                        <td className="p-4 text-center">
                          {team.oppPpg.toFixed(1)}
                        </td>
                        <td
                          className={`p-4 text-center font-semibold ${
                            team.pointsDiff >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {team.pointsDiff >= 0 ? "+" : ""}
                          {team.pointsDiff.toFixed(1)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1">
                            {/* Streak functionality temporarily disabled for development */}
                            {/* {team.stats.streak?.map((result, i) => (
                              <StreakBadge key={i} result={result} />
                            ))} */}
                            <span className="text-xs text-muted-foreground">-</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Playoff cutoff indicator */}
              <div className="p-4 border-t bg-muted/30">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Top {playoffCutoff} teams qualify for playoffs</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded"></div>
                    <span>Playoff Position</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
