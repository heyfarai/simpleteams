"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Plus, Trophy, Users } from "lucide-react";
import type { FilterData } from "@/lib/sanity/get-filter-data";
import { GamesList } from "./games/games-list";
import { fetchGames } from "@/lib/data/fetch-games";
import type { Game } from "@/types/schema";
import { useQuery } from "@tanstack/react-query";
import { sampleGames, sampleSessions, getSeasonById } from "@/lib/sample-data";
import { TransformedGame } from "@/lib/utils/game-filters";

interface GamesScheduleProps {
  filterData: FilterData;
}

interface Tournament {
  id: string;
  name: string;
  division: string;
  startDate: string;
  endDate: string;
  eligibility: string;
  venue: string;
  description: string;
  teams: number;
  status: "upcoming" | "registration";
  seasonName?: string;
}

export function GamesSchedule({ filterData }: GamesScheduleProps) {
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [selectedSession, setSelectedSession] = useState<string>("all");
  const [selectedSeason, setSelectedSeason] = useState<string>("all");

  // Fetch games using React Query
  const {
    data = { games: [], sessions: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["games"],
    queryFn: () => fetchGames(),
  });

  const { games, sessions } = data;

  // Utility functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading games...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">Error loading games</div>
    );
  }

  // Transform Sanity games to component format
  const transformedGames = games.map((game: Game) => {
    const session = game.session;
    return {
      id: game._id,
      sessionId: session?._id,
      sessionName: session?.name || "Regular Season",
      season: game.season,
      homeTeam: game.homeTeam?.name || "Unknown Team",
      awayTeam: game.awayTeam?.name || "Unknown Team",
      homeScore: game.score?.homeScore || null,
      awayScore: game.score?.awayScore || null,
      date: game.gameDate,
      time: game.gameTime,
      venue: game.venue || "TBD",
      venueAddress: game.venueAddress || "",
      division: "TBD",
      status: game.status,
      isTournament: session?.type === "playoff",
      tournamentName: session?.type === "playoff" ? session.name : undefined,
    };
  });

  // Apply filters to games
  const filteredGames = transformedGames.filter((game: TransformedGame) => {
    if (
      selectedSeason !== "all" &&
      game.season?.year.toString() !== selectedSeason
    ) {
      return false;
    }
    if (selectedSession !== "all") {
      if (!game.sessionId && selectedSession !== "regular") {
        return false;
      }
      if (game.sessionId && game.sessionId !== selectedSession) {
        return false;
      }
    }
    if (selectedDivision !== "all" && game.division !== selectedDivision) {
      return false;
    }
    return true;
  });

  const upcomingGames = filteredGames.filter(
    (game: TransformedGame) =>
      game.status === "scheduled" || game.status === "in-progress"
  );

  const completedGames = filteredGames.filter(
    (game: TransformedGame) => game.status === "final"
  );

  // Generate tournaments from sample data
  const tournaments: Tournament[] = sampleSessions
    .filter((session) => session.type === "playoff")
    .map((session) => {
      const season = getSeasonById(session.seasonId);
      const sessionGames = sampleGames.filter(
        (game) => game.sessionId === session.id
      );

      return {
        id: session.id,
        name: session.name,
        division: "All Divisions",
        startDate: session.startDate,
        endDate: session.endDate,
        eligibility: "Top teams from regular season",
        venue: "Multiple Venues",
        description: session.description || "Championship tournament",
        teams: sessionGames.length * 2,
        status:
          new Date(session.startDate) > new Date()
            ? "upcoming"
            : "registration",
        seasonName: season?.name,
      };
    });

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <Tabs
          defaultValue="upcoming"
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Games</TabsTrigger>
            <TabsTrigger value="completed">Completed Games</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          </TabsList>

          <TabsContent
            value="upcoming"
            className="space-y-6"
          >
            <GamesList
              games={upcomingGames}
              emptyMessage="No upcoming games match your filters"
            />
          </TabsContent>

          <TabsContent
            value="completed"
            className="space-y-6"
          >
            <GamesList
              games={completedGames}
              emptyMessage="No completed games match your filters"
            />
          </TabsContent>

          <TabsContent
            value="tournaments"
            className="space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {tournaments.map((tournament) => (
                <Card
                  key={tournament.id}
                  className="border-primary/20"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-primary">
                          <Trophy className="h-5 w-5" />
                          {tournament.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {tournament.division}
                        </p>
                      </div>
                      <Badge
                        variant={
                          tournament.status === "upcoming"
                            ? "default"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {tournament.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {tournament.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatDate(tournament.startDate)} -{" "}
                          {formatDate(tournament.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{tournament.teams} Teams</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{tournament.venue}</span>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Eligibility
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {tournament.eligibility}
                      </p>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90">
                      {tournament.status === "registration"
                        ? "Register Team"
                        : "View Details"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface GameCardProps {
  game: TransformedGame;
}

function GameCard({ game }: GameCardProps) {
  const [showMap, setShowMap] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Game Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {game.isTournament && (
                <Badge
                  variant="outline"
                  className="text-xs bg-primary/10 text-primary border-primary/20"
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  {game.tournamentName}
                </Badge>
              )}
            </div>

            {/* Teams and Score */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center flex-1">
                <div className="font-semibold text-lg text-foreground">
                  {game.homeTeam}
                </div>
                {game.homeScore !== null && (
                  <div className="text-2xl font-bold text-primary">
                    {game.homeScore}
                  </div>
                )}
              </div>

              <div className="text-center px-4">
                <div className="text-muted-foreground font-medium">
                  {game.status === "completed" ? "FINAL" : "VS"}
                </div>
              </div>

              <div className="text-center flex-1">
                <div className="font-semibold text-lg text-foreground">
                  {game.awayTeam}
                </div>
                {game.awayScore !== null && (
                  <div className="text-2xl font-bold text-primary">
                    {game.awayScore}
                  </div>
                )}
              </div>
            </div>

            {/* Date, Time, Venue */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(game.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(game.time)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{game.venue}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-32">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="bg-transparent"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
            {game.status === "scheduled" && (
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
            )}
          </div>
        </div>

        {/* Map Section */}
        {showMap && (
          <div className="mt-4 pt-4 border-t">
            <div className="bg-muted rounded-lg h-48 flex items-center justify-center mb-2">
              <img
                src="/venue-location-map-interactive.jpg"
                alt={`Map of ${game.venue}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {game.venueAddress}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
