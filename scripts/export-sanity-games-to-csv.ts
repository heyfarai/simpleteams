// Sanity Games to CSV Export Script
// Fetches all games from Sanity for season 1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3
// Maps team IDs to roster IDs and transforms data for Supabase compatibility

import { config } from 'dotenv';
import { createClient } from '@sanity/client';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

// Load environment variables
config({ path: '.env.local' });

// Sanity client configuration
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-03-07',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

// Target season ID
const TARGET_SEASON_ID = '1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3';

// Hardcoded roster mapping: Team ID -> Roster ID
const ROSTER_MAPPING = {
  '3bef4624-7dd7-4ca1-a00d-6d9f9e66f17a': '81346326-efaf-4913-aa35-274a9dda3087', // BGC Regional
  'e7ea8431-ff25-4265-afc8-07ebf00f99db': 'b67aa531-5902-4e68-b29b-84bfc68aa955', // Brockville Blazers
  '8c5983e4-cbec-4ad0-8eec-f33ec71b7415': '06b0b98c-531d-405e-b609-34f4944195a5', // Eastern Ontario Elite
  'c172589c-6bd4-4ec3-a703-d8d7444e9439': 'c33a367f-0f45-4880-b134-4e28e2979b87', // Helisis
  'a9469609-adbd-4f83-8753-b1e464da3faa': 'e010fa4b-307a-43d3-9816-9fd875ad81ea', // KingMo Elite
  'a16de71b-9183-4d3d-a0e0-26fb2091252d': '637029f2-43dc-428b-a670-581fdb4441fc', // Montreal Wildcats
  '13111760-ab34-4d1e-a512-cfe0c830312e': 'd6bf35e0-c83c-479c-8ea9-e4e27ac14f3f', // ONL-X Junior
  'Ayz0qkvWb6walzY5rOpz9w': 'b1fc73a0-9d8e-4248-8b98-46b5c2622125', // ONL-X National (fixed ID)
  '7353d790-ec6a-4df4-9990-5e30b9d610ac': '440633bc-1497-46e0-905a-91ad4c3d772e', // ONL-X Rise
  '675fecdc-88d3-4ddb-b9bb-457098b643fe': 'f05c74eb-5efd-484c-b356-8c9c1fe74022', // Smith's Falls Hawks
  'a6e38c61-5eda-4fd6-9681-e552ecd6df9a': '813c7ea9-b9bc-4d46-b5c7-bc87b52723d8'  // YEB Junior
};

interface SanityGame {
  _id: string;
  gameDate: string;
  gameTime: string;
  gameNumber: number;
  homeTeam: { _id: string; name: string };
  awayTeam: { _id: string; name: string };
  status: string;
  score?: {
    homeScore: number;
    awayScore: number;
  };
}

interface SupabaseGame {
  id: string;
  roster_home_id: string;
  roster_away_id: string;
  scheduled_at: string;
  status: string;
  home_score: number;
  away_score: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

class GameMigrationLogger {
  private logs: Array<{
    level: 'info' | 'warn' | 'error';
    message: string;
    gameId?: string;
  }> = [];

  info(message: string, gameId?: string) {
    this.logs.push({ level: 'info', message, gameId });
    console.log(`ℹ️  ${message}${gameId ? ` (${gameId})` : ''}`);
  }

  warn(message: string, gameId?: string) {
    this.logs.push({ level: 'warn', message, gameId });
    console.warn(`⚠️  ${message}${gameId ? ` (${gameId})` : ''}`);
  }

  error(message: string, gameId?: string) {
    this.logs.push({ level: 'error', message, gameId });
    console.error(`❌ ${message}${gameId ? ` (${gameId})` : ''}`);
  }

  getSummary() {
    const summary = this.logs.reduce((acc, log) => {
      acc[log.level]++;
      return acc;
    }, { info: 0, warn: 0, error: 0 });

    return summary;
  }

  getErrors() {
    return this.logs.filter(log => log.level === 'error');
  }
}

class SanityGamesCSVExporter {
  private logger = new GameMigrationLogger();

  async export(): Promise<void> {
    this.logger.info('Starting Sanity games export to CSV...');

    try {
      // Fetch games from Sanity
      const games = await this.fetchGamesFromSanity();
      this.logger.info(`Fetched ${games.length} games from Sanity`);

      // Transform games for Supabase
      const transformedGames = this.transformGames(games);
      this.logger.info(`Transformed ${transformedGames.length} games for Supabase`);

      // Generate CSV
      const csvContent = this.generateCSV(transformedGames);

      // Write CSV file
      const outputPath = join(process.cwd(), 'sanity-games-export.csv');
      writeFileSync(outputPath, csvContent);

      this.logger.info(`CSV exported successfully to: ${outputPath}`);
      this.printSummary();

    } catch (error) {
      this.logger.error(`Export failed: ${error.message}`);
      throw error;
    }
  }

  private async fetchGamesFromSanity(): Promise<SanityGame[]> {
    const query = `*[_type == "game" && season._ref == $seasonId] | order(gameDate asc) {
      _id,
      gameDate,
      gameTime,
      gameNumber,
      homeTeam->{_id, name},
      awayTeam->{_id, name},
      status,
      score
    }`;

    const games = await sanityClient.fetch(query, { seasonId: TARGET_SEASON_ID });
    return games;
  }

  private transformGames(sanityGames: SanityGame[]): SupabaseGame[] {
    const transformedGames: SupabaseGame[] = [];

    for (const game of sanityGames) {
      try {
        // Find corresponding roster IDs
        const homeRosterId = ROSTER_MAPPING[game.homeTeam._id];
        const awayRosterId = ROSTER_MAPPING[game.awayTeam._id];

        if (!homeRosterId) {
          this.logger.warn(`Home team roster not found: ${game.homeTeam.name} (${game.homeTeam._id})`, game._id);
          continue;
        }

        if (!awayRosterId) {
          this.logger.warn(`Away team roster not found: ${game.awayTeam.name} (${game.awayTeam._id})`, game._id);
          continue;
        }

        // Convert date and time
        const scheduledAt = this.convertDateTime(game.gameDate, game.gameTime);
        if (!scheduledAt) {
          this.logger.warn(`Invalid date/time format: ${game.gameDate} ${game.gameTime}`, game._id);
          continue;
        }

        // Map status
        const status = this.mapStatus(game.status);

        // Extract scores
        const homeScore = game.score?.homeScore || 0;
        const awayScore = game.score?.awayScore || 0;

        // Create notes
        const notes = `Migrated from Sanity CMS - Sanity ID: ${game._id}, Game #${game.gameNumber}`;

        const now = new Date().toISOString();

        const transformedGame: SupabaseGame = {
          id: randomUUID(),
          roster_home_id: homeRosterId,
          roster_away_id: awayRosterId,
          scheduled_at: scheduledAt,
          status,
          home_score: homeScore,
          away_score: awayScore,
          notes,
          created_at: now,
          updated_at: now
        };

        transformedGames.push(transformedGame);

      } catch (error) {
        this.logger.error(`Failed to transform game: ${error.message}`, game._id);
      }
    }

    return transformedGames;
  }

  private convertDateTime(gameDate: string, gameTime: string): string | null {
    try {
      // Parse time (e.g., "02:00 PM" -> "14:00")
      const timeMatch = gameTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!timeMatch) {
        return null;
      }

      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const meridiem = timeMatch[3].toUpperCase();

      // Convert to 24-hour format
      if (meridiem === 'PM' && hours !== 12) {
        hours += 12;
      } else if (meridiem === 'AM' && hours === 12) {
        hours = 0;
      }

      // Format with leading zeros
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      // Combine date and time
      return `${gameDate} ${formattedTime}:00+00`;

    } catch (error) {
      return null;
    }
  }

  private mapStatus(sanityStatus: string): string {
    switch (sanityStatus) {
      case 'final':
        return 'completed';
      case 'scheduled':
        return 'scheduled';
      default:
        return 'scheduled'; // Default fallback
    }
  }

  private generateCSV(games: SupabaseGame[]): string {
    const headers = [
      'id',
      'roster_home_id',
      'roster_away_id',
      'scheduled_at',
      'status',
      'home_score',
      'away_score',
      'notes',
      'created_at',
      'updated_at'
    ];

    const csvRows = [headers.join(',')];

    for (const game of games) {
      const row = [
        game.id,
        game.roster_home_id,
        game.roster_away_id,
        game.scheduled_at,
        game.status,
        game.home_score.toString(),
        game.away_score.toString(),
        `"${game.notes.replace(/"/g, '""')}"`, // Escape quotes in CSV
        game.created_at,
        game.updated_at
      ];

      csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
  }

  private printSummary(): void {
    const summary = this.logger.getSummary();

    console.log('\n📋 Export Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Info messages: ${summary.info}`);
    console.log(`⚠️  Warnings: ${summary.warn}`);
    console.log(`❌ Errors: ${summary.error}`);

    const errors = this.logger.getErrors();
    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      errors.forEach(error => {
        console.log(`- ${error.message}${error.gameId ? ` (${error.gameId})` : ''}`);
      });
    }

    console.log('\n🎯 Next Steps:');
    console.log('1. Review the generated CSV file: sanity-games-export.csv');
    console.log('2. Import the CSV into Supabase using the dashboard or CLI');
    console.log('3. Verify data integrity after import');
  }
}

// Run the export
async function runExport(): Promise<void> {
  console.log('🚀 Sanity Games CSV Export');
  console.log('='.repeat(50));
  console.log(`Target Season: ${TARGET_SEASON_ID}`);
  console.log(`Teams mapped: ${Object.keys(ROSTER_MAPPING).length}`);

  const exporter = new SanityGamesCSVExporter();
  await exporter.export();
}

// Export for potential reuse
export { SanityGamesCSVExporter, ROSTER_MAPPING };

// Run if called directly
if (require.main === module) {
  runExport().catch(console.error);
}