import { client } from '@/lib/sanity/client'
import { playerProfileQuery } from '@/lib/sanity/player-profile-queries'

export interface PlayerProfile {
  _id: string
  name: string
  firstName: string
  lastName: string
  personalInfo: {
    gradYear: number
    height: string
    weight?: number
    hometown: string
  }
  photo?: {
    asset: {
      _ref: string
    }
  }
  stats: {
    points: number
    rebounds: number
    assists: number
    steals: number
    blocks: number
    minutes: number
    fieldGoalPercentage: number
    gamesPlayed: number
  }
  yearlyStats?: Array<{
    year: number
    season: string
    gamesPlayed: number
    points: number
    rebounds: number
    assists: number
    steals: number
    blocks: number
    minutes: number
    fieldGoalPercentage: number
  }>
  sessionHighs?: {
    points: number
    rebounds: number
    assists: number
    steals: number
    blocks: number
    minutes: number
  }
  bio?: string
  highlightVideos?: Array<{
    title: string
    url: string
    thumbnail?: string
  }>
  awards?: string[]
  social?: {
    instagram?: string
    twitter?: string
    hudl?: string
  }
  team?: {
    _id: string
    name: string
    division: string
    coach?: string
    record?: string
    logo?: string
  }
}

export async function fetchPlayerProfile(playerId: string): Promise<PlayerProfile | null> {
  try {
    const player = await client.fetch<PlayerProfile>(playerProfileQuery, { playerId })
    
    if (!player) return null


    return player
  } catch (error) {
    console.error('Error fetching player profile:', error)
    return null
  }
}
