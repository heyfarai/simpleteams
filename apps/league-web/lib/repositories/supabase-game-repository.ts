// Supabase implementation of GameRepository
import { createClient } from '@supabase/supabase-js';
import type { Game, Team, Division, Season, Venue } from '@/lib/domain/models';
import type { GameRepository, CreateGameRequest } from './interfaces';

// Use service role key on server side, anon key on client side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = typeof window === 'undefined'
  ? process.env.SUPABASE_SERVICE_ROLE_KEY! // Server side
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Client side

const supabase = createClient(supabaseUrl, supabaseKey);

export interface GameEvent {
  id: string;
  gameId: string;
  playerId?: string;
  teamId: string;
  eventType: string;
  quarter: number;
  gameTime: string;
  details: Record<string, any>;
  points: number;
  createdAt: string;
  createdBy?: string;
  sequenceNumber: number;
}

export class SupabaseGameRepository implements GameRepository {
  async findAll(includeArchived = false): Promise<Game[]> {
    try {
      let query = supabase
        .from('games')
        .select(`
          *,
          roster_home:rosters!roster_home_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
              division:league_divisions(
                id,
                name,
                description
              )
            )
          ),
          roster_away:rosters!roster_away_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
              division:league_divisions(
                id,
                name,
                description
              )
            )
          ),
          venue:venues(
            id,
            name,
            address,
            city
          ),
          game_session:game_sessions!session_id(
            id,
            name,
            season:seasons(
              id,
              name,
              year,
              status,
              is_active
            )
          )
        `);

      if (!includeArchived) {
        query = query.eq('is_archived', false);
      }

      const { data: games, error } = await query.order('scheduled_at', { ascending: true });

      if (error) throw error;

      return games?.map(this.transformToGame) || [];
    } catch (error) {
      console.error('Error fetching all games:', error);
      throw error;
    }
  }

  async findBySeason(seasonId: string, includeArchived = false): Promise<Game[]> {
    try {
      let query = supabase
        .from('games')
        .select(`
          *,
          roster_home:rosters!roster_home_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          roster_away:rosters!roster_away_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          venue:venues(
            id,
            name,
            address,
            city
          ),
          session:game_sessions!inner(
            id,
            name,
            season:seasons!inner(
              id,
              name,
              year,
              status,
              is_active
            )
          )
        `)
        .eq('session.season.id', seasonId);

      if (!includeArchived) {
        query = query.eq('is_archived', false);
      }

      const { data: games, error } = await query.order('scheduled_at', { ascending: true });

      if (error) throw error;

      return games?.map(this.transformToGame) || [];
    } catch (error) {
      console.error('Error fetching games by season:', error);
      throw error;
    }
  }

  async findByTeam(teamId: string): Promise<Game[]> {
    try {
      const { data: games, error } = await supabase
        .from('games')
        .select(`
          *,
          roster_home:rosters!roster_home_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          roster_away:rosters!roster_away_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          venue:venues(
            id,
            name,
            address,
            city
          )
        `)
        .or(`roster_home.team_id.eq.${teamId},roster_away.team_id.eq.${teamId}`)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      return games?.map(this.transformToGame) || [];
    } catch (error) {
      console.error('Error fetching games by team:', error);
      throw error;
    }
  }

  async findById(gameId: string): Promise<Game | null> {
    try {
      const { data: game, error } = await supabase
        .from('games')
        .select(`
          *,
          roster_home:rosters!roster_home_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          roster_away:rosters!roster_away_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          venue:venues(
            id,
            name,
            address,
            city
          )
        `)
        .eq('id', gameId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return game ? this.transformToGame(game) : null;
    } catch (error) {
      console.error('Error fetching game by ID:', error);
      throw error;
    }
  }

  async getLiveGames(): Promise<Game[]> {
    try {
      const { data: games, error } = await supabase
        .from('games')
        .select(`
          *,
          roster_home:rosters!roster_home_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          roster_away:rosters!roster_away_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          venue:venues(
            id,
            name,
            address,
            city
          )
        `)
        .eq('status', 'live')
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      return games?.map(this.transformToGame) || [];
    } catch (error) {
      console.error('Error fetching live games:', error);
      throw error;
    }
  }

  async createGame(gameData: Partial<Game>): Promise<Game> {
    try {
      const { data: game, error } = await supabase
        .from('games')
        .insert({
          roster_home_id: gameData.homeRoster?.id,
          roster_away_id: gameData.awayRoster?.id,
          venue_id: gameData.venue?.id,
          scheduled_at: gameData.date + 'T' + gameData.time,
          status: gameData.status || 'scheduled',
        })
        .select()
        .single();

      if (error) throw error;

      // Fetch the full game with relations
      const fullGame = await this.getGameById(game.id);
      if (!fullGame) throw new Error('Failed to fetch created game');

      return fullGame;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  async updateGameScore(gameId: string, homeScore: number, awayScore: number): Promise<Game> {
    try {
      const { data: game, error } = await supabase
        .from('games')
        .update({
          home_score: homeScore,
          away_score: awayScore,
        })
        .eq('id', gameId)
        .select()
        .single();

      if (error) throw error;

      const fullGame = await this.getGameById(gameId);
      if (!fullGame) throw new Error('Failed to fetch updated game');

      return fullGame;
    } catch (error) {
      console.error('Error updating game score:', error);
      throw error;
    }
  }

  async startGame(gameId: string): Promise<Game> {
    try {
      const { data: game, error } = await supabase
        .from('games')
        .update({
          status: 'live',
          actual_start_at: new Date().toISOString(),
        })
        .eq('id', gameId)
        .select()
        .single();

      if (error) throw error;

      const fullGame = await this.getGameById(gameId);
      if (!fullGame) throw new Error('Failed to fetch updated game');

      return fullGame;
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  }

  async endGame(gameId: string): Promise<Game> {
    try {
      const { data: game, error } = await supabase
        .from('games')
        .update({
          status: 'completed',
          actual_end_at: new Date().toISOString(),
        })
        .eq('id', gameId)
        .select()
        .single();

      if (error) throw error;

      const fullGame = await this.getGameById(gameId);
      if (!fullGame) throw new Error('Failed to fetch updated game');

      return fullGame;
    } catch (error) {
      console.error('Error ending game:', error);
      throw error;
    }
  }

  // Game Events
  async addGameEvent(event: Omit<GameEvent, 'id' | 'createdAt' | 'sequenceNumber'>): Promise<GameEvent> {
    try {
      // Get next sequence number for this game
      const { data: lastEvent } = await supabase
        .from('game_events')
        .select('sequence_number')
        .eq('game_id', event.gameId)
        .order('sequence_number', { ascending: false })
        .limit(1)
        .single();

      const sequenceNumber = (lastEvent?.sequence_number || 0) + 1;

      const { data: gameEvent, error } = await supabase
        .from('game_events')
        .insert({
          game_id: event.gameId,
          player_id: event.playerId,
          team_id: event.teamId,
          event_type: event.eventType,
          quarter: event.quarter,
          game_time: event.gameTime,
          details: event.details,
          points: event.points,
          created_by: event.createdBy,
          sequence_number: sequenceNumber,
        })
        .select()
        .single();

      if (error) throw error;

      return this.transformToGameEvent(gameEvent);
    } catch (error) {
      console.error('Error adding game event:', error);
      throw error;
    }
  }

  async getGameEvents(gameId: string): Promise<GameEvent[]> {
    try {
      const { data: events, error } = await supabase
        .from('game_events')
        .select('*')
        .eq('game_id', gameId)
        .order('sequence_number', { ascending: true });

      if (error) throw error;

      return events?.map(this.transformToGameEvent) || [];
    } catch (error) {
      console.error('Error fetching game events:', error);
      throw error;
    }
  }

  // Transform Supabase row to domain Game model
  private transformToGame(row: any): Game {
    const homeTeam: Team = {
      id: row.roster_home?.team.id,
      name: row.roster_home?.team.name,
      shortName: row.roster_home?.team.short_name,
      logo: row.roster_home?.team.logo_url,
      location: { city: row.roster_home?.team.city },
      status: 'active',
    };

    const awayTeam: Team = {
      id: row.roster_away?.team.id,
      name: row.roster_away?.team.name,
      shortName: row.roster_away?.team.short_name,
      logo: row.roster_away?.team.logo_url,
      location: { city: row.roster_away?.team.city },
      status: 'active',
    };

    const division: Division = {
      id: row.roster_home?.season_division?.division?.id || '',
      name: row.roster_home?.season_division?.division?.name || 'Unknown Division',
      ageGroup: row.roster_home?.season_division?.division?.age_group || '',
      skillLevel: row.roster_home?.season_division?.division?.skill_level || '',
      conference: {
        id: row.session?.season?.id || '',
        name: row.session?.season?.name || '',
        season: {
          id: row.session?.season?.id || '',
          name: row.session?.season?.name || '',
          year: row.session?.season?.year || 0,
          status: row.session?.season?.status || 'upcoming',
          isActive: row.session?.season?.is_active || false,
        },
      },
    };

    const season: Season = {
      id: row.session?.season?.id || '',
      name: row.session?.season?.name || '',
      year: row.session?.season?.year || 0,
      status: row.session?.season?.status || 'upcoming',
      isActive: row.session?.season?.is_active || false,
    };

    const venue: Venue | undefined = row.venue ? {
      id: row.venue.id,
      name: row.venue.name,
      address: row.venue.address,
      city: row.venue.city,
    } : undefined;

    const scheduledDate = new Date(row.scheduled_at);

    return {
      id: row.id,
      title: `${awayTeam.name} @ ${homeTeam.name}`,
      date: scheduledDate.toISOString().split('T')[0],
      time: scheduledDate.toTimeString().split(' ')[0].slice(0, 5),
      venue: venue || { id: 'tbd', name: 'TBD', address: '', city: '' },
      homeTeam,
      awayTeam,
      division,
      season,
      status: row.status,
      homeScore: row.home_score,
      awayScore: row.away_score,
      score: {
        homeScore: row.home_score,
        awayScore: row.away_score,
      },
    };
  }

  private transformToGameEvent(row: any): GameEvent {
    return {
      id: row.id,
      gameId: row.game_id,
      playerId: row.player_id,
      teamId: row.team_id,
      eventType: row.event_type,
      quarter: row.quarter,
      gameTime: row.game_time,
      details: row.details,
      points: row.points,
      createdAt: row.created_at,
      createdBy: row.created_by,
      sequenceNumber: row.sequence_number,
    };
  }

  // Real-time subscriptions
  subscribeToGameUpdates(gameId: string, callback: (game: Game) => void) {
    return supabase
      .channel(`game:${gameId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`,
      }, async () => {
        try {
          const game = await this.getGameById(gameId);
          if (game) {
            callback(game);
          }
        } catch (error) {
          console.error('Error in game subscription callback:', error);
        }
      })
      .subscribe();
  }

  subscribeToGameEvents(gameId: string, callback: (event: GameEvent) => void) {
    return supabase
      .channel(`game-events:${gameId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'game_events',
        filter: `game_id=eq.${gameId}`,
      }, (payload) => {
        if (payload.new) {
          callback(this.transformToGameEvent(payload.new));
        }
      })
      .subscribe();
  }

  subscribeToLiveGames(callback: (games: Game[]) => void) {
    return supabase
      .channel('live-games')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'games',
        filter: 'status=eq.live',
      }, async () => {
        try {
          const games = await this.getLiveGames();
          callback(games);
        } catch (error) {
          console.error('Error in live games subscription callback:', error);
        }
      })
      .subscribe();
  }

  // Interface methods that need basic implementation
  async findByDivision(divisionId: string): Promise<Game[]> {
    // For now, return empty array - can be implemented later with proper division filtering
    return [];
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Game[]> {
    try {
      const { data: games, error } = await supabase
        .from('games')
        .select('*')
        .gte('game_date', startDate)
        .lte('game_date', endDate);

      if (error) throw error;
      return games?.map(this.mapGameFromDB) || [];
    } catch (error) {
      console.error('Error fetching games by date range:', error);
      throw error;
    }
  }

  async findUpcoming(limit = 10): Promise<Game[]> {
    try {
      const { data: games, error } = await supabase
        .from('games')
        .select('*')
        .gte('game_date', new Date().toISOString())
        .order('game_date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return games?.map(this.mapGameFromDB) || [];
    } catch (error) {
      console.error('Error fetching upcoming games:', error);
      throw error;
    }
  }

  async findCompleted(limit = 10): Promise<Game[]> {
    try {
      const { data: games, error } = await supabase
        .from('games')
        .select('*')
        .lt('game_date', new Date().toISOString())
        .eq('status', 'completed')
        .order('game_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return games?.map(this.mapGameFromDB) || [];
    } catch (error) {
      console.error('Error fetching completed games:', error);
      throw error;
    }
  }

  // Session-based query methods
  async findBySession(sessionId: string): Promise<Game[]> {
    try {
      const { data: games, error } = await supabase
        .from('games')
        .select(`
          *,
          roster_home:rosters!roster_home_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          roster_away:rosters!roster_away_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          venue:venues(
            id,
            name,
            address,
            city
          ),
          session:game_sessions(
            id,
            name,
            sequence,
            type
          )
        `)
        .eq('session_id', sessionId)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      return games?.map(this.transformToGame) || [];
    } catch (error) {
      console.error('Error fetching games by session:', error);
      throw error;
    }
  }

  async findByTeamAndSession(rosterId: string, sessionId: string): Promise<Game[]> {
    try {
      const { data: games, error } = await supabase
        .from('games')
        .select(`
          *,
          roster_home:rosters!roster_home_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          roster_away:rosters!roster_away_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          venue:venues(
            id,
            name,
            address,
            city
          ),
          session:game_sessions(
            id,
            name,
            sequence,
            type
          )
        `)
        .eq('session_id', sessionId)
        .or(`roster_home_id.eq.${rosterId},roster_away_id.eq.${rosterId}`)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      return games?.map(this.transformToGame) || [];
    } catch (error) {
      console.error('Error fetching games by team and session:', error);
      throw error;
    }
  }

  async findBySeasonAndSession(seasonId: string, sessionId: string): Promise<Game[]> {
    try {
      const { data: games, error } = await supabase
        .from('games')
        .select(`
          *,
          roster_home:rosters!roster_home_id(
            id,
            season_division:season_divisions!inner(
              season:seasons!inner(
                id,
                name,
                year,
                status,
                is_active
              ),
              division:league_divisions(
                id,
                name,
                description
              )
            )
          ),
          roster_away:rosters!roster_away_id(
            id,
            season_division:season_divisions!inner(
              season:seasons!inner(
                id,
                name,
                year,
                status,
                is_active
              ),
              division:league_divisions(
                id,
                name,
                description
              )
            )
          ),
          venue:venues(
            id,
            name,
            address,
            city
          ),
          session:game_sessions(
            id,
            name,
            sequence,
            type
          )
        `)
        .eq('session_id', sessionId)
        .eq('roster_home.season_division.season.id', seasonId)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      return games?.map(this.transformToGame) || [];
    } catch (error) {
      console.error('Error fetching games by season and session:', error);
      throw error;
    }
  }

  // Update operation
  async update(id: string, gameData: import('./interfaces').UpdateGameRequest): Promise<Game> {
    try {
      // Build update object with only provided fields that exist in database
      const updateData: any = {};

      // Note: title field doesn't exist in games table, so we skip it
      if (gameData.status !== undefined) updateData.status = gameData.status;
      if (gameData.homeScore !== undefined) updateData.home_score = gameData.homeScore;
      if (gameData.awayScore !== undefined) updateData.away_score = gameData.awayScore;
      if (gameData.venueId !== undefined) updateData.venue_id = gameData.venueId;
      if (gameData.isArchived !== undefined) updateData.is_archived = gameData.isArchived;

      // Handle date and time updates - combine into scheduled_at timestamp
      if (gameData.date !== undefined || gameData.time !== undefined) {
        const currentGame = await this.findById(id);
        if (!currentGame) throw new Error(`Game with id ${id} not found`);

        const currentDate = gameData.date || currentGame.date;
        const currentTime = gameData.time || currentGame.time;

        // Combine date and time into scheduled_at timestamp
        updateData.scheduled_at = new Date(`${currentDate}T${currentTime}:00`).toISOString();
      }

      const { data: updatedGame, error } = await supabase
        .from('games')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          roster_home:rosters!roster_home_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          roster_away:rosters!roster_away_id(
            id,
            team:teams(
              id,
              name,
              short_name,
              logo_url,
              city
            ),
            season_division:season_divisions(
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
                description
              )
            )
          ),
          venue:venues(
            id,
            name,
            address,
            city
          )
        `)
        .single();

      if (error) throw error;
      if (!updatedGame) throw new Error(`Failed to update game ${id}`);

      return this.transformToGame(updatedGame);
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  }

  // Helper method to map database records to domain Game objects
  private mapGameFromDB(dbGame: any): Game {
    return {
      id: dbGame.id,
      date: dbGame.game_date,
      time: dbGame.game_time,
      status: dbGame.status,
      homeTeam: {
        id: dbGame.roster_home_id,
        name: dbGame.roster_home?.team?.name || 'Unknown Team',
        logo: null
      },
      awayTeam: {
        id: dbGame.roster_away_id,
        name: dbGame.roster_away?.team?.name || 'Unknown Team',
        logo: null
      },
      homeScore: dbGame.home_score,
      awayScore: dbGame.away_score,
      season: {
        id: dbGame.season_id || 'unknown',
        name: 'Season',
        year: new Date().getFullYear(),
        status: 'active'
      },
      venue: {
        id: dbGame.venue_id || 'unknown',
        name: dbGame.venue?.name || 'TBD',
        address: dbGame.venue?.address || ''
      }
    } as Game;
  }

  async create(gameData: CreateGameRequest): Promise<Game> {
    try {
      // Import the roster repository at runtime to avoid circular dependencies
      const { SupabaseRosterRepository } = await import('./roster-repository');
      const rosterRepo = new SupabaseRosterRepository();

      // Resolve team IDs to roster IDs
      const homeRoster = await rosterRepo.getRosterByTeamSeason(gameData.homeTeamId, gameData.seasonId);
      const awayRoster = await rosterRepo.getRosterByTeamSeason(gameData.awayTeamId, gameData.seasonId);

      if (!homeRoster) {
        throw new Error(`No roster found for home team ${gameData.homeTeamId} in season ${gameData.seasonId}`);
      }
      if (!awayRoster) {
        throw new Error(`No roster found for away team ${gameData.awayTeamId} in season ${gameData.seasonId}`);
      }

      // Combine date and time into scheduled_at timestamp
      const scheduledAt = `${gameData.date}T${gameData.time}:00Z`;

      const { data: game, error } = await supabase
        .from('games')
        .insert({
          scheduled_at: scheduledAt,
          roster_home_id: homeRoster.id,
          roster_away_id: awayRoster.id,
          venue_id: gameData.venueId,
          status: gameData.status || 'upcoming',
          is_archived: gameData.isArchived || false,
        })
        .select()
        .single();

      if (error) throw error;
      if (!game) throw new Error('Failed to create game');

      // Fetch the full game with related data
      const fullGame = await this.findById(game.id);
      if (!fullGame) throw new Error('Failed to fetch created game');

      return fullGame;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }
}