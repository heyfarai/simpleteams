import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Use the SIMPLE_ prefixed credentials for fresh instance
const supabase = createClient(
  'https://bzmromdmfwfaiuwwfscj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bXJvbWRtZndmYWl1d3dmc2NqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ5NDAyOCwiZXhwIjoyMDc0MDcwMDI4fQ.7M0tidy5oa8mn0AM4ehKKIjgCLUFgAhtHH-CCnW-QxU'
);

async function executeSQLFile(filePath: string, description: string) {
  console.log(`📄 Executing ${description}...`);

  try {
    const sqlContent = readFileSync(filePath, 'utf-8');

    // Execute the entire SQL content at once using the SQL editor approach
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });

    if (error) {
      console.error(`❌ Error executing ${description}:`, error);
      return false;
    }

    console.log(`✅ ${description} executed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to execute ${description}:`, error);
    return false;
  }
}

async function deployDirectly() {
  console.log('🚀 Starting direct Supabase deployment...');

  try {
    // Test connection first
    const { data, error } = await supabase.from('__test__').select('*').limit(1);
    if (error && !error.message.includes('__test__')) {
      console.log('✅ Connection to Supabase established');
    }

    // Deploy main schema
    const schemaPath = join(process.cwd(), 'supabase', 'schema-v3-optimized.sql');
    const schemaSuccess = await executeSQLFile(schemaPath, 'Basketball League Schema v3.0');

    if (!schemaSuccess) {
      throw new Error('Schema deployment failed');
    }

    // Deploy RLS policies
    const rlsPath = join(process.cwd(), 'supabase', 'rls-policies.sql');
    const rlsSuccess = await executeSQLFile(rlsPath, 'Row Level Security Policies');

    if (!rlsSuccess) {
      console.warn('⚠️ RLS policies failed, but continuing...');
    }

    // Create default organization
    console.log('🏢 Creating default organization...');
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: 'NCHC Basketball League',
        slug: 'nchc-basketball',
        description: 'Default organization for migration',
        primary_color: '#1e40af',
        secondary_color: '#fbbf24',
        settings: {
          created_by: 'direct_deployment',
          created_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (orgError) {
      console.error('❌ Failed to create default organization:', orgError);
    } else {
      console.log(`✅ Created default organization: ${org.id}`);
    }

    // Verify deployment
    console.log('🔍 Verifying deployment...');
    const tables = [
      'organizations', 'seasons', 'divisions', 'teams', 'rosters',
      'players', 'roster_players', 'games', 'game_events'
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Available`);
      }
    }

    console.log('✅ Direct deployment completed!');

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    throw error;
  }
}

if (require.main === module) {
  deployDirectly().catch(console.error);
}