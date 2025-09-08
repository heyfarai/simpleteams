const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: '6bhzpimk',
  dataset: 'dev',
  apiVersion: '2024-03-07',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

const teamsQuery = `{
  "teams": *[_type == "team"] {
    _id,
    name,
    coach,
    region,
    awards,
    stats
  },
  "seasons": *[_type == "season"] | order(year desc) {
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

async function testSeasonFiltering() {
  try {
    const data = await sanityClient.fetch(teamsQuery);
    const { teams, seasons } = data;
    
    console.log('=== Available Seasons ===');
    seasons.forEach(season => {
      console.log(`${season.name} (${season.year}) - ID: ${season._id}`);
      season.divisions.forEach(div => {
        console.log(`  - ${div.division.name}: ${div.teamRefs.length} teams`);
      });
    });
    
    // Test filtering for each season
    seasons.forEach(season => {
      console.log(`\n=== Teams for ${season.name} ===`);
      
      // Create team-division mapping for this season
      const teamDivisions = new Map();
      season.divisions.forEach(div => {
        div.teamRefs.forEach(teamRef => {
          teamDivisions.set(teamRef, {
            _id: div.division._id,
            name: div.division.name
          });
        });
      });
      
      // Get teams for this season
      const activeTeamIds = new Set();
      season.divisions.forEach(div => {
        div.teamRefs.forEach(teamRef => {
          activeTeamIds.add(teamRef);
        });
      });
      
      const seasonTeams = teams
        .filter(team => activeTeamIds.has(team._id))
        .map(team => ({
          ...team,
          division: teamDivisions.get(team._id),
          season: {
            _id: season._id,
            name: season.name,
            year: season.year
          }
        }));
        
      console.log(`Found ${seasonTeams.length} teams:`);
      seasonTeams.forEach(team => {
        console.log(`- ${team.name} (Division: ${team.division?.name || 'None'})`);
      });
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testSeasonFiltering();
