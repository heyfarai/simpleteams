const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: '6bhzpimk',
  dataset: 'dev',
  apiVersion: '2024-03-07',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

const query = `{
  "teams": *[_type == "team"] {
    _id,
    name,
    "logo": logo.asset._ref,
    coach,
    region,
    description,
    homeVenue,
    awards,
    stats
  },
  "divisions": *[_type == "division"] {
    _id,
    name,
    "activeTeams": seasonTeams[status == "active"]{
      "team": team->{
        _id,
        name
      },
      "season": season->{
        _id,
        name,
        year
      }
    }
  }
}`;

async function testQuery() {
  try {
    const result = await sanityClient.fetch(query);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testQuery();
