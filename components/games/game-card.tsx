"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin, Plus, Trophy } from "lucide-react";
import type { Game } from "@/types/schema";
import { formatGameDate, formatGameTime } from "@/lib/utils/date";
import { getTeamLogoUrl } from "@/lib/utils/sanity-image";

interface GameCardProps {
  game: Game;
  loading?: boolean;
}

export function GameCard({ game, loading = false }: GameCardProps) {
  const [showMap, setShowMap] = useState(false);

  const handleMapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMap(!showMap);
  };

  if (loading) {
    return (
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
                <div className="flex justify-between flex-1">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <div className="hidden md:flex text-center px-4">
                  <Skeleton className="h-8 w-8" />
                </div>
                <div className="flex justify-between flex-1">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
              <div className="flex md:justify-center flex-wrap gap-4">
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "in-progress":
        return <Badge variant="default">Live</Badge>;
      case "final":
        return <Badge variant="secondary">Final</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Link
      href={`/games/${game._id}`}
      className="block"
    >
      <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              {/* Status and Session */}
              <div className="hidden md:flex justify-center items-center gap-2 mb-2">
                {getStatusBadge(game.status)}
                {game.session?.name && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-primary/10 text-primary border-primary/20"
                  >
                    {game.session.type === "playoff" && (
                      <Trophy className="h-3 w-3 mr-1" />
                    )}
                    {game.session.name}
                  </Badge>
                )}
              </div>

              {/* Teams and Score */}
              <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
                <div className="flex justify-between flex-1 items-center">
                  <div className="team-lockup flex items-center gap-6 p-0">
                    <Image
                      src={getTeamLogoUrl(game.homeTeam.logo, "thumbnail")}
                      alt={game.homeTeam.name || "Home Team"}
                      width={72}
                      height={72}
                      className="w-10 h-10 md:w-20 md:h-20"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {game.homeTeam?.name || "Home Team"}
                      </span>
                      <span className="text-sm text-muted-foreground -mt-1">
                        Home
                      </span>
                    </div>
                  </div>
                  {game.score && (
                    <span className="text-4xl font-extrabold grotesk text-primary">
                      {game.score.homeScore}
                    </span>
                  )}
                </div>

                <div className="hidden md:flex items-center px-4">
                  <div className="text-muted-foreground font-medium">
                    {game.status === "final" ? "FINAL" : "VS"}
                  </div>
                </div>

                <div className="flex justify-between flex-1 items-center">
                  {game.score && (
                    <span className="text-4xl font-extrabold text-primary order-2 md:order-1 grotesk">
                      {game.score.awayScore}
                    </span>
                  )}
                  <div className="team-lockup md:p-2 p-0 flex items-center justify-end  gap-6 order-1 md:order-2">
                    <Image
                      src={getTeamLogoUrl(game.awayTeam.logo, "thumbnail")}
                      alt={game.awayTeam.name || "Away Team"}
                      width={72}
                      height={72}
                      className="md:order-2 w-10 h-10 md:w-20 md:h-20"
                    />
                    <div className="flex flex-col md:items-end md:text-right gap-0">
                      <span className="font-semibold text-sm">
                        {game.awayTeam?.name || "Away Team"}
                      </span>
                      <span className="text-xs text-muted-foreground -mt-1">
                        Away
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Details */}
              <div className="flex justify-center flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatGameDate(game.gameDate)}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{formatGameTime(game.gameTime)}</span>
                </div>
                {game.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{game.venue}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Section */}
          {showMap && game.venue && (
            <div className="mt-4 pt-4 border-t">
              <div className="bg-muted rounded-lg h-48 flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                  Map view coming soon
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
