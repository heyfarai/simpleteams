import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import { groq } from 'next-sanity'

// Load environment variables from .env.local
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-03-07',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
})

async function debugLeaderboards() {
  console.log('🔍 Testing leaderboard functionality...')
  
  // Test 1: Simple points leaders query
  console.log('\n📊 Testing simple points leaders:')
  const pointsQuery = groq`*[_type == "player" && defined(stats) && stats.points > 0] | order(stats.points desc) [0...5] {
    _id, firstName, lastName, stats { points, rebounds, assists }
  }`
  const pointsLeaders = await client.fetch(pointsQuery)
  console.log(`Points leaders found: ${pointsLeaders.length}`)
  pointsLeaders.forEach((player: any, i: number) => {
    console.log(`${i + 1}. ${player.firstName} ${player.lastName} - ${player.stats.points} ppg`)
  })

  // Test 2: Players in 2025 Summer Series with stats
  const summerSeasonId = '1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3'
  console.log('\n📊 Testing 2025 Summer Series players with stats:')
  const summerPlayersQuery = groq`*[_type == "team" && count(rosters[season._ref == $seasonId]) > 0] {
    _id, name,
    "roster": rosters[season._ref == $seasonId][0] {
      season-> { _id, name, year },
      players[] {
        player-> {
          _id, firstName, lastName, stats
        }
      }
    }
  }`
  
  const summerTeams = await client.fetch(summerPlayersQuery, { seasonId: summerSeasonId })
  console.log(`Summer teams: ${summerTeams.length}`)
  
  let summerPlayersWithStats = 0
  summerTeams.forEach((team: any) => {
    const playersWithStats = team.roster?.players?.filter((p: any) => p.player?.stats?.points > 0) || []
    summerPlayersWithStats += playersWithStats.length
    if (playersWithStats.length > 0) {
      console.log(`${team.name}: ${playersWithStats.length} players with stats`)
      playersWithStats.slice(0, 2).forEach((p: any) => {
        console.log(`  - ${p.player.firstName} ${p.player.lastName}: ${p.player.stats.points} ppg`)
      })
    }
  })
  console.log(`Total summer players with stats: ${summerPlayersWithStats}`)

  // Test 3: Other stat categories
  console.log('\n🏆 Testing other stat categories:')
  const categories = [
    { name: 'rebounds', field: 'rebounds' },
    { name: 'assists', field: 'assists' },
    { name: 'steals', field: 'steals' },
    { name: 'blocks', field: 'blocks' }
  ]
  
  for (const category of categories) {
    const query = groq`*[_type == "player" && defined(stats) && stats.${category.field} > 0] | order(stats.${category.field} desc) [0...3] {
      _id, firstName, lastName, stats
    }`
    const leaders = await client.fetch(query)
    console.log(`${category.name.toUpperCase()} leaders: ${leaders.length}`)
    if (leaders.length > 0) {
      const top = leaders[0]
      console.log(`  Top: ${top.firstName} ${top.lastName} - ${top.stats[category.field]} ${category.field}`)
    }
  }
}

debugLeaderboards().catch(console.error)
