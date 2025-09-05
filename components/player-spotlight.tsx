import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Award } from "lucide-react"
import { samplePlayers, getTeamById } from "@/lib/sample-data"
import Link from "next/link"

export function PlayerSpotlight() {
  const featuredPlayers = samplePlayers.slice(0, 4).map((player) => {
    const team = getTeamById(player.teamId)
    return {
      id: player.id,
      name: player.name,
      team: team?.name || "Unknown Team",
      position: player.position,
      jersey: player.jerseyNumber,
      stats: {
        points: player.stats.points,
        rebounds: player.stats.rebounds,
        assists: player.stats.assists,
      },
      awards: player.awards,
      image: player.photo,
      gradYear: player.gradYear,
      hasHighlight: !!player.highlightVideo,
    }
  })

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Player Spotlight</h2>
        <p className="text-muted-foreground">Featuring this week's standout performers</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredPlayers.map((player) => (
          <Link key={player.id} href={`/players/${player.id}`}>
            <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={player.image || "/placeholder.svg"}
                    alt={`${player.name} - ${player.team}`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {player.jersey}
                  </div>

                  {player.hasHighlight && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
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
                    <p className="text-sm text-primary font-medium">{player.team}</p>
                    <p className="text-xs text-muted-foreground">
                      {player.position} • Class of {player.gradYear}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-sm font-bold text-primary">{player.stats.points}</div>
                      <div className="text-xs text-muted-foreground">PPG</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-primary">{player.stats.rebounds}</div>
                      <div className="text-xs text-muted-foreground">RPG</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-primary">{player.stats.assists}</div>
                      <div className="text-xs text-muted-foreground">APG</div>
                    </div>
                  </div>

                  {player.awards.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {player.awards.slice(0, 2).map((award, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {award}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button className="w-full bg-primary hover:bg-primary/90 text-sm">View Full Profile</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
