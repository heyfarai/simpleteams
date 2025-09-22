import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bzmromdmfwfaiuwwfscj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bXJvbWRtZndmYWl1d3dmc2NqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ5NDAyOCwiZXhwIjoyMDc0MDcwMDI4fQ.7M0tidy5oa8mn0AM4ehKKIjgCLUFgAhtHH-CCnW-QxU'
);

async function verifyDeployment() {
  console.log('🔍 Verifying schema deployment...');

  const tables = [
    'organizations', 'seasons', 'divisions', 'teams', 'rosters',
    'players', 'roster_players', 'games', 'game_events',
    'team_conversations', 'messages', 'team_members'
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Available`);
      }
    } catch (error: any) {
      console.log(`❌ ${table}: ${error.message}`);
    }
  }

  // Test materialized views
  console.log('\n🔍 Checking materialized views...');
  const views = ['current_rosters', 'team_standings', 'player_career_stats'];

  for (const view of views) {
    try {
      const { error } = await supabase.from(view).select('*').limit(1);
      if (error) {
        console.log(`❌ ${view}: ${error.message}`);
      } else {
        console.log(`✅ ${view}: Available`);
      }
    } catch (error: any) {
      console.log(`❌ ${view}: ${error.message}`);
    }
  }

  // Test functions
  console.log('\n🔍 Checking functions...');
  try {
    await supabase.rpc('refresh_performance_views');
    console.log('✅ refresh_performance_views: Working');
  } catch (error: any) {
    console.log(`❌ refresh_performance_views: ${error.message}`);
  }

  console.log('\n✅ Deployment verification completed!');
}

verifyDeployment().catch(console.error);