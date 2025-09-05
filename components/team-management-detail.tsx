"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

export function TeamManagementDetail() {
  const [isEditing, setIsEditing] = useState(false)
  const [teamData, setTeamData] = useState({
    name: "Thunder Bolts",
    division: "Men's Open Division",
    coach: "Mike Johnson",
    coachEmail: "mike@thunderbolts.com",
    region: "North Springfield",
    description:
      "The Thunder Bolts are a competitive basketball team known for their fast-paced offense and tenacious defense.",
  })

  const players = [
    { id: 1, name: "Marcus Thompson", position: "Point Guard", jersey: 23, status: "Active" },
    { id: 2, name: "Tyler Rodriguez", position: "Shooting Guard", jersey: 15, status: "Active" },
    { id: 3, name: "Jordan Williams", position: "Forward", jersey: 32, status: "Active" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground">Manage team details and roster</p>
          </div>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Team
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Team Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={teamData.name}
                    onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="division">Division</Label>
                  <Select
                    value={teamData.division}
                    onValueChange={(value) => setTeamData({ ...teamData, division: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Men's Open Division">Men's Open Division</SelectItem>
                      <SelectItem value="Women's Competitive">Women's Competitive</SelectItem>
                      <SelectItem value="Youth U18">Youth U18</SelectItem>
                      <SelectItem value="Recreational League">Recreational League</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="coach">Coach Name</Label>
                  <Input
                    id="coach"
                    value={teamData.coach}
                    onChange={(e) => setTeamData({ ...teamData, coach: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="coachEmail">Coach Email</Label>
                  <Input
                    id="coachEmail"
                    type="email"
                    value={teamData.coachEmail}
                    onChange={(e) => setTeamData({ ...teamData, coachEmail: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={teamData.region}
                    onChange={(e) => setTeamData({ ...teamData, region: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Team Description</Label>
                <Textarea
                  id="description"
                  value={teamData.description}
                  onChange={(e) => setTeamData({ ...teamData, description: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Roster Management */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Team Roster</CardTitle>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        #{player.jersey}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{player.name}</div>
                        <div className="text-sm text-muted-foreground">{player.position}</div>
                      </div>
                      <Badge variant="default">{player.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Stats Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">8-2</div>
                <div className="text-sm text-muted-foreground">Season Record</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-foreground">12</div>
                  <div className="text-xs text-muted-foreground">Players</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">80%</div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium text-foreground">Player Added</div>
                <div className="text-muted-foreground">Jordan Williams joined the team</div>
                <div className="text-xs text-muted-foreground">2 days ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-foreground">Game Won</div>
                <div className="text-muted-foreground">Beat Fire Hawks 78-72</div>
                <div className="text-xs text-muted-foreground">1 week ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-foreground">Roster Updated</div>
                <div className="text-muted-foreground">Updated player positions</div>
                <div className="text-xs text-muted-foreground">2 weeks ago</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
