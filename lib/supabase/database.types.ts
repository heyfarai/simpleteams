export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          short_name: string | null
          city: string
          region: string | null
          logo_url: string | null
          primary_color: string
          secondary_color: string
          accent_color: string | null
          contact_email: string
          phone: string | null
          website: string | null
          primary_contact_name: string
          primary_contact_email: string
          primary_contact_phone: string | null
          primary_contact_role: string
          head_coach_name: string | null
          head_coach_email: string | null
          head_coach_phone: string | null
          head_coach_certifications: string | null
          division_preference: string | null
          registration_notes: string | null
          registration_date: string
          status: 'pending' | 'approved' | 'suspended' | 'archived'
          payment_status: 'pending' | 'paid' | 'overdue' | 'refunded'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          short_name?: string | null
          city: string
          region?: string | null
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          accent_color?: string | null
          contact_email: string
          phone?: string | null
          website?: string | null
          primary_contact_name: string
          primary_contact_email: string
          primary_contact_phone?: string | null
          primary_contact_role?: string
          head_coach_name?: string | null
          head_coach_email?: string | null
          head_coach_phone?: string | null
          head_coach_certifications?: string | null
          division_preference?: string | null
          registration_notes?: string | null
          registration_date?: string
          status?: 'pending' | 'approved' | 'suspended' | 'archived'
          payment_status?: 'pending' | 'paid' | 'overdue' | 'refunded'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          short_name?: string | null
          city?: string
          region?: string | null
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          accent_color?: string | null
          contact_email?: string
          phone?: string | null
          website?: string | null
          primary_contact_name?: string
          primary_contact_email?: string
          primary_contact_phone?: string | null
          primary_contact_role?: string
          head_coach_name?: string | null
          head_coach_email?: string | null
          head_coach_phone?: string | null
          head_coach_certifications?: string | null
          division_preference?: string | null
          registration_notes?: string | null
          registration_date?: string
          status?: 'pending' | 'approved' | 'suspended' | 'archived'
          payment_status?: 'pending' | 'paid' | 'overdue' | 'refunded'
        }
      }
      team_members: {
        Row: {
          id: string
          created_at: string
          team_id: string
          user_id: string
          role: 'admin' | 'coach' | 'assistant_coach' | 'manager'
          status: 'active' | 'inactive' | 'pending'
          can_manage_roster: boolean
          can_view_payments: boolean
          can_edit_team_info: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          team_id: string
          user_id: string
          role: 'admin' | 'coach' | 'assistant_coach' | 'manager'
          status?: 'active' | 'inactive' | 'pending'
          can_manage_roster?: boolean
          can_view_payments?: boolean
          can_edit_team_info?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          team_id?: string
          user_id?: string
          role?: 'admin' | 'coach' | 'assistant_coach' | 'manager'
          status?: 'active' | 'inactive' | 'pending'
          can_manage_roster?: boolean
          can_view_payments?: boolean
          can_edit_team_info?: boolean
        }
      }
      players: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          team_id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          date_of_birth: string | null
          height: string | null
          weight: number | null
          jersey_number: number | null
          position: 'PG' | 'SG' | 'SF' | 'PF' | 'C' | null
          grad_year: number | null
          photo_url: string | null
          guardian_name: string | null
          guardian_phone: string | null
          guardian_email: string | null
          medical_notes: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          status: 'active' | 'inactive' | 'injured' | 'suspended'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          team_id: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          height?: string | null
          weight?: number | null
          jersey_number?: number | null
          position?: 'PG' | 'SG' | 'SF' | 'PF' | 'C' | null
          grad_year?: number | null
          photo_url?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          guardian_email?: string | null
          medical_notes?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          status?: 'active' | 'inactive' | 'injured' | 'suspended'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          team_id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          height?: string | null
          weight?: number | null
          jersey_number?: number | null
          position?: 'PG' | 'SG' | 'SF' | 'PF' | 'C' | null
          grad_year?: number | null
          photo_url?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          guardian_email?: string | null
          medical_notes?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          status?: 'active' | 'inactive' | 'injured' | 'suspended'
        }
      }
      team_payments: {
        Row: {
          id: string
          created_at: string
          team_id: string
          amount: number
          currency: string
          description: string
          stripe_session_id: string | null
          stripe_payment_intent_id: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          due_date: string | null
          paid_at: string | null
          receipt_url: string | null
          receipt_number: string | null
          payment_type: 'registration' | 'tournament' | 'equipment' | 'other'
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          team_id: string
          amount: number
          currency?: string
          description: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          due_date?: string | null
          paid_at?: string | null
          receipt_url?: string | null
          receipt_number?: string | null
          payment_type?: 'registration' | 'tournament' | 'equipment' | 'other'
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          team_id?: string
          amount?: number
          currency?: string
          description?: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          due_date?: string | null
          paid_at?: string | null
          receipt_url?: string | null
          receipt_number?: string | null
          payment_type?: 'registration' | 'tournament' | 'equipment' | 'other'
          notes?: string | null
        }
      }
      player_stats: {
        Row: {
          id: string
          created_at: string
          player_id: string
          season: string | null
          game_date: string | null
          opponent: string | null
          points: number
          rebounds: number
          assists: number
          steals: number
          blocks: number
          minutes_played: number
          field_goals_made: number
          field_goals_attempted: number
          three_pointers_made: number
          three_pointers_attempted: number
          free_throws_made: number
          free_throws_attempted: number
        }
        Insert: {
          id?: string
          created_at?: string
          player_id: string
          season?: string | null
          game_date?: string | null
          opponent?: string | null
          points?: number
          rebounds?: number
          assists?: number
          steals?: number
          blocks?: number
          minutes_played?: number
          field_goals_made?: number
          field_goals_attempted?: number
          three_pointers_made?: number
          three_pointers_attempted?: number
          free_throws_made?: number
          free_throws_attempted?: number
        }
        Update: {
          id?: string
          created_at?: string
          player_id?: string
          season?: string | null
          game_date?: string | null
          opponent?: string | null
          points?: number
          rebounds?: number
          assists?: number
          steals?: number
          blocks?: number
          minutes_played?: number
          field_goals_made?: number
          field_goals_attempted?: number
          three_pointers_made?: number
          three_pointers_attempted?: number
          free_throws_made?: number
          free_throws_attempted?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}