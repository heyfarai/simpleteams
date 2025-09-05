import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Trophy, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface GameDetailsProps {
  gameId: string
}

export function GameDetails({ gameId }: GameDetailsProps) {
  // Mock game data - in real app, fetch based on gameId
  const game = {
    id: 1,
    homeTeam: "Thunder Bolts",
    awayTeam: "Fire Hawks",
    homeScore: 78,
    awayScore: 72,
    date: "2025-01-15",
    time: "19:00",
    venue: "Downtown Sports Complex",
    venueAddress: "123 Main St, Springfield, IL 62701",
    division: "Men's Open Division",
    status: "completed",
    isTournament: false,
    attendance: 245,
    referee: "John Smith",
    gameRecap:
      "In a thrilling matchup, the Thunder Bolts edged out the Fire Hawks 78-72 in a game that went down to the wire. Marcus Thompson led the Thunder Bolts with 24 points and 9 assists, while Tyler Rodriguez added 18 points. The Fire Hawks fought valiantly with strong performances from their starting five, but couldn't quite close the gap in the final minutes.",
    homeTeamStats: {
      fieldGoals: "28/65 (43.1%)",
      threePointers: "8/22 (36.4%)",
      freeThrows: "14/18 (77.8%)",
      rebounds: 42,
      assists: 18,
      turnovers: 12,
    },
    awayTeamStats: {
      fieldGoals: "26/62 (41.9%)",
      threePointers: "6/19 (31.6%)",
      freeThrows: "14/16 (87.5%)",
      rebounds: 38,
      assists: 15,
      turnovers: 15,
    },
    topPerformers: [
      {
        name: "Marcus Thompson",
        team: "Thunder Bolts",
        stats: "24 PTS, 4 REB, 9 AST",
      },
      {
        name: "Tyler Rodriguez",
        team: "Thunder Bolts",
        stats: "18 PTS, 6 REB, 3 AST",
      },
      {
        name: "Alex Johnson",
        team: "Fire Hawks",
        stats: "22 PTS, 8 REB, 2 AST",
      },
    ],
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/games">
          <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Schedule
          </Button>
        </Link>
      </div>

      {/* Game Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="secondary">{game.division}</Badge>
              <Badge variant={game.status === "completed" ? "default" : "outline"} className="capitalize">
                {game.status}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-muted-foreground mb-4">
              {formatDate(game.date)} • {formatTime(game.time)}
            </h1>
          </div>

          {/* Score Display */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-2">{game.homeTeam}</div>
              <div className="text-4xl font-bold text-primary">{game.homeScore}</div>
            </div>

            <div className="text-center px-6">
              <div className="text-lg font-medium text-muted-foreground">FINAL</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-2">{game.awayTeam}</div>
              <div className="text-4xl font-bold text-primary">{game.awayScore}</div>
            </div>
          </div>

          {/* Game Info */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{game.venue}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{game.attendance} Attendance</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span>Referee: {game.referee}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Recap */}
          <Card>
            <CardHeader>
              <CardTitle>Game Recap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{game.gameRecap}</p>
            </CardContent>
          </Card>

          {/* Team Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Team Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Home Team Stats */}
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-4">{game.homeTeam}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Field Goals</span>
                      <span className="font-medium">{game.homeTeamStats.fieldGoals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">3-Pointers</span>
                      <span className="font-medium">{game.homeTeamStats.threePointers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Free Throws</span>
                      <span className="font-medium">{game.homeTeamStats.freeThrows}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rebounds</span>
                      <span className="font-medium">{game.homeTeamStats.rebounds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assists</span>
                      <span className="font-medium">{game.homeTeamStats.assists}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Turnovers</span>
                      <span className="font-medium">{game.homeTeamStats.turnovers}</span>
                    </div>
                  </div>
                </div>

                {/* Away Team Stats */}
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-4">{game.awayTeam}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Field Goals</span>
                      <span className="font-medium">{game.awayTeamStats.fieldGoals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">3-Pointers</span>
                      <span className="font-medium">{game.awayTeamStats.threePointers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Free Throws</span>
                      <span className="font-medium">{game.awayTeamStats.freeThrows}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rebounds</span>
                      <span className="font-medium">{game.awayTeamStats.rebounds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assists</span>
                      <span className="font-medium">{game.awayTeamStats.assists}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Turnovers</span>
                      <span className="font-medium">{game.awayTeamStats.turnovers}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {game.topPerformers.map((player, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{player.name}</div>
                    <div className="text-sm text-muted-foreground">{player.team}</div>
                  </div>
                  <div className="text-sm font-medium text-primary">{player.stats}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Venue Map */}
          <Card>
            <CardHeader>
              <CardTitle>Venue Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-48 flex items-center justify-center mb-3">
                <img
                  src="/venue-location-map-interactive.jpg"
                  alt={`Map of ${game.venue}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="text-center">
                <div className="font-medium text-foreground">{game.venue}</div>
                <div className="text-sm text-muted-foreground">{game.venueAddress}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
