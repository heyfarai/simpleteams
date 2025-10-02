"use client";

import { Card, CardContent } from "@/components/ui/card";

interface SeasonStats {
  wins?: number;
  losses?: number;
  pointsFor?: number;
  pointsAgainst?: number;
  ties?: number;
}

interface TeamStatsOverviewProps {
  seasonStats?: SeasonStats;
}

export function TeamStatsOverview({ seasonStats }: TeamStatsOverviewProps) {
  const gamesPlayed =
    (seasonStats?.wins ?? 0) +
    (seasonStats?.losses ?? 0) +
    (seasonStats?.ties ?? 0);

  const winRate =
    gamesPlayed > 0
      ? (((seasonStats?.wins ?? 0) / gamesPlayed) * 100).toFixed(1)
      : "0.0";

  const ppg =
    gamesPlayed > 0
      ? ((seasonStats?.pointsFor ?? 0) / gamesPlayed).toFixed(1)
      : "0.0";

  const oppPpg =
    gamesPlayed > 0
      ? ((seasonStats?.pointsAgainst ?? 0) / gamesPlayed).toFixed(1)
      : "0.0";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {seasonStats?.wins ?? 0}
          </div>
          <div className="text-sm text-muted-foreground">Wins</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {seasonStats?.losses ?? 0}
          </div>
          <div className="text-sm text-muted-foreground">Losses</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {seasonStats?.ties ?? 0}
          </div>
          <div className="text-sm text-muted-foreground">Ties</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{winRate}%</div>
          <div className="text-sm text-muted-foreground">Win Rate</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{ppg}</div>
          <div className="text-sm text-muted-foreground">PF</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{oppPpg}</div>
          <div className="text-sm text-muted-foreground">PA</div>
        </CardContent>
      </Card>
    </div>
  );
}
