export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      player_stats: {
        Row: {
          assists: number | null
          blocks: number | null
          created_at: string
          field_goals_attempted: number | null
          field_goals_made: number | null
          free_throws_attempted: number | null
          free_throws_made: number | null
          game_date: string | null
          id: string
          minutes_played: number | null
          opponent: string | null
          player_id: string
          points: number | null
          rebounds: number | null
          season: string | null
          steals: number | null
          three_pointers_attempted: number | null
          three_pointers_made: number | null
        }
        Insert: {
          assists?: number | null
          blocks?: number | null
          created_at?: string
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          free_throws_attempted?: number | null
          free_throws_made?: number | null
          game_date?: string | null
          id?: string
          minutes_played?: number | null
          opponent?: string | null
          player_id: string
          points?: number | null
          rebounds?: number | null
          season?: string | null
          steals?: number | null
          three_pointers_attempted?: number | null
          three_pointers_made?: number | null
        }
        Update: {
          assists?: number | null
          blocks?: number | null
          created_at?: string
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          free_throws_attempted?: number | null
          free_throws_made?: number | null
          game_date?: string | null
          id?: string
          minutes_played?: number | null
          opponent?: string | null
          player_id?: string
          points?: number | null
          rebounds?: number | null
          season?: string | null
          steals?: number | null
          three_pointers_attempted?: number | null
          three_pointers_made?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          first_name: string
          grad_year: number | null
          guardian_email: string | null
          guardian_name: string | null
          guardian_phone: string | null
          height: string | null
          id: string
          jersey_number: number | null
          last_name: string
          medical_notes: string | null
          phone: string | null
          photo_url: string | null
          position: string | null
          status: string | null
          team_id: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name: string
          grad_year?: number | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          height?: string | null
          id?: string
          jersey_number?: number | null
          last_name: string
          medical_notes?: string | null
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          status?: string | null
          team_id: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name?: string
          grad_year?: number | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          height?: string | null
          id?: string
          jersey_number?: number | null
          last_name?: string
          medical_notes?: string | null
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          status?: string | null
          team_id?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "user_team_dashboard"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_carts: {
        Row: {
          created_at: string | null
          email: string
          form_data: Json
          id: string
          step: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          form_data: Json
          id?: string
          step?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          form_data?: Json
          id?: string
          step?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      season_config: {
        Row: {
          created_at: string | null
          deposit_amount: number
          full_price: number
          installment_amount: number
          installment_count: number
          registration_open: boolean | null
          season_id: string
        }
        Insert: {
          created_at?: string | null
          deposit_amount?: number
          full_price?: number
          installment_amount?: number
          installment_count?: number
          registration_open?: boolean | null
          season_id: string
        }
        Update: {
          created_at?: string | null
          deposit_amount?: number
          full_price?: number
          installment_amount?: number
          installment_count?: number
          registration_open?: boolean | null
          season_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          can_edit_team_info: boolean | null
          can_manage_roster: boolean | null
          can_view_payments: boolean | null
          created_at: string
          id: string
          role: string
          status: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          can_edit_team_info?: boolean | null
          can_manage_roster?: boolean | null
          can_view_payments?: boolean | null
          created_at?: string
          id?: string
          role: string
          status?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          can_edit_team_info?: boolean | null
          can_manage_roster?: boolean | null
          can_view_payments?: boolean | null
          created_at?: string
          id?: string
          role?: string
          status?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "user_team_dashboard"
            referencedColumns: ["id"]
          },
        ]
      }
      team_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string
          due_date: string | null
          id: string
          notes: string | null
          paid_at: string | null
          payment_type: string | null
          receipt_number: string | null
          receipt_url: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          team_id: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description: string
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_type?: string | null
          receipt_number?: string | null
          receipt_url?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          team_id: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_type?: string | null
          receipt_number?: string | null
          receipt_url?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          team_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_payments_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_payments_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "user_team_dashboard"
            referencedColumns: ["id"]
          },
        ]
      }
      team_registrations: {
        Row: {
          contact_email: string
          created_at: string | null
          division_preference: string | null
          head_coach_certifications: string | null
          head_coach_email: string
          head_coach_name: string
          head_coach_phone: string | null
          head_coach_same_as_primary: boolean | null
          id: string
          payment_plan: Database["public"]["Enums"]["payment_plan"] | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          primary_contact_email: string
          primary_contact_name: string
          primary_contact_phone: string | null
          primary_contact_role: string
          sanity_team_id: string | null
          season_id: string
          stripe_checkout_session_id: string | null
          stripe_customer_id: string | null
          team_name: string | null
          user_id: string | null
        }
        Insert: {
          contact_email: string
          created_at?: string | null
          division_preference?: string | null
          head_coach_certifications?: string | null
          head_coach_email: string
          head_coach_name: string
          head_coach_phone?: string | null
          head_coach_same_as_primary?: boolean | null
          id?: string
          payment_plan?: Database["public"]["Enums"]["payment_plan"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          primary_contact_email: string
          primary_contact_name: string
          primary_contact_phone?: string | null
          primary_contact_role: string
          sanity_team_id?: string | null
          season_id: string
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          team_name?: string | null
          user_id?: string | null
        }
        Update: {
          contact_email?: string
          created_at?: string | null
          division_preference?: string | null
          head_coach_certifications?: string | null
          head_coach_email?: string
          head_coach_name?: string
          head_coach_phone?: string | null
          head_coach_same_as_primary?: boolean | null
          id?: string
          payment_plan?: Database["public"]["Enums"]["payment_plan"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          primary_contact_email?: string
          primary_contact_name?: string
          primary_contact_phone?: string | null
          primary_contact_role?: string
          sanity_team_id?: string | null
          season_id?: string
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          team_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          accent_color: string | null
          city: string
          contact_email: string
          created_at: string
          division_preference: string | null
          head_coach_certifications: string | null
          head_coach_email: string | null
          head_coach_name: string | null
          head_coach_phone: string | null
          id: string
          logo_url: string | null
          name: string
          payment_status: string | null
          phone: string | null
          primary_color: string | null
          primary_contact_email: string
          primary_contact_name: string
          primary_contact_phone: string | null
          primary_contact_role: string | null
          region: string | null
          registration_date: string | null
          registration_notes: string | null
          sanity_team_id: string | null
          secondary_color: string | null
          selected_package: string | null
          short_name: string | null
          status: string | null
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          accent_color?: string | null
          city: string
          contact_email: string
          created_at?: string
          division_preference?: string | null
          head_coach_certifications?: string | null
          head_coach_email?: string | null
          head_coach_name?: string | null
          head_coach_phone?: string | null
          id?: string
          logo_url?: string | null
          name: string
          payment_status?: string | null
          phone?: string | null
          primary_color?: string | null
          primary_contact_email: string
          primary_contact_name: string
          primary_contact_phone?: string | null
          primary_contact_role?: string | null
          region?: string | null
          registration_date?: string | null
          registration_notes?: string | null
          sanity_team_id?: string | null
          secondary_color?: string | null
          selected_package?: string | null
          short_name?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          accent_color?: string | null
          city?: string
          contact_email?: string
          created_at?: string
          division_preference?: string | null
          head_coach_certifications?: string | null
          head_coach_email?: string | null
          head_coach_name?: string | null
          head_coach_phone?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          payment_status?: string | null
          phone?: string | null
          primary_color?: string | null
          primary_contact_email?: string
          primary_contact_name?: string
          primary_contact_phone?: string | null
          primary_contact_role?: string | null
          region?: string | null
          registration_date?: string | null
          registration_notes?: string | null
          sanity_team_id?: string | null
          secondary_color?: string | null
          selected_package?: string | null
          short_name?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_team_dashboard: {
        Row: {
          city: string | null
          completed_payments: number | null
          contact_email: string | null
          created_at: string | null
          id: string | null
          name: string | null
          payment_status: string | null
          region: string | null
          selected_package: string | null
          status: string | null
          total_paid: number | null
        }
        Insert: {
          city?: string | null
          completed_payments?: never
          contact_email?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
          payment_status?: string | null
          region?: string | null
          selected_package?: string | null
          status?: string | null
          total_paid?: never
        }
        Update: {
          city?: string | null
          completed_payments?: never
          contact_email?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
          payment_status?: string | null
          region?: string | null
          selected_package?: string | null
          status?: string | null
          total_paid?: never
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_teams: {
        Args: { user_uuid?: string }
        Returns: {
          accent_color: string | null
          city: string
          contact_email: string
          created_at: string
          division_preference: string | null
          head_coach_certifications: string | null
          head_coach_email: string | null
          head_coach_name: string | null
          head_coach_phone: string | null
          id: string
          logo_url: string | null
          name: string
          payment_status: string | null
          phone: string | null
          primary_color: string | null
          primary_contact_email: string
          primary_contact_name: string
          primary_contact_phone: string | null
          primary_contact_role: string | null
          region: string | null
          registration_date: string | null
          registration_notes: string | null
          sanity_team_id: string | null
          secondary_color: string | null
          selected_package: string | null
          short_name: string | null
          status: string | null
          updated_at: string
          user_id: string | null
          website: string | null
        }[]
      }
      user_owns_team: {
        Args: { team_uuid: string; user_uuid?: string }
        Returns: boolean
      }
    }
    Enums: {
      payment_plan: "full" | "deposit_plus_payments"
      payment_status: "pending" | "deposit_paid" | "fully_paid"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      payment_plan: ["full", "deposit_plus_payments"],
      payment_status: ["pending", "deposit_paid", "fully_paid"],
      user_role: ["admin", "user"],
    },
  },
} as const
