"use client";

import { fetchPlayerProfile, type PlayerProfile as PlayerProfileType } from "@/lib/data/fetch-player-profile";
import { useQuery } from "@tanstack/react-query";
import { PlayerHeader } from "./player-profile/player-header";
import { PlayerInfo } from "./player-profile/player-info";
import { PlayerStats } from "./player-profile/player-stats";
import { PlayerHighlights } from "./player-profile/player-highlights";
import { PlayerSidebar } from "./player-profile/player-sidebar";
import { LoadingState } from "./player-profile/loading-state";
import { ErrorState } from "./player-profile/error-state";

interface PlayerProfileProps {
  playerId: string;
}

export function PlayerProfile({ playerId }: PlayerProfileProps) {
  const { data: player, isLoading, error } = useQuery<PlayerProfileType | null>({
    queryKey: ["player", playerId],
    queryFn: () => fetchPlayerProfile(playerId),
  });

  if (isLoading) return <LoadingState />;
  if (error || !player) return <ErrorState />;

  return (
    <div className="container mx-auto px-4 py-8">
      <PlayerHeader player={player} />
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <PlayerInfo player={player} />
          <PlayerStats player={player} />
          <PlayerHighlights player={player} />
        </div>

        {/* Sidebar */}
        <PlayerSidebar player={player} />
      </div>
    </div>
  );
}
