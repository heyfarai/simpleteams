"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  Plus,
  Trophy,
  Users,
  Filter,
  X,
} from "lucide-react";
import {
  sampleGames,
  sampleSessions,
  sampleSeasons,
  getTeamById,
  getSessionById,
  getSeasonById,
} from "@/lib/sample-data";

export function GamesSchedule() {
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedVenue, setSelectedVenue] = useState("all");
  const [selectedSession, setSelectedSession] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const transformGameData = (game: any) => {
    const session = getSessionById(game.sessionId);
    const season = session ? getSeasonById(session.seasonId) : null;
    const homeTeam = getTeamById(game.homeTeamId);
    const awayTeam = getTeamById(game.awayTeamId);

    return {
      id: game.id,
      homeTeam: homeTeam?.name || "Unknown Team",
      awayTeam: awayTeam?.name || "Unknown Team",
      homeScore: game.homeScore || null,
      awayScore: game.awayScore || null,
      date: game.date,
      time: game.time,
      venue: game.venue,
      venueAddress: game.venueAddress,
      division: game.division,
      status: game.status,
      isTournament: session?.type === "playoff",
      tournamentName: session?.type === "playoff" ? session.name : undefined,
      sessionName: session?.name,
      sessionType: session?.type,
      seasonName: season?.name,
      seasonType: season?.type,
      sessionId: game.sessionId,
    };
  };

  const upcomingGames = sampleGames
    .filter((game) => game.status === "scheduled")
    .map(transformGameData);
  const completedGames = sampleGames
    .filter((game) => game.status === "completed")
    .map(transformGameData);

  const tournaments = sampleSessions
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

  const divisions = [
    "all",
    ...Array.from(new Set(sampleGames.map((game) => game.division))),
  ];
  const venues = [
    "all",
    ...Array.from(new Set(sampleGames.map((game) => game.venue))),
  ];
  const sessions = [
    "all",
    ...sampleSessions.map((session) => ({
      id: session.id,
      name: session.name,
    })),
  ];
  const seasons = [
    "all",
    ...sampleSeasons.map((season) => ({ id: season.id, name: season.name })),
  ];

  const filterGames = (games: typeof upcomingGames) => {
    return games.filter((game) => {
      const matchesDivision =
        selectedDivision === "all" || game.division === selectedDivision;
      const matchesVenue =
        selectedVenue === "all" || game.venue === selectedVenue;
      const matchesSession =
        selectedSession === "all" || game.sessionId === selectedSession;
      const matchesSeason =
        selectedSeason === "all" ||
        (() => {
          const session = getSessionById(game.sessionId);
          return session?.seasonId === selectedSeason;
        })();

      return matchesDivision && matchesVenue && matchesSession && matchesSeason;
    });
  };

  const groupGamesBySessionAndDivision = (games: typeof upcomingGames) => {
    const filtered = filterGames(games);
    const grouped: Record<string, Record<string, typeof games>> = {};

    filtered.forEach((game) => {
      const sessionKey = game.sessionName || "Unknown Session";
      const divisionKey = game.division;

      if (!grouped[sessionKey]) {
        grouped[sessionKey] = {};
      }
      if (!grouped[sessionKey][divisionKey]) {
        grouped[sessionKey][divisionKey] = [];
      }
      grouped[sessionKey][divisionKey].push(game);
    });

    return grouped;
  };

  const clearAllFilters = () => {
    setSelectedDivision("all");
    setSelectedVenue("all");
    setSelectedSession("all");
    setSelectedSeason("all");
  };

  const activeFiltersCount = [
    selectedDivision,
    selectedVenue,
    selectedSession,
    selectedSeason,
  ].filter((filter) => filter !== "all").length;

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
    <div className="flex gap-6">
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filters</CardTitle>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Season Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Season</label>
                <Select
                  value={selectedSeason}
                  onValueChange={setSelectedSeason}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Seasons" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Seasons</SelectItem>
                    {seasons.slice(1).map((season) => (
                      <SelectItem
                        key={season.id}
                        value={season.id}
                      >
                        {season.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Session Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Session</label>
                <Select
                  value={selectedSession}
                  onValueChange={setSelectedSession}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    {sessions.slice(1).map((session) => (
                      <SelectItem
                        key={session.id}
                        value={session.id}
                      >
                        {session.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Division Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Division</label>
                <Select
                  value={selectedDivision}
                  onValueChange={setSelectedDivision}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Divisions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Divisions</SelectItem>
                    {divisions.slice(1).map((division) => (
                      <SelectItem
                        key={division}
                        value={division}
                      >
                        {division}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Venue Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Venue</label>
                <Select
                  value={selectedVenue}
                  onValueChange={setSelectedVenue}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Venues" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Venues</SelectItem>
                    {venues.slice(1).map((venue) => (
                      <SelectItem
                        key={venue}
                        value={venue}
                      >
                        {venue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Export Options */}
              <div className="pt-4 border-t space-y-2">
                <label className="text-sm font-medium">Export</label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Export iCal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </span>
            {showMobileFilters ? (
              <X className="h-4 w-4" />
            ) : (
              <Filter className="h-4 w-4" />
            )}
          </Button>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <Card className="mt-4">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={selectedSeason}
                    onValueChange={setSelectedSeason}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Seasons</SelectItem>
                      {seasons.slice(1).map((season) => (
                        <SelectItem
                          key={season.id}
                          value={season.id}
                        >
                          {season.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedSession}
                    onValueChange={setSelectedSession}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sessions</SelectItem>
                      {sessions.slice(1).map((session) => (
                        <SelectItem
                          key={session.id}
                          value={session.id}
                        >
                          {session.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedDivision}
                    onValueChange={setSelectedDivision}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Division" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Divisions</SelectItem>
                      {divisions.slice(1).map((division) => (
                        <SelectItem
                          key={division}
                          value={division}
                        >
                          {division}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedVenue}
                    onValueChange={setSelectedVenue}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Venue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Venues</SelectItem>
                      {venues.slice(1).map((venue) => (
                        <SelectItem
                          key={venue}
                          value={venue}
                        >
                          {venue}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    iCal
                  </Button>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

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
            {(() => {
              const groupedGames =
                groupGamesBySessionAndDivision(upcomingGames);
              const sessionKeys = Object.keys(groupedGames);

              if (sessionKeys.length === 0) {
                return (
                  <div className="text-center py-8 text-muted-foreground">
                    No upcoming games match your filters
                  </div>
                );
              }

              return sessionKeys.map((sessionName) => (
                <div
                  key={sessionName}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {sessionName}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      {Object.values(groupedGames[sessionName]).flat().length}{" "}
                      games
                    </Badge>
                  </div>

                  {Object.entries(groupedGames[sessionName]).map(
                    ([divisionName, games]) => (
                      <div
                        key={divisionName}
                        className="space-y-3"
                      >
                        <h4 className="text-lg font-medium text-muted-foreground pb-1">
                          {divisionName} Division
                        </h4>
                        <div className="space-y-3">
                          {games.map((game) => (
                            <GameCard
                              key={game.id}
                              game={game}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ));
            })()}
          </TabsContent>

          <TabsContent
            value="completed"
            className="space-y-6"
          >
            {(() => {
              const groupedGames =
                groupGamesBySessionAndDivision(completedGames);
              const sessionKeys = Object.keys(groupedGames);

              if (sessionKeys.length === 0) {
                return (
                  <div className="text-center py-8 text-muted-foreground">
                    No completed games match your filters
                  </div>
                );
              }

              return sessionKeys.map((sessionName) => (
                <div
                  key={sessionName}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {sessionName}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      {Object.values(groupedGames[sessionName]).flat().length}{" "}
                      games
                    </Badge>
                  </div>

                  {Object.entries(groupedGames[sessionName]).map(
                    ([divisionName, games]) => (
                      <div
                        key={divisionName}
                        className="space-y-3"
                      >
                        <h4 className="text-lg font-medium text-muted-foreground  pb-1">
                          {divisionName} Division
                        </h4>
                        <div className="space-y-3">
                          {games.map((game) => (
                            <GameCard
                              key={game.id}
                              game={game}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ));
            })()}
          </TabsContent>

          {/* Tournaments */}
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
  game: {
    id: number;
    homeTeam: string;
    awayTeam: string;
    homeScore: number | null;
    awayScore: number | null;
    date: string;
    time: string;
    venue: string;
    venueAddress: string;
    division: string;
    status: string;
    isTournament: boolean;
    tournamentName?: string;
    sessionName?: string;
    sessionType?: string;
    seasonName?: string;
    seasonType?: string;
  };
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
