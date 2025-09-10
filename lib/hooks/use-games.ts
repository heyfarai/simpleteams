import { useQuery } from '@tanstack/react-query'
import { createClient } from '@sanity/client'
import { groq } from 'next-sanity'

// Create client for NCHC project where our games data is
const nchcClient = createClient({
  projectId: 'your-nchc-project-id', // TODO: Replace with actual project ID
  dataset: 'production',
  apiVersion: '2024-09-07',
  useCdn: false,
})

interface GameFilters {
  seasonId?: string
  sessionId?: string
}

interface Game {
  _id: string
  gameNumber: number
  gameDate: string
  gameTime: string
  status: string
  homeTeam: {
    _id: string
    name: string
  }
  awayTeam: {
    _id: string
    name: string
  }
  score: {
    homeScore: number
    awayScore: number
  }
  session: {
    _id: string
    name: string
    type: string
  }
  season: {
    _id: string
    name: string
    year: number
  }
}

// Get latest defaults
const defaultsQuery = groq`{
  "season": *[_type == "season"] | order(startDate desc)[0] {
    _id,
    year,
    name,
    "activeSession": *[_type == "session" && references(^._id) && isActive == true] | order(startDate desc)[0] {
      _id,
      name,
      type
    }
  }
}`

// Get filtered games
const gamesQuery = groq`*[_type == "game" && season._ref == $seasonId && session._ref == $sessionId] | order(gameDate desc) {
  _id,
  gameNumber,
  gameDate,
  gameTime,
  status,
  homeTeam->{
    _id,
    name
  },
  awayTeam->{
    _id,
    name
  },
  score,
  session->{
    _id,
    name,
    type
  },
  season->{
    _id,
    name,
    year
  }
}`

export function useGames(filters?: GameFilters) {
  // First get defaults if no filters provided
  const defaultsResult = useQuery({
    queryKey: ['games', 'defaults'],
    queryFn: async () => {
      const defaults = await nchcClient.fetch(defaultsQuery)
      return defaults
    },
    enabled: !filters?.seasonId || !filters?.sessionId
  })

  // Then get games using either provided filters or defaults
  const gamesResult = useQuery({
    queryKey: ['games', filters?.seasonId || defaultsResult.data?.season?._id, filters?.sessionId || defaultsResult.data?.season?.activeSession?._id],
    queryFn: async () => {
      const games = await nchcClient.fetch(gamesQuery, {
        seasonId: filters?.seasonId || defaultsResult.data?.season?._id,
        sessionId: filters?.sessionId || defaultsResult.data?.season?.activeSession?._id
      })
      return games as Game[]
    },
    enabled: Boolean(filters?.seasonId || defaultsResult.data?.season?._id)
  })

  return {
    defaults: defaultsResult.data,
    games: gamesResult.data || [],
    isLoading: defaultsResult.isLoading || gamesResult.isLoading,
    error: defaultsResult.error || gamesResult.error
  }
}
