import { fetchAllPlayers, fetchFilterOptions, fetchStatLeaders } from '@/lib/data/fetch-players'

async function testPlayersFetch() {
  console.log('🏀 Testing Players Data Fetching...\n')

  try {
    // Test filter options
    console.log('1. Testing filter options fetch...')
    const filterOptions = await fetchFilterOptions()
    console.log(`✅ Filter options loaded:`)
    console.log(`   - Seasons: ${filterOptions.seasons.length}`)
    console.log(`   - Divisions: ${filterOptions.divisions.length}`)
    console.log(`   - Teams: ${filterOptions.teams.length}`)
    console.log(`   - Positions: ${filterOptions.positions.length}\n`)

    // Test all players fetch
    console.log('2. Testing all players fetch...')
    const allPlayers = await fetchAllPlayers()
    console.log(`✅ All players loaded: ${allPlayers.length} players`)
    
    if (allPlayers.length > 0) {
      const samplePlayer = allPlayers[0]
      console.log(`   Sample player:`)
      console.log(`   - Name: ${samplePlayer.firstName} ${samplePlayer.lastName}`)
      console.log(`   - Team: ${samplePlayer.team}`)
      console.log(`   - Position: ${samplePlayer.position}`)
      console.log(`   - Jersey: #${samplePlayer.jersey}`)
      console.log(`   - Stats: ${samplePlayer.stats.ppg} PPG, ${samplePlayer.stats.rpg} RPG, ${samplePlayer.stats.apg} APG`)
    }
    console.log('')

    // Test stat leaders fetch
    console.log('3. Testing stat leaders fetch...')
    const statLeaders = await fetchStatLeaders('2024', 'Regular Season')
    console.log(`✅ Stat leaders loaded: ${statLeaders.length} players`)
    
    if (statLeaders.length > 0) {
      const topScorer = statLeaders.sort((a, b) => b.stats.ppg - a.stats.ppg)[0]
      console.log(`   Top scorer: ${topScorer.firstName} ${topScorer.lastName} - ${topScorer.stats.ppg} PPG`)
    }
    console.log('')

    console.log('🎉 All tests completed successfully!')

  } catch (error) {
    console.error('❌ Error during testing:', error)
    
    // Provide helpful debugging information
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Stack trace:', error.stack)
    }
    
    console.log('\n🔧 Debugging tips:')
    console.log('1. Check if Sanity environment variables are set correctly')
    console.log('2. Verify that the Sanity project has data')
    console.log('3. Ensure the schema fields match the query expectations')
    console.log('4. Check network connectivity to Sanity')
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPlayersFetch()
}

export { testPlayersFetch }
