"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Trophy, Calendar, Play, BarChart3, Award, MapPin, Check, X, Minus, Heart } from "lucide-react"
import {
  sampleTeams,
  sampleGames,
  sampleSeasons,
  sampleSessions,
  getPlayersByTeam,
  getTeamById,
} from "@/lib/sample-data"

interface TeamProfileProps {
  teamId: string
}

function useFollowTeam(teamId: string) {
  const [isFollowing, setIsFollowing] = useState(() => {
    if (typeof window !== "undefined") {
      const followedTeams = JSON.parse(localStorage.getItem("followedTeams") || "[]")
      return followedTeams.includes(teamId)
    }
    return false
  })

  const toggleFollow = () => {
    if (typeof window !== "undefined") {
      const followedTeams = JSON.parse(localStorage.getItem("followedTeams") || "[]")
      let updatedTeams

      if (isFollowing) {
        updatedTeams = followedTeams.filter((id: string) => id !== teamId)
      } else {
        updatedTeams = [...followedTeams, teamId]
      }

      localStorage.setItem("followedTeams", JSON.stringify(updatedTeams))
      setIsFollowing(!isFollowing)
    }
  }

  return { isFollowing, toggleFollow }
}

export function TeamProfile({ teamId }: TeamProfileProps) {
  const [selectedYear, setSelectedYear] = useState("2024")
  const { isFollowing, toggleFollow } = useFollowTeam(teamId)

  const team = getTeamById(teamId) || sampleTeams[0]
  const teamPlayers = getPlayersByTeam(team.id)

  const availableYears = Array.from(new Set(sampleSeasons.map((season) => season.year.toString())))

  const filteredSeasons = sampleSeasons.filter((season) => season.year.toString() === selectedYear)
  const filteredSessions = sampleSessions.filter((session) =>
    filteredSeasons.some((season) => season.id === session.seasonId),
  )
  const filteredGames = sampleGames.filter(
    (game) =>
      filteredSessions.some((session) => session.id === game.sessionId) &&
      (game.homeTeamId === team.id || game.awayTeamId === team.id),
  )

  const teamHighlights = [
    {
      id: "1",
      title: "Championship Game Highlights",
      thumbnail: "/basketball-championship-finals-game-thumbnail.jpg",
      duration: "8:45",
      views: "2.1K",
      date: "2024-03-15",
    },
    {
      id: "2",
      title: "Best Plays of the Season",
      thumbnail: "/basketball-top-dunks-highlight-reel-thumbnail.jpg",
      duration: "12:30",
      views: "5.8K",
      date: "2024-02-28",
    },
    {
      id: "3",
      title: "Defensive Highlights",
      thumbnail: "/basketball-best-assists-teamwork-thumbnail.jpg",
      duration: "6:22",
      views: "1.4K",
      date: "2024-01-20",
    },
  ]

  const teamStats = {
    2024: {
      wins: team.stats?.wins || 0,
      losses: team.stats?.losses || 0,
      pointsFor: team.stats?.pointsFor || 0,
      pointsAgainst: team.stats?.pointsAgainst || 0,
      gamesPlayed: team.stats?.gamesPlayed || 0,
      avgPointsFor: team.stats?.gamesPlayed ? (team.stats.pointsFor / team.stats.gamesPlayed).toFixed(1) : "0.0",
      avgPointsAgainst: team.stats?.gamesPlayed
        ? (team.stats.pointsAgainst / team.stats.gamesPlayed).toFixed(1)
        : "0.0",
      winPercentage: team.stats?.gamesPlayed ? ((team.stats.wins / team.stats.gamesPlayed) * 100).toFixed(1) : "0.0",
    },
    2023: {
      wins: 14,
      losses: 8,
      pointsFor: 1680,
      pointsAgainst: 1540,
      gamesPlayed: 22,
      avgPointsFor: "76.4",
      avgPointsAgainst: "70.0",
      winPercentage: "63.6",
    },
  }

  const currentStats = teamStats[selectedYear as keyof typeof teamStats] || teamStats[2024]

  const StreakBadge = ({ result }: { result: "W" | "L" | "T" }) => {
    const bgColor = result === "W" ? "bg-green-500" : result === "L" ? "bg-red-500" : "bg-gray-500"
    const Icon = result === "W" ? Check : result === "L" ? X : Minus

    return (
      <div className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center`}>
        <Icon className="h-3 w-3 text-white" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Team Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <img
              src={team.logo || "/placeholder.svg"}
              alt={`${team.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">{team.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <Button
                onClick={toggleFollow}
                variant={isFollowing ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${isFollowing ? "fill-current" : ""}`} />
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">
                {team.division}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {team.record} Record
              </Badge>
              {team.awards.length > 0 && (
                <Badge variant="default" className="text-sm bg-primary">
                  <Trophy className="h-3 w-3 mr-1" />
                  {team.awards[0]}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground max-w-2xl">{team.description}</p>
          </div>

          {/* Year Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Filter by Year</label>
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
        </div>

        {/* Team Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{currentStats.wins}</div>
              <div className="text-sm text-muted-foreground">Wins</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{currentStats.losses}</div>
              <div className="text-sm text-muted-foreground">Losses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{currentStats.winPercentage}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{currentStats.avgPointsFor}</div>
              <div className="text-sm text-muted-foreground">PPG</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{currentStats.avgPointsAgainst}</div>
              <div className="text-sm text-muted-foreground">OPP PPG</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{teamPlayers.length}</div>
              <div className="text-sm text-muted-foreground">Players</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-12">
        {/* Schedule Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Team Schedule - {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredGames.length > 0 ? (
              <div className="grid gap-4">
                {filteredGames.map((game) => {
                  const opponent =
                    game.homeTeamId === team.id ? getTeamById(game.awayTeamId) : getTeamById(game.homeTeamId)
                  const isHome = game.homeTeamId === team.id

                  return (
                    <Card key={game.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="font-medium text-foreground">
                                {new Date(game.date).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-muted-foreground">{game.time}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{isHome ? "vs" : "@"}</span>
                              <span className="font-medium">{opponent?.name}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{game.venue}</div>
                            <Badge variant={game.status === "completed" ? "default" : "secondary"}>{game.status}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">No games scheduled for {selectedYear}</div>
            )}
          </CardContent>
        </Card>

        {/* Roster Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Roster - {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamPlayers.map((player) => (
                <Card key={player.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={player.photo || "/placeholder.svg"}
                        alt={player.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{player.name}</div>
                        <div className="text-sm text-muted-foreground">{player.position}</div>
                        <div className="text-xs text-muted-foreground">Class of {player.gradYear}</div>
                      </div>
                      <div className="text-primary font-bold">#{player.jerseyNumber}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Games Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Game Results - {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {filteredGames
                .filter((game) => game.status === "completed")
                .map((game) => {
                  const opponent =
                    game.homeTeamId === team.id ? getTeamById(game.awayTeamId) : getTeamById(game.homeTeamId)
                  const isHome = game.homeTeamId === team.id
                  const teamScore = isHome ? game.homeScore : game.awayScore
                  const oppScore = isHome ? game.awayScore : game.homeScore
                  const won = teamScore && oppScore ? teamScore > oppScore : false

                  return (
                    <Card key={game.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={won ? "default" : "destructive"}
                              className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                            >
                              {won ? "W" : "L"}
                            </Badge>
                            <span className="font-medium">
                              {isHome ? "vs" : "@"} {opponent?.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {teamScore}-{oppScore}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(game.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {/* Highlights Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Team Highlights - {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamHighlights.map((highlight) => (
                <Card key={highlight.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative mb-3 rounded-t-lg overflow-hidden bg-muted">
                      <img
                        src={highlight.thumbnail || "/placeholder.svg"}
                        alt={highlight.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                          <Play className="h-5 w-5 text-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {highlight.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-2">
                        {highlight.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{highlight.views} views</span>
                        <span>•</span>
                        <span>{new Date(highlight.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Team Statistics - {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                  <span className="font-medium">Games Played</span>
                  <span className="font-bold text-primary">{currentStats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                  <span className="font-medium">Total Points For</span>
                  <span className="font-bold text-green-600">{currentStats.pointsFor}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                  <span className="font-medium">Total Points Against</span>
                  <span className="font-bold text-red-600">{currentStats.pointsAgainst}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                  <span className="font-medium">Point Differential</span>
                  <span
                    className={`font-bold ${(currentStats.pointsFor - currentStats.pointsAgainst) >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {currentStats.pointsFor - currentStats.pointsAgainst >= 0 ? "+" : ""}
                    {currentStats.pointsFor - currentStats.pointsAgainst}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Form</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Last 5 Games</label>
                  <div className="flex items-center gap-2">
                    {team.stats?.streak.map((result, i) => (
                      <StreakBadge key={i} result={result} />
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Season Averages</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{currentStats.avgPointsFor}</div>
                      <div className="text-xs text-muted-foreground">Points For</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{currentStats.avgPointsAgainst}</div>
                      <div className="text-xs text-muted-foreground">Points Against</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Awards Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Team Awards & Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {team.awards.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.awards.map((award, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{award}</div>
                          <div className="text-sm text-muted-foreground">{selectedYear}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">No awards recorded for {selectedYear}</div>
            )}
          </CardContent>
        </Card>

        {/* Team Info */}
        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{team.homeVenue}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Founded {team.founded}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Coach {team.coach}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
