import { fetchTeams } from '../lib/data/fetch-teams';

async function testTeamsFetch() {
  try {
    console.log('Testing fetchTeams for season 1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3...');
    
    const teams = await fetchTeams('1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3');
    
    console.log(`Found ${teams.length} teams:`);
    teams.forEach(team => {
      console.log(`- ${team.name} (Division: ${team.division?.name || 'None'})`);
    });
    
    if (teams.length === 0) {
      console.log('No teams found - this indicates the filtering is not working correctly');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testTeamsFetch();
