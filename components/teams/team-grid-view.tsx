"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { Team } from "@/lib/types/teams";
import { getTeamLogoUrl } from "@/lib/utils/sanity-image";

interface TeamGridViewProps {
  teams: Team[];
}

export function TeamGridView({ teams }: TeamGridViewProps) {
  // Group teams by division
  const teamsByDivision = teams.reduce((acc, team) => {
    const divisionName = team.division?.name || "Unassigned";
    if (!acc[divisionName]) {
      acc[divisionName] = [];
    }
    acc[divisionName].push(team);
    return acc;
  }, {} as Record<string, Team[]>);

  // Sort divisions and teams within divisions
  const sortedDivisions = Object.entries(teamsByDivision)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([division, divisionTeams]) => ({
      name: division,
      teams: divisionTeams.sort((a, b) => a.name.localeCompare(b.name)),
    }));

  return (
    <div className="space-y-8">
      {sortedDivisions.map(({ name, teams: divisionTeams }) => (
        <div
          key={name}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-foreground">{name}</h2>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {divisionTeams.length} teams
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {divisionTeams.map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
              >
                <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Team Logo */}
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        <img
                          src={getTeamLogoUrl(team.logo, 'small')}
                          alt={`${team.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                          {team.name}
                        </h3>
                        {team.division && (
                          <Badge
                            variant="secondary"
                            className="mb-2"
                          >
                            {team.division.name}
                          </Badge>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {team.region}
                        </p>
                      </div>
                    </div>

                    {/* Team Awards */}
                    {team.awards.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {team.awards.slice(0, 2).map((award: string) => (
                            <Badge
                              key={award}
                              variant="outline"
                              className="text-xs"
                            >
                              <Trophy className="h-3 w-3 mr-1" />
                              {award}
                            </Badge>
                          ))}
                          {team.awards.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              +{team.awards.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Team Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary">
                          {team.stats?.wins || 0}-{team.stats?.losses || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Record
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">
                          {team.stats?.gamesPlayed || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Games
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">
                          {team.stats?.gamesPlayed && team.stats.gamesPlayed > 0
                            ? (
                                (team.stats.wins / team.stats.gamesPlayed) *
                                100
                              ).toFixed(0)
                            : "0"}
                          %
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Win Rate
                        </div>
                      </div>
                    </div>

                    {/* Coach Info */}
                    <div>
                      <p className="text-sm text-muted-foreground">Coach</p>
                      <p className="font-medium text-foreground">
                        {team.coach}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
