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

async function checkSchema() {
  try {
    // Query season structure
    console.log('\nChecking season schema...')
    const seasonQuery = `*[_type == "season"][0] {...}`
    const season = await client.fetch(seasonQuery)
    console.log('Season example:', JSON.stringify(season, null, 2))

    // Query division structure
    console.log('\nChecking division schema...')
    const divisionQuery = `*[_type == "division"][0] {...}`
    const division = await client.fetch(divisionQuery)
    console.log('Division example:', JSON.stringify(division, null, 2))

    // Query team structure with references
    console.log('\nChecking team schema...')
    const teamQuery = `*[_type == "team"][0] {
      ...,
      "division": division->,
      "season": *[_type == "season" && references(^._id)][0]
    }`
    const team = await client.fetch(teamQuery)
    console.log('Team example:', JSON.stringify(team, null, 2))

  } catch (error) {
    console.error('Error:', error)
  }
}

checkSchema()
