const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: '6bhzpimk',
  dataset: 'dev',
  apiVersion: '2024-03-07',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

async function debugSanityData() {
  try {
    const seasonId = '1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3';
    
    // Test our updated query
    const teamsQuery = `{
  "divisions": *[_type == "division"] {
    _id,
    name
  },
      "seasons": *[_type == "season" && defined(activeDivisions)] | order(year desc) {
        _id,
        name,
        year,
        isActive,
        "divisions": activeDivisions[status == "active" && defined(teams) && count(teams) > 0]{
          "division": division->{
            _id,
            name
          },
          "teamRefs": teams[]._ref
        }
      },
      "teams": *[_type == "team"] {
        _id,
        name,
        shortName,
        "logo": logo.asset._ref,
        coach,
        region,
        description,
        homeVenue,
        awards,
        stats,
        rosters[] {
          "season": season->{
            _id,
            name,
            year
          },
          seasonStats {
            wins,
            losses,
            ties,
            pointsFor,
            pointsAgainst,
            homeRecord,
            awayRecord,
            conferenceRecord
          }
        }
      }
    }`;
    
    const data = await sanityClient.fetch(teamsQuery);
    
    // Find the target season
    const targetSeason = data.seasons.find((s: { _id: string }) => s._id === seasonId);
    console.log('Target Season:', JSON.stringify(targetSeason, null, 2));
    
    if (targetSeason) {
      // Get team IDs for this season
      const seasonTeamIds = new Set();
      targetSeason.divisions.forEach((div: { teamRefs: string[] }) => {
        div.teamRefs.forEach((teamRef: string) => {
          seasonTeamIds.add(teamRef);
        });
      });
      
      console.log('\nTeam IDs in season:', Array.from(seasonTeamIds));
      
      // Filter teams
      const filteredTeams = data.teams.filter((team: { _id: string }) => seasonTeamIds.has(team._id));
      console.log('\nFiltered Teams for season:', filteredTeams.map((t: { _id: string; name: string }) => ({ id: t._id, name: t.name })));
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

debugSanityData();
