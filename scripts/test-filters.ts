import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.SANITY_API_TOKEN) {
  throw new Error('SANITY_API_TOKEN is required')
}

const client = createClient({
  projectId: '6bhzpimk',
  dataset: 'dev',
  apiVersion: '2024-03-07',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
})

async function testFilters() {
  try {
    // Test 1: Get all seasons
    console.log('\nTest 1: Fetching seasons...')
    const seasons = await client.fetch(`*[_type == "season"] {
      _id,
      name,
      year,
      activeDivisions[] {
        division->,
        status
      }
    }`)
    console.log('Seasons:', JSON.stringify(seasons, null, 2))

    if (seasons.length > 0) {
      const testSeason = seasons[0]
      
      // Test 2: Get teams for a specific season
      console.log('\nTest 2: Fetching teams for season:', testSeason.name)
      const teams = await client.fetch(`*[_type == "team" && references($seasonId)] {
        _id,
        name,
        division->{
          _id,
          name
        },
        stats
      }`, { seasonId: testSeason._id })
      console.log('Teams:', JSON.stringify(teams, null, 2))

      // Test 3: Get divisions for a specific season
      console.log('\nTest 3: Fetching divisions for season:', testSeason.name)
      const divisions = await client.fetch(`*[_type == "division" && references($seasonId)] {
        _id,
        name,
        season->
      }`, { seasonId: testSeason._id })
      console.log('Divisions:', JSON.stringify(divisions, null, 2))
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

testFilters()
