// Roster Repository - handles temporal team/player relationships
import { createClient } from '@supabase/supabase-js';
import type { Team, Player, Season, Division } from '@simpleteams/types';

const supabase = createClient(
  process.env.SIMPLE_SUPABASE_URL!,
  process.env.SIMPLE_SUPABASE_SERVICE_ROLE_KEY!
);

export interface Roster {
  id: string;
  teamId: string;
  seasonId: string;
  divisionId: string;
  status: 'draft' | 'submitted' | 'approved' | 'locked';
  submittedAt?: string;
  approvedAt?: string;
  registrationNotes?: string;
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'refunded';
  players: RosterPlayer[];
  team: Team;
  season: Season;
  division: Division;
}

export interface RosterPlayer {
  id: string;
  rosterId: string;
  playerId: string;
  jerseyNumber: number;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  status: 'active' | 'inactive' | 'injured' | 'suspended';
  joinedAt: string;
  leftAt?: string;
  player: Player;
  seasonStats?: PlayerSeasonStats;
}

export interface PlayerSeasonStats {
  gamesPlayed: number;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  mpg: number;
  fgPercentage: number;
  threePointPercentage: number;
  ftPercentage: number;
}

export class SupabaseRosterRepository {
  // Get current rosters (uses materialized view for performance)
  async getCurrentRosters(): Promise<Roster[]> {
    try {
      const { data: currentRosters, error } = await supabase
        .from('current_rosters')
        .select('*')
        .order('team_name');

      if (error) throw error;

      // Group by roster and transform
      const rosterMap = new Map<string, any>();
      currentRosters?.forEach(row => {
        if (!rosterMap.has(row.roster_id)) {
          rosterMap.set(row.roster_id, {
            id: row.roster_id,
            team: {
              id: row.team_id,
              name: row.team_name,
              shortName: row.team_short_name,
              logo: row.logo_url,
              location: { city: row.city },
            },
            division: {
              id: row.division_id,
              name: row.division_name,
              ageGroup: row.age_group,
            },
            season: {
              id: row.season_id,
              name: row.season_name,
              year: row.season_year,
            },
            players: [],
          });
        }

        // Add player if exists
        if (row.player_id) {
          rosterMap.get(row.roster_id).players.push({
            id: row.player_id,
            firstName: row.first_name,
            lastName: row.last_name,
            jerseyNumber: row.jersey_number,
            position: row.position,
            status: row.player_status,
            seasonStats: {
              gamesPlayed: row.games_played || 0,
              ppg: row.ppg || 0,
              rpg: row.rpg || 0,
              apg: row.apg || 0,
            },
          });
        }
      });

      return Array.from(rosterMap.values());
    } catch (error) {
      console.error('Error fetching current rosters:', error);
      throw error;
    }
  }

  // Get roster by team and season
  async getRosterByTeamSeason(teamId: string, seasonId: string): Promise<Roster | null> {
    try {
      const { data: roster, error } = await supabase
        .from('rosters')
        .select(`
          *,
          team:teams(
            id,
            name,
            short_name,
            logo_url,
            city
          ),
          season_division:season_divisions(
            id,
            season:seasons(
              id,
              name,
              year,
              status,
              is_active
            ),
            division:league_divisions(
              id,
              name,
              description,
              display_order
            )
          ),
          roster_players(
            id,
            jersey_number,
            position,
            status,
            joined_at,
            left_at,
            player:players(
              id,
              first_name,
              last_name,
              photo_url,
              preferred_position
            ),
            player_season_stats(
              games_played,
              ppg,
              rpg,
              apg,
              spg,
              bpg,
              mpg,
              fg_percentage,
              three_point_percentage,
              ft_percentage
            )
          )
        `)
        .eq('team_id', teamId)
        .eq('season_id', seasonId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return roster ? this.transformToRoster(roster) : null;
    } catch (error) {
      console.error('Error fetching roster by team/season:', error);
      throw error;
    }
  }

  // Get all rosters for a team across seasons
  async getRostersByTeam(teamId: string): Promise<Roster[]> {
    try {
      const { data: rosters, error } = await supabase
        .from('rosters')
        .select(`
          *,
          team:teams(
            id,
            name,
            short_name,
            logo_url,
            city
          ),
          season_division:season_divisions(
            id,
            season:seasons(
              id,
              name,
              year,
              status,
              is_active
            ),
            division:league_divisions(
              id,
              name,
              description,
              display_order
            )
          ),
          roster_players(
            id,
            jersey_number,
            position,
            status,
            joined_at,
            left_at,
            player:players(
              id,
              first_name,
              last_name,
              photo_url
            )
          )
        `)
        .eq('team_id', teamId)
        .order('season.year', { ascending: false });

      if (error) throw error;

      return rosters?.map(this.transformToRoster) || [];
    } catch (error) {
      console.error('Error fetching rosters by team:', error);
      throw error;
    }
  }

  // Get player's roster history
  async getPlayerRosterHistory(playerId: string): Promise<RosterPlayer[]> {
    try {
      const { data: rosterPlayers, error } = await supabase
        .from('roster_players')
        .select(`
          *,
          roster:rosters(
            id,
            status,
            team:teams(
              id,
              name,
              short_name,
              logo_url
            ),
            season:seasons(
              id,
              name,
              year
            ),
            season_division:season_divisions(
              division:league_divisions(
                id,
                name,
                description
              )
            )
          ),
          player_season_stats(
            games_played,
            ppg,
            rpg,
            apg,
            spg,
            bpg,
            mpg,
            fg_percentage,
            three_point_percentage,
            ft_percentage
          )
        `)
        .eq('player_id', playerId)
        .order('roster.season.year', { ascending: false });

      if (error) throw error;

      return rosterPlayers?.map(this.transformToRosterPlayer) || [];
    } catch (error) {
      console.error('Error fetching player roster history:', error);
      throw error;
    }
  }

  // Create a new roster for a team/season
  async createRoster(teamId: string, seasonId: string, divisionId: string): Promise<Roster> {
    try {
      const { data: roster, error } = await supabase
        .from('rosters')
        .insert({
          team_id: teamId,
          season_id: seasonId,
          division_id: divisionId,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      // Fetch the full roster with relations
      const fullRoster = await this.getRosterByTeamSeason(teamId, seasonId);
      if (!fullRoster) throw new Error('Failed to fetch created roster');

      return fullRoster;
    } catch (error) {
      console.error('Error creating roster:', error);
      throw error;
    }
  }

  // Add player to roster
  async addPlayerToRoster(
    rosterId: string,
    playerId: string,
    jerseyNumber: number,
    position: 'PG' | 'SG' | 'SF' | 'PF' | 'C'
  ): Promise<RosterPlayer> {
    try {
      const { data: rosterPlayer, error } = await supabase
        .from('roster_players')
        .insert({
          roster_id: rosterId,
          player_id: playerId,
          jersey_number: jerseyNumber,
          position: position,
          status: 'active',
        })
        .select(`
          *,
          player:players(
            id,
            first_name,
            last_name,
            photo_url,
            preferred_position
          )
        `)
        .single();

      if (error) throw error;

      return this.transformToRosterPlayer(rosterPlayer);
    } catch (error) {
      console.error('Error adding player to roster:', error);
      throw error;
    }
  }

  // Remove player from roster
  async removePlayerFromRoster(rosterId: string, playerId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('roster_players')
        .delete()
        .eq('roster_id', rosterId)
        .eq('player_id', playerId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing player from roster:', error);
      throw error;
    }
  }

  // Update roster status
  async updateRosterStatus(
    rosterId: string,
    status: 'draft' | 'submitted' | 'approved' | 'locked'
  ): Promise<Roster> {
    try {
      const updateData: any = { status };

      if (status === 'submitted') {
        updateData.submitted_at = new Date().toISOString();
      } else if (status === 'approved') {
        updateData.approved_at = new Date().toISOString();
      }

      const { data: roster, error } = await supabase
        .from('rosters')
        .update(updateData)
        .eq('id', rosterId)
        .select()
        .single();

      if (error) throw error;

      // Fetch full roster with relations
      const { data: fullRoster } = await supabase
        .from('rosters')
        .select(`
          *,
          team:teams(*),
          season_division:season_divisions(
            season:seasons(*),
            division:league_divisions(*)
          )
        `)
        .eq('id', rosterId)
        .single();

      return this.transformToRoster(fullRoster);
    } catch (error) {
      console.error('Error updating roster status:', error);
      throw error;
    }
  }

  // Get team standings (uses materialized view)
  async getTeamStandings(seasonId?: string, divisionId?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('team_standings')
        .select('*')
        .order('division_rank');

      if (seasonId) {
        query = query.eq('season_id', seasonId);
      }

      if (divisionId) {
        query = query.eq('division_id', divisionId);
      }

      const { data: standings, error } = await query;

      if (error) throw error;

      return standings || [];
    } catch (error) {
      console.error('Error fetching team standings:', error);
      throw error;
    }
  }

  // Transform database row to Roster domain model
  private transformToRoster(row: any): Roster {
    return {
      id: row.id,
      teamId: row.team_id,
      seasonId: row.season_id,
      divisionId: row.division_id,
      status: row.status,
      submittedAt: row.submitted_at,
      approvedAt: row.approved_at,
      registrationNotes: row.registration_notes,
      paymentStatus: row.payment_status,
      team: {
        id: row.team.id,
        name: row.team.name,
        shortName: row.team.short_name,
        logo: row.team.logo_url,
        location: { city: row.team.city },
        status: 'active',
      },
      season: {
        id: row.season.id,
        name: row.season.name,
        year: row.season.year,
        status: row.season.status,
        isActive: row.season.is_active,
      },
      division: {
        id: row.division.id,
        name: row.division.name,
        ageGroup: row.division.age_group,
        skillLevel: row.division.skill_level,
        conference: {
          id: row.season.id,
          name: row.season.name,
          season: {
            id: row.season.id,
            name: row.season.name,
            year: row.season.year,
            status: row.season.status,
            isActive: row.season.is_active,
          },
        },
      },
      players: row.roster_players?.map(this.transformToRosterPlayer) || [],
    };
  }

  // Transform database row to RosterPlayer domain model
  private transformToRosterPlayer(row: any): RosterPlayer {
    const seasonStats = row.player_season_stats?.[0];

    return {
      id: row.id,
      rosterId: row.roster_id,
      playerId: row.player_id,
      jerseyNumber: row.jersey_number,
      position: row.position,
      status: row.status,
      joinedAt: row.joined_at,
      leftAt: row.left_at,
      player: {
        id: row.player.id,
        firstName: row.player.first_name,
        lastName: row.player.last_name,
        name: `${row.player.first_name} ${row.player.last_name}`,
        photo: row.player.photo_url,
        team: {} as Team, // Will be populated by context
        jersey: row.jersey_number,
        position: row.position,
        gradYear: 0, // TODO: Get from player data
        stats: {} as any, // Will be calculated from seasonStats
        awards: [],
        hasHighlight: false,
        division: {} as Division, // Will be populated by context
        gamesPlayed: seasonStats?.games_played || 0,
        season: {} as Season, // Will be populated by context
        hometown: '',
      },
      seasonStats: seasonStats ? {
        gamesPlayed: seasonStats.games_played,
        ppg: seasonStats.ppg,
        rpg: seasonStats.rpg,
        apg: seasonStats.apg,
        spg: seasonStats.spg,
        bpg: seasonStats.bpg,
        mpg: seasonStats.mpg,
        fgPercentage: seasonStats.fg_percentage,
        threePointPercentage: seasonStats.three_point_percentage,
        ftPercentage: seasonStats.ft_percentage,
      } : undefined,
    };
  }

  // Real-time subscriptions
  subscribeToRosterUpdates(rosterId: string, callback: (roster: Roster) => void) {
    return supabase
      .channel(`roster:${rosterId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rosters',
        filter: `id=eq.${rosterId}`,
      }, async () => {
        try {
          // Refresh materialized views when roster changes
          await this.refreshMaterializedViews();

          // Fetch updated roster (this is expensive, consider optimizing)
          const { data: roster } = await supabase
            .from('rosters')
            .select('team_id, season_id')
            .eq('id', rosterId)
            .single();

          if (roster) {
            const updatedRoster = await this.getRosterByTeamSeason(
              roster.team_id,
              roster.season_id
            );
            if (updatedRoster) {
              callback(updatedRoster);
            }
          }
        } catch (error) {
          console.error('Error in roster subscription callback:', error);
        }
      })
      .subscribe();
  }

  subscribeToRosterPlayers(rosterId: string, callback: (players: RosterPlayer[]) => void) {
    return supabase
      .channel(`roster-players:${rosterId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'roster_players',
        filter: `roster_id=eq.${rosterId}`,
      }, async () => {
        try {
          await this.refreshMaterializedViews();

          const { data: rosterPlayers } = await supabase
            .from('roster_players')
            .select(`
              *,
              player:players(
                id,
                first_name,
                last_name,
                photo_url
              )
            `)
            .eq('roster_id', rosterId);

          if (rosterPlayers) {
            callback(rosterPlayers.map(this.transformToRosterPlayer));
          }
        } catch (error) {
          console.error('Error in roster players subscription callback:', error);
        }
      })
      .subscribe();
  }

  // Utility to refresh materialized views
  private async refreshMaterializedViews(): Promise<void> {
    try {
      await supabase.rpc('refresh_performance_views');
    } catch (error) {
      console.error('Error refreshing materialized views:', error);
    }
  }
}