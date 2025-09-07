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
    // Create a test team
    console.log('Creating test team...')
    const testTeam = await client.create({
      _type: 'team',
      name: 'Test Team',
      stats: {
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        gamesPlayed: 0
      }
    })
    console.log('Created team:', testTeam)

    // Query the team
    const query = `*[_type == "team" && _id == $id][0] {
      _id,
      name,
      stats
    }`
    console.log('\nQuerying team...')
    const result = await client.fetch(query, { id: testTeam._id })
    console.log('Query result:', JSON.stringify(result, null, 2))

    // Clean up
    console.log('\nCleaning up...')
    await client.delete(testTeam._id)
    console.log('Test team deleted')
  } catch (error) {
    console.error('Error:', error)
  }
}

debugQuery()
