"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Volume2, VolumeX, Calendar, Clock, MapPin } from "lucide-react";

export function HeroSection() {
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(true);

  const nextGame = {
    homeTeam: "ONL-X Senior",
    awayTeam: "Kingmo Elite",
    date: "January 25, 2025",
    time: "7:30 PM",
    venue: "Downtown Sports Complex",
  };

  return (
    <section className="relative max-h-[80vh] min-h-[600px] w-full overflow-hidden bg-gradient-to-br from-black/80 to-black/10 flex">
      <div className="hidden lg:w-1/3 bg-black/80 backdrop-blur-sm">
        <Card className="m-4 bg-white/95 backdrop-blur-sm border-primary/20 flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-center text-primary">
              Next Game
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Teams */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                <span className="text-foreground">{nextGame.homeTeam}</span>
                <span className="text-primary font-bold">VS</span>
                <span className="text-foreground">{nextGame.awayTeam}</span>
              </div>
            </div>

            {/* Game Details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{nextGame.date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{nextGame.time}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{nextGame.venue}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-xs"
              >
                Register Now
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs bg-transparent"
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative flex-1 lg:w-2/3">
        {/* Hero Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16">
            <div className="text-white text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 text-balance">
                National Capital Hoops Circuit
              </h1>
              <p className="text-lg md:text-xl mb-6 text-pretty opacity-90">
                Where champions will rise in the Capital.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="default"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Register for 2025-26 Season
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
