const { fetchTeams, fetchTeamFilters } = require('../lib/data/fetch-teams.ts');

async function testSeasonFiltering() {
  try {
    console.log('=== Testing Season Filtering ===\n');
    
    // Get filter options first
    const filterOptions = await fetchTeamFilters();
    console.log('Available seasons:');
    filterOptions.seasons.forEach(season => {
      console.log(`- ${season.name} (${season.year}) - ID: ${season._id}`);
    });
    
    // Test fetching teams for different seasons
    const seasons = filterOptions.seasons;
    
    for (const season of seasons.slice(0, 3)) { // Test first 3 seasons
      console.log(`\n=== Teams for ${season.name} ===`);
      const teams = await fetchTeams(season._id);
      console.log(`Found ${teams.length} teams:`);
      teams.forEach(team => {
        console.log(`- ${team.name} (Division: ${team.division?.name || 'None'}, Season: ${team.season?.name})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testSeasonFiltering();
