'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/supabase/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Team {
  id: string
  sanity_team_id: string
  name: string
  contact_email: string
  created_at: string
}

export default function RosterListPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          setError('Not authenticated')
          setIsLoading(false)
          return
        }

        const response = await fetch(`/api/admin/user-teams?userId=${user.id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch teams: ${response.status}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to load teams')
        }

        setTeams(result.teams || [])

      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load teams')
      } finally {
        setIsLoading(false)
      }
    }

    loadTeams()
  }, [])

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
          Select a team to manage their roster
        </p>
      </div>

      {/* Teams List */}
      {teams.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No teams found</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have access to any teams yet.
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
                        {team.contact_email}
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