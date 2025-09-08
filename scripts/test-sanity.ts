import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: '6bhzpimk',
  dataset: 'dev',
  apiVersion: '2024-03-07',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

const seasonsQuery = `*[_type == "season"] {
  _id,
  name,
  year,
  activeDivisions[] {
    division->,
    teams[] {
      _ref,
      _type
    }
  }
}`;

async function testSanityData() {
  try {
    const seasons = await sanityClient.fetch(seasonsQuery);
    console.log('Seasons:', JSON.stringify(seasons, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testSanityData();
