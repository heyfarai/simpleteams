import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Play } from "lucide-react";
import Link from "next/link";
import type { Player } from "@/lib/domain/models";

interface PlayersGridProps {
  playersByTeam: Record<string, Player[]>;
  isLoading?: boolean;
}

export function PlayersGrid({ playersByTeam, isLoading }: PlayersGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-32 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(playersByTeam)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([teamName, teamPlayers]) => (
          <div key={teamName} className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold">{teamName}</h3>
              <Badge variant="secondary">{teamPlayers.length} players</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamPlayers.map((player) => (
                <Link key={player.id} href={`/players/${player.id}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        {player.photo && (
                          <img
                            src={player.photo}
                            alt={player.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{player.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            #{player.jersey} • {player.position}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {player.division}
                            </Badge>
                            {player.awards.length > 0 && (
                              <Award className="h-4 w-4 text-yellow-500" />
                            )}
                            {player.hasHighlight && (
                              <Play className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-semibold">
                            {player.stats.ppg.toFixed(1)} PPG
                          </div>
                          <div className="text-muted-foreground">
                            {player.stats.rpg.toFixed(1)} RPG
                          </div>
                          <div className="text-muted-foreground">
                            {player.stats.apg.toFixed(1)} APG
                          </div>
                        </div>
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