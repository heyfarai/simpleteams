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

async function debugFilters() {
  console.log('🔍 Testing filter queries...')
  
  // Test 1: Get all seasons for filter dropdown
  const seasonsQuery = groq`*[_type == "season"] | order(year desc) {
    _id, name, year, status
  }`
  console.log('Running seasons query:', seasonsQuery)
  const seasons = await client.fetch(seasonsQuery)
  console.log('📊 Seasons found:', seasons.length)
  seasons.forEach((s: any) => console.log(`  - ${s.name} (${s.year}) [${s.status}] - ID: ${s._id}`))

  // Test 2: Get divisions for filter dropdown
  const divisionsQuery = groq`*[_type == "division"] {
    _id, name, ageGroup, skillLevel
  }`
  console.log('\nRunning divisions query:', divisionsQuery)
  const divisions = await client.fetch(divisionsQuery)
  console.log('📊 Divisions found:', divisions.length)
  divisions.forEach((d: any) => console.log(`  - ${d.name} (${d.ageGroup}, ${d.skillLevel}) - ID: ${d._id}`))

  // Test 3: Get teams for filter dropdown
  const teamsQuery = groq`*[_type == "team"] | order(name asc) {
    _id, name, shortName
  }`
  console.log('\nRunning teams query:', teamsQuery)
  const teams = await client.fetch(teamsQuery)
  console.log('📊 Teams found:', teams.length)
  teams.slice(0, 5).forEach((t: any) => console.log(`  - ${t.name} (${t.shortName}) - ID: ${t._id}`))

  // Test 4: Test season filtering - get players for specific season
  const testSeasonId = seasons[1]._id // Use the 2025 Summer Series (has data)
  console.log(`\n🧪 Testing season filter with: ${seasons[1].name} (${testSeasonId})`)
  
  const playersInSeasonQuery = groq`*[_type == "team" && count(rosters[season._ref == $seasonId]) > 0] {
    _id,
    name,
    "roster": rosters[season._ref == $seasonId][0] {
      season-> { _id, name, year },
      players[] {
        player-> {
          _id,
          firstName,
          lastName
        }
      }
    }
  }`
  
  const teamsInSeason = await client.fetch(playersInSeasonQuery, { seasonId: testSeasonId })
  console.log('📊 Teams in selected season:', teamsInSeason.length)
  
  let totalPlayersInSeason = 0
  teamsInSeason.forEach((team: any) => {
    const playerCount = team.roster?.players?.length || 0
    totalPlayersInSeason += playerCount
    console.log(`  - ${team.name}: ${playerCount} players`)
  })
  console.log('📊 Total players in season:', totalPlayersInSeason)

  // Test 5: Check if divisions are at roster level
  console.log('\n🧪 Testing roster-level divisions...')
  const rosterDivisionQuery = groq`*[_type == "team"] {
    _id, name,
    rosters[] {
      season-> { _id, name },
      division-> { _id, name, ageGroup, skillLevel },
      players[0...2] {
        player-> { _id, firstName, lastName }
      }
    }
  }`
  
  const teamsWithRosterDivisions = await client.fetch(rosterDivisionQuery)
  console.log('📊 Teams with roster divisions:', teamsWithRosterDivisions.length)
  teamsWithRosterDivisions.slice(0, 3).forEach((team: any) => {
    console.log(`  - ${team.name}:`)
    team.rosters?.forEach((roster: any) => {
      console.log(`    Season: ${roster.season?.name}, Division: ${roster.division?.name || 'None'}`)
    })
  })

  // Test 6: Combined filter options query (what the UI uses)
  const filterOptionsQuery = groq`{
    "seasons": *[_type == "season"] | order(year desc) {
      _id, name, year, status
    },
    "divisions": *[_type == "division"] {
      _id, name, ageGroup, skillLevel
    },
    "teams": *[_type == "team"] | order(name asc) {
      _id, name, shortName
    }
  }`
  
  console.log('\n🧪 Testing combined filter options query...')
  const filterOptions = await client.fetch(filterOptionsQuery)
  console.log('📊 Filter options structure:')
  console.log(`  - Seasons: ${filterOptions.seasons?.length || 0}`)
  console.log(`  - Divisions: ${filterOptions.divisions?.length || 0}`)
  console.log(`  - Teams: ${filterOptions.teams?.length || 0}`)
}

debugFilters().catch(console.error)
