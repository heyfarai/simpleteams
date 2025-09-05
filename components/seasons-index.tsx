"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Eye, Archive, Play, Calendar, Users, MapPin } from "lucide-react"
import { adminSampleData, type AdminSeason } from "@/lib/admin-data"

export function SeasonsIndex() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredSeasons = adminSampleData.seasons.filter((season) => {
    const matchesSearch = season.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || season.status === statusFilter
    const matchesType = typeFilter === "all" || season.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Season Management</h1>
          <p className="text-muted-foreground">Create and manage basketball league seasons</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" asChild>
          <Link href="/admin/seasons/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Season
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search seasons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Regular">Regular Season</SelectItem>
                <SelectItem value="Summer">Summer League</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Seasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSeasons.map((season) => (
          <SeasonCard key={season.id} season={season} />
        ))}
      </div>

      {filteredSeasons.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No seasons found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first season to get started"}
            </p>
            <Button asChild>
              <Link href="/admin/seasons/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Season
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function SeasonCard({ season }: { season: AdminSeason }) {
  const totalConferences = season.conferences.length
  const totalDivisions = season.conferences.reduce((acc, conf) => acc + conf.divisions.length, 0)
  const totalTeams = season.conferences.reduce(
    (acc, conf) => acc + conf.divisions.reduce((divAcc, div) => divAcc + div.teams.length, 0),
    0,
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4" />
      case "completed":
        return <Archive className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "draft":
        return "outline"
      case "archived":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{season.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(season.startDate).toLocaleDateString()} - {new Date(season.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={getStatusColor(season.status)} className="flex items-center gap-1">
              {getStatusIcon(season.status)}
              {season.status}
            </Badge>
            <Badge variant="outline">{season.type}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{totalConferences}</div>
            <div className="text-xs text-muted-foreground">Conferences</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{totalDivisions}</div>
            <div className="text-xs text-muted-foreground">Divisions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{totalTeams}</div>
            <div className="text-xs text-muted-foreground">Teams</div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {season.locations.length} locations assigned
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {season.officials.length} officials assigned
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
            <Link href={`/admin/seasons/${season.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/seasons/${season.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
