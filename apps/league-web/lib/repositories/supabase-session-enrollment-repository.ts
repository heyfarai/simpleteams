import { createClient } from '@supabase/supabase-js';
import type {
  SessionEnrollmentRepository,
  CreateSessionEnrollmentRequest
} from './interfaces';
import type { RosterSessionEnrollment } from '../domain/models';

// Use service role key on server side, anon key on client side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  typeof window === "undefined"
    ? process.env.SUPABASE_SERVICE_ROLE_KEY! // Server side
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Client side

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseSessionEnrollmentRepository implements SessionEnrollmentRepository {
  private supabase = supabase;

  async findAll(): Promise<RosterSessionEnrollment[]> {
    const { data, error } = await this.supabase
      .from('roster_session_enrollments')
      .select(`
        *,
        roster:rosters(*),
        session:game_sessions(*)
      `)
      .order('enrollment_date', { ascending: false });

    if (error) {
      console.error('[SupabaseSessionEnrollmentRepository.findAll] Error:', error);
      throw error;
    }

    return data?.map(this.transformToEnrollment) || [];
  }

  async findById(id: string): Promise<RosterSessionEnrollment | null> {
    const { data, error } = await this.supabase
      .from('roster_session_enrollments')
      .select(`
        *,
        roster:rosters(*),
        session:game_sessions(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('[SupabaseSessionEnrollmentRepository.findById] Error:', error);
      throw error;
    }

    return data ? this.transformToEnrollment(data) : null;
  }

  async findByRoster(rosterId: string): Promise<RosterSessionEnrollment[]> {
    const { data, error } = await this.supabase
      .from('roster_session_enrollments')
      .select(`
        *,
        roster:rosters(*),
        session:game_sessions(*)
      `)
      .eq('roster_id', rosterId)
      .order('enrollment_date', { ascending: false });

    if (error) {
      console.error('[SupabaseSessionEnrollmentRepository.findByRoster] Error:', error);
      throw error;
    }

    return data?.map(this.transformToEnrollment) || [];
  }

  async findBySession(sessionId: string): Promise<RosterSessionEnrollment[]> {
    const { data, error } = await this.supabase
      .from('roster_session_enrollments')
      .select(`
        *,
        roster:rosters(
          *,
          team:teams(*)
        ),
        session:game_sessions(*)
      `)
      .eq('session_id', sessionId)
      .order('enrollment_date', { ascending: false });

    if (error) {
      console.error('[SupabaseSessionEnrollmentRepository.findBySession] Error:', error);
      throw error;
    }

    return data?.map(this.transformToEnrollment) || [];
  }

  async findByRosterAndSession(rosterId: string, sessionId: string): Promise<RosterSessionEnrollment | null> {
    const { data, error } = await this.supabase
      .from('roster_session_enrollments')
      .select(`
        *,
        roster:rosters(*),
        session:game_sessions(*)
      `)
      .eq('roster_id', rosterId)
      .eq('session_id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('[SupabaseSessionEnrollmentRepository.findByRosterAndSession] Error:', error);
      throw error;
    }

    return data ? this.transformToEnrollment(data) : null;
  }

  async create(enrollmentData: CreateSessionEnrollmentRequest): Promise<RosterSessionEnrollment> {
    const { data, error } = await this.supabase
      .from('roster_session_enrollments')
      .insert({
        roster_id: enrollmentData.rosterId,
        session_id: enrollmentData.sessionId,
        enrolled_via_package: enrollmentData.enrolledViaPackage,
        enrollment_date: enrollmentData.enrollmentDate?.toISOString() || new Date().toISOString(),
      })
      .select(`
        *,
        roster:rosters(*),
        session:game_sessions(*)
      `)
      .single();

    if (error) {
      console.error('[SupabaseSessionEnrollmentRepository.create] Error:', error);
      throw error;
    }

    return this.transformToEnrollment(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('roster_session_enrollments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[SupabaseSessionEnrollmentRepository.delete] Error:', error);
      throw error;
    }
  }

  async deleteByRosterAndSession(rosterId: string, sessionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('roster_session_enrollments')
      .delete()
      .eq('roster_id', rosterId)
      .eq('session_id', sessionId);

    if (error) {
      console.error('[SupabaseSessionEnrollmentRepository.deleteByRosterAndSession] Error:', error);
      throw error;
    }
  }

  private transformToEnrollment(data: any): RosterSessionEnrollment {
    return {
      id: data.id,
      rosterId: data.roster_id,
      sessionId: data.session_id,
      enrolledViaPackage: data.enrolled_via_package,
      enrollmentDate: new Date(data.enrollment_date),
      roster: data.roster ? {
        id: data.roster.id,
        name: data.roster.team?.name || 'Unknown Team',
        shortName: data.roster.team?.short_name,
        logo: data.roster.team?.logo_url,
        logoUrl: data.roster.team?.logo_url,
        logoStoragePath: data.roster.team?.logo_storage_path,
        logoPublicUrl: data.roster.team?.logo_public_url,
        location: data.roster.team ? {
          city: data.roster.team.city,
          region: data.roster.team.region,
        } : undefined,
        colors: data.roster.team ? {
          primary: data.roster.team.primary_color,
          secondary: data.roster.team.secondary_color,
          accent: data.roster.team.accent_color,
        } : undefined,
        status: data.roster.team?.status || 'active',
      } : undefined,
      session: data.session ? {
        id: data.session.id,
        seasonId: data.session.season_id,
        name: data.session.name,
        sequence: data.session.sequence,
        startDate: data.session.start_date,
        endDate: data.session.end_date,
        type: data.session.type,
        maxTeams: data.session.max_teams,
        isActive: data.session.is_active,
      } : undefined,
    };
  }
}