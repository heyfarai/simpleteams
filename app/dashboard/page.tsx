'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  CreditCard, 
  Calendar,
  AlertCircle,
  Plus,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { getCurrentUser, getUserSanityTeamId } from '@/lib/supabase/auth'
import { supabase } from '@/lib/supabase/client-safe'
import { client } from '@/lib/sanity/client'
import { teamsQuery } from '@/lib/sanity/team-queries'
import { DEV_SANITY_TEAM_ID } from '@/lib/dev-context'

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
  seasonStats?: {
    wins?: number
    losses?: number
    ties?: number
    pointsFor?: number
    pointsAgainst?: number
    homeRecord?: string
    awayRecord?: string
    conferenceRecord?: string
  }
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

interface TeamPayment {
  id: string
  amount: number
  currency: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  created_at: string
  paid_at?: string
  payment_type: string
}

interface DashboardStats {
  playerCount: number
  activePlayerCount: number
  outstandingBalance: number
  lastPaymentDate: string | null
  paymentStatus: 'paid' | 'pending' | 'overdue'
}

export default function DashboardPage() {
  const [team, setTeam] = useState<Team | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentPayments, setRecentPayments] = useState<TeamPayment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        const userSanityTeamId = await getUserSanityTeamId(user.id)
        if (!userSanityTeamId) return

        // Fetch team and player data from Sanity
        const sanityData = await client.fetch(teamsQuery)
        const userTeam = sanityData.teams.find((team: Team) => team._id === userSanityTeamId)
        
        if (!userTeam) return
        setTeam(userTeam)

        // Calculate player stats from current season's roster
        const currentRoster = userTeam.rosters?.[0] // Assuming most recent roster first
        const players = currentRoster?.players || []
        const activePlayerCount = players.filter(p => p.status === 'active').length

        // Load payment data from Supabase
        const { data: payments, error: paymentsError } = await supabase
          .from('team_payments')
          .select('*')
          .eq('sanity_team_id', userSanityTeamId)
          .order('created_at', { ascending: false })
          .limit(5)

        if (paymentsError) {
          console.warn('Error loading payments:', paymentsError)
        }

        // Calculate payment stats
        const outstandingBalance = payments
          ?.filter(p => p.status === 'pending')
          .reduce((sum, p) => sum + p.amount, 0) || 0

        const lastPayment = payments?.find(p => p.status === 'completed')
        
        setStats({
          playerCount: players.length,
          activePlayerCount,
          outstandingBalance,
          lastPaymentDate: lastPayment?.paid_at || null,
          paymentStatus: outstandingBalance > 0 ? 'pending' : 'paid'
        })

        setRecentPayments(payments || [])
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!team || !stats) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </div>
    )
  }

  const getPaymentStatusColor = (status: 'paid' | 'pending' | 'overdue') => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back to {team.name}'s dashboard
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/dashboard/roster/add">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Status Alert */}
      {stats.paymentStatus !== 'paid' && (
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Payment Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Your team registration payment is {stats.paymentStatus}. 
                    Complete your payment to ensure your team's participation.
                  </p>
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/payments">
                    <Button size="sm" variant="outline">
                      View Payments
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Players */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Players
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.playerCount}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Players */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Players
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.activePlayerCount}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Payment Status
                  </dt>
                  <dd className="mt-1">
                    <Badge className={getPaymentStatusColor(stats.paymentStatus)}>
                      {stats.paymentStatus.charAt(0).toUpperCase() + stats.paymentStatus.slice(1)}
                    </Badge>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Balance */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Outstanding Balance
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${(stats.outstandingBalance / 100).toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Info */}
        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Team Name</dt>
                <dd className="text-sm text-gray-900">{team.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Short Name</dt>
                <dd className="text-sm text-gray-900">{team.shortName || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Region</dt>
                <dd className="text-sm text-gray-900">
                  {team.region || 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Coach</dt>
                <dd className="text-sm text-gray-900">{team.coach || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Home Venue</dt>
                <dd className="text-sm text-gray-900">
                  {team.homeVenue || 'Not specified'}
                </dd>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm">
                  Edit Team Info
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <p className="text-sm text-gray-500">No payment history</p>
            ) : (
              <div className="space-y-3">
                {recentPayments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {payment.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${(payment.amount / 100).toFixed(2)}
                      </p>
                      <Badge
                        size="sm"
                        className={
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link href="/dashboard/payments">
                <Button variant="outline" size="sm">
                  View All Payments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}