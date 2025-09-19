'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getCurrentUser } from '@/lib/supabase/auth'

interface TeamData {
  id: string
  name: string
  sanity_team_id: string
}

interface CachedTeamInfo {
  supabaseId: string
  sanityId: string
  name: string
}

interface TeamSelectorProps {
  onTeamChange?: (teamId: string) => void
}

export function TeamSelector({ onTeamChange }: TeamSelectorProps) {
  const [teams, setTeams] = useState<TeamData[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const loadUserTeams = async () => {
      try {

        // Get current user
        const user = await getCurrentUser()
        if (!user) {
          setIsLoading(false)
          return
        }

        // Call admin endpoint to get user teams
        const response = await fetch(`/api/admin/user-teams?userId=${user.id}`)

        if (!response.ok) {
          console.error('❌ TeamSelector: Admin API error:', response.status, response.statusText)
          setIsLoading(false)
          return
        }

        const result = await response.json()

        if (!result.success) {
          console.error('❌ TeamSelector: Error from admin API:', result.error)
          setIsLoading(false)
          return
        }

        setTeams(result.teams || [])

        // Set selected team from localStorage or default to first team
        const storedTeamId = localStorage.getItem('selectedTeamId')
        const teamToSelect = storedTeamId && result.teams?.find((t: TeamData) => t.id === storedTeamId)
          ? storedTeamId
          : result.teams?.[0]?.id || null

        if (teamToSelect) {
          const selectedTeamData = result.teams.find((t: TeamData) => t.id === teamToSelect)

          setSelectedTeam(teamToSelect)
          localStorage.setItem('selectedTeamId', teamToSelect)

          // Cache team info for other components
          if (selectedTeamData) {
            const teamInfo: CachedTeamInfo = {
              supabaseId: selectedTeamData.id,
              sanityId: selectedTeamData.sanity_team_id,
              name: selectedTeamData.name
            }
            localStorage.setItem('selectedTeamInfo', JSON.stringify(teamInfo))

            // Don't auto-navigate - let the redirect page handle it
          }

          onTeamChange?.(teamToSelect)
        } else {
        }
      } catch (error) {
        console.error('❌ TeamSelector: Error loading teams:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserTeams()
  }, [onTeamChange])

  const handleTeamChange = (teamId: string) => {
    const selectedTeamData = teams.find(t => t.id === teamId)

    setSelectedTeam(teamId)
    localStorage.setItem('selectedTeamId', teamId)

    // Cache team info for other components
    if (selectedTeamData) {
      const teamInfo: CachedTeamInfo = {
        supabaseId: selectedTeamData.id,
        sanityId: selectedTeamData.sanity_team_id,
        name: selectedTeamData.name
      }
      localStorage.setItem('selectedTeamInfo', JSON.stringify(teamInfo))

      // Navigate to roster page if we're on roster route
      if (pathname.startsWith('/dashboard/roster')) {
        const redirectUrl = `/dashboard/roster/${selectedTeamData.sanity_team_id}`
        router.push(redirectUrl)
      } else {
      }
    }

    onTeamChange?.(teamId)
  }

  if (isLoading) {
    return (
      <div className="px-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    )
  }

  if (teams.length === 0) {
    return (
      <div className="px-4">
        <p className="text-sm text-gray-500">No teams found</p>
      </div>
    )
  }

  // If only one team, show team name without selector
  if (teams.length === 1) {
    const team = teams[0]
    return (
      <div className="px-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {team.name.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">{team.name}</h2>
            <p className="text-sm text-gray-500">Team</p>
          </div>
        </div>
      </div>
    )
  }

  // Multiple teams - show selector
  const selectedTeamData = teams.find(t => t.id === selectedTeam)

  return (
    <div className="px-4">
      <Select value={selectedTeam || ''} onValueChange={handleTeamChange}>
        <SelectTrigger className="w-full border-none shadow-none p-0 h-auto">
          <SelectValue asChild>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {selectedTeamData?.name.charAt(0) || '?'}
                </span>
              </div>
              <div className="ml-3 flex-1 text-left">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedTeamData?.name || 'Select Team'}
                </h2>
                <p className="text-sm text-gray-500">Team</p>
              </div>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">
                    {team.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-gray-500">Team</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Hook to get currently selected team
export function useSelectedTeam() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('selectedTeamId')
    setSelectedTeamId(stored)

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedTeamId') {
        setSelectedTeamId(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return selectedTeamId
}

// Hook to get currently selected team info (including Sanity ID)
export function useSelectedTeamInfo(): CachedTeamInfo | null {
  const [teamInfo, setTeamInfo] = useState<CachedTeamInfo | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('selectedTeamInfo')
    if (stored) {
      try {
        setTeamInfo(JSON.parse(stored))
      } catch (error) {
        console.error('Error parsing team info from localStorage:', error)
        setTeamInfo(null)
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedTeamInfo') {
        if (e.newValue) {
          try {
            setTeamInfo(JSON.parse(e.newValue))
          } catch (error) {
            console.error('Error parsing team info from storage event:', error)
            setTeamInfo(null)
          }
        } else {
          setTeamInfo(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return teamInfo
}