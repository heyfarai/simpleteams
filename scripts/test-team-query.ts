import { client } from "../lib/sanity/client";
import { teamsQuery } from "../lib/sanity/team-queries";

async function testQuery() {
  try {
    // First, create test data
    const testTeam = {
      _type: 'team',
      name: 'Test Team',
      division: {
        _type: 'reference',
        _ref: 'test-division'
      }
    };

    const testGame1 = {
      _type: 'game',
      homeTeamId: 'test-team',
      awayTeamId: 'opponent-1',
      homeScore: 80,
      awayScore: 70,
      status: 'completed'
    };

    const testGame2 = {
      _type: 'game',
      homeTeamId: 'opponent-2',
      awayTeamId: 'test-team',
      homeScore: 90,
      awayScore: 85,
      status: 'completed'
    };

    // Create test documents
    const createdTeam = await client.create(testTeam);
    console.log('Created test team:', createdTeam);
    
    const createdGame1 = await client.create(testGame1);
    console.log('Created test game 1:', createdGame1);
    
    const createdGame2 = await client.create(testGame2);
    console.log('Created test game 2:', createdGame2);

    // Run the query
    console.log('Running teams query...');
    const result = await client.fetch(teamsQuery);
    console.log('Query result:', JSON.stringify(result, null, 2));

    // Clean up test data
    await client.delete(createdTeam._id);
    await client.delete(createdGame1._id);
    await client.delete(createdGame2._id);
    console.log('Cleaned up test data');

  } catch (error) {
    console.error('Error:', error);
  }
}

testQuery();
