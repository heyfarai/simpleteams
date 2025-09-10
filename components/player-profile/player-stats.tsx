import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3 } from "lucide-react";
import { useState } from "react";
import { type PlayerProfile } from "@/lib/data/fetch-player-profile";

interface PlayerStatsProps {
  player: PlayerProfile;
}

export function PlayerStats({ player }: PlayerStatsProps) {
  const [selectedYear, setSelectedYear] = useState<string>("2024");

  const availableYears = player.yearlyStats
    ? [...new Set(player.yearlyStats.map((stat) => stat.year.toString()))]
    : ["2024"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Season Statistics
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Filter by Year:
          </span>
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem
                  key={year}
                  value={year}
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {player.yearlyStats && player.yearlyStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-muted">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Season
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                    GP
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                    PPG
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                    RPG
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                    APG
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                    SPG
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                    BPG
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                    MPG
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                    FG%
                  </th>
                </tr>
              </thead>
              <tbody>
                {player.yearlyStats
                  .filter(stat => stat.year.toString() === selectedYear)
                  .map((stat, index) => (
                    <tr
                      key={index}
                      className="border-b border-muted/50 hover:bg-muted/30"
                    >
                      <td className="py-3 px-2 font-medium">
                        {stat.season}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {stat.gamesPlayed || '0'}
                      </td>
                      <td className="py-3 px-2 text-center font-semibold text-primary">
                        {stat.points || '0'}
                      </td>
                      <td className="py-3 px-2 text-center font-semibold text-primary">
                        {stat.rebounds || '0'}
                      </td>
                      <td className="py-3 px-2 text-center font-semibold text-primary">
                        {stat.assists || '0'}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {stat.steals || "—"}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {stat.blocks || "—"}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {stat.minutes || "—"}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {stat.fieldGoalPercentage
                          ? `${stat.fieldGoalPercentage}%`
                          : "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No statistics available for {selectedYear}
          </div>
        )}

        {/* Session Highs */}
        {player.sessionHighs?.points && (
          <>
            <Separator className="my-6" />
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                Session/Tournament Highs
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {player.sessionHighs.points && (
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-lg font-bold text-primary">
                      {player.sessionHighs.points}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Points
                    </div>
                  </div>
                )}
                {player.sessionHighs.rebounds && (
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-lg font-bold text-primary">
                      {player.sessionHighs.rebounds}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rebounds
                    </div>
                  </div>
                )}
                {player.sessionHighs.assists && (
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-lg font-bold text-primary">
                      {player.sessionHighs.assists}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Assists
                    </div>
                  </div>
                )}
                {player.sessionHighs.steals && (
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-lg font-bold text-primary">
                      {player.sessionHighs.steals}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Steals
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
