"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Clock } from "lucide-react";

export function NextSessionCard() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Mock next game data
  const nextGame = {
    homeTeam: "ONL-X Senior",
    awayTeam: "Kingmo Elite",
    date: "November 1, 2025",
    time: "7:30 PM",
    venue: "Downtown Sports Complex",
    address: "123 Main St, Springfield, IL",
  };

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date("2025-11-01T19:30:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="border-black/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Next Session: West Capital
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Teams */}
        <div className="hidden text-center">
          <div className="flex items-center justify-center gap-4 text-xl font-semibold">
            <span className="text-foreground">{nextGame.homeTeam}</span>
            <span className="text-primary font-bold">VS</span>
            <span className="text-foreground">{nextGame.awayTeam}</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-4 text-center">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div
              key={unit}
              className="bg-black/90 rounded-lg p-5"
            >
              <div className="text-4xl font-bold text-primary">{value}</div>
              <div className="text-sm text-white capitalize">{unit}</div>
            </div>
          ))}
        </div>

        {/* Game Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{nextGame.date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{nextGame.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{nextGame.venue}</span>
          </div>
        </div>

        {/* Embedded Map Placeholder */}
        <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
          <img
            src="/map-showing-sports-complex-location.jpg"
            alt="Venue location map"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 bg-primary hover:bg-primary/90">
            View Details
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
          >
            Add to Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
