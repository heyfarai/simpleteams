'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User,
  Mail,
  Phone
} from 'lucide-react'
import Link from 'next/link'
import { getCurrentUser, getUserSanityTeamId } from '@/lib/supabase/auth'
import { client } from '@/lib/sanity/client'
import { teamDetailsQuery } from '@/lib/sanity/team-queries'

interface Team {
  _id: string
  name: string
  shortName?: string
  logo?: any
  coach?: string
  region?: string
  description?: string
  homeVenue?: string
  awards?: any[]
  stats?: any
  rosters?: Roster[]
}

interface Roster {
  season: {
    _id: string
    name: string
    year: number
  }
  players?: Player[]
}

interface Player {
  player: {
    _id: string
    name: string
  }
  jerseyNumber?: number
  position?: string
  status?: string
}

export default function RosterPage() {
  const [team, setTeam] = useState<Team | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRosterData = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        const userSanityTeamId = await getUserSanityTeamId(user.id)
        if (!userSanityTeamId) return

        // Fetch team details from Sanity including roster
        const teamData = await client.fetch(teamDetailsQuery, { teamId: userSanityTeamId })
        if (!teamData) return

        setTeam(teamData)

        // Get current season's roster (assuming most recent)
        const currentRoster = teamData.rosters?.[0]
        const playersData = currentRoster?.players || []

        // Sort by jersey number
        const sortedPlayers = playersData.sort((a, b) => {
          const aNum = a.jerseyNumber || 999
          const bNum = b.jerseyNumber || 999
          return aNum - bNum
        })

        setPlayers(sortedPlayers)
        setFilteredPlayers(sortedPlayers)
      } catch (error) {
        console.error('Error loading roster data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRosterData()
  }, [])

  useEffect(() => {
    const filtered = players.filter(player =>
      player.player.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (player.position && player.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (player.jerseyNumber && player.jerseyNumber.toString().includes(searchTerm))
    )
    setFilteredPlayers(filtered)
  }, [searchTerm, players])

  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm('Are you sure you want to remove this player from the roster?')) {
      return
    }

    // TODO: Implement Sanity deletion or roster management
    alert('Player removal functionality coming soon - this would update the roster in Sanity')
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'injured':
        return 'bg-yellow-100 text-yellow-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Team not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Roster</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your team's players
            </p>
          </div>
          <Link href="/dashboard/roster/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search players by name, position, or jersey number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{players.length}</div>
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
              <div className="text-2xl font-bold text-red-600">
                {players.filter(p => p.status === 'suspended').length}
              </div>
              <div className="text-sm text-gray-500">Suspended</div>
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No players</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding your first player to the roster.
                </p>
                <div className="mt-6">
                  <Link href="/dashboard/roster/add">
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No players found</h3>
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
                        {player.jerseyNumber || '?'}
                      </span>
                    </div>
                    
                    {/* Player Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {player.player.name}
                        </h3>
                        <Badge className={getStatusColor(player.status)}>
                          {player.status || 'active'}
                        </Badge>
                      </div>
                      
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        {player.position && (
                          <span>{player.position}</span>
                        )}
                        {player.jerseyNumber && (
                          <span>#{player.jerseyNumber}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/roster/${player.player._id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePlayer(player.player._id)}
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
  )
}