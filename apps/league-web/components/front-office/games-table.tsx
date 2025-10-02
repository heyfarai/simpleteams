"use client";

import { useState } from "react";
import { useGames } from "@/hooks/use-games";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatGameDate, formatGameTime } from "@/lib/utils/date";
import { cn } from "@/lib/utils";
import type { Game } from "@/lib/domain/models";

interface GamesTableProps {
  onGameSelect: (game: Game) => void;
  selectedGameId?: string;
}

const seasons = [
  { id: "all", name: "All Seasons" },
  { id: "1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3", name: "2024-25 Season" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge variant="secondary">Completed</Badge>;
    case "in_progress":
      return <Badge variant="default">In Progress</Badge>;
    case "upcoming":
      return <Badge variant="outline">Upcoming</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export function GamesTable({ onGameSelect, selectedGameId }: GamesTableProps) {
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [showArchived, setShowArchived] = useState(false);

  const {
    data: gamesData,
    isLoading,
    isError,
    error,
  } = useGames({
    season: selectedSeason === "all" ? undefined : selectedSeason,
    pageSize: 100, // Get more games for the admin interface
    includeArchived: showArchived,
  });

  const games = gamesData?.games || [];

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">
          Error loading games:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Season Filter */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Season:</label>
          <Select
            value={selectedSeason}
            onValueChange={setSelectedSeason}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem
                  key={season.id}
                  value={season.id}
                >
                  {season.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showArchived"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <label
              htmlFor="showArchived"
              className="text-sm font-medium"
            >
              Show archived games
            </label>
          </div>

          <div className="text-sm text-muted-foreground">
            {games.length} game{games.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="text-sm text-muted-foreground">
              Loading games...
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Home Team</TableHead>
              <TableHead>Away Team</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8"
                >
                  No games found
                </TableCell>
              </TableRow>
            ) : (
              games.map((game) => (
                <TableRow
                  key={game.id}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedGameId === game.id && "bg-blue-50 border-blue-200"
                  )}
                  onClick={() => onGameSelect(game)}
                >
                  <TableCell className="font-medium">
                    {formatGameDate(game.date)}
                  </TableCell>
                  <TableCell>{formatGameTime(game.time)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {game.homeTeam.logo && (
                        <img
                          src={game.homeTeam.logoUrl || game.homeTeam.logo}
                          alt=""
                          className="w-4 h-4 object-contain"
                        />
                      )}
                      <span className="truncate">
                        {game.homeTeam.shortName || game.homeTeam.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {game.awayTeam.logo && (
                        <img
                          src={game.awayTeam.logoUrl || game.awayTeam.logo}
                          alt=""
                          className="w-4 h-4 object-contain"
                        />
                      )}
                      <span className="truncate">
                        {game.awayTeam.shortName || game.awayTeam.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="truncate">
                    {game.venue?.name || "TBD"}
                  </TableCell>
                  <TableCell>{getStatusBadge(game.status)}</TableCell>
                  <TableCell>
                    {game.homeScore !== undefined &&
                    game.awayScore !== undefined ? (
                      <span className="font-mono">
                        {game.homeScore} - {game.awayScore}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
