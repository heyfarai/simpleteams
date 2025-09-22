// Supabase implementation of SeasonRepository
import { createClient } from '@supabase/supabase-js';
import type { SeasonRepository } from './interfaces';
import type { Season, Division } from '@/lib/domain/models';

// Use service role key on server side, anon key on client side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = typeof window === 'undefined'
  ? process.env.SUPABASE_SERVICE_ROLE_KEY! // Server side
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Client side

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseSeasonRepository implements SeasonRepository {
  async getAllSeasons(): Promise<Season[]> {
    try {
      const { data: seasons, error } = await supabase
        .from('seasons')
        .select(`
          id,
          name,
          year,
          start_date,
          end_date,
          status,
          is_active
        `)
        .order('year', { ascending: false });

      if (error) throw error;

      return seasons?.map(this.transformToSeason) || [];
    } catch (error) {
      console.error('Error fetching all seasons:', error);
      throw error;
    }
  }

  async getCurrentSeason(): Promise<Season | null> {
    try {
      const { data: season, error } = await supabase
        .from('seasons')
        .select(`
          id,
          name,
          year,
          start_date,
          end_date,
          status,
          is_active
        `)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return season ? this.transformToSeason(season) : null;
    } catch (error) {
      console.error('Error fetching current season:', error);
      throw error;
    }
  }

  async getSeasonById(seasonId: string): Promise<Season | null> {
    try {
      const { data: season, error } = await supabase
        .from('seasons')
        .select(`
          id,
          name,
          year,
          start_date,
          end_date,
          status,
          is_active
        `)
        .eq('id', seasonId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return season ? this.transformToSeason(season) : null;
    } catch (error) {
      console.error('Error fetching season by ID:', error);
      throw error;
    }
  }

  async getActiveSeasons(): Promise<Season[]> {
    try {
      const { data: seasons, error } = await supabase
        .from('seasons')
        .select(`
          id,
          name,
          year,
          start_date,
          end_date,
          status,
          is_active
        `)
        .eq('status', 'active')
        .order('year', { ascending: false });

      if (error) throw error;

      return seasons?.map(this.transformToSeason) || [];
    } catch (error) {
      console.error('Error fetching active seasons:', error);
      throw error;
    }
  }

  async getDivisionsBySeason(seasonId: string): Promise<Division[]> {
    try {
      const { data: divisions, error } = await supabase
        .from('divisions')
        .select(`
          id,
          name,
          age_group,
          skill_level,
          max_teams,
          min_teams,
          season:seasons(
            id,
            name,
            year,
            status,
            is_active
          )
        `)
        .eq('season_id', seasonId)
        .order('name');

      if (error) throw error;

      return divisions?.map(this.transformToDivision) || [];
    } catch (error) {
      console.error('Error fetching divisions by season:', error);
      throw error;
    }
  }

  async createSeason(seasonData: Partial<Season>): Promise<Season> {
    try {
      const { data: season, error } = await supabase
        .from('seasons')
        .insert({
          name: seasonData.name,
          year: seasonData.year,
          start_date: seasonData.startDate,
          end_date: seasonData.endDate,
          status: seasonData.status || 'upcoming',
          is_active: seasonData.isActive || false,
          organization_id: process.env.DEFAULT_ORGANIZATION_ID, // Default for migration
        })
        .select()
        .single();

      if (error) throw error;

      return this.transformToSeason(season);
    } catch (error) {
      console.error('Error creating season:', error);
      throw error;
    }
  }

  async updateSeason(seasonId: string, updates: Partial<Season>): Promise<Season> {
    try {
      const { data: season, error } = await supabase
        .from('seasons')
        .update({
          name: updates.name,
          year: updates.year,
          start_date: updates.startDate,
          end_date: updates.endDate,
          status: updates.status,
          is_active: updates.isActive,
        })
        .eq('id', seasonId)
        .select()
        .single();

      if (error) throw error;

      return this.transformToSeason(season);
    } catch (error) {
      console.error('Error updating season:', error);
      throw error;
    }
  }

  async setActiveSeason(seasonId: string): Promise<void> {
    try {
      // First, deactivate all seasons
      const { error: deactivateError } = await supabase
        .from('seasons')
        .update({ is_active: false })
        .neq('id', seasonId);

      if (deactivateError) throw deactivateError;

      // Then activate the specified season
      const { error: activateError } = await supabase
        .from('seasons')
        .update({ is_active: true })
        .eq('id', seasonId);

      if (activateError) throw activateError;
    } catch (error) {
      console.error('Error setting active season:', error);
      throw error;
    }
  }

  // Interface methods required by SeasonRepository
  async findAll(): Promise<Season[]> {
    return this.getAllSeasons();
  }

  async findById(id: string): Promise<Season | null> {
    return this.getSeasonById(id);
  }

  async findActive(): Promise<Season[]> {
    return this.getActiveSeasons();
  }

  async findCompleted(): Promise<Season[]> {
    try {
      const { data: seasons, error } = await supabase
        .from('seasons')
        .select(`
          id,
          name,
          year,
          start_date,
          end_date,
          status,
          is_active
        `)
        .eq('status', 'completed')
        .order('year', { ascending: false });

      if (error) throw error;

      return seasons?.map(this.transformToSeason) || [];
    } catch (error) {
      console.error('Error fetching completed seasons:', error);
      throw error;
    }
  }

  async findCurrent(): Promise<Season | null> {
    return this.getCurrentSeason();
  }

  // Transform Supabase row to domain Season model
  private transformToSeason(row: any): Season {
    return {
      id: row.id,
      name: row.name,
      year: row.year,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      isActive: row.is_active,
    };
  }

  // Transform Supabase row to domain Division model
  private transformToDivision(row: any): Division {
    return {
      id: row.id,
      name: row.name,
      ageGroup: row.age_group,
      skillLevel: row.skill_level,
      teamLimits: {
        maxTeams: row.max_teams,
        minTeams: row.min_teams,
      },
      conference: {
        id: row.season?.id || '',
        name: row.season?.name || '',
        season: {
          id: row.season?.id || '',
          name: row.season?.name || '',
          year: row.season?.year || 0,
          status: row.season?.status || 'upcoming',
          isActive: row.season?.is_active || false,
        },
      },
    };
  }

  // Real-time subscriptions
  subscribeToSeasonUpdates(callback: (seasons: Season[]) => void) {
    return supabase
      .channel('seasons')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'seasons',
      }, async () => {
        try {
          const seasons = await this.getAllSeasons();
          callback(seasons);
        } catch (error) {
          console.error('Error in season subscription callback:', error);
        }
      })
      .subscribe();
  }

  subscribeToCurrentSeason(callback: (season: Season | null) => void) {
    return supabase
      .channel('current-season')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'seasons',
        filter: 'is_active=eq.true',
      }, async () => {
        try {
          const season = await this.getCurrentSeason();
          callback(season);
        } catch (error) {
          console.error('Error in current season subscription callback:', error);
        }
      })
      .subscribe();
  }
}