"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import Link from "next/link";
import { Season } from "@/lib/utils/season-filters";

interface Player {
  player: {
    _id: string;
    name: string;
  };
  jerseyNumber: number;
  position: string;
  status: 'active' | 'inactive' | 'injured';
}

interface TeamRosterProps {
  players: Player[];
  seasonName: string;
  year: string; // Format: "2024-25"
}

function PlayerCard({ player }: { player: Player }) {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800", 
    injured: "bg-red-100 text-red-800"
  };

  return (
    <Link href={`/players/${player.player._id}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold">
              #{player.jerseyNumber}
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground">
                {player.player.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {player.position}
              </div>
              <Badge 
                className={`text-xs mt-1 ${statusColors[player.status]}`}
                variant="secondary"
              >
                {player.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function TeamRoster({ players, seasonName, year }: TeamRosterProps) {
  const activePlayers = players.filter(p => p.status === 'active');
  const inactivePlayers = players.filter(p => p.status !== 'active');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Roster - {seasonName}
          </div>
          <div className="text-sm font-normal text-muted-foreground">
            {activePlayers.length} active, {inactivePlayers.length} inactive
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {players.length > 0 ? (
          <div className="space-y-6">
            {activePlayers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Active Players ({activePlayers.length})
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activePlayers.map((player) => (
                    <PlayerCard key={player.player._id} player={player} />
                  ))}
                </div>
              </div>
            )}
            
            {inactivePlayers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Inactive/Injured Players ({inactivePlayers.length})
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inactivePlayers.map((player) => (
                    <PlayerCard key={player.player._id} player={player} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No players found for the selected season
          </div>
        )}
      </CardContent>
    </Card>
  );
}
