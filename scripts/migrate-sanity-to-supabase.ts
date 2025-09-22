// Migration script from Sanity to Supabase
// Handles the complete data transfer with proper temporal relationships

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { mcp__sanity__get_initial_context, mcp__sanity__query_documents } from '../lib/mcp-tools';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabase = createClient(
  process.env.SIMPLE_SUPABASE_URL!,
  process.env.SIMPLE_SUPABASE_SERVICE_ROLE_KEY!
);

const SANITY_RESOURCE = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  target: 'dataset' as const,
};

interface MigrationLog {
  entity: string;
  action: 'created' | 'updated' | 'skipped' | 'error';
  sanityId?: string;
  supabaseId?: string;
  error?: string;
}

class SanityToSupabaseMigration {
  private logs: MigrationLog[] = [];
  private organizationId: string = '';
  private seasonMap = new Map<string, string>(); // Sanity ID -> Supabase ID
  private divisionMap = new Map<string, string>();
  private teamMap = new Map<string, string>();
  private playerMap = new Map<string, string>();
  private rosterMap = new Map<string, string>();

  async migrate(): Promise<void> {
    console.log('🚀 Starting Sanity to Supabase migration...');

    try {
      // Step 1: Create default organization
      await this.createDefaultOrganization();

      // Step 2: Migrate seasons
      await this.migrateSeasons();

      // Step 3: Migrate divisions
      await this.migrateDivisions();

      // Step 4: Migrate teams
      await this.migrateTeams();

      // Step 5: Migrate players
      await this.migratePlayers();

      // Step 6: Create rosters and roster_players
      await this.createRosters();

      // Step 7: Migrate games (if any exist)
      await this.migrateGames();

      // Step 8: Calculate and create stats
      await this.calculateStats();

      // Step 9: Refresh materialized views
      await this.refreshMaterializedViews();

      console.log('✅ Migration completed successfully!');
      this.printMigrationSummary();

    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  private async createDefaultOrganization(): Promise<void> {
    console.log('📦 Creating default organization...');

    try {
      const { data: org, error } = await supabase
        .from('organizations')
        .insert({
          name: 'NCHC Basketball League',
          slug: 'nchc-basketball',
          description: 'Migrated from Sanity CMS',
          settings: { migrated_from: 'sanity', migration_date: new Date().toISOString() }
        })
        .select()
        .single();

      if (error) throw error;

      this.organizationId = org.id;
      this.log('organization', 'created', undefined, org.id);

      console.log(`✅ Created organization: ${org.id}`);
    } catch (error) {
      this.log('organization', 'error', undefined, undefined, error.message);
      throw error;
    }
  }

  private async migrateSeasons(): Promise<void> {
    console.log('📅 Migrating seasons...');

    try {
      const seasons = await mcp__sanity__query_documents({
        resource: SANITY_RESOURCE,
        query: '*[_type == "season"] | order(year desc)',
        limit: 50
      });

      for (const season of seasons.documents) {
        try {
          const { data: supabaseSeason, error } = await supabase
            .from('seasons')
            .insert({
              organization_id: this.organizationId,
              name: season.name,
              year: season.year,
              start_date: season.startDate || `${season.year}-01-01`,
              end_date: season.endDate || `${season.year}-12-31`,
              status: season.isActive ? 'active' : 'completed',
              is_active: Boolean(season.isActive),
              registration_open: Boolean(season.registrationOpen),
            })
            .select()
            .single();

          if (error) throw error;

          this.seasonMap.set(season._id, supabaseSeason.id);
          this.log('season', 'created', season._id, supabaseSeason.id);

        } catch (error) {
          this.log('season', 'error', season._id, undefined, error.message);
          console.error(`Failed to migrate season ${season._id}:`, error);
        }
      }

      console.log(`✅ Migrated ${this.seasonMap.size} seasons`);
    } catch (error) {
      console.error('Failed to migrate seasons:', error);
      throw error;
    }
  }

  private async migrateDivisions(): Promise<void> {
    console.log('🏆 Migrating divisions...');

    try {
      const divisions = await mcp__sanity__query_documents({
        resource: SANITY_RESOURCE,
        query: '*[_type == "division"]',
        limit: 100
      });

      for (const division of divisions.documents) {
        try {
          // Find corresponding season
          const seasonId = division.season?._ref;
          const supabaseSeasonId = this.seasonMap.get(seasonId);

          if (!supabaseSeasonId) {
            this.log('division', 'skipped', division._id, undefined, 'Season not found');
            continue;
          }

          const { data: supabaseDivision, error } = await supabase
            .from('divisions')
            .insert({
              season_id: supabaseSeasonId,
              name: division.name,
              age_group: division.ageGroup || 'unknown',
              skill_level: division.skillLevel || 'intermediate',
              max_teams: division.teamLimits?.max || 12,
              min_teams: division.teamLimits?.min || 4,
              description: division.description,
            })
            .select()
            .single();

          if (error) throw error;

          this.divisionMap.set(division._id, supabaseDivision.id);
          this.log('division', 'created', division._id, supabaseDivision.id);

        } catch (error) {
          this.log('division', 'error', division._id, undefined, error.message);
          console.error(`Failed to migrate division ${division._id}:`, error);
        }
      }

      console.log(`✅ Migrated ${this.divisionMap.size} divisions`);
    } catch (error) {
      console.error('Failed to migrate divisions:', error);
      throw error;
    }
  }

  private async migrateTeams(): Promise<void> {
    console.log('🏀 Migrating teams...');

    try {
      const teams = await mcp__sanity__query_documents({
        resource: SANITY_RESOURCE,
        query: '*[_type == "team"]',
        limit: 200
      });

      for (const team of teams.documents) {
        try {
          const { data: supabaseTeam, error } = await supabase
            .from('teams')
            .insert({
              organization_id: this.organizationId,
              name: team.name,
              short_name: team.shortName,
              city: team.location?.city || team.region || 'Unknown',
              region: team.location?.region || team.region,
              logo_url: team.logo?.asset?.url,
              primary_color: team.colors?.primary || '#1e40af',
              secondary_color: team.colors?.secondary || '#fbbf24',
              contact_email: team.contactEmail || `${team.name?.toLowerCase().replace(/\s+/g, '')}@temp.com`,
              head_coach_name: team.coach || team.headCoach,
              primary_contact_name: team.coach || team.headCoach || 'Unknown',
              primary_contact_email: team.contactEmail || `${team.name?.toLowerCase().replace(/\s+/g, '')}@temp.com`,
              status: team.status === 'active' ? 'active' : 'inactive',
            })
            .select()
            .single();

          if (error) throw error;

          this.teamMap.set(team._id, supabaseTeam.id);
          this.log('team', 'created', team._id, supabaseTeam.id);

        } catch (error) {
          this.log('team', 'error', team._id, undefined, error.message);
          console.error(`Failed to migrate team ${team._id}:`, error);
        }
      }

      console.log(`✅ Migrated ${this.teamMap.size} teams`);
    } catch (error) {
      console.error('Failed to migrate teams:', error);
      throw error;
    }
  }

  private async migratePlayers(): Promise<void> {
    console.log('👥 Migrating players...');

    try {
      const players = await mcp__sanity__query_documents({
        resource: SANITY_RESOURCE,
        query: '*[_type == "player"]',
        limit: 1000
      });

      for (const player of players.documents) {
        try {
          const { data: supabasePlayer, error } = await supabase
            .from('players')
            .insert({
              organization_id: this.organizationId,
              first_name: player.firstName,
              last_name: player.lastName,
              hometown: player.hometown,
              height: player.height,
              grad_year: player.gradYear,
              preferred_position: player.position,
              photo_url: player.photo?.asset?.url,
              status: 'active',
            })
            .select()
            .single();

          if (error) throw error;

          this.playerMap.set(player._id, supabasePlayer.id);
          this.log('player', 'created', player._id, supabasePlayer.id);

        } catch (error) {
          this.log('player', 'error', player._id, undefined, error.message);
          console.error(`Failed to migrate player ${player._id}:`, error);
        }
      }

      console.log(`✅ Migrated ${this.playerMap.size} players`);
    } catch (error) {
      console.error('Failed to migrate players:', error);
      throw error;
    }
  }

  private async createRosters(): Promise<void> {
    console.log('📋 Creating rosters and roster players...');

    try {
      // Get all teams with their associated divisions and seasons from Sanity
      const teams = await mcp__sanity__query_documents({
        resource: SANITY_RESOURCE,
        query: `*[_type == "team" && defined(division)] {
          _id,
          name,
          division->{_id, name, season->{_id, name, year}},
          "players": *[_type == "player" && team._ref == ^._id] {
            _id,
            firstName,
            lastName,
            jersey,
            position
          }
        }`,
        limit: 200
      });

      for (const team of teams.documents) {
        try {
          if (!team.division?.season) {
            this.log('roster', 'skipped', team._id, undefined, 'No season found');
            continue;
          }

          const supabaseTeamId = this.teamMap.get(team._id);
          const supabaseSeasonId = this.seasonMap.get(team.division.season._id);
          const supabaseDivisionId = this.divisionMap.get(team.division._id);

          if (!supabaseTeamId || !supabaseSeasonId || !supabaseDivisionId) {
            this.log('roster', 'skipped', team._id, undefined, 'Missing related entities');
            continue;
          }

          // Create roster
          const { data: roster, error: rosterError } = await supabase
            .from('rosters')
            .insert({
              team_id: supabaseTeamId,
              season_id: supabaseSeasonId,
              division_id: supabaseDivisionId,
              status: 'approved',
              approved_at: new Date().toISOString(),
              payment_status: 'paid',
            })
            .select()
            .single();

          if (rosterError) throw rosterError;

          this.rosterMap.set(team._id, roster.id);
          this.log('roster', 'created', team._id, roster.id);

          // Add players to roster
          for (const player of team.players || []) {
            try {
              const supabasePlayerId = this.playerMap.get(player._id);

              if (!supabasePlayerId) {
                console.warn(`Player ${player._id} not found in migration map`);
                continue;
              }

              const { error: rosterPlayerError } = await supabase
                .from('roster_players')
                .insert({
                  roster_id: roster.id,
                  player_id: supabasePlayerId,
                  jersey_number: player.jersey || Math.floor(Math.random() * 99) + 1,
                  position: player.position || 'PG',
                  status: 'active',
                });

              if (rosterPlayerError) throw rosterPlayerError;

              this.log('roster_player', 'created', player._id, undefined);

            } catch (error) {
              this.log('roster_player', 'error', player._id, undefined, error.message);
              console.error(`Failed to add player ${player._id} to roster:`, error);
            }
          }

        } catch (error) {
          this.log('roster', 'error', team._id, undefined, error.message);
          console.error(`Failed to create roster for team ${team._id}:`, error);
        }
      }

      console.log(`✅ Created ${this.rosterMap.size} rosters`);
    } catch (error) {
      console.error('Failed to create rosters:', error);
      throw error;
    }
  }

  private async migrateGames(): Promise<void> {
    console.log('🎮 Migrating games...');

    try {
      const games = await mcp__sanity__query_documents({
        resource: SANITY_RESOURCE,
        query: `*[_type == "game"] {
          _id,
          title,
          date,
          time,
          homeTeam->{_id, name},
          awayTeam->{_id, name},
          division->{_id, name},
          venue->{_id, name, address, city},
          status,
          homeScore,
          awayScore
        }`,
        limit: 500
      });

      for (const game of games.documents) {
        try {
          // Find corresponding rosters
          const homeRosterId = this.rosterMap.get(game.homeTeam?._id);
          const awayRosterId = this.rosterMap.get(game.awayTeam?._id);

          if (!homeRosterId || !awayRosterId) {
            this.log('game', 'skipped', game._id, undefined, 'Missing team rosters');
            continue;
          }

          // Create or find venue
          let venueId = null;
          if (game.venue) {
            const { data: venue, error: venueError } = await supabase
              .from('venues')
              .insert({
                organization_id: this.organizationId,
                name: game.venue.name,
                address: game.venue.address || 'Unknown',
                city: game.venue.city || 'Unknown',
              })
              .select()
              .single();

            if (!venueError) {
              venueId = venue.id;
            }
          }

          const { data: supabaseGame, error } = await supabase
            .from('games')
            .insert({
              roster_home_id: homeRosterId,
              roster_away_id: awayRosterId,
              venue_id: venueId,
              scheduled_at: `${game.date}T${game.time || '18:00'}:00`,
              status: game.status || 'scheduled',
              home_score: game.homeScore || 0,
              away_score: game.awayScore || 0,
            })
            .select()
            .single();

          if (error) throw error;

          this.log('game', 'created', game._id, supabaseGame.id);

        } catch (error) {
          this.log('game', 'error', game._id, undefined, error.message);
          console.error(`Failed to migrate game ${game._id}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to migrate games:', error);
    }
  }

  private async calculateStats(): Promise<void> {
    console.log('📊 Calculating team and player stats...');

    try {
      // Calculate roster season stats for all rosters
      for (const [sanityTeamId, rosterId] of this.rosterMap) {
        try {
          await supabase.rpc('calculate_roster_season_stats', { roster_uuid: rosterId });
          this.log('roster_stats', 'created', sanityTeamId, rosterId);
        } catch (error) {
          this.log('roster_stats', 'error', sanityTeamId, rosterId, error.message);
          console.error(`Failed to calculate stats for roster ${rosterId}:`, error);
        }
      }

      console.log('✅ Stats calculation completed');
    } catch (error) {
      console.error('Failed to calculate stats:', error);
    }
  }

  private async refreshMaterializedViews(): Promise<void> {
    console.log('🔄 Refreshing materialized views...');

    try {
      await supabase.rpc('refresh_performance_views');
      console.log('✅ Materialized views refreshed');
    } catch (error) {
      console.error('Failed to refresh materialized views:', error);
    }
  }

  private log(entity: string, action: MigrationLog['action'], sanityId?: string, supabaseId?: string, error?: string): void {
    this.logs.push({ entity, action, sanityId, supabaseId, error });
  }

  private printMigrationSummary(): void {
    console.log('\n📋 Migration Summary:');
    console.log('='.repeat(50));

    const summary = this.logs.reduce((acc, log) => {
      if (!acc[log.entity]) {
        acc[log.entity] = { created: 0, updated: 0, skipped: 0, error: 0 };
      }
      acc[log.entity][log.action]++;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    for (const [entity, counts] of Object.entries(summary)) {
      console.log(`${entity.padEnd(15)} | Created: ${counts.created.toString().padStart(3)} | Errors: ${counts.error.toString().padStart(3)} | Skipped: ${counts.skipped.toString().padStart(3)}`);
    }

    const errors = this.logs.filter(log => log.action === 'error');
    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      errors.forEach(error => {
        console.log(`- ${error.entity} (${error.sanityId}): ${error.error}`);
      });
    }

    console.log('\n✅ Migration completed!');
    console.log(`📊 Total entities processed: ${this.logs.length}`);
    console.log(`✅ Successfully created: ${this.logs.filter(l => l.action === 'created').length}`);
    console.log(`❌ Errors: ${this.logs.filter(l => l.action === 'error').length}`);
    console.log(`⏭️  Skipped: ${this.logs.filter(l => l.action === 'skipped').length}`);
  }
}

// Run migration
async function runMigration(): Promise<void> {
  console.log('Starting Sanity to Supabase migration...');
  console.log('🔍 Environment check:');
  console.log(`- Supabase URL: ${process.env.SIMPLE_SUPABASE_URL ? '✅' : '❌'}`);
  console.log(`- Supabase Key: ${process.env.SIMPLE_SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌'}`);
  console.log(`- Sanity Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? '✅' : '❌'}`);
  console.log(`- Sanity Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET ? '✅' : '❌'}`);

  const migration = new SanityToSupabaseMigration();
  await migration.migrate();
}

// Export for use in other scripts
export { SanityToSupabaseMigration, runMigration };

// Run if called directly
if (require.main === module) {
  runMigration().catch(console.error);
}