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

async function testQuery() {
  try {
    // Test the teams query
    console.log('Running teams query...');
    const teamsQuery = `*[_type == "team"] {
      _id,
      name,
      "logo": logo.asset._ref,
      "season": *[_type == "season" && references(^._id)][0]{
        _id,
        name,
        year,
        activeDivisions[]{
          division->,
          status,
          teamLimits,
          teams
        }
      },
      "division": *[_type == "season" && references(^._id)][0].activeDivisions[teams[]._ref match ^._id].division->{
        _id,
        name
      },
      coach,
      region,
      description,
      homeVenue,
      awards,
      stats
    }`;
    const result = await client.fetch(teamsQuery);
    console.log('Query result:', JSON.stringify(result, null, 2));

    // Test a single team query with expanded season and division
    console.log('\nTesting single team query...');
    const singleTeamQuery = `*[_type == "team"][0] {
      _id,
      name,
      "logo": logo.asset._ref,
      "season": *[_type == "season" && references(^._id)][0]{
        _id,
        name,
        year,
        activeDivisions[]{
          division->,
          status,
          teamLimits,
          teams
        }
      },
      "division": *[_type == "season" && references(^._id)][0].activeDivisions[teams[]._ref match ^._id].division->{
        _id,
        name
      },
      stats
    }`;
    const singleTeam = await client.fetch(singleTeamQuery);
    console.log('Single team result:', JSON.stringify(singleTeam, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

testQuery();
