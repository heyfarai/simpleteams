"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Award } from "lucide-react";
import { fetchFeaturedPlayers } from "@/lib/data/fetch-players";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function PlayerSpotlight() {
  const { data: featuredPlayers = [], isLoading } = useQuery({
    queryKey: ["featuredPlayers"],
    queryFn: () => fetchFeaturedPlayers(4),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return (
    <section className="space-y-6 py-24">
      <div className="text-center">
        <h2 className="font-black lg:text-8xl md:text-6xl text-5xl tracking-tighter  text-foreground mb-2">
          Player Spotlight
        </h2>
        <p className="text-muted-foreground">Featuring our top performers</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <Card
                key={i}
                className="animate-pulse"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-24 h-24 bg-muted rounded-full mx-auto" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                    <div className="h-4 bg-muted rounded w-1/4 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : featuredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlayers.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
            >
              <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={player.photo || "/placeholder.svg"}
                      alt={`${player.name} - ${player.team}`}
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
                        {player.name}
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
                          {player.stats?.ppg?.toFixed?.(1) ||
                            player.stats?.ppg ||
                            0}
                        </div>
                        <div className="text-xs text-muted-foreground">PPG</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary">
                          {player.stats?.rpg?.toFixed?.(1) ||
                            player.stats?.rpg ||
                            0}
                        </div>
                        <div className="text-xs text-muted-foreground">RPG</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary">
                          {player.stats?.apg?.toFixed?.(1) ||
                            player.stats?.apg ||
                            0}
                        </div>
                        <div className="text-xs text-muted-foreground">APG</div>
                      </div>
                    </div>

                    {player.awards?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {player.awards.slice(0, 2).map((award, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            <Award className="h-3 w-3 mr-1" />
                            {award}
                          </Badge>
                        ))}
                        {player.awards.length > 2 && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                          >
                            +{player.awards.length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No featured players available
          </p>
        </div>
      )}
    </section>
  );
}
