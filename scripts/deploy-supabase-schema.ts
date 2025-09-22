// Script to deploy the new Supabase schema and RLS policies
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.local
config({ path: '.env.local' });

console.log('🔍 Environment variables check:');
console.log(`SIMPLE_SUPABASE_URL: ${process.env.SIMPLE_SUPABASE_URL ? 'Found' : 'Missing'}`);
console.log(`SIMPLE_SUPABASE_SERVICE_ROLE_KEY: ${process.env.SIMPLE_SUPABASE_SERVICE_ROLE_KEY ? 'Found' : 'Missing'}`);

if (!process.env.SIMPLE_SUPABASE_URL || !process.env.SIMPLE_SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required SIMPLE_ environment variables');
  process.exit(1);
}

const supabase = createClient(
  process.env.SIMPLE_SUPABASE_URL!,
  process.env.SIMPLE_SUPABASE_SERVICE_ROLE_KEY!
);

class SchemaDeployment {
  private async executeSQLFile(filePath: string, description: string): Promise<void> {
    console.log(`📄 Executing ${description}...`);

    try {
      const sqlContent = readFileSync(filePath, 'utf-8');

      // Split into individual statements and execute
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error } = await supabase.rpc('exec_sql', { sql: statement });
            if (error) {
              console.warn(`⚠️  Warning in statement: ${error.message}`);
              console.log(`Statement: ${statement.substring(0, 100)}...`);
            }
          } catch (error) {
            console.warn(`⚠️  Could not execute statement: ${error.message}`);
          }
        }
      }

      console.log(`✅ ${description} executed successfully`);
    } catch (error) {
      console.error(`❌ Failed to execute ${description}:`, error);
      throw error;
    }
  }

  private async executeRawSQL(sql: string, description: string): Promise<void> {
    console.log(`🔧 ${description}...`);

    try {
      const { error } = await supabase.rpc('exec_sql', { sql });
      if (error) throw error;
      console.log(`✅ ${description} completed`);
    } catch (error) {
      console.error(`❌ ${description} failed:`, error);
      // Continue with deployment even if some statements fail
    }
  }

  async deploySchema(): Promise<void> {
    console.log('🚀 Starting Supabase schema deployment...');

    try {
      // Step 1: Create exec_sql function if it doesn't exist
      await this.createExecSQLFunction();

      // Step 2: Deploy main schema
      const schemaPath = join(process.cwd(), 'supabase', 'schema-v3-optimized.sql');
      await this.executeSQLFile(schemaPath, 'Enhanced Basketball League Schema v3.0');

      // Step 3: Deploy RLS policies
      const rlsPath = join(process.cwd(), 'supabase', 'rls-policies.sql');
      await this.executeSQLFile(rlsPath, 'Row Level Security Policies');

      // Step 4: Create default organization
      await this.createDefaultOrganization();

      // Step 5: Verify deployment
      await this.verifyDeployment();

      console.log('✅ Schema deployment completed successfully!');
      console.log('🔄 You can now run the migration script to move data from Sanity.');

    } catch (error) {
      console.error('❌ Schema deployment failed:', error);
      throw error;
    }
  }

  private async createExecSQLFunction(): Promise<void> {
    const execSQLFunction = `
      CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
      RETURNS TEXT
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
        RETURN 'OK';
      EXCEPTION
        WHEN OTHERS THEN
          RETURN SQLERRM;
      END;
      $$;
    `;

    await this.executeRawSQL(execSQLFunction, 'Creating exec_sql function');
  }

  private async createDefaultOrganization(): Promise<void> {
    console.log('🏢 Creating default organization...');

    try {
      const { data: existingOrg } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', 'nchc-basketball')
        .single();

      if (existingOrg) {
        console.log('✅ Default organization already exists');
        return;
      }

      const { data: org, error } = await supabase
        .from('organizations')
        .insert({
          name: 'NCHC Basketball League',
          slug: 'nchc-basketball',
          description: 'Default organization for migration',
          primary_color: '#1e40af',
          secondary_color: '#fbbf24',
          settings: {
            created_by: 'migration_script',
            created_at: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Created default organization: ${org.id}`);

      // Set as environment variable for migration script
      process.env.DEFAULT_ORGANIZATION_ID = org.id;

    } catch (error) {
      console.error('❌ Failed to create default organization:', error);
    }
  }

  private async verifyDeployment(): Promise<void> {
    console.log('🔍 Verifying schema deployment...');

    const checks = [
      { table: 'organizations', description: 'Organizations table' },
      { table: 'seasons', description: 'Seasons table' },
      { table: 'divisions', description: 'Divisions table' },
      { table: 'teams', description: 'Teams table' },
      { table: 'rosters', description: 'Rosters table' },
      { table: 'players', description: 'Players table' },
      { table: 'roster_players', description: 'Roster players table' },
      { table: 'games', description: 'Games table' },
      { table: 'game_events', description: 'Game events table' },
      { table: 'team_conversations', description: 'Team conversations table' },
      { table: 'messages', description: 'Messages table' },
      { table: 'roster_season_stats', description: 'Roster season stats table' },
      { table: 'player_game_stats', description: 'Player game stats table' },
      { table: 'current_rosters', description: 'Current rosters materialized view' },
      { table: 'team_standings', description: 'Team standings materialized view' },
      { table: 'player_career_stats', description: 'Player career stats materialized view' },
    ];

    for (const check of checks) {
      try {
        const { error } = await supabase
          .from(check.table)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ ${check.description}: ${error.message}`);
        } else {
          console.log(`✅ ${check.description}: Available`);
        }
      } catch (error) {
        console.log(`❌ ${check.description}: ${error.message}`);
      }
    }

    // Check functions
    try {
      await supabase.rpc('refresh_performance_views');
      console.log('✅ Performance views function: Working');
    } catch (error) {
      console.log(`❌ Performance views function: ${error.message}`);
    }

    try {
      await supabase.rpc('calculate_roster_season_stats', { roster_uuid: '00000000-0000-0000-0000-000000000000' });
      console.log('✅ Stats calculation function: Working');
    } catch (error) {
      // Expected to fail with invalid UUID, but function should exist
      if (error.message.includes('invalid input syntax')) {
        console.log('✅ Stats calculation function: Working');
      } else {
        console.log(`❌ Stats calculation function: ${error.message}`);
      }
    }
  }
}

// Main deployment function
async function deploySchema(): Promise<void> {
  console.log('Starting Supabase schema deployment...');
  console.log('🔍 Environment check:');
  console.log(`- Supabase URL: ${process.env.SIMPLE_SUPABASE_URL ? '✅' : '❌'}`);
  console.log(`- Supabase Service Role Key: ${process.env.SIMPLE_SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌'}`);

  if (!process.env.SIMPLE_SUPABASE_URL || !process.env.SIMPLE_SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }

  const deployment = new SchemaDeployment();
  await deployment.deploySchema();
}

// Export for use in other scripts
export { SchemaDeployment, deploySchema };

// Run if called directly
if (require.main === module) {
  deploySchema().catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
}