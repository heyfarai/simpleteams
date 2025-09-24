import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Stripe from "stripe";
import type { Database } from "@/lib/supabase/database.types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { userId, teamId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return []; },
          setAll() { },
        },
      }
    );

    // Find the specific team's Stripe customer ID from their payment records
    // Path: user_id -> team_registrations -> teams -> rosters -> team_payments
    const { data: payments, error: paymentsError } = await supabase
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

    if (paymentsError || !payments || payments.length === 0) {
      return NextResponse.json(
        { error: "No subscription found for this user" },
        { status: 404 }
      );
    }

    // Get the customer ID from the latest payment
    const payment = payments[0];
    let customerId: string | null = null;

    if (payment.stripe_session_id) {
      // Get customer ID from checkout session
      const session = await stripe.checkout.sessions.retrieve(payment.stripe_session_id);
      customerId = session.customer as string;
    }

    if (!customerId) {
      return NextResponse.json(
        { error: "Could not find customer information" },
        { status: 404 }
      );
    }

    // Create the billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/payments`,
    });

    return NextResponse.json({
      portal_url: portalSession.url,
    });

  } catch (error) {
    console.error("Error creating billing portal session:", error);
    return NextResponse.json(
      { error: "Failed to create billing portal session" },
      { status: 500 }
    );
  }
}