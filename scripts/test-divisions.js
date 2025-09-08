const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: '6bhzpimk',
  dataset: 'dev',
  apiVersion: '2024-03-07',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

const query = `*[_type == "season" && defined(activeDivisions)] | order(year desc) {
  _id,
  name,
  year,
  "divisions": activeDivisions[status == "active" && defined(teams) && count(teams) > 0]{
    "division": division->{
      _id,
      name
    },
    "teamRefs": teams[]._ref
  }
}[0]`;

async function testQuery() {
  try {
    const result = await sanityClient.fetch(query);
    console.log('Active Season:', JSON.stringify(result, null, 2));

    // Fetch teams in each division
    for (const div of result.divisions) {
      const teamQuery = `*[_type == "team" && _id in $teamRefs] {
        _id,
        name
      }`;
      const teams = await sanityClient.fetch(teamQuery, { teamRefs: div.teamRefs });
      console.log(`\nTeams in ${div.division.name} division:`, JSON.stringify(teams, null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testQuery();
