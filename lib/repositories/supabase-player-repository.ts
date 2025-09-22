// Supabase Player Repository
import { createClient } from '@supabase/supabase-js';
import type { PlayerRepository, CreatePlayerRequest, UpdatePlayerRequest } from './interfaces';
import type { Player, Team, Division, Season, PlayerStats } from '@/lib/domain/models';

// Use service role key on server side, anon key on client side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = typeof window === 'undefined'
  ? process.env.SUPABASE_SERVICE_ROLE_KEY! // Server side
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Client side

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabasePlayerRepository implements PlayerRepository {
  async findAll(): Promise<Player[]> {
    try {
      const { data: rosterPlayers, error } = await supabase
        .from('roster_players')
        .select(`
          id,
          jersey_number,
          position,
          status,
          player:players(
            id,
            first_name,
            last_name,
            photo_url,
            grad_year,
            height,
            hometown
          ),
          roster:rosters(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url
            ),
            season_division:season_divisions(
              division:league_divisions(
                id,
                name,
                description
              ),
              season:seasons(
                id,
                name,
                year,
                status,
                is_active
              )
            )
          ),
          player_season_stats(
            ppg,
            rpg,
            apg,
            spg,
            bpg,
            mpg,
            games_played
          )
        `)
        .eq('status', 'active');

      if (error) throw error;

      return rosterPlayers?.map(this.transformToPlayer) || [];
    } catch (error) {
      console.error('Error fetching all players:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Player | null> {
    console.log('🔍 SupabasePlayerRepository.findById() called with:', id);
    try {
      // Use a simpler query that matches what works in SQL
      const { data: rosterPlayer, error } = await supabase
        .from('roster_players')
        .select(`
          id,
          jersey_number,
          position,
          status,
          players!inner(
            id,
            first_name,
            last_name,
            photo_url,
            grad_year,
            height,
            hometown
          ),
          rosters!inner(
            id,
            teams!inner(
              id,
              name,
              short_name,
              logo_url
            ),
            season_divisions!inner(
              league_divisions!inner(
                id,
                name,
                description
              ),
              seasons!inner(
                id,
                name,
                year,
                status,
                is_active
              )
            )
          )
        `)
        .eq('players.id', id)
        .single();

      if (!error && rosterPlayer) {
        console.log('✅ Found player with roster info:', rosterPlayer);
        return this.transformToPlayer(rosterPlayer);
      }

      // If we get here, there was an error finding the player in roster_players
      console.log('❌ Failed to find player in roster_players. Error:', error);
      if (error?.code === 'PGRST116') {
        return null; // Player not found
      }

      throw error;
    } catch (error) {
      console.error('Error fetching player by ID:', error);
      throw error;
    }
  }

  async findBySeason(seasonId: string): Promise<Player[]> {
    try {
      const { data: rosterPlayers, error } = await supabase
        .from('roster_players')
        .select(`
          id,
          jersey_number,
          position,
          status,
          player:players(
            id,
            first_name,
            last_name,
            photo_url,
            grad_year,
            height,
            hometown
          ),
          roster:rosters!inner(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url
            ),
            season_division:season_divisions!inner(
              division:league_divisions(
                id,
                name,
                description
              ),
              season:seasons!inner(
                id,
                name,
                year,
                status,
                is_active
              )
            )
          ),
          player_season_stats(
            ppg,
            rpg,
            apg,
            spg,
            bpg,
            mpg,
            games_played
          )
        `)
        .eq('roster.season_division.season.id', seasonId)
        .eq('status', 'active');

      if (error) throw error;

      return rosterPlayers?.map(this.transformToPlayer) || [];
    } catch (error) {
      console.error('Error fetching players by season:', error);
      throw error;
    }
  }

  async findByTeam(teamId: string): Promise<Player[]> {
    try {
      const { data: rosterPlayers, error } = await supabase
        .from('roster_players')
        .select(`
          id,
          jersey_number,
          position,
          status,
          players!inner(
            id,
            first_name,
            last_name,
            photo_url,
            grad_year,
            height,
            hometown
          ),
          rosters!inner(
            id,
            teams!inner(
              id,
              name,
              short_name,
              logo_url
            ),
            season_divisions!inner(
              league_divisions!inner(
                id,
                name,
                description
              ),
              seasons!inner(
                id,
                name,
                year,
                status,
                is_active
              )
            )
          )
        `)
        .eq('rosters.teams.id', teamId)
        .eq('status', 'active')
        .order('jersey_number', { ascending: true });

      if (error) throw error;

      return rosterPlayers?.map(this.transformToPlayer) || [];
    } catch (error) {
      console.error('Error fetching players by team:', error);
      throw error;
    }
  }

  async findStatLeaders(seasonId?: string): Promise<Player[]> {
    // TODO: Implement stat leaders query
    return [];
  }

  async findLeadersByCategory(category: any, seasonId?: string): Promise<Player[]> {
    // TODO: Implement leaders by category query
    return [];
  }

  async findFeatured(count: number): Promise<Player[]> {
    // TODO: Implement featured players query
    return [];
  }

  async search(query: string): Promise<Player[]> {
    try {
      const { data: rosterPlayers, error } = await supabase
        .from('roster_players')
        .select(`
          id,
          jersey_number,
          position,
          status,
          player:players(
            id,
            first_name,
            last_name,
            photo_url,
            grad_year,
            height,
            hometown
          ),
          roster:rosters(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url
            ),
            season_division:season_divisions(
              division:league_divisions(
                id,
                name,
                description
              ),
              season:seasons(
                id,
                name,
                year,
                status,
                is_active
              )
            )
          ),
          player_season_stats(
            ppg,
            rpg,
            apg,
            spg,
            bpg,
            mpg,
            games_played
          )
        `)
        .or(`player.first_name.ilike.%${query}%,player.last_name.ilike.%${query}%`)
        .eq('status', 'active')
        .limit(20);

      if (error) throw error;

      return rosterPlayers?.map(this.transformToPlayer) || [];
    } catch (error) {
      console.error('Error searching players:', error);
      throw error;
    }
  }

  // Transform Supabase row to domain Player model
  private transformToPlayer(row: any): Player {
    // Handle both old format (row.player) and new format (row.players[0])
    const player = row.players?.[0] || row.players || row.player;
    const roster = row.rosters?.[0] || row.rosters || row.roster;
    const team = roster?.teams?.[0] || roster?.teams || roster?.team;
    const seasonDivision = roster?.season_divisions?.[0] || roster?.season_divisions || roster?.season_division;
    const division = seasonDivision?.league_divisions?.[0] || seasonDivision?.league_divisions || seasonDivision?.division;
    const season = seasonDivision?.seasons?.[0] || seasonDivision?.seasons || seasonDivision?.season;

    const teamData: Team = {
      id: team?.id || '',
      name: team?.name || '',
      shortName: team?.short_name || '',
      logo: team?.logo_url || '',
      status: 'active',
    };

    const divisionData: Division = {
      id: division?.id || '',
      name: division?.name || '',
      ageGroup: division?.description || 'unknown',
      conference: {
        id: season?.id || '',
        name: season?.name || '',
        season: {
          id: season?.id || '',
          name: season?.name || '',
          year: season?.year || 0,
          status: season?.status || 'upcoming',
          isActive: season?.is_active || false,
        },
      },
    };

    const seasonData: Season = {
      id: season?.id || '',
      name: season?.name || '',
      year: season?.year || 0,
      status: season?.status || 'upcoming',
      isActive: season?.is_active || false,
    };

    const stats: PlayerStats = {
      ppg: row.player_season_stats?.[0]?.ppg || 0,
      rpg: row.player_season_stats?.[0]?.rpg || 0,
      apg: row.player_season_stats?.[0]?.apg || 0,
      spg: row.player_season_stats?.[0]?.spg || 0,
      bpg: row.player_season_stats?.[0]?.bpg || 0,
      mpg: row.player_season_stats?.[0]?.mpg || 0,
    };

    const fullName = `${player?.first_name || ''} ${player?.last_name || ''}`;

    return {
      id: player?.id || '',
      firstName: player?.first_name || '',
      lastName: player?.last_name || '',
      name: fullName,
      team: teamData,
      jersey: row.jersey_number || 0,
      position: row.position || 'PG',
      gradYear: player?.grad_year || 0,
      height: player?.height || '',
      photo: player?.photo_url || '',
      stats,
      awards: [], // TODO: Implement awards if needed
      hasHighlight: false, // TODO: Implement highlights if needed
      division: divisionData,
      gamesPlayed: row.player_season_stats?.[0]?.games_played || 0,
      season: seasonData,
      hometown: player?.hometown || '',
    };
  }

  async create(playerData: CreatePlayerRequest): Promise<Player> {
    console.log('🏀 SupabasePlayerRepository.create() called with:', playerData);

    try {
      // First, create the player record
      const { data: newPlayer, error: playerError } = await supabase
        .from('players')
        .insert({
          first_name: playerData.firstName,
          last_name: playerData.lastName,
          grad_year: playerData.personalInfo?.gradYear,
          hometown: playerData.personalInfo?.hometown,
          height: playerData.personalInfo?.height,
          photo_url: null, // TODO: Handle photo upload
        })
        .select()
        .single();

      if (playerError) {
        console.error('Error creating player:', playerError);
        throw new Error(`Failed to create player: ${playerError.message}`);
      }

      console.log('✅ Player created:', newPlayer);

      // If we have roster data, create the roster entry
      if (playerData.rosterData && playerData.teamId) {
        // First, find the roster for this team (should be one active roster)
        const { data: roster, error: rosterError } = await supabase
          .from('rosters')
          .select('id')
          .eq('team_id', playerData.teamId)
          .single();

        if (rosterError) {
          console.error('Error finding roster:', rosterError);
          throw new Error(`Failed to find roster: ${rosterError.message}`);
        }

        // Create the roster player entry
        const { data: rosterPlayer, error: rosterPlayerError } = await supabase
          .from('roster_players')
          .insert({
            roster_id: roster.id,
            player_id: newPlayer.id,
            jersey_number: playerData.rosterData.jerseyNumber,
            position: playerData.rosterData.position,
            status: playerData.rosterData.status,
          })
          .select()
          .single();

        if (rosterPlayerError) {
          console.error('Error creating roster player:', rosterPlayerError);
          throw new Error(`Failed to create roster player: ${rosterPlayerError.message}`);
        }

        console.log('✅ Roster player created:', rosterPlayer);
      }

      // Return the newly created player by fetching it with full details
      const createdPlayer = await this.findById(newPlayer.id);
      if (!createdPlayer) {
        throw new Error('Failed to retrieve created player');
      }

      return createdPlayer;

    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async update(id: string, playerData: UpdatePlayerRequest): Promise<Player> {
    console.log('🏀 SupabasePlayerRepository.update() called with:', id, playerData);

    try {
      // Update the player record
      const updateData: any = {};

      if (playerData.firstName !== undefined) updateData.first_name = playerData.firstName;
      if (playerData.lastName !== undefined) updateData.last_name = playerData.lastName;
      if (playerData.personalInfo?.gradYear !== undefined) updateData.grad_year = playerData.personalInfo.gradYear;
      if (playerData.personalInfo?.hometown !== undefined) updateData.hometown = playerData.personalInfo.hometown;
      if (playerData.personalInfo?.height !== undefined) updateData.height = playerData.personalInfo.height;

      if (Object.keys(updateData).length > 0) {
        const { data: updatedPlayer, error: playerError } = await supabase
          .from('players')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (playerError) {
          console.error('Error updating player:', playerError);
          throw new Error(`Failed to update player: ${playerError.message}`);
        }

        console.log('✅ Player updated:', updatedPlayer);
      }

      // If we have roster data, update the roster player entry
      if (playerData.rosterData) {
        // Find the roster player entry for this player
        const { data: rosterPlayers, error: findError } = await supabase
          .from('roster_players')
          .select('id')
          .eq('player_id', id);

        if (findError) {
          console.error('Error finding roster player:', findError);
          throw new Error(`Failed to find roster player: ${findError.message}`);
        }

        if (rosterPlayers && rosterPlayers.length > 0) {
          const rosterUpdateData: any = {};

          if (playerData.rosterData.jerseyNumber !== undefined) rosterUpdateData.jersey_number = playerData.rosterData.jerseyNumber;
          if (playerData.rosterData.position !== undefined) rosterUpdateData.position = playerData.rosterData.position;
          if (playerData.rosterData.status !== undefined) rosterUpdateData.status = playerData.rosterData.status;

          if (Object.keys(rosterUpdateData).length > 0) {
            const { data: updatedRosterPlayer, error: rosterError } = await supabase
              .from('roster_players')
              .update(rosterUpdateData)
              .eq('player_id', id)
              .select()
              .single();

            if (rosterError) {
              console.error('Error updating roster player:', rosterError);
              throw new Error(`Failed to update roster player: ${rosterError.message}`);
            }

            console.log('✅ Roster player updated:', updatedRosterPlayer);
          }
        }
      }

      // Return the updated player by fetching it with full details
      const updatedPlayer = await this.findById(id);
      if (!updatedPlayer) {
        throw new Error('Failed to retrieve updated player');
      }

      return updatedPlayer;

    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    console.log('🗑️ SupabasePlayerRepository.softDelete() called with:', id);

    try {
      // Find all roster_players entries for this player and mark them as removed
      const { data: rosterPlayers, error: findError } = await supabase
        .from('roster_players')
        .select('id')
        .eq('player_id', id)
        .eq('status', 'active');

      if (findError) {
        console.error('Error finding roster players to soft delete:', findError);
        throw new Error(`Failed to find roster players: ${findError.message}`);
      }

      if (rosterPlayers && rosterPlayers.length > 0) {
        // Update all active roster entries to 'removed' status
        const { error: updateError } = await supabase
          .from('roster_players')
          .update({ status: 'removed' })
          .eq('player_id', id)
          .eq('status', 'active');

        if (updateError) {
          console.error('Error soft deleting roster players:', updateError);
          throw new Error(`Failed to soft delete roster players: ${updateError.message}`);
        }

        console.log('✅ Soft deleted player from rosters:', id);
      } else {
        console.log('⚠️ No active roster entries found for player:', id);
      }

    } catch (error) {
      console.error('Error in softDelete:', error);
      throw error;
    }
  }
}