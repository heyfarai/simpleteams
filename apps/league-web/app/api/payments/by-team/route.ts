import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json(
        { error: 'teamId parameter is required' },
        { status: 400 }
      );
    }

    // Query payments directly with JOIN to rosters table to filter by team_id
    const { data: paymentsData, error } = await supabase
      .from("team_payments")
      .select(`
        *,
        rosters!inner(
          team_id
        )
      `)
      .eq("rosters.team_id", teamId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }

    // Transform to domain model format
    const payments = (paymentsData || []).map(payment => ({
      id: payment.id,
      rosterId: payment.roster_id,
      amount: payment.amount,
      currency: payment.currency,
      description: payment.description,
      paymentType: payment.payment_type,
      status: payment.status === 'completed' ? 'paid' : payment.status, // Map completed -> paid
      dueDate: payment.due_date,
      paidAt: payment.paid_at,
      stripeSessionId: payment.stripe_session_id,
      stripePaymentIntentId: payment.stripe_payment_intent_id,
      receiptNumber: payment.receipt_number,
      receiptUrl: payment.receipt_url,
      notes: payment.notes,
      createdAt: payment.created_at,
    }));

    return NextResponse.json({
      payments,
      count: payments.length
    });
  } catch (error) {
    console.error('Error fetching payments by team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments by team' },
      { status: 500 }
    );
  }
}