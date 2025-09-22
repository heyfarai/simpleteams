// Supabase implementation of GameRepository
import { createClient } from '@supabase/supabase-js';
import type { Game, Team, Division, Season, Venue } from '@/lib/domain/models';

const supabase = createClient(
  process.env.SIMPLE_SUPABASE_URL!,
  process.env.SIMPLE_SUPABASE_SERVICE_ROLE_KEY!
);

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

export class SupabaseGameRepository {
  async getAllGames(): Promise<Game[]> {
    try {
      const { data: games, error } = await supabase
        .from('games')
        .select(`
          *,
          roster_home:rosters!roster_home_id(
            id,
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
          home_team:teams!home_team_id(
            id,
            name,
            short_name,
            logo_url,
            city
          ),
          away_team:teams!away_team_id(
            id,
            name,
            short_name,
            logo_url,
            city
          ),
          venue:venues(
            id,
            name,
            address,
            city
          )
        `)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      return games?.map(this.transformToGame) || [];
    } catch (error) {
      console.error('Error fetching all games:', error);
      throw error;
    }
  }

  async getGamesBySeason(seasonId: string): Promise<Game[]> {
    try {
      const { data: games, error } = await supabase
        .from('games')
        .select(`
          *,
          division:divisions!inner(
            id,
            name,
            age_group,
            skill_level,
            season:seasons!inner(
              id,
              name,
              year,
              status,
              is_active
            )
          ),
          home_team:teams!home_team_id(
            id,
            name,
            short_name,
            logo_url,
            city
          ),
          away_team:teams!away_team_id(
            id,
            name,
            short_name,
            logo_url,
            city
          ),
          venue:venues(
            id,
            name,
            address,
            city
          )
        `)
        .eq('division.season.id', seasonId)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      return games?.map(this.transformToGame) || [];
    } catch (error) {
      console.error('Error fetching games by season:', error);
      throw error;
    }
  }

  async getGamesByTeam(teamId: string): Promise<Game[]> {
    try {
      const { data: games, error } = await supabase
        .from('games')
        .select(`
          *,
          roster_home:rosters!roster_home_id(
            id,
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
          home_team:teams!home_team_id(
            id,
            name,
            short_name,
            logo_url,
            city
          ),
          away_team:teams!away_team_id(
            id,
            name,
            short_name,
            logo_url,
            city
          ),
          venue:venues(
            id,
            name,
            address,
            city
          )
        `)
        .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      return games?.map(this.transformToGame) || [];
    } catch (error) {
      console.error('Error fetching games by team:', error);
      throw error;
    }
  }

  async getGameById(gameId: string): Promise<Game | null> {
    try {
      const { data: game, error } = await supabase
        .from('games')
        .select(`
          *,
          roster_home:rosters!roster_home_id(
            id,
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
          home_team:teams!home_team_id(
            id,
            name,
            short_name,
            logo_url,
            city
          ),
          away_team:teams!away_team_id(
            id,
            name,
            short_name,
            logo_url,
            city
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
          home_team:teams!home_team_id(
            id,
            name,
            short_name,
            logo_url,
            city
          ),
          away_team:teams!away_team_id(
            id,
            name,
            short_name,
            logo_url,
            city
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
          division_id: gameData.division?.id,
          home_team_id: gameData.homeTeam?.id,
          away_team_id: gameData.awayTeam?.id,
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
      id: row.home_team.id,
      name: row.home_team.name,
      shortName: row.home_team.short_name,
      logo: row.home_team.logo_url,
      location: { city: row.home_team.city },
      status: 'active',
    };

    const awayTeam: Team = {
      id: row.away_team.id,
      name: row.away_team.name,
      shortName: row.away_team.short_name,
      logo: row.away_team.logo_url,
      location: { city: row.away_team.city },
      status: 'active',
    };

    const division: Division = {
      id: row.division.id,
      name: row.division.name,
      ageGroup: row.division.age_group,
      skillLevel: row.division.skill_level,
      conference: {
        id: row.division.season?.id || '',
        name: row.division.season?.name || '',
        season: {
          id: row.division.season?.id || '',
          name: row.division.season?.name || '',
          year: row.division.season?.year || 0,
          status: row.division.season?.status || 'upcoming',
          isActive: row.division.season?.is_active || false,
        },
      },
    };

    const season: Season = {
      id: row.division.season?.id || '',
      name: row.division.season?.name || '',
      year: row.division.season?.year || 0,
      status: row.division.season?.status || 'upcoming',
      isActive: row.division.season?.is_active || false,
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
      venue: venue!,
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
}