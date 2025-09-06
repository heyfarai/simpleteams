"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Award, Play, Filter, Trophy } from "lucide-react";
import {
  samplePlayers,
  sampleTeams,
  sampleSeasons,
  getTeamById,
} from "@/lib/sample-data";
import Link from "next/link";

export function PlayersShowcase() {
  const [activeTab, setActiveTab] = useState("leaders");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedGradYear, setSelectedGradYear] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedAwards, setSelectedAwards] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Leaders tab filters
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedDivision, setSelectedDivision] = useState("Diamond Division");
  const [selectedSeason, setSelectedSeason] = useState("Regular Season");

  const players = samplePlayers.map((player) => {
    const team = getTeamById(player.teamId);
    const [firstName, ...lastNameParts] = player.name.split(" ");
    const lastName = lastNameParts.join(" ");

    return {
      id: Number.parseInt(player.id),
      firstName,
      lastName,
      team: team?.name || "Unknown Team",
      teamId: Number.parseInt(player.teamId),
      jersey: player.jerseyNumber,
      position: player.position,
      gradYear: Number.parseInt(player.gradYear),
      height: player.height,
      headshot: player.photo,
      stats: {
        ppg: player.stats.points,
        rpg: player.stats.rebounds,
        apg: player.stats.assists,
        spg: player.stats.steals || 0,
        bpg: player.stats.blocks || 0,
        mpg: player.stats.minutes || 0,
      },
      awards: player.awards,
      hasHighlight: !!player.highlightVideo,
      division: player.division || team?.division || "Unknown",
      gamesPlayed: player.stats.gamesPlayed,
      year: player.year || "2024", // Assuming player data includes year information
      season: player.season || "Regular Season", // Assuming player stats are from the selected season
    };
  });

  const teams = ["all", ...sampleTeams.map((team) => team.name)];
  const gradYears = [
    "all",
    ...Array.from(
      new Set(samplePlayers.map((player) => player.gradYear))
    ).sort(),
  ];
  const positions = [
    "all",
    ...Array.from(
      new Set(samplePlayers.map((player) => player.position))
    ).sort(),
  ];
  const allAwards = Array.from(
    new Set(samplePlayers.flatMap((player) => player.awards))
  ).sort();
  const years = Array.from(
    new Set(sampleSeasons.map((season) => season.year.toString()))
  )
    .sort()
    .reverse();
  const divisions = [
    "Diamond Division",
    "Premier Division",
    "Development Division",
  ];
  const seasons = sampleSeasons.map((season) => season.name);

  const getTopPlayersByStat = (
    statKey: keyof (typeof players)[0]["stats"],
    minGames = 3
  ) => {
    return players
      .filter((player) => player.gamesPlayed >= minGames)
      .filter((player) => {
        if (selectedDivision !== "all" && player.division !== selectedDivision)
          return false;
        if (player.year !== selectedYear) return false;
        if (player.season !== selectedSeason) return false;
        return true;
      })
      .sort((a, b) => b.stats[statKey] - a.stats[statKey])
      .slice(0, 5);
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      `${player.firstName} ${player.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === "all" || player.team === selectedTeam;
    const matchesGradYear =
      selectedGradYear === "all" ||
      player.gradYear.toString() === selectedGradYear;
    const matchesPosition =
      selectedPosition === "all" || player.position === selectedPosition;
    const matchesAwards =
      selectedAwards.length === 0 ||
      selectedAwards.some((award) => player.awards.includes(award));
    return (
      matchesSearch &&
      matchesTeam &&
      matchesGradYear &&
      matchesPosition &&
      matchesAwards
    );
  });

  const handleAwardChange = (award: string, checked: boolean) => {
    if (checked) {
      setSelectedAwards([...selectedAwards, award]);
    } else {
      setSelectedAwards(selectedAwards.filter((a) => a !== award));
    }
  };

  const LeadersFilterSidebar = ({ className = "" }: { className?: string }) => (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="font-semibold text-foreground mb-3">Year *</h3>
        <Select
          value={selectedYear}
          onValueChange={setSelectedYear}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
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

      <div>
        <h3 className="font-semibold text-foreground mb-3">Division *</h3>
        <Select
          value={selectedDivision}
          onValueChange={setSelectedDivision}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Division" />
          </SelectTrigger>
          <SelectContent>
            {divisions.map((division) => (
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

      <div>
        <h3 className="font-semibold text-foreground mb-3">Season *</h3>
        <Select
          value={selectedSeason}
          onValueChange={setSelectedSeason}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Season" />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((season) => (
              <SelectItem
                key={season}
                value={season}
              >
                {season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setSelectedDivision("Diamond Division");
          setSelectedSeason("Regular Season");
        }}
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  );

  const AllPlayersFilterSidebar = ({
    className = "",
  }: {
    className?: string;
  }) => (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="font-semibold text-foreground mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Team</h3>
        <Select
          value={selectedTeam}
          onValueChange={setSelectedTeam}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {teams.slice(1).map((team) => (
              <SelectItem
                key={team}
                value={team}
              >
                {team}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Class of</h3>
        <Select
          value={selectedGradYear}
          onValueChange={setSelectedGradYear}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {gradYears.slice(1).map((year) => (
              <SelectItem
                key={year}
                value={year}
              >
                Class of {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Position</h3>
        <Select
          value={selectedPosition}
          onValueChange={setSelectedPosition}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Positions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {positions.slice(1).map((position) => (
              <SelectItem
                key={position}
                value={position}
              >
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Awards</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {allAwards.map((award) => (
            <div
              key={award}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={award}
                checked={selectedAwards.includes(award)}
                onCheckedChange={(checked) =>
                  handleAwardChange(award, checked as boolean)
                }
              />
              <label
                htmlFor={award}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {award}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setSearchTerm("");
          setSelectedTeam("all");
          setSelectedGradYear("all");
          setSelectedPosition("all");
          setSelectedAwards([]);
        }}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );

  const StatLeaderCard = ({
    player,
    statValue,
    statLabel,
  }: {
    player: any;
    statValue: number;
    statLabel: string;
  }) => (
    <Link href={`/players/${player.id}`}>
      <div className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer group">
        <div className="flex-shrink-0">
          <img
            src={player.headshot || "/placeholder.svg"}
            alt={`${player.firstName} ${player.lastName}`}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {player.firstName} {player.lastName}
          </h4>
          <p className="text-sm text-muted-foreground">{player.team}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xl font-bold text-foreground">{statValue}</div>
          <Badge
            variant="secondary"
            className="bg-teal-600 text-white hover:bg-teal-700"
          >
            {statLabel}
          </Badge>
        </div>
      </div>
    </Link>
  );

  const StatLeaderColumn = ({
    title,
    statKey,
    statLabel,
  }: {
    title: string;
    statKey: keyof (typeof players)[0]["stats"];
    statLabel: string;
  }) => {
    const topPlayers = getTopPlayersByStat(statKey);

    return (
      <Card className="h-fit">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
          </div>
          <div className="space-y-1">
            {topPlayers.map((player) => (
              <StatLeaderCard
                key={player.id}
                player={player}
                statValue={player.stats[statKey]}
                statLabel={statLabel}
              />
            ))}
          </div>
          <div className="p-4 border-t">
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
              View All
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="flex gap-6">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              {activeTab === "leaders" ? (
                <LeadersFilterSidebar />
              ) : (
                <AllPlayersFilterSidebar />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="leaders"
              className="flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Leaders
            </TabsTrigger>
            <TabsTrigger
              value="all-players"
              className="flex items-center gap-2"
            >
              <Award className="h-4 w-4" />
              All Players
            </TabsTrigger>
          </TabsList>

          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </Button>

            {showMobileFilters && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  {activeTab === "leaders" ? (
                    <LeadersFilterSidebar />
                  ) : (
                    <AllPlayersFilterSidebar />
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <TabsContent
            value="leaders"
            className="space-y-8"
          >
            <div className="grid lg:grid-cols-3 gap-6">
              <StatLeaderColumn
                title="Points Leaders"
                statKey="ppg"
                statLabel="PPG"
              />
              <StatLeaderColumn
                title="Assists Leaders"
                statKey="apg"
                statLabel="APG"
              />
              <StatLeaderColumn
                title="Rebounds Leaders"
                statKey="rpg"
                statLabel="RPG"
              />
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              <StatLeaderColumn
                title="Steals Leaders"
                statKey="spg"
                statLabel="SPG"
              />
              <StatLeaderColumn
                title="Blocks Leaders"
                statKey="bpg"
                statLabel="BPG"
              />
              <StatLeaderColumn
                title="Minutes Leaders"
                statKey="mpg"
                statLabel="MPG"
              />
            </div>
          </TabsContent>

          <TabsContent value="all-players">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlayers.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.id}`}
                >
                  <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={player.headshot || "/placeholder.svg"}
                          alt={`${player.firstName} ${player.lastName}`}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                          {player.jersey}
                        </div>

                        {player.hasHighlight && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Highlight
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                            {player.firstName} {player.lastName}
                          </h3>
                          <p className="text-sm text-primary font-medium">
                            {player.team}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {player.position} • Class of {player.gradYear}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-sm font-bold text-primary">
                              {player.stats.ppg}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              PPG
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-primary">
                              {player.stats.rpg}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              RPG
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-primary">
                              {player.stats.apg}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              APG
                            </div>
                          </div>
                        </div>

                        {player.awards.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {player.awards.map((award, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                <Award className="h-3 w-3 mr-1" />
                                {award}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredPlayers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-2">
                  No players found
                </div>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
