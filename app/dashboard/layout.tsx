'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  CreditCard, 
  Settings, 
  Home,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { getCurrentUser, signOut, getUserSanityTeamId } from '@/lib/supabase/auth'
import { client } from '@/lib/sanity/client'
import { teamDetailsQuery } from '@/lib/sanity/team-queries'

interface Team {
  _id: string
  name: string
  shortName?: string
  region?: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Roster', href: '/dashboard/roster', icon: Users },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push('/login')
          return
        }

        const userSanityTeamId = await getUserSanityTeamId(user.id)
        if (!userSanityTeamId) {
          router.push('/register')
          return
        }

        // Fetch team details from Sanity
        const teamData = await client.fetch(teamDetailsQuery, { teamId: userSanityTeamId })
        if (!teamData) {
          router.push('/register')
          return
        }

        setTeam(teamData)
      } catch (error) {
        console.error('Error loading user data:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!team) {
    return null
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <SidebarContent team={team} onSignOut={handleSignOut} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent team={team} onSignOut={handleSignOut} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden">
          <div className="relative flex-shrink-0 flex h-16 bg-white shadow">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex">
                <div className="w-full flex items-center">
                  <h1 className="text-lg font-semibold text-gray-900">{team.name}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ team, onSignOut }: { team: Team; onSignOut: () => void }) {
  return (
    <div className="flex flex-col h-full bg-white shadow-sm">
      {/* Logo/Team Info */}
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {team.name.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">{team.name}</h2>
            <p className="text-sm text-gray-500">{team.region || 'No region'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Icon className="mr-3 h-6 w-6 flex-shrink-0" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Sign out */}
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="flex-shrink-0 w-full group block"
        >
          <div className="flex items-center">
            <LogOut className="inline-block h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Sign out
              </p>
            </div>
          </div>
        </Button>
      </div>
    </div>
  )
}