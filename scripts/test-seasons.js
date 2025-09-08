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
  "seasons": *[_type == "season" && defined(activeDivisions)] | order(year desc) {
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
