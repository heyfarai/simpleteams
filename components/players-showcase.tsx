"use client";

import {
  fetchAllPlayers,
  fetchPlayersBySeason,
  fetchStatLeaders,
  fetchFilterOptions,
  fetchLeadersByCategory,
  type ShowcasePlayer,
} from "@/lib/data/fetch-players";
import { SeasonTabs } from "@/components/filters/season-tabs";
import { Season } from "@/lib/utils/season-filters";
import { debugPlayerData } from "@/lib/sanity/test-queries";
import { type StatCategory } from "@/lib/sanity/player-queries";
import { type FilterOptions, type SanitySeason } from "@/lib/sanity/types";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Filter, Play, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PlayersShowcase() {
  const [activeTab, setActiveTab] = useState<string>("leaders");
  // State for filters
  const [selectedSeason, setSelectedSeason] = useState<string>("");

  // Debug function to check data availability
  const handleDebugData = async () => {
    const debugResult = await debugPlayerData();
    console.log("Debug result:", debugResult);
  };

  // Fetch filter options
  const { data: filterOptions, isLoading: filtersLoading } = useQuery({
    queryKey: ["filter-options"],
    queryFn: fetchFilterOptions,
  });

  // Fetch all players for the "All Players" tab
  const { data: allPlayersData, isLoading: playersLoading } = useQuery({
    queryKey: ["all-players", selectedSeason],
    queryFn: () => fetchPlayersBySeason(selectedSeason),
  });

  // Fetch stat leaders for the "Leaders" tab (fallback for filtering)
  const { data: statLeadersData, isLoading: leadersLoading } = useQuery({
    queryKey: ["stat-leaders", selectedSeason],
    queryFn: () => fetchStatLeaders(selectedSeason),
    enabled: false, // Disable since we're using optimized queries
  });

  // Use fetched data or fallback to empty arrays
  const players = allPlayersData || [];
  const statLeaders = statLeadersData || [];

  // Extract filter options from fetched data
  const availableSeasons: Season[] = (filterOptions?.seasons || []).map(
    (season: SanitySeason) => ({
      id: season._id,
      name: season.name,
      year: `${season.year}-${(season.year + 1).toString().slice(2)}`,
      startDate: new Date(season.year, 8, 1),
      endDate: new Date(season.year + 1, 7, 31),
      isActive: Boolean(season.isActive),
    })
  );

  // Optimized leaderboard queries using React Query
  const { data: pointsLeaders, isLoading: pointsLoading } = useQuery({
    queryKey: ["leaders", "ppg", selectedSeason],
    queryFn: () => fetchLeadersByCategory("ppg", selectedSeason),
    enabled: activeTab === "leaders",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: reboundsLeaders, isLoading: reboundsLoading } = useQuery({
    queryKey: ["leaders", "rpg", selectedSeason],
    queryFn: () => fetchLeadersByCategory("rpg", selectedSeason),
    enabled: activeTab === "leaders",
    staleTime: 5 * 60 * 1000,
  });

  const { data: assistsLeaders, isLoading: assistsLoading } = useQuery({
    queryKey: ["leaders", "apg", selectedSeason],
    queryFn: () => fetchLeadersByCategory("apg", selectedSeason),
    enabled: activeTab === "leaders",
    staleTime: 5 * 60 * 1000,
  });

  const { data: stealsLeaders, isLoading: stealsLoading } = useQuery({
    queryKey: ["leaders", "spg", selectedSeason],
    queryFn: () => fetchLeadersByCategory("spg", selectedSeason),
    enabled: activeTab === "leaders",
    staleTime: 5 * 60 * 1000,
  });

  const { data: blocksLeaders, isLoading: blocksLoading } = useQuery({
    queryKey: ["leaders", "bpg", selectedSeason],
    queryFn: () => fetchLeadersByCategory("bpg", selectedSeason),
    enabled: activeTab === "leaders",
    staleTime: 5 * 60 * 1000,
  });

  const { data: minutesLeaders, isLoading: minutesLoading } = useQuery({
    queryKey: ["leaders", "mpg", selectedSeason],
    queryFn: () => fetchLeadersByCategory("mpg", selectedSeason),
    enabled: activeTab === "leaders",
    staleTime: 5 * 60 * 1000,
  });

  const getLeadersByCategory = (category: StatCategory) => {
    switch (category) {
      case "ppg":
        return { data: pointsLeaders, isLoading: pointsLoading };
      case "rpg":
        return { data: reboundsLeaders, isLoading: reboundsLoading };
      case "apg":
        return { data: assistsLeaders, isLoading: assistsLoading };
      case "spg":
        return { data: stealsLeaders, isLoading: stealsLoading };
      case "bpg":
        return { data: blocksLeaders, isLoading: blocksLoading };
      case "mpg":
        return { data: minutesLeaders, isLoading: minutesLoading };
      default:
        return { data: [], isLoading: false };
    }
  };

  const filteredPlayers = players.filter((player) => {
    if (selectedSeason && player.seasonId !== selectedSeason) return false;
    return true;
  });

  // Group players by team
  const playersByTeam = filteredPlayers.reduce((acc, player) => {
    const team = player.team || "Unassigned";
    if (!acc[team]) {
      acc[team] = [];
    }
    acc[team].push(player);
    return acc;
  }, {} as Record<string, ShowcasePlayer[]>);

  const StatLeaderCard = ({
    player,
    statValue,
    statLabel,
  }: {
    player: ShowcasePlayer;
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
    category,
    statLabel,
  }: {
    title: string;
    category: StatCategory;
    statLabel: string;
  }) => {
    const { data: leaders, isLoading } = getLeadersByCategory(category);
    const topPlayers = leaders?.slice(0, 5) || [];

    return (
      <Card className="h-fit">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
          </div>
          <div className="space-y-1">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading leaders...
              </div>
            ) : topPlayers.length > 0 ? (
              topPlayers.map((player) => (
                <StatLeaderCard
                  key={player.id}
                  player={player}
                  statValue={player.stats[category]}
                  statLabel={statLabel}
                />
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No data available
              </div>
            )}
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

  // Show loading state for initial data
  if (filtersLoading || playersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading players...</div>
          <div className="text-muted-foreground">
            Please wait while we fetch the latest data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <SeasonTabs
          selectedSeason={selectedSeason}
          seasons={availableSeasons}
          onSeasonChange={setSelectedSeason}
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
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
        <TabsContent value="leaders">
          <div className="grid lg:grid-cols-3 gap-6">
            <StatLeaderColumn
              title="Points Leaders"
              category="ppg"
              statLabel="PPG"
            />
            <StatLeaderColumn
              title="Assists Leaders"
              category="apg"
              statLabel="APG"
            />
            <StatLeaderColumn
              title="Rebounds Leaders"
              category="rpg"
              statLabel="RPG"
            />
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <StatLeaderColumn
              title="Steals Leaders"
              category="spg"
              statLabel="SPG"
            />
            <StatLeaderColumn
              title="Blocks Leaders"
              category="bpg"
              statLabel="BPG"
            />
            <StatLeaderColumn
              title="Minutes Leaders"
              category="mpg"
              statLabel="MPG"
            />
          </div>
        </TabsContent>
        <TabsContent value="all-players">
          <div className="space-y-8">
            {Object.entries(playersByTeam)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([team, teamPlayers]) => (
                <div
                  key={team}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-foreground">
                      {team}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="text-sm"
                    >
                      {teamPlayers.length} players
                    </Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {teamPlayers.map((player) => (
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
                </div>
              ))}
          </div>

          {Object.keys(playersByTeam).length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-2">No players found</div>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
