import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

// Simple test query to check if we have any players at all
export const testPlayersQuery = groq`
  *[_type == "player"] {
    _id,
    name,
    firstName,
    lastName,
    stats
  }
`

// Test query to check if we have any players with stats
export const testPlayersWithStatsQuery = groq`
  *[_type == "player" && defined(stats)] {
    _id,
    name,
    firstName,
    lastName,
    stats {
      points,
      rebounds,
      assists,
      gamesPlayed
    }
  }
`

// Test function to debug data availability
export async function debugPlayerData() {
  try {
    console.log('🔍 Debugging player data...')
    
    // Check total players
    const allPlayers = await client.fetch(testPlayersQuery)
    console.log(`📊 Total players in database: ${allPlayers.length}`)
    
    if (allPlayers.length > 0) {
      console.log('Sample player:', allPlayers[0])
    }
    
    // Check players with stats
    const playersWithStats = await client.fetch(testPlayersWithStatsQuery)
    console.log(`📈 Players with stats: ${playersWithStats.length}`)
    
    if (playersWithStats.length > 0) {
      console.log('Sample player with stats:', playersWithStats[0])
    }
    
    return {
      totalPlayers: allPlayers.length,
      playersWithStats: playersWithStats.length,
      samplePlayer: allPlayers[0],
      samplePlayerWithStats: playersWithStats[0]
    }
  } catch (error) {
    console.error('❌ Error debugging player data:', error)
    return null
  }
}
