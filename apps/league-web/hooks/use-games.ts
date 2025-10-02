import { useQuery } from '@tanstack/react-query'
import { fetchGames, fetchGameById } from '@simpleteams/database'
import type { Game } from '@simpleteams/types'

interface UseGamesOptions {
  season?: string
  session?: string
  division?: string
  status?: string
  pageSize?: number
  includeArchived?: boolean
}

interface GamesQueryResult {
  games: Game[]
  total: number
}

export function useGames({
  season,
  session,
  division,
  status,
  pageSize = 50,
  includeArchived = false,
}: UseGamesOptions = {}) {
  return useQuery({
    queryKey: ['games', season || 'all', session || 'all', division || 'all', status || 'all', includeArchived ? 'archived' : 'active'],
    queryFn: () => fetchGames({
      season,
      session,
      division,
      status,
      page: 1,
      pageSize,
    }),
  })
}

export function useGame(id: string) {
  return useQuery({
    queryKey: ['game', id],
    queryFn: () => fetchGameById(id),
    enabled: !!id,
  })
}
