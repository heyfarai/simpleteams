// Registration Repository - Supabase implementation
import { createClient } from "@supabase/supabase-js";
import type {
  RegistrationRepository,
  CreateRegistrationRequest,
  UpdateRegistrationRequest
} from "./interfaces";
import type {
  TeamRegistration,
  RegistrationStatus,
  PaymentStatus
} from "@/lib/domain/models";
import type { Database } from "@/lib/supabase/database.types";

// Use service role key on server side, anon key on client side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  typeof window === "undefined"
    ? process.env.SUPABASE_SERVICE_ROLE_KEY! // Server side
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Client side

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export class SupabaseRegistrationRepository implements RegistrationRepository {
  async findAll(): Promise<TeamRegistration[]> {
    const { data: registrations, error } = await supabase
      .from("team_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch registrations: ${error.message}`);
    }

    return (registrations || []).map(this.mapToTeamRegistration);
  }

  async findById(id: string): Promise<TeamRegistration | null> {
    const { data: registration, error } = await supabase
      .from("team_registrations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch registration: ${error.message}`);
    }

    return registration ? this.mapToTeamRegistration(registration) : null;
  }

  async findByUserId(userId: string): Promise<TeamRegistration[]> {
    const { data: registrations, error } = await supabase
      .from("team_registrations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch registrations by user: ${error.message}`);
    }

    return (registrations || []).map(this.mapToTeamRegistration);
  }

  async findByStatus(status: RegistrationStatus): Promise<TeamRegistration[]> {
    const { data: registrations, error } = await supabase
      .from("team_registrations")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch registrations by status: ${error.message}`);
    }

    return (registrations || []).map(this.mapToTeamRegistration);
  }

  async findByStripeSessionId(sessionId: string): Promise<TeamRegistration | null> {
    const { data: registration, error } = await supabase
      .from("team_registrations")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch registration by session ID: ${error.message}`);
    }

    return registration ? this.mapToTeamRegistration(registration) : null;
  }

  async create(registrationData: CreateRegistrationRequest): Promise<TeamRegistration> {
    const dbData = this.mapToDatabase(registrationData);

    const { data: registration, error } = await supabase
      .from("team_registrations")
      .insert(dbData)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to create registration: ${error.message}`);
    }

    if (!registration) {
      throw new Error("Failed to create registration - no data returned");
    }

    return this.mapToTeamRegistration(registration);
  }

  async update(id: string, updateData: UpdateRegistrationRequest): Promise<TeamRegistration> {
    const dbData = this.mapUpdateToDatabase(updateData);

    const { data: registration, error } = await supabase
      .from("team_registrations")
      .update(dbData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to update registration: ${error.message}`);
    }

    if (!registration) {
      throw new Error("Failed to update registration - no data returned");
    }

    return this.mapToTeamRegistration(registration);
  }

  async updateStatus(id: string, status: RegistrationStatus): Promise<TeamRegistration> {
    const updateData: any = { status };

    // Add timestamp for status changes
    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString();
    }

    const { data: registration, error } = await supabase
      .from("team_registrations")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to update registration status: ${error.message}`);
    }

    if (!registration) {
      throw new Error("Failed to update registration status - no data returned");
    }

    return this.mapToTeamRegistration(registration);
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<TeamRegistration> {
    const { data: registration, error } = await supabase
      .from("team_registrations")
      .update({ payment_status: paymentStatus })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }

    if (!registration) {
      throw new Error("Failed to update payment status - no data returned");
    }

    return this.mapToTeamRegistration(registration);
  }

  async updateStripeSessionId(id: string, stripeSessionId: string): Promise<void> {
    const { error } = await supabase
      .from("team_registrations")
      .update({ stripe_session_id: stripeSessionId })
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to update Stripe session ID: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("team_registrations")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete registration: ${error.message}`);
    }
  }

  // Private mapping methods
  private mapToTeamRegistration(dbRecord: any): TeamRegistration {
    return {
      id: dbRecord.id,
      userId: dbRecord.user_id,
      teamName: dbRecord.team_name,
      city: dbRecord.city,
      region: dbRecord.region,
      phone: dbRecord.phone,
      primaryColor: dbRecord.primary_color,
      secondaryColor: dbRecord.secondary_color,
      accentColor: dbRecord.accent_color,
      primaryContactName: dbRecord.primary_contact_name,
      primaryContactEmail: dbRecord.primary_contact_email,
      primaryContactPhone: dbRecord.primary_contact_phone,
      primaryContactRole: dbRecord.primary_contact_role,
      headCoachName: dbRecord.head_coach_name,
      headCoachEmail: dbRecord.head_coach_email,
      headCoachPhone: dbRecord.head_coach_phone,
      headCoachCertifications: dbRecord.head_coach_certifications,
      divisionPreference: dbRecord.division_preference,
      registrationNotes: dbRecord.registration_notes,
      selectedPackage: dbRecord.selected_package,
      status: dbRecord.status as RegistrationStatus,
      paymentStatus: dbRecord.payment_status as PaymentStatus,
      teamId: dbRecord.team_id,
      stripeSessionId: dbRecord.stripe_session_id,
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at,
      approvedAt: dbRecord.approved_at,
      teamCreatedAt: dbRecord.team_created_at,
    };
  }

  private mapToDatabase(registration: CreateRegistrationRequest): any {
    return {
      user_id: registration.userId,
      team_name: registration.teamName,
      city: registration.city,
      region: registration.region,
      phone: registration.phone,
      primary_color: registration.primaryColor,
      secondary_color: registration.secondaryColor,
      accent_color: registration.accentColor,
      primary_contact_name: registration.primaryContactName,
      primary_contact_email: registration.primaryContactEmail,
      primary_contact_phone: registration.primaryContactPhone,
      primary_contact_role: registration.primaryContactRole,
      head_coach_name: registration.headCoachName,
      head_coach_email: registration.headCoachEmail,
      head_coach_phone: registration.headCoachPhone,
      head_coach_certifications: registration.headCoachCertifications,
      division_preference: registration.divisionPreference,
      registration_notes: registration.registrationNotes,
      selected_package: registration.selectedPackage,
      status: registration.status || 'pending',
      payment_status: registration.paymentStatus || 'pending',
    };
  }

  private mapUpdateToDatabase(update: UpdateRegistrationRequest): any {
    const dbUpdate: any = {};

    if (update.teamName !== undefined) dbUpdate.team_name = update.teamName;
    if (update.city !== undefined) dbUpdate.city = update.city;
    if (update.region !== undefined) dbUpdate.region = update.region;
    if (update.phone !== undefined) dbUpdate.phone = update.phone;
    if (update.primaryColor !== undefined) dbUpdate.primary_color = update.primaryColor;
    if (update.secondaryColor !== undefined) dbUpdate.secondary_color = update.secondaryColor;
    if (update.accentColor !== undefined) dbUpdate.accent_color = update.accentColor;
    if (update.primaryContactName !== undefined) dbUpdate.primary_contact_name = update.primaryContactName;
    if (update.primaryContactEmail !== undefined) dbUpdate.primary_contact_email = update.primaryContactEmail;
    if (update.primaryContactPhone !== undefined) dbUpdate.primary_contact_phone = update.primaryContactPhone;
    if (update.primaryContactRole !== undefined) dbUpdate.primary_contact_role = update.primaryContactRole;
    if (update.headCoachName !== undefined) dbUpdate.head_coach_name = update.headCoachName;
    if (update.headCoachEmail !== undefined) dbUpdate.head_coach_email = update.headCoachEmail;
    if (update.headCoachPhone !== undefined) dbUpdate.head_coach_phone = update.headCoachPhone;
    if (update.headCoachCertifications !== undefined) dbUpdate.head_coach_certifications = update.headCoachCertifications;
    if (update.divisionPreference !== undefined) dbUpdate.division_preference = update.divisionPreference;
    if (update.registrationNotes !== undefined) dbUpdate.registration_notes = update.registrationNotes;
    if (update.selectedPackage !== undefined) dbUpdate.selected_package = update.selectedPackage;
    if (update.status !== undefined) dbUpdate.status = update.status;
    if (update.paymentStatus !== undefined) dbUpdate.payment_status = update.paymentStatus;
    if (update.teamId !== undefined) dbUpdate.team_id = update.teamId;
    if (update.stripeSessionId !== undefined) dbUpdate.stripe_session_id = update.stripeSessionId;

    return dbUpdate;
  }
}