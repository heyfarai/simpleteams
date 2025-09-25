'use client'

import { useSelectedTeam } from '@/components/dashboard/team-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, ArrowRight, Calendar, Trophy, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useQuery } from '@tanstack/react-query'

interface TeamWithEnrollments {
  id: string
  name: string
  primary_contact_email: string
  created_at: string
  selected_package?: string
  rosterId?: string
  sessions: {
    id: string
    name: string
    start_date: string
    end_date: string
    sequence: number
    type: string
  }[]
}

// Helper function to format date range
const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Format options
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  }

  // If same month, show "Nov 1-3"
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    if (start.getDate() === end.getDate()) {
      return start.toLocaleDateString("en-US", options)
    }
    return `${start
      .toLocaleDateString("en-US", options)
      .replace(/,.*/, "")} ${start.getDate()}-${end.getDate()}`
  }

  // Different months, show "Dec 20 - Jan 2"
  return `${start.toLocaleDateString(
    "en-US",
    options
  )} - ${end.toLocaleDateString("en-US", options)}`
}

// Custom hook to fetch user teams with session enrollments
function useUserTeamsWithEnrollments(selectedTeamId: string | null) {
  const { user } = useAuth()

  // Check if user is admin
  const isAdmin = user?.email === 'farai@me.com'

  return useQuery({
    queryKey: isAdmin ? ['admin-all-teams', selectedTeamId] : ['user-teams', user?.id, selectedTeamId],
    queryFn: async (): Promise<TeamWithEnrollments[]> => {
      if (!user?.id) {
        throw new Error('Not authenticated')
      }

      // Use all-teams endpoint for admin, user-teams for regular users
      const endpoint = isAdmin
        ? '/api/teams/all-teams'
        : `/api/teams/user-teams?userId=${user.id}${selectedTeamId ? `&teamId=${selectedTeamId}` : ''}`

      console.log('Admin check:', { userEmail: user.email, isAdmin, endpoint })

      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${isAdmin ? 'all' : 'user'} teams`)
      }
      const data = await response.json()
      console.log('Teams fetched:', data.length, 'teams')
      return data
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export default function RosterListPage() {
  const selectedTeamId = useSelectedTeam()
  const { user } = useAuth()
  const {
    data: teams = [],
    isLoading,
    error
  } = useUserTeamsWithEnrollments(selectedTeamId)

  const isAdmin = user?.email === 'farai@me.com'

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading teams</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? 'All Team Rosters (Admin)' : 'Team Rosters'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isAdmin
            ? 'Manage any team\'s roster and details'
            : selectedTeamId ? 'Manage your selected team\'s roster' : 'Select a team to manage their roster'
          }
        </p>
      </div>

      {/* Teams List */}
      {teams.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {selectedTeamId ? 'No roster found for selected team' : 'No teams found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedTeamId
                ? 'The selected team doesn\'t have an accessible roster yet.'
                : 'You don\'t have access to any teams yet.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {team.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {team.primary_contact_email}
                      </p>
                      {team.selected_package && (
                        <Badge variant="secondary" className="mt-1">
                          {team.selected_package.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Package
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Link href={`/dashboard/roster/${team.id}`}>
                    <Button>
                      Manage Roster
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                {/* Session Information */}
                {team.sessions && team.sessions.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Enrolled Sessions ({team.sessions.length})
                      </span>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {team.sessions
                        .sort((a, b) => a.sequence - b.sequence)
                        .map((session) => (
                        <div key={session.id} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-medium">
                              {session.sequence}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">
                                {session.name}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDateRange(session.start_date, session.end_date)}</span>
                                <span className="text-gray-400">•</span>
                                <span className="capitalize">{session.type}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}