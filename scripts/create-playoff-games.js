// Script to create Summer Series 2025 playoff games
const { gameService } = require('../lib/services/game-service');
const { teamRepository } = require('../lib/repositories/factory');
const { seasonRepository } = require('../lib/repositories/factory');

async function createPlayoffGames() {
  try {
    console.log('🏀 Creating Summer Series 2025 playoff games...');

    // Get Summer Series 2025 season
    const seasons = await seasonRepository.findAll();
    const summerSeason = seasons.find(s => s.name.includes('Summer Series') && s.name.includes('2025'));

    if (!summerSeason) {
      console.error('❌ Summer Series 2025 season not found');
      console.log('Available seasons:', seasons.map(s => s.name));
      return;
    }

    console.log('✅ Found season:', summerSeason.name, 'ID:', summerSeason.id);

    // Get all teams to find IDs
    const teams = await teamRepository.findAll();
    console.log('✅ Found', teams.length, 'teams');

    // Helper to find team by name
    const findTeam = (name) => {
      const team = teams.find(t =>
        t.name.toLowerCase().includes(name.toLowerCase()) ||
        t.shortName?.toLowerCase().includes(name.toLowerCase())
      );
      if (!team) {
        console.log(`❓ Available teams:`, teams.map(t => t.name).join(', '));
      }
      return team;
    };

    // Find teams from the image
    const smithsFalls = findTeam('Smith') || findTeam('Falls') || findTeam('Hawks');
    const bgcRegional = findTeam('BGC') || findTeam('Regional');
    const montrealWildcats = findTeam('Montreal') || findTeam('Wildcats');
    const onlxJunior = findTeam('ONL') || findTeam('Junior');
    const onlxRise = findTeam('Rise');

    console.log('Team lookup results:');
    console.log('- Smith\'s Falls Hawks:', smithsFalls?.name || 'NOT FOUND');
    console.log('- BGC Regional:', bgcRegional?.name || 'NOT FOUND');
    console.log('- Montreal Wildcats:', montrealWildcats?.name || 'NOT FOUND');
    console.log('- ONL-X Junior:', onlxJunior?.name || 'NOT FOUND');
    console.log('- ONL-X Rise:', onlxRise?.name || 'NOT FOUND');

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
          status: game.status
        };

        const createdGame = await gameService.createGame(gameRequest);
        console.log(`✅ Created game: ${createdGame.title} (ID: ${createdGame.id})`);

        // Update with final scores if game is completed
        if (game.status === 'completed') {
          const updatedGame = await gameService.updateGame(createdGame.id, {
            homeScore: game.homeScore,
            awayScore: game.awayScore,
            status: 'completed'
          });
          console.log(`✅ Updated scores: ${game.homeScore}-${game.awayScore}`);
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