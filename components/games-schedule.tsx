"use client";

import { useState, useEffect } from "react";
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
import type { FilterData } from "@/lib/sanity/get-filter-data";
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
  getTeamById,
  getSessionById,
  getSeasonById,
} from "@/lib/sample-data";
import {
  TransformedGame,
  FilterState,
  filterGames,
  groupGamesBySessionAndDivision,
  getActiveFiltersCount,
} from "@/lib/utils/game-filters";

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
  // Group all useState hooks together at the top
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [selectedVenue, setSelectedVenue] = useState<string>("all");
  const [selectedConference, setSelectedConference] = useState<string>("all");
  const [selectedSeason, setSelectedSeason] = useState<string>("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Place useEffect after all useState hooks
  useEffect(() => {
    if (!filterData) {
      setError("Failed to load filter data");
    } else if (
      !filterData.seasons ||
      !filterData.conferences ||
      !filterData.divisions
    ) {
      setError("Incomplete filter data");
    }
    setIsLoading(false);
  }, [filterData]);

  if (isLoading) {
    return <div className="text-center py-8">Loading filters...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  const transformGameData = (game: {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    homeScore?: number;
    awayScore?: number;
    date: string;
    time: string;
    venue: string;
    venueAddress: string;
    division: string;
    status: string;
    sessionId: string;
  }): TransformedGame => {
    const session = getSessionById(game.sessionId);
    const season = session ? getSeasonById(session.seasonId) : null;
    const homeTeam = getTeamById(game.homeTeamId);
    const awayTeam = getTeamById(game.awayTeamId);

    return {
      id: game.id,
      conference: "unknown", // Default since we're using sample data
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

  const upcomingGames: TransformedGame[] = sampleGames
    .filter((game) => game.status === "scheduled")
    .map((game) =>
      transformGameData({
        id: game.id,
        homeTeamId: game.homeTeamId,
        awayTeamId: game.awayTeamId,
        homeScore: game.homeScore,
        awayScore: game.awayScore,
        date: game.date,
        time: game.time,
        venue: game.venue,
        venueAddress: game.venueAddress,
        division: game.division,
        status: game.status,
        sessionId: game.sessionId,
      })
    );

  const completedGames: TransformedGame[] = sampleGames
    .filter((game) => game.status === "completed")
    .map((game) =>
      transformGameData({
        id: game.id,
        homeTeamId: game.homeTeamId,
        awayTeamId: game.awayTeamId,
        homeScore: game.homeScore,
        awayScore: game.awayScore,
        date: game.date,
        time: game.time,
        venue: game.venue,
        venueAddress: game.venueAddress,
        division: game.division,
        status: game.status,
        sessionId: game.sessionId,
      })
    );

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
      } satisfies Tournament;
    });

  // Initialize filter data with proper typing
  const divisions = [
    { _id: "all", name: "All Divisions" },
    ...(filterData.divisions || []),
  ];
  const conferences = [
    { _id: "all", name: "All Conferences" },
    ...(filterData.conferences || []),
  ];
  const seasons = [
    { _id: "all", name: "All Seasons" },
    ...(filterData.seasons || []),
  ];
  // For now, keep venues from sample data until we add them to Sanity
  const venues = [
    "all",
    ...Array.from(new Set(sampleGames.map((game) => game.venue))),
  ];

  const clearAllFilters = () => {
    setSelectedDivision("all");
    setSelectedVenue("all");
    setSelectedConference("all");
    setSelectedSeason("all");
  };

  const activeFiltersCount = getActiveFiltersCount({
    selectedDivision,
    selectedVenue,
    selectedConference,
    selectedSeason,
  });

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
                    {seasons
                      .filter((s) => s._id !== "all")
                      .map((season) => (
                        <SelectItem
                          key={season._id}
                          value={season._id}
                        >
                          {season.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Conference Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Conference</label>
                <Select
                  value={selectedConference}
                  onValueChange={setSelectedConference}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Conferences" />
                  </SelectTrigger>
                  <SelectContent>
                    {conferences.map((conference) => (
                      <SelectItem
                        key={conference._id}
                        value={conference._id}
                      >
                        {conference.name}
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
                    {divisions.map((division) => (
                      <SelectItem
                        key={division._id}
                        value={division._id}
                      >
                        {division.name}
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
                    {venues.map((venue) => (
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
                      {seasons.map((season) => (
                        <SelectItem
                          key={season._id}
                          value={season._id}
                        >
                          {season.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedConference}
                    onValueChange={setSelectedConference}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Conference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conferences</SelectItem>
                      {conferences.map((conference) => (
                        <SelectItem
                          key={conference._id}
                          value={conference._id}
                        >
                          {conference.name}
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
                      {divisions.map((division) => (
                        <SelectItem
                          key={division._id}
                          value={division._id}
                        >
                          {division.name}
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
                      {venues.map((venue) => (
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
              const groupedGames = groupGamesBySessionAndDivision(
                upcomingGames,
                {
                  selectedDivision,
                  selectedVenue,
                  selectedConference,
                  selectedSeason,
                }
              );
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
              const groupedGames = groupGamesBySessionAndDivision(
                completedGames,
                {
                  selectedDivision,
                  selectedVenue,
                  selectedConference,
                  selectedSeason,
                }
              );
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
