'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/supabase/auth'
import { useSelectedTeam } from '@/components/dashboard/team-selector'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

interface Team {
  id: string
  sanity_team_id: string
  name: string
  primary_contact_email: string
  created_at: string
}

export default function RosterListPage() {
  const selectedTeamId = useSelectedTeam()
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTeamIdReady, setIsTeamIdReady] = useState(false)

  // Track when selectedTeamId is initialized from localStorage
  useEffect(() => {
    // Give a moment for localStorage to be read by useSelectedTeam hook
    const timer = setTimeout(() => {
      setIsTeamIdReady(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Don't load teams until selectedTeamId is ready from localStorage
    if (!isTeamIdReady) {
      return
    }

    const loadTeams = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          setError('Not authenticated')
          setIsLoading(false)
          return
        }

        // Use Supabase client directly for user-specific team queries
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        let query = supabase
          .from('team_registrations')
          .select(`
            team_id,
            teams!inner (
              id,
              name,
              primary_contact_email,
              created_at
            )
          `)
          .eq('user_id', user.id)
          .not('team_id', 'is', null)

        // Filter by selected team if one is selected
        if (selectedTeamId) {
          query = query.eq('team_id', selectedTeamId)
        }

        const { data: registrationData, error: teamsError } = await query

        if (teamsError) {
          throw teamsError
        }

        // Transform the nested data structure from team_registrations
        const transformedTeams = registrationData?.map((reg: any) => ({
          id: reg.teams.id,
          sanity_team_id: reg.teams.id, // Using Supabase ID as sanity_team_id for now
          name: reg.teams.name,
          primary_contact_email: reg.teams.primary_contact_email,
          created_at: reg.teams.created_at
        })) || []

        setTeams(transformedTeams)

      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load teams')
      } finally {
        setIsLoading(false)
      }
    }

    loadTeams()
  }, [selectedTeamId, isTeamIdReady]) // Re-run when selected team changes or when team ID is ready

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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Team Rosters</h1>
        <p className="mt-1 text-sm text-gray-500">
          {selectedTeamId ? 'Manage your selected team\'s roster' : 'Select a team to manage their roster'}
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
        <div className="space-y-4">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
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
                    </div>
                  </div>
                  <Link href={`/dashboard/roster/${team.sanity_team_id}`}>
                    <Button>
                      Manage Roster
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}