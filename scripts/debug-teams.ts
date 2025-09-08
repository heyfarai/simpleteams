const { createClient: createSanityClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const testClient = createSanityClient({
  projectId: '6bhzpimk',
  dataset: 'dev',
  apiVersion: '2024-03-07',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

const query = `*[_type == "team"] {
  _id,
  name,
  "division": *[_type == "season" && references(^._id)][0].activeDivisions[teams[]._ref == ^._id][0].division->
}`;

async function testQuery() {
  try {
    const result = await testClient.fetch(query);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testQuery();
