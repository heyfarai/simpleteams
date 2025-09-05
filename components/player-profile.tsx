"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, Play, Mail, Instagram, Twitter, ExternalLink, Trophy, Target, BarChart3, Video } from "lucide-react"
import { samplePlayers, getTeamById } from "@/lib/sample-data"
import { useState } from "react"

interface PlayerProfileProps {
  playerId: string
}

export function PlayerProfile({ playerId }: PlayerProfileProps) {
  const player = samplePlayers.find((p) => p.id === playerId)
  const [selectedYear, setSelectedYear] = useState<string>("2024")

  if (!player) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Player Not Found</h1>
          <p className="text-muted-foreground">The requested player profile could not be found.</p>
        </div>
      </div>
    )
  }

  const team = getTeamById(player.teamId)
  const [firstName, ...lastNameParts] = player.name.split(" ")
  const lastName = lastNameParts.join(" ")

  const availableYears = player.yearlyStats
    ? [...new Set(player.yearlyStats.map((stat) => stat.year.toString()))]
    : ["2024"]
  const filteredStats = player.yearlyStats?.filter((stat) => stat.year.toString() === selectedYear) || []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Player Header */}
      <div className="mb-8">
        <div className="grid lg:grid-cols-3 gap-8 mb-6">
          {/* Player Image & Basic Info */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={player.photo || "/placeholder.svg"}
                    alt={`${player.name} - ${team?.name}`}
                    className="w-full h-80 object-cover"
                  />
                  {/* Jersey Number Badge */}
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl">
                    {player.jerseyNumber}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-1">{firstName}</h1>
                    <h2 className="text-3xl font-bold text-primary mb-2">{lastName}</h2>
                    <p className="text-lg font-semibold text-foreground">{team?.name}</p>
                    <p className="text-muted-foreground">{player.position}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-xl font-bold text-primary">{player.stats.points}</div>
                      <div className="text-xs text-muted-foreground">PPG</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-primary">{player.stats.rebounds}</div>
                      <div className="text-xs text-muted-foreground">RPG</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-primary">{player.stats.assists}</div>
                      <div className="text-xs text-muted-foreground">APG</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Player Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Player Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Class:</span>
                      <span className="font-medium">{player.gradYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Height:</span>
                      <span className="font-medium">{player.height}</span>
                    </div>
                    {player.weight && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="font-medium">{player.weight}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Position:</span>
                      <span className="font-medium">{player.position}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Division:</span>
                      <span className="font-medium">{player.division || team?.division}</span>
                    </div>
                    {player.hometown && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hometown:</span>
                        <span className="font-medium">{player.hometown}</span>
                      </div>
                    )}
                    {player.region && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Region:</span>
                        <span className="font-medium">{player.region}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Games Played:</span>
                      <span className="font-medium">{player.stats.gamesPlayed}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Bio */}
            <Card>
              <CardHeader>
                <CardTitle>About {firstName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{player.bio}</p>
              </CardContent>
            </Card>

            {/* Awards & Achievements */}
            {player.awards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Awards & Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {player.awards.map((award, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
                        <Trophy className="h-4 w-4 mr-2" />
                        {award}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Season Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Season Statistics
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filter by Year:</span>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredStats.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-muted">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Season</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">GP</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">PPG</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">RPG</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">APG</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">SPG</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">BPG</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">MPG</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">FG%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStats.map((stat, index) => (
                        <tr key={index} className="border-b border-muted/50 hover:bg-muted/30">
                          <td className="py-3 px-2 font-medium">{stat.season}</td>
                          <td className="py-3 px-2 text-center">{stat.gamesPlayed}</td>
                          <td className="py-3 px-2 text-center font-semibold text-primary">{stat.points}</td>
                          <td className="py-3 px-2 text-center font-semibold text-primary">{stat.rebounds}</td>
                          <td className="py-3 px-2 text-center font-semibold text-primary">{stat.assists}</td>
                          <td className="py-3 px-2 text-center">{stat.steals || "—"}</td>
                          <td className="py-3 px-2 text-center">{stat.blocks || "—"}</td>
                          <td className="py-3 px-2 text-center">{stat.minutes || "—"}</td>
                          <td className="py-3 px-2 text-center">
                            {stat.fieldGoalPercentage ? `${stat.fieldGoalPercentage}%` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No statistics available for {selectedYear}</div>
              )}

              {/* Session Highs */}
              {player.sessionHighs && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">Session/Tournament Highs</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {player.sessionHighs.points && (
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <div className="text-lg font-bold text-primary">{player.sessionHighs.points}</div>
                          <div className="text-xs text-muted-foreground">Points</div>
                        </div>
                      )}
                      {player.sessionHighs.rebounds && (
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <div className="text-lg font-bold text-primary">{player.sessionHighs.rebounds}</div>
                          <div className="text-xs text-muted-foreground">Rebounds</div>
                        </div>
                      )}
                      {player.sessionHighs.assists && (
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <div className="text-lg font-bold text-primary">{player.sessionHighs.assists}</div>
                          <div className="text-xs text-muted-foreground">Assists</div>
                        </div>
                      )}
                      {player.sessionHighs.steals && (
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <div className="text-lg font-bold text-primary">{player.sessionHighs.steals}</div>
                          <div className="text-xs text-muted-foreground">Steals</div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Highlight Videos */}
          {player.highlightVideos && player.highlightVideos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Highlight Reels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {player.highlightVideos.map((video, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg bg-muted/30 aspect-video mb-2">
                        <img
                          src={
                            video.thumbnail || "/placeholder.svg?height=200&width=300&query=basketball highlight video"
                          }
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Play
                          </Button>
                        </div>
                      </div>
                      <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                        {video.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scouting Notes */}
          {player.scoutingNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Scouting Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed italic">{player.scoutingNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact & Social */}
          <Card>
            <CardHeader>
              <CardTitle>Connect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {player.contactEmail && (
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <a href={`mailto:${player.contactEmail}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </a>
                </Button>
              )}

              {player.social?.instagram && (
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <a
                    href={`https://instagram.com/${player.social.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    {player.social.instagram}
                  </a>
                </Button>
              )}

              {player.social?.twitter && (
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <a
                    href={`https://twitter.com/${player.social.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    {player.social.twitter}
                  </a>
                </Button>
              )}

              {player.social?.hudl && (
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <a href={player.social.hudl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Hudl Profile
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Team Info */}
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={team?.logo || "/placeholder.svg"}
                  alt={`${team?.name} logo`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-foreground">{team?.name}</div>
                  <div className="text-sm text-muted-foreground">{team?.division}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coach:</span>
                  <span className="font-medium">{team?.coach}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Record:</span>
                  <span className="font-medium">{team?.record}</span>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 mt-4">View Team Profile</Button>
            </CardContent>
          </Card>

          {/* Share Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Share Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Share this player profile for recruiting and scouting purposes.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Copy Profile Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
