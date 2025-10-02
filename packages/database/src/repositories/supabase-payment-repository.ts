// Payment Repository - Supabase implementation
import { createClient } from "@supabase/supabase-js";
import type {
  PaymentRepository,
  CreatePaymentRequest,
  UpdatePaymentRequest
} from "./interfaces";
import type {
  TeamPayment,
  PaymentStatus,
  PaymentType
} from "@/lib/domain/models";
import type { Database } from "@/lib/supabase/database.types";

// Use service role key on server side, anon key on client side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  typeof window === "undefined"
    ? process.env.SUPABASE_SERVICE_ROLE_KEY! // Server side
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Client side

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export class SupabasePaymentRepository implements PaymentRepository {
  async findAll(): Promise<TeamPayment[]> {
    const { data: payments, error } = await supabase
      .from("team_payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }

    return (payments || []).map(this.mapToTeamPayment);
  }

  async findById(id: string): Promise<TeamPayment | null> {
    const { data: payment, error } = await supabase
      .from("team_payments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch payment: ${error.message}`);
    }

    return payment ? this.mapToTeamPayment(payment) : null;
  }

  async findByRosterId(rosterId: string): Promise<TeamPayment[]> {
    const { data: payments, error } = await supabase
      .from("team_payments")
      .select("*")
      .eq("roster_id", rosterId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch payments by roster: ${error.message}`);
    }

    return (payments || []).map(this.mapToTeamPayment);
  }

  async findByStatus(status: PaymentStatus): Promise<TeamPayment[]> {
    const { data: payments, error } = await supabase
      .from("team_payments")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch payments by status: ${error.message}`);
    }

    return (payments || []).map(this.mapToTeamPayment);
  }

  async findByPaymentType(paymentType: PaymentType): Promise<TeamPayment[]> {
    const { data: payments, error } = await supabase
      .from("team_payments")
      .select("*")
      .eq("payment_type", paymentType)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch payments by type: ${error.message}`);
    }

    return (payments || []).map(this.mapToTeamPayment);
  }

  async findByStripeSessionId(sessionId: string): Promise<TeamPayment | null> {
    const { data: payment, error } = await supabase
      .from("team_payments")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch payment by session ID: ${error.message}`);
    }

    return payment ? this.mapToTeamPayment(payment) : null;
  }

  async findByStripePaymentIntentId(paymentIntentId: string): Promise<TeamPayment | null> {
    const { data: payment, error } = await supabase
      .from("team_payments")
      .select("*")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch payment by payment intent ID: ${error.message}`);
    }

    return payment ? this.mapToTeamPayment(payment) : null;
  }

  async findOverdue(): Promise<TeamPayment[]> {
    const { data: payments, error } = await supabase
      .from("team_payments")
      .select("*")
      .eq("status", "pending")
      .lt("due_date", new Date().toISOString())
      .order("due_date", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch overdue payments: ${error.message}`);
    }

    return (payments || []).map(this.mapToTeamPayment);
  }

  async findInstallmentPaymentByUserAndTeam(userId: string, teamId: string): Promise<TeamPayment | null> {
    // This implements the complex query from the API route
    const { data: payments, error } = await supabase
      .from('team_payments')
      .select(`
        *,
        rosters!inner(
          team_id,
          teams!inner(
            id,
            team_registrations!inner(
              user_id
            )
          )
        )
      `)
      .eq('rosters.teams.team_registrations.user_id', userId)
      .eq('rosters.team_id', teamId)
      .eq('payment_type', 'installment')
      .not('stripe_session_id', 'is', null)
      .limit(1);

    if (error) {
      throw new Error(`Failed to find installment payment: ${error.message}`);
    }

    if (!payments || payments.length === 0) {
      return null;
    }

    return this.mapToTeamPayment(payments[0]);
  }

  async create(paymentData: CreatePaymentRequest): Promise<TeamPayment> {
    const dbData = this.mapToDatabase(paymentData);

    const { data: payment, error } = await supabase
      .from("team_payments")
      .insert(dbData)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }

    if (!payment) {
      throw new Error("Failed to create payment - no data returned");
    }

    return this.mapToTeamPayment(payment);
  }

  async update(id: string, updateData: UpdatePaymentRequest): Promise<TeamPayment> {
    const dbData = this.mapUpdateToDatabase(updateData);

    const { data: payment, error } = await supabase
      .from("team_payments")
      .update(dbData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to update payment: ${error.message}`);
    }

    if (!payment) {
      throw new Error("Failed to update payment - no data returned");
    }

    return this.mapToTeamPayment(payment);
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<TeamPayment> {
    const updateData: any = { status };

    // Add timestamp for status changes
    if (status === 'paid') {
      updateData.paid_at = new Date().toISOString();
    }

    const { data: payment, error } = await supabase
      .from("team_payments")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }

    if (!payment) {
      throw new Error("Failed to update payment status - no data returned");
    }

    return this.mapToTeamPayment(payment);
  }

  async markAsPaid(id: string, paidAt?: Date, receiptUrl?: string): Promise<TeamPayment> {
    const updateData: any = {
      status: 'paid',
      paid_at: paidAt ? paidAt.toISOString() : new Date().toISOString()
    };

    if (receiptUrl) {
      updateData.receipt_url = receiptUrl;
    }

    const { data: payment, error } = await supabase
      .from("team_payments")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to mark payment as paid: ${error.message}`);
    }

    if (!payment) {
      throw new Error("Failed to mark payment as paid - no data returned");
    }

    return this.mapToTeamPayment(payment);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("team_payments")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete payment: ${error.message}`);
    }
  }

  // Private mapping methods
  private mapToTeamPayment(dbRecord: any): TeamPayment {
    return {
      id: dbRecord.id,
      rosterId: dbRecord.roster_id,
      amount: dbRecord.amount,
      currency: dbRecord.currency || 'USD',
      description: dbRecord.description,
      paymentType: dbRecord.payment_type as PaymentType,
      status: dbRecord.status as PaymentStatus,
      dueDate: dbRecord.due_date,
      paidAt: dbRecord.paid_at,
      stripeSessionId: dbRecord.stripe_session_id,
      stripePaymentIntentId: dbRecord.stripe_payment_intent_id,
      receiptNumber: dbRecord.receipt_number,
      receiptUrl: dbRecord.receipt_url,
      notes: dbRecord.notes,
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at,
    };
  }

  private mapToDatabase(payment: CreatePaymentRequest): any {
    return {
      roster_id: payment.rosterId,
      amount: payment.amount,
      currency: payment.currency || 'USD',
      description: payment.description,
      payment_type: payment.paymentType || 'one-time',
      status: payment.status || 'pending',
      due_date: payment.dueDate?.toISOString(),
      stripe_session_id: payment.stripeSessionId,
      stripe_payment_intent_id: payment.stripePaymentIntentId,
      notes: payment.notes,
    };
  }

  private mapUpdateToDatabase(update: UpdatePaymentRequest): any {
    const dbUpdate: any = {};

    if (update.amount !== undefined) dbUpdate.amount = update.amount;
    if (update.currency !== undefined) dbUpdate.currency = update.currency;
    if (update.description !== undefined) dbUpdate.description = update.description;
    if (update.paymentType !== undefined) dbUpdate.payment_type = update.paymentType;
    if (update.status !== undefined) dbUpdate.status = update.status;
    if (update.dueDate !== undefined) dbUpdate.due_date = update.dueDate.toISOString();
    if (update.paidAt !== undefined) dbUpdate.paid_at = update.paidAt.toISOString();
    if (update.stripeSessionId !== undefined) dbUpdate.stripe_session_id = update.stripeSessionId;
    if (update.stripePaymentIntentId !== undefined) dbUpdate.stripe_payment_intent_id = update.stripePaymentIntentId;
    if (update.receiptNumber !== undefined) dbUpdate.receipt_number = update.receiptNumber;
    if (update.receiptUrl !== undefined) dbUpdate.receipt_url = update.receiptUrl;
    if (update.notes !== undefined) dbUpdate.notes = update.notes;

    return dbUpdate;
  }
}