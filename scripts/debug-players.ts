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

async function debugPlayers() {
  console.log('🔍 Testing player queries...')
  
  // Test 1: Simple leaderboard - just players with stats ordered by points
  const simpleLeadersQuery = groq`*[_type == "player" && defined(stats) && stats.points > 0] | order(stats.points desc) [0...5] {
    _id, firstName, lastName,
    stats { points, rebounds, assists, steals, blocks, minutes }
  }`
  console.log('Running simple leaders query:', simpleLeadersQuery)
  const simpleLeaders = await client.fetch(simpleLeadersQuery)
  console.log('📊 Simple leaders found:', simpleLeaders.length)
  if (simpleLeaders.length > 0) {
    console.log('Top scorer:', simpleLeaders[0])
  }

  // Test 2: Get all seasons
  const seasonQuery = groq`*[_type == "season"] | order(year desc) {
    _id, name, year, status
  }`
  console.log('\nRunning season query:', seasonQuery)
  const seasons = await client.fetch(seasonQuery)
  console.log('📊 Seasons found:', seasons.length)
  seasons.forEach((s: any) => console.log(`Season: ${s.name} (${s.year}) - ${s._id}`))

  // Test 3: Players for specific season (2025 Summer Series)
  const summerSeasonId = '1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3'
  const playersInSeasonQuery = groq`*[_type == "team" && count(rosters[season._ref == $seasonId]) > 0] {
    _id,
    name,
    "seasonPlayers": rosters[season._ref == $seasonId][0].players[] {
      player-> {
        _id,
        firstName,
        lastName,
        stats
      }
    }
  }`
  console.log('\nRunning players in season query:', playersInSeasonQuery)
  const teamsInSeason = await client.fetch(playersInSeasonQuery, { seasonId: summerSeasonId })
  console.log('📊 Teams in 2025 Summer Series:', teamsInSeason.length)
  
  let totalPlayersInSeason = 0
  teamsInSeason.forEach((team: any) => {
    totalPlayersInSeason += team.seasonPlayers?.length || 0
  })
  console.log('📊 Total players in 2025 Summer Series:', totalPlayersInSeason)
  
  if (teamsInSeason.length > 0 && teamsInSeason[0].seasonPlayers?.length > 0) {
    console.log('Sample player in season:', teamsInSeason[0].seasonPlayers[0])
  }

  // Test 4: Leaderboard for specific season
  const seasonLeadersQuery = groq`*[_type == "team" && count(rosters[season._ref == $seasonId]) > 0] {
    "players": rosters[season._ref == $seasonId][0].players[] {
      player-> {
        _id,
        firstName,
        lastName,
        stats
      }
    }
  }[].players[] | order(player.stats.points desc) [0...5]`
  console.log('\nRunning season leaders query:', seasonLeadersQuery)
  const seasonLeaders = await client.fetch(seasonLeadersQuery, { seasonId: summerSeasonId })
  console.log('📊 Season leaders found:', seasonLeaders.length)
  if (seasonLeaders.length > 0) {
    console.log('Top season scorer:', seasonLeaders[0])
  }
}

debugPlayers().catch(console.error)
