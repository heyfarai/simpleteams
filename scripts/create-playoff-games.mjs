// ES Module script to create Summer Series 2025 playoff games via API
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api';

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

async function postJson(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(result)}`);
  }

  return result;
}

async function createPlayoffGames() {
  try {
    console.log('🏀 Creating Summer Series 2025 playoff games via API...');

    // Get seasons
    console.log('📅 Fetching seasons...');
    const seasons = await fetchJson(`${API_BASE}/seasons`);
    const summerSeason = seasons.find(s => s.name.includes('Summer Series') && s.name.includes('2025'));

    if (!summerSeason) {
      console.error('❌ Summer Series 2025 season not found');
      console.log('Available seasons:', seasons.map(s => s.name));
      return;
    }

    console.log('✅ Found season:', summerSeason.name, 'ID:', summerSeason.id);

    // Get teams
    console.log('🏀 Fetching teams...');
    const teamsResponse = await fetchJson(`${API_BASE}/teams/all-teams`);
    const teams = Array.isArray(teamsResponse) ? teamsResponse : teamsResponse.teams || [];

    console.log('✅ Found', teams.length, 'teams');

    // Helper to find team by name
    const findTeam = (searchTerms) => {
      for (const term of searchTerms) {
        const team = teams.find(t =>
          t.name?.toLowerCase().includes(term.toLowerCase()) ||
          t.shortName?.toLowerCase().includes(term.toLowerCase()) ||
          t.short_name?.toLowerCase().includes(term.toLowerCase())
        );
        if (team) return team;
      }
      return null;
    };

    // Find teams from the image - trying multiple search terms
    const smithsFalls = findTeam(['smith', 'falls', 'hawks']);
    const bgcRegional = findTeam(['bgc', 'regional']);
    const montrealWildcats = findTeam(['montreal', 'wildcats']);
    const onlxJunior = findTeam(['onl', 'junior']);
    const onlxRise = findTeam(['rise', 'onl']);

    console.log('🔍 Team lookup results:');
    console.log('- Smith\'s Falls Hawks:', smithsFalls?.name || 'NOT FOUND');
    console.log('- BGC Regional:', bgcRegional?.name || 'NOT FOUND');
    console.log('- Montreal Wildcats:', montrealWildcats?.name || 'NOT FOUND');
    console.log('- ONL-X Junior:', onlxJunior?.name || 'NOT FOUND');
    console.log('- ONL-X Rise:', onlxRise?.name || 'NOT FOUND');

    if (!smithsFalls || !bgcRegional || !montrealWildcats || !onlxJunior || !onlxRise) {
      console.log('\n📋 Available teams:');
      teams.forEach(t => console.log(`   - ${t.name} (${t.id})`));
    }

    // Game data from the screenshot
    const gameData = [
      {
        name: 'Hawks vs BGC Regional',
        date: '2025-08-10',
        time: '12:00',
        homeTeam: smithsFalls,
        awayTeam: bgcRegional,
        homeScore: 54,
        awayScore: 91,
        status: 'completed'
      },
      {
        name: 'Wildcats vs ONL-X Junior',
        date: '2025-08-10',
        time: '12:00',
        homeTeam: montrealWildcats,
        awayTeam: onlxJunior,
        homeScore: 83,
        awayScore: 63,
        status: 'completed'
      },
      {
        name: 'Wildcats vs Hawks',
        date: '2025-08-10',
        time: '15:00',
        homeTeam: montrealWildcats,
        awayTeam: smithsFalls,
        homeScore: 88,
        awayScore: 83,
        status: 'completed'
      },
      {
        name: 'BGC Regional vs ONL-X Rise',
        date: '2025-08-10',
        time: '16:30',
        homeTeam: bgcRegional,
        awayTeam: onlxRise,
        homeScore: 76,
        awayScore: 70,
        status: 'completed'
      }
    ];

    // Create each game
    for (const game of gameData) {
      if (!game.homeTeam || !game.awayTeam) {
        console.log(`❌ Skipping ${game.name} - missing teams`);
        continue;
      }

      try {
        console.log(`\n🎯 Creating game: ${game.name}`);

        const gameRequest = {
          date: game.date,
          time: game.time,
          homeTeamId: game.homeTeam.id,
          awayTeamId: game.awayTeam.id,
          seasonId: summerSeason.id,
          status: game.status || 'upcoming'
        };

        console.log('📝 Game request:', gameRequest);

        const createdGame = await postJson(`${API_BASE}/games`, gameRequest);
        console.log(`✅ Created game: ${createdGame.title || createdGame.id}`);

        // Update with final scores if game is completed
        if (game.status === 'completed') {
          const updateRequest = {
            homeScore: game.homeScore,
            awayScore: game.awayScore,
            status: 'completed'
          };

          console.log('🏆 Updating with final scores...');
          const updatedGame = await fetch(`${API_BASE}/games/${createdGame.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateRequest),
          });

          if (updatedGame.ok) {
            console.log(`✅ Updated scores: ${game.homeScore}-${game.awayScore}`);
          } else {
            console.log(`⚠️ Could not update scores (game still created)`);
          }
        }

      } catch (error) {
        console.error(`❌ Failed to create ${game.name}:`, error.message);
      }
    }

    console.log('\n🏆 Playoff games creation complete!');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the script
createPlayoffGames().then(() => {
  console.log('✅ Script finished');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});