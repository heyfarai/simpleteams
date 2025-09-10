import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
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

async function debugQuery() {
  try {
    const teamId = '13111760-ab34-4d1e-a512-cfe0c830312e';
    
    // Query the team with roster data
    const query = `*[_type == "team" && _id == $teamId][0] {
      _id,
      name,
      rosters[] {
        "season": season->{
          _id,
          name,
          year
        },
        seasonStats {
          wins,
          losses,
          ties,
          pointsFor,
          pointsAgainst,
          homeRecord,
          awayRecord,
          conferenceRecord
        }
      }
    }`
    console.log('\nQuerying team...')
    const result = await client.fetch(query, { teamId })
    console.log('Query result:', JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('Error:', error)
  }
}

debugQuery()
