import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Play } from "lucide-react";
import Link from "next/link";
import type { Player } from "@/lib/domain/models";

interface StatLeaderCardProps {
  player: Player;
  rank: number;
  statValue: number;
  statLabel: string;
}

export function StatLeaderCard({
  player,
  rank,
  statValue,
  statLabel,
}: StatLeaderCardProps) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-gray-400";
      case 3:
        return "bg-amber-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <Link href={`/players/${player.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-full ${getRankColor(
                rank
              )} flex items-center justify-center text-white text-sm font-bold`}
            >
              {rank}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">{player.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {player.team} • #{player.jersey}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{statValue.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">{statLabel}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex space-x-1">
                  <Badge variant="secondary" className="text-xs">
                    {player.division}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {player.position}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  {player.awards.length > 0 && (
                    <Award className="h-3 w-3 text-yellow-500" />
                  )}
                  {player.hasHighlight && (
                    <Play className="h-3 w-3 text-blue-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}