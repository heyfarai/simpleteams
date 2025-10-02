import { createClient } from '@supabase/supabase-js';
import type {
  GameSessionRepository,
  CreateGameSessionRequest,
  UpdateGameSessionRequest
} from './interfaces';
import type { GameSession } from '../domain/models';

// Use service role key on server side, anon key on client side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  typeof window === "undefined"
    ? process.env.SUPABASE_SERVICE_ROLE_KEY! // Server side
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Client side

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseGameSessionRepository implements GameSessionRepository {
  private supabase = supabase;

  async findAll(): Promise<GameSession[]> {
    const { data, error } = await this.supabase
      .from('game_sessions')
      .select(`
        *,
        season:seasons(*)
      `)
      .order('sequence', { ascending: true });

    if (error) {
      console.error('[SupabaseGameSessionRepository.findAll] Error:', error);
      throw error;
    }

    return data?.map(this.transformToGameSession) || [];
  }

  async findById(id: string): Promise<GameSession | null> {
    const { data, error } = await this.supabase
      .from('game_sessions')
      .select(`
        *,
        season:seasons(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('[SupabaseGameSessionRepository.findById] Error:', error);
      throw error;
    }

    return data ? this.transformToGameSession(data) : null;
  }

  async findBySeason(seasonId: string): Promise<GameSession[]> {
    const { data, error } = await this.supabase
      .from('game_sessions')
      .select(`
        *,
        season:seasons(*)
      `)
      .eq('season_id', seasonId)
      .order('sequence', { ascending: true });

    if (error) {
      console.error('[SupabaseGameSessionRepository.findBySeason] Error:', error);
      throw error;
    }

    return data?.map(this.transformToGameSession) || [];
  }

  async findBySeasonAndType(seasonId: string, type: 'regular' | 'playoffs'): Promise<GameSession[]> {
    const { data, error } = await this.supabase
      .from('game_sessions')
      .select(`
        *,
        season:seasons(*)
      `)
      .eq('season_id', seasonId)
      .eq('type', type)
      .order('sequence', { ascending: true });

    if (error) {
      console.error('[SupabaseGameSessionRepository.findBySeasonAndType] Error:', error);
      throw error;
    }

    return data?.map(this.transformToGameSession) || [];
  }

  async findActive(): Promise<GameSession[]> {
    const { data, error } = await this.supabase
      .from('game_sessions')
      .select(`
        *,
        season:seasons(*)
      `)
      .eq('is_active', true)
      .order('sequence', { ascending: true });

    if (error) {
      console.error('[SupabaseGameSessionRepository.findActive] Error:', error);
      throw error;
    }

    return data?.map(this.transformToGameSession) || [];
  }

  async create(sessionData: CreateGameSessionRequest): Promise<GameSession> {
    const { data, error } = await this.supabase
      .from('game_sessions')
      .insert({
        season_id: sessionData.seasonId,
        name: sessionData.name,
        sequence: sessionData.sequence,
        start_date: sessionData.startDate,
        end_date: sessionData.endDate,
        type: sessionData.type,
        max_teams: sessionData.maxTeams,
        is_active: sessionData.isActive ?? true,
      })
      .select(`
        *,
        season:seasons(*)
      `)
      .single();

    if (error) {
      console.error('[SupabaseGameSessionRepository.create] Error:', error);
      throw error;
    }

    return this.transformToGameSession(data);
  }

  async update(id: string, updateData: UpdateGameSessionRequest): Promise<GameSession> {
    const updateFields: any = {};

    if (updateData.name !== undefined) updateFields.name = updateData.name;
    if (updateData.sequence !== undefined) updateFields.sequence = updateData.sequence;
    if (updateData.startDate !== undefined) updateFields.start_date = updateData.startDate;
    if (updateData.endDate !== undefined) updateFields.end_date = updateData.endDate;
    if (updateData.type !== undefined) updateFields.type = updateData.type;
    if (updateData.maxTeams !== undefined) updateFields.max_teams = updateData.maxTeams;
    if (updateData.isActive !== undefined) updateFields.is_active = updateData.isActive;

    const { data, error } = await this.supabase
      .from('game_sessions')
      .update(updateFields)
      .eq('id', id)
      .select(`
        *,
        season:seasons(*)
      `)
      .single();

    if (error) {
      console.error('[SupabaseGameSessionRepository.update] Error:', error);
      throw error;
    }

    return this.transformToGameSession(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('game_sessions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[SupabaseGameSessionRepository.delete] Error:', error);
      throw error;
    }
  }

  private transformToGameSession(data: any): GameSession {
    return {
      id: data.id,
      seasonId: data.season_id,
      name: data.name,
      sequence: data.sequence,
      startDate: data.start_date,
      endDate: data.end_date,
      type: data.type,
      maxTeams: data.max_teams,
      isActive: data.is_active,
      season: data.season ? {
        id: data.season.id,
        name: data.season.name,
        year: data.season.year,
        startDate: data.season.start_date,
        endDate: data.season.end_date,
        status: data.season.status,
        isActive: data.season.is_active,
      } : undefined,
    };
  }
}