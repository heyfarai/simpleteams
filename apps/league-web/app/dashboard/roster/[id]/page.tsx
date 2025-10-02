"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, User } from "lucide-react";
import Link from "next/link";
import { playerRepository, teamRepository } from "@/lib/repositories/factory";
import type { Player, Team } from "@/lib/domain/models";

export default function TeamRosterPage() {
  const params = useParams();
  const teamId = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [seasonId, setSeasonId] = useState<string | null>(null);

  // Load team data when teamId changes
  useEffect(() => {
    const loadTeamData = async () => {
      if (!teamId) {
        setTeam(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const teamData = await teamRepository.findById(teamId);

        if (!teamData) {
          setTeam(null);
          return;
        }

        setTeam(teamData);
      } catch (error) {
        console.error("Error loading team:", error);
        setTeam(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamData();
  }, [teamId]);

  // Load roster data when team loads
  useEffect(() => {
    const loadRosterData = async () => {
      if (!teamId) {
        setPlayers([]);
        setFilteredPlayers([]);
        return;
      }

      try {
        // Get players for this team (including inactive players)
        const playersData = await playerRepository.findByTeam(teamId, true);

        // Sort by jersey number
        const sortedPlayers = playersData.sort((a, b) => {
          const aNum = a.jersey || 999;
          const bNum = b.jersey || 999;
          return aNum - bNum;
        });

        setPlayers(sortedPlayers);
        setFilteredPlayers(sortedPlayers);
      } catch (error) {
        console.error("Error loading roster:", error);
        setPlayers([]);
        setFilteredPlayers([]);
      }
    };

    loadRosterData();
  }, [teamId]);

  useEffect(() => {
    const filtered = players.filter(
      (player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (player.position &&
          player.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (player.jersey && player.jersey.toString().includes(searchTerm))
    );
    setFilteredPlayers(filtered);
  }, [searchTerm, players]);

  const handleDeletePlayer = async (playerId: string) => {
    if (
      !confirm("Are you sure you want to remove this player from the roster?")
    ) {
      return;
    }

    try {
      console.log("🗑️ Removing player from roster:", playerId);
      await playerRepository.softDelete(playerId);

      // Refresh the roster data to reflect the removal
      const playersData = await playerRepository.findByTeam(teamId, true);
      const sortedPlayers = playersData.sort((a, b) => {
        const aNum = a.jersey || 999;
        const bNum = b.jersey || 999;
        return aNum - bNum;
      });
      setPlayers(sortedPlayers);
      setFilteredPlayers(sortedPlayers);

      console.log("✅ Player removed from roster successfully");
    } catch (error) {
      console.error("Error removing player:", error);
      alert("Failed to remove player. Please try again.");
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "injured":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "removed":
        return "bg-gray-100 text-gray-500";
      default:
        return "bg-green-100 text-green-800"; // Default to active
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Team not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {team.name} Roster
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your team's players
            </p>
          </div>
          <Link href={`/dashboard/roster/${teamId}/add`}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search players by name, position, or jersey number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {players.length}
                </div>
                <div className="text-sm text-gray-500">Total Players</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {players.filter(p => p.status === 'active').length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {players.filter(p => p.status === 'injured').length}
                </div>
                <div className="text-sm text-gray-500">Injured</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {players.filter(p => p.status === 'inactive' || p.status === 'removed').length}
                </div>
                <div className="text-sm text-gray-500">Inactive</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player List */}
        {filteredPlayers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              {players.length === 0 ? (
                <>
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No players
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding your first player to the roster.
                  </p>
                  <div className="mt-6">
                    <Link href={`/dashboard/roster/${teamId}/add`}>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Player
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No players found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search criteria.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPlayers.map((player) => (
              <Card key={player.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Jersey Number */}
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900">
                          {player.jersey || "?"}
                        </span>
                      </div>

                      {/* Player Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {player.name}
                          </h3>
                          <Badge className={getStatusColor(player.status)}>
                            {player.status || 'active'}
                          </Badge>
                        </div>

                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          {player.position && <span>{player.position}</span>}
                          {player.jersey && <span>#{player.jersey}</span>}
                          {player.height && <span>{player.height}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/roster/${teamId}/${player.id}/edit`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePlayer(player.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
