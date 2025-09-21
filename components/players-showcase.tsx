"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";
import { usePlayersShowcase } from "@/hooks/use-players-clean";
import { StatLeaderColumn } from "./players/stat-leader-column";
import { PlayersGrid } from "./players/players-grid";
import { ShowcaseFilters } from "./players/showcase-filters";

export default function PlayersShowcase() {
  const {
    activeTab,
    setActiveTab,
    selectedSeason,
    setSelectedSeason,
    filteredPlayers,
    playersByTeam,
    availableSeasons,
    getLeadersByCategory,
    isLoading,
    playersLoading,
  } = usePlayersShowcase();

  const handleDebugData = async () => {
    console.log("Debug data clicked");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Players Showcase</h1>
        <p className="text-lg text-muted-foreground">
          Discover the stars of the league and track statistical leaders
        </p>
      </div>

      <ShowcaseFilters
        availableSeasons={availableSeasons}
        selectedSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
        onDebugData={handleDebugData}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leaders" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Statistical Leaders</span>
          </TabsTrigger>
          <TabsTrigger value="all">All Players</TabsTrigger>
        </TabsList>

        <TabsContent value="leaders" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatLeaderColumn
              title="Points Leaders"
              leaders={getLeadersByCategory("ppg")}
              category="ppg"
              isLoading={isLoading}
            />
            <StatLeaderColumn
              title="Rebounds Leaders"
              leaders={getLeadersByCategory("rpg")}
              category="rpg"
              isLoading={isLoading}
            />
            <StatLeaderColumn
              title="Assists Leaders"
              leaders={getLeadersByCategory("apg")}
              category="apg"
              isLoading={isLoading}
            />
            <StatLeaderColumn
              title="Steals Leaders"
              leaders={getLeadersByCategory("spg")}
              category="spg"
              isLoading={isLoading}
            />
            <StatLeaderColumn
              title="Blocks Leaders"
              leaders={getLeadersByCategory("bpg")}
              category="bpg"
              isLoading={isLoading}
            />
            <StatLeaderColumn
              title="Minutes Leaders"
              leaders={getLeadersByCategory("mpg")}
              category="mpg"
              isLoading={isLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">
              All Players {selectedSeason && `(${availableSeasons.find(s => s.id === selectedSeason)?.name})`}
            </h2>
            <p className="text-muted-foreground">
              {filteredPlayers.length} players across all teams
            </p>
          </div>

          <PlayersGrid
            playersByTeam={playersByTeam}
            isLoading={playersLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}