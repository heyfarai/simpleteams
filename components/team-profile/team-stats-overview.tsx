"use client";

import { Card, CardContent } from "@/components/ui/card";

interface TeamStats {
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  gamesPlayed: number;
}

interface TeamStatsOverviewProps {
  stats?: TeamStats;
  totalPlayers: number;
}

export function TeamStatsOverview({ stats, totalPlayers }: TeamStatsOverviewProps) {
  const winRate = stats && stats.gamesPlayed > 0 
    ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1)
    : '0.0';
  
  const ppg = stats && stats.gamesPlayed > 0 
    ? (stats.pointsFor / stats.gamesPlayed).toFixed(1)
    : '0.0';
  
  const oppPpg = stats && stats.gamesPlayed > 0 
    ? (stats.pointsAgainst / stats.gamesPlayed).toFixed(1)
    : '0.0';

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats?.wins || 0}
          </div>
          <div className="text-sm text-muted-foreground">Wins</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {stats?.losses || 0}
          </div>
          <div className="text-sm text-muted-foreground">Losses</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {winRate}%
          </div>
          <div className="text-sm text-muted-foreground">Win Rate</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {ppg}
          </div>
          <div className="text-sm text-muted-foreground">PPG</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {oppPpg}
          </div>
          <div className="text-sm text-muted-foreground">OPP PPG</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {totalPlayers}
          </div>
          <div className="text-sm text-muted-foreground">Players</div>
        </CardContent>
      </Card>
    </div>
  );
}
