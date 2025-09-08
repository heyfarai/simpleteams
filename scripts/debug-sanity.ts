const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: '6bhzpimk',
  dataset: 'dev',
  apiVersion: '2024-03-07',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

async function debugSanityData() {
  try {
    // First, get all seasons
    const seasonsQuery = `*[_type == "season"] {
      _id,
      name,
      year,
      activeDivisions[] {
        division->,
        teams[] {
          _ref
        }
      }
    }`;
    const seasons = await sanityClient.fetch(seasonsQuery);
    console.log('Seasons:', JSON.stringify(seasons, null, 2));

    // Then get all teams
    const teamsQuery = `*[_type == "team"] {
      _id,
      name
    }`;
    const teams = await sanityClient.fetch(teamsQuery);
    console.log('\nTeams:', JSON.stringify(teams, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

debugSanityData();
