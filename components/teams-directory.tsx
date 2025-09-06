"use client";

import { useState } from "react";
import Link from "next/link"; // Added Link import for team profile navigation
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Users,
  Trophy,
  Filter,
  X,
  Grid3X3,
  BarChart3,
  Check,
  XIcon,
  Minus,
} from "lucide-react";
import {
  sampleTeams,
  getPlayersByTeam,
  sampleSeasons,
  sampleSessions,
} from "@/lib/sample-data";

export function TeamsDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedSession, setSelectedSession] = useState("all");
  const [selectedAwards, setSelectedAwards] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "standings">("grid");
  const [playoffCutoff, setPlayoffCutoff] = useState(4);

  const teams = sampleTeams.map((team) => {
    const players = getPlayersByTeam(team.id);
    const [wins, losses] = team.record.split("-").map(Number);

    return {
      id: team.id,
      name: team.name,
      logo: team.logo,
      division: team.division,
      coach: team.coach,
      region: "Springfield Area", // Default region since not in schema
      wins: wins || 0,
      losses: losses || 0,
      playerCount: players.length,
      description: team.description,
      homeVenue: team.homeVenue,
      awards: team.awards,
      sessionIds: team.sessionIds,
      stats: team.stats || {
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        gamesPlayed: 0,
        streak: [],
      },
    };
  });

  const divisions = [
    "all",
    ...Array.from(new Set(sampleTeams.map((team) => team.division))),
  ];
  const years = [
    "all",
    ...Array.from(
      new Set(sampleSeasons.map((season) => season.year.toString()))
    ),
  ];
  const sessions = [
    "all",
    ...Array.from(new Set(sampleSessions.map((session) => session.name))),
  ];
  const allAwards = Array.from(
    new Set(sampleTeams.flatMap((team) => team.awards))
  );

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.coach.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision =
      selectedDivision === "all" || team.division === selectedDivision;
    const matchesYear =
      selectedYear === "all" ||
      team.sessionIds.some((sessionId) => {
        const session = sampleSessions.find((s) => s.id === sessionId);
        if (!session) return false;
        const season = sampleSeasons.find((s) => s.id === session.seasonId);
        return season?.year.toString() === selectedYear;
      });
    const matchesSession =
      selectedSession === "all" ||
      team.sessionIds.some((sessionId) => {
        const session = sampleSessions.find((s) => s.id === sessionId);
        return session?.name === selectedSession;
      });
    const matchesAwards =
      selectedAwards.length === 0 ||
      selectedAwards.some((award) => team.awards.includes(award));

    return (
      matchesSearch &&
      matchesDivision &&
      matchesYear &&
      matchesSession &&
      matchesAwards
    );
  });

  const handleAwardToggle = (award: string) => {
    setSelectedAwards((prev) =>
      prev.includes(award) ? prev.filter((a) => a !== award) : [...prev, award]
    );
  };

  const clearFilters = () => {
    setSelectedDivision("all");
    setSelectedYear("all");
    setSelectedSession("all");
    setSelectedAwards([]);
    setSearchTerm("");
  };

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`space-y-6 ${isMobile ? "p-4" : ""}`}>
      {/* Search */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search teams, regions, coaches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Division Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Division
        </label>
        <Select
          value={selectedDivision}
          onValueChange={setSelectedDivision}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Division" />
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

      {/* Year Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Year
        </label>
        <Select
          value={selectedYear}
          onValueChange={setSelectedYear}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.slice(1).map((year) => (
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

      {/* Session Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Session
        </label>
        <Select
          value={selectedSession}
          onValueChange={setSelectedSession}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Session" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sessions</SelectItem>
            {sessions.slice(1).map((session) => (
              <SelectItem
                key={session}
                value={session}
              >
                {session}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Awards Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Awards
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {allAwards.map((award) => (
            <div
              key={award}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={`award-${award}`}
                checked={selectedAwards.includes(award)}
                onCheckedChange={() => handleAwardToggle(award)}
              />
              <label
                htmlFor={`award-${award}`}
                className="text-sm text-foreground cursor-pointer flex-1"
              >
                {award}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full bg-transparent"
      >
        Clear All Filters
      </Button>
    </div>
  );

  const getStandingsData = () => {
    const teamStats = filteredTeams.map((team) => {
      const stats = team.stats || {
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        gamesPlayed: 0,
        streak: [],
      };

      const winPercentage =
        stats.gamesPlayed > 0 ? (stats.wins / stats.gamesPlayed) * 100 : 0;
      const ppg =
        stats.gamesPlayed > 0 ? stats.pointsFor / stats.gamesPlayed : 0;
      const oppPpg =
        stats.gamesPlayed > 0 ? stats.pointsAgainst / stats.gamesPlayed : 0;
      const pointsDiff = ppg - oppPpg;

      return {
        ...team,
        winPercentage,
        ppg,
        oppPpg,
        pointsDiff,
        stats,
      };
    });

    // Group by division and sort by win percentage
    const divisions = Array.from(
      new Set(teamStats.map((team) => team.division))
    );
    return divisions.map((division) => ({
      division,
      teams: teamStats
        .filter((team) => team.division === division)
        .sort((a, b) => b.winPercentage - a.winPercentage),
    }));
  };

  const StreakBadge = ({ result }: { result: "W" | "L" | "T" }) => {
    const bgColor =
      result === "W"
        ? "bg-green-500"
        : result === "L"
        ? "bg-red-500"
        : "bg-gray-500";
    const Icon = result === "W" ? Check : result === "L" ? XIcon : Minus;

    return (
      <div
        className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center`}
      >
        <Icon className="h-3 w-3 text-white" />
      </div>
    );
  };

  return (
    <div className="flex gap-6">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 shrink-0 mt-14">
        <Card className="sticky top-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Filters</h3>
            </div>
            <FilterSidebar />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <Card className="lg:hidden">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <FilterSidebar isMobile />
            </CardContent>
          </Card>
        )}

        {/* Results Header with View Toggle */}
        <div className="flex items-end justify-end">
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === "standings" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("standings")}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Standings
              </Button>
            </div>
            {(selectedDivision !== "all" ||
              selectedYear !== "all" ||
              selectedSession !== "all" ||
              selectedAwards.length > 0 ||
              searchTerm) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-sm"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(selectedDivision !== "all" ||
          selectedYear !== "all" ||
          selectedSession !== "all" ||
          selectedAwards.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {selectedDivision !== "all" && (
              <Badge
                variant="secondary"
                className="gap-1"
              >
                Division: {selectedDivision}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedDivision("all")}
                />
              </Badge>
            )}
            {selectedYear !== "all" && (
              <Badge
                variant="secondary"
                className="gap-1"
              >
                Year: {selectedYear}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedYear("all")}
                />
              </Badge>
            )}
            {selectedSession !== "all" && (
              <Badge
                variant="secondary"
                className="gap-1"
              >
                Session: {selectedSession}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedSession("all")}
                />
              </Badge>
            )}
            {selectedAwards.map((award) => (
              <Badge
                key={award}
                variant="secondary"
                className="gap-1"
              >
                {award}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleAwardToggle(award)}
                />
              </Badge>
            ))}
          </div>
        )}

        {viewMode === "grid" ? (
          /* Teams Grid */
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
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
                          src={team.logo || "/placeholder.svg"}
                          alt={`${team.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                          {team.name}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="mb-2"
                        >
                          {team.division}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {team.region}
                        </p>
                      </div>
                    </div>

                    {/* Team Awards */}
                    {team.awards.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {team.awards.slice(0, 2).map((award) => (
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
                          {team.wins}-{team.losses}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Record
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">
                          {team.playerCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Players
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">
                          {(
                            (team.wins / (team.wins + team.losses)) *
                            100
                          ).toFixed(0)}
                          %
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Win Rate
                        </div>
                      </div>
                    </div>

                    {/* Coach Info */}
                    <div className="mb-4">
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
        ) : (
          /* Standings View */
          <div className="space-y-8">
            {getStandingsData().map(({ division, teams }) => (
              <div key={division}>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {division}
                </h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-4 font-semibold">
                              Rank
                            </th>
                            <th className="text-left p-4 font-semibold">
                              Team
                            </th>
                            <th className="text-center p-4 font-semibold">W</th>
                            <th className="text-center p-4 font-semibold">L</th>
                            <th className="text-center p-4 font-semibold">
                              Win %
                            </th>
                            <th className="text-center p-4 font-semibold">
                              PPG
                            </th>
                            <th className="text-center p-4 font-semibold">
                              OPP PPG
                            </th>
                            <th className="text-center p-4 font-semibold">
                              Diff
                            </th>
                            <th className="text-center p-4 font-semibold">
                              Streak
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {teams.map((team, index) => (
                            <tr
                              key={team.id}
                              className={`border-b hover:bg-muted/30 transition-colors ${
                                index < playoffCutoff
                                  ? "bg-green-50 dark:bg-green-950/20"
                                  : ""
                              }`}
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">
                                    {index + 1}
                                  </span>
                                  {index < playoffCutoff && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    >
                                      Playoff
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <Link
                                  href={`/teams/${team.id}`}
                                  className="flex items-center gap-3 hover:text-primary transition-colors"
                                >
                                  <img
                                    src={team.logo || "/placeholder.svg"}
                                    alt={`${team.name} logo`}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div>
                                    <div className="font-semibold text-foreground">
                                      {team.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {team.coach}
                                    </div>
                                  </div>
                                </Link>
                              </td>
                              <td className="p-4 text-center font-semibold text-green-600">
                                {team.stats.wins}
                              </td>
                              <td className="p-4 text-center font-semibold text-red-600">
                                {team.stats.losses}
                              </td>
                              <td className="p-4 text-center font-semibold">
                                {team.winPercentage.toFixed(1)}%
                              </td>
                              <td className="p-4 text-center">
                                {team.ppg.toFixed(1)}
                              </td>
                              <td className="p-4 text-center">
                                {team.oppPpg.toFixed(1)}
                              </td>
                              <td
                                className={`p-4 text-center font-semibold ${
                                  team.pointsDiff >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {team.pointsDiff >= 0 ? "+" : ""}
                                {team.pointsDiff.toFixed(1)}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center gap-1">
                                  {team.stats.streak.map((result, i) => (
                                    <StreakBadge
                                      key={i}
                                      result={result}
                                    />
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Playoff cutoff indicator */}
                    <div className="p-4 border-t bg-muted/30">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          Top {playoffCutoff} teams qualify for playoffs
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-100 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded"></div>
                          <span>Playoff Position</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">No teams found</div>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
