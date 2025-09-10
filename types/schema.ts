export type GameStatus = 'scheduled' | 'in-progress' | 'final' | 'cancelled'

export interface Team {
  _id: string
  name: string
  logo?: {
    asset: {
      url: string
    }
  }
  division?: Division
}

export interface Division {
  _id: string
  name: string
  order: number
}

export interface Session {
  _id: string
  name: string
  type: 'regular' | 'playoff' | 'tournament'
  startDate: string
  endDate?: string
  division?: Division
  season?: Season
}

export interface Season {
  _id: string
  name: string
  year: number
  startDate: string
  endDate?: string
}

export interface Game {
  _id: string
  gameNumber: number
  gameDate: string
  gameTime: string
  status: GameStatus
  homeTeam: Team
  awayTeam: Team
  score?: {
    homeScore: number
    awayScore: number
  }
  session: Session
  season: Season
  venue?: string
  venueAddress?: string
}

export interface PaginatedGames {
  games: Game[]
  total: number
}
