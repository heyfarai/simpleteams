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
    coach,
    region,
    awards
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

async function debugFilters() {
  try {
    const data = await sanityClient.fetch(query);
    const { teams, seasons } = data;
    
    console.log('=== SEASONS ===');
    seasons.forEach(season => {
      console.log(`${season.name} (${season.year})`);
      season.divisions.forEach(div => {
        console.log(`  - ${div.division.name}: ${div.teamRefs.length} teams`);
        div.teamRefs.forEach(teamRef => {
          const team = teams.find(t => t._id === teamRef);
          console.log(`    * ${team?.name || 'Unknown'}`);
        });
      });
    });

    console.log('\n=== TEAM ASSIGNMENTS ===');
    const activeSeason = seasons[0];
    const teamDivisions = new Map();
    
    activeSeason.divisions.forEach(div => {
      div.teamRefs.forEach(teamRef => {
        teamDivisions.set(teamRef, {
          _id: div.division._id,
          name: div.division.name
        });
      });
    });

    teams.forEach(team => {
      const division = teamDivisions.get(team._id);
      const season = {
        _id: activeSeason._id,
        name: activeSeason.name,
        year: activeSeason.year
      };
      
      console.log(`${team.name}:`);
      console.log(`  Division: ${division ? division.name : 'None'}`);
      console.log(`  Season: ${season.name}`);
      console.log(`  Coach: ${team.coach || 'TBA'}`);
      console.log(`  Region: ${team.region || 'Unknown'}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

debugFilters();
