"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, Plus, Filter } from "lucide-react"
import Link from "next/link"
import { getAdminSeasonById, getSessionsBySeason, getGamesBySession } from "@/lib/admin-data"

interface SessionsListProps {
  seasonId: string
}

export function SessionsList({ seasonId }: SessionsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const season = getAdminSeasonById(seasonId)
  const sessions = getSessionsBySeason(seasonId)

  if (!season) {
    return <div>Season not found</div>
  }

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || session.type === typeFilter
    return matchesSearch && matchesType
  })

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "Regular":
        return "bg-blue-100 text-blue-800"
      case "Playoff":
        return "bg-orange-100 text-orange-800"
      case "Tournament":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-600">{season.name}</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Session
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Playoff">Playoff</SelectItem>
                <SelectItem value="Tournament">Tournament</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSessions.map((session) => {
          const games = getGamesBySession(session.id)
          return (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{session.name}</CardTitle>
                  <Badge className={getSessionTypeColor(session.type)}>{session.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(session.startDate).toLocaleDateString()} - {new Date(session.endDate).toLocaleDateString()}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {games.length} games scheduled
                </div>

                {session.description && <p className="text-sm text-gray-600">{session.description}</p>}

                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Link href={`/admin/sessions/${session.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredSessions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No sessions found matching your criteria.</p>
            <Button onClick={() => setShowCreateModal(true)} className="mt-4 bg-orange-600 hover:bg-orange-700">
              Create First Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
