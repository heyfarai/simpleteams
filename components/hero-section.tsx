"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Volume2, VolumeX, Calendar, Clock, MapPin } from "lucide-react"

export function HeroSection() {
  const [isMuted, setIsMuted] = useState(true)
  const [showPlayButton, setShowPlayButton] = useState(true)

  const nextGame = {
    homeTeam: "Thunder Bolts",
    awayTeam: "Fire Hawks",
    date: "January 25, 2025",
    time: "7:30 PM",
    venue: "Downtown Sports Complex",
  }

  return (
    <section className="relative max-h-[33vh] min-h-[400px] w-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/10 flex">
      <div className="hidden lg:flex lg:w-1/3 bg-black/80 backdrop-blur-sm">
        <Card className="m-4 bg-white/95 backdrop-blur-sm border-primary/20 flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-center text-primary">Next Game</CardTitle>
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
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">
                Register Now
              </Button>
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative flex-1 lg:w-2/3">
        {/* Background Video Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20">
          <img
            src="/basketball-game-action-shot-with-players-dunking.jpg"
            alt="Basketball game highlights"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Video Controls Overlay */}
        <div className="absolute top-6 right-6 flex gap-2 z-20">
          <Button
            variant="secondary"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white border-0"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        {/* Play Button Overlay */}
        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-6 shadow-2xl"
              onClick={() => setShowPlayButton(false)}
            >
              <Play className="h-8 w-8 ml-1" />
            </Button>
          </div>
        )}

        {/* Hero Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
            <div className="max-w-xl text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 text-balance">National Capital Hoops Circuit</h1>
              <p className="text-lg md:text-xl mb-6 text-pretty opacity-90">
                Where champions are made and legends are born.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Join the League
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
                >
                  Watch Highlights
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
