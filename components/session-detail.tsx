"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Filter,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  getSessionById,
  getGamesBySession,
  getAdminTeamById,
  getLocationById,
  getDivisionById,
} from "@/lib/admin-data";

interface SessionDetailProps {
  sessionId: string;
}

export function SessionDetail({ sessionId }: SessionDetailProps) {
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);

  const session = getSessionById(sessionId);
  const games = getGamesBySession(sessionId);

  if (!session) {
    return <div>Session not found</div>;
  }

  const filteredGames = games.filter((game) => {
    const matchesDivision =
      divisionFilter === "all" || game.divisionId === divisionFilter;
    const matchesStatus =
      statusFilter === "all" || game.status === statusFilter;
    return matchesDivision && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "postponed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "Regular":
        return "bg-blue-100 text-blue-800";
      case "Playoff":
        return "bg-orange-100 text-orange-800";
      case "Tournament":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={`/admin/seasons/${session.seasonId}/sessions`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sessions
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{session.name}</h1>
            <Badge className={getSessionTypeColor(session.type)}>
              {session.type}
            </Badge>
          </div>
          <div className="flex items-center text-gray-600 gap-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(session.startDate).toLocaleDateString()} -{" "}
              {new Date(session.endDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              {games.length} games
            </div>
          </div>
          {session.description && (
            <p className="text-gray-600 mt-2">{session.description}</p>
          )}
        </div>
        <Button
          onClick={() => setShowCreateGameModal(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Game
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={divisionFilter}
              onValueChange={setDivisionFilter}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                <SelectItem value="div-1">Diamond Division</SelectItem>
                <SelectItem value="div-2">Premier Division</SelectItem>
                <SelectItem value="div-3">Development Division</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="postponed">Postponed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Games List */}
      <div className="space-y-4">
        {filteredGames.map((game) => {
          const homeTeam = getAdminTeamById(game.homeTeamId);
          const awayTeam = getAdminTeamById(game.awayTeamId);
          const location = getLocationById(game.locationId);
          const division = getDivisionById(game.divisionId);

          return (
            <Card
              key={game.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {awayTeam?.name || "TBD"}
                        </span>
                        <span className="text-gray-500">@</span>
                        <span className="font-semibold">
                          {homeTeam?.name || "TBD"}
                        </span>
                      </div>
                      <Badge className={getStatusColor(game.status)}>
                        {game.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(game.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {game.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {location?.name || "TBD"}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {division?.name || "TBD"}
                      </div>
                    </div>

                    {game.notes && (
                      <p className="text-sm text-gray-600 mt-2">{game.notes}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      Edit Game
                    </Button>
                    {game.status === "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        View Recap
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredGames.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              No games found matching your criteria.
            </p>
            <Button
              onClick={() => setShowCreateGameModal(true)}
              className="mt-4 bg-orange-600 hover:bg-orange-700"
            >
              Schedule First Game
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
