import { supabaseAdmin } from "@/lib/supabase/client-safe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "No session ID provided" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe with expanded payment intent
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'subscription'],
    });

    const registrationId = session.metadata?.registrationId;

    if (!registrationId) {
      return NextResponse.json(
        { error: "No registration information found for this session" },
        { status: 404 }
      );
    }

    // Verify payment status directly from Stripe
    let paymentStatus = 'pending';
    let paymentVerified = false;

    if (session.payment_status === 'paid') {
      paymentStatus = 'completed';
      paymentVerified = true;
    } else if (session.payment_status === 'unpaid') {
      paymentStatus = 'pending';
    } else if (session.payment_status === 'no_payment_required') {
      paymentStatus = 'completed';
      paymentVerified = true;
    }

    // Additional verification through payment intent if available
    if (session.payment_intent && typeof session.payment_intent === 'object') {
      const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
      if (paymentIntent.status === 'succeeded') {
        paymentStatus = 'completed';
        paymentVerified = true;
      } else if (paymentIntent.status === 'requires_payment_method') {
        paymentStatus = 'failed';
      }
    }

    // Get team and payment information from our database
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Get team via registration
    const { data: registration, error: registrationError } = await supabaseAdmin
      .from("team_registrations")
      .select(`
        *,
        teams(*)
      `)
      .eq("id", registrationId)
      .single();

    if (registrationError || !registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // Get selected sessions if any
    let selectedSessions = [];
    if (registration.selected_session_ids && registration.selected_session_ids.length > 0) {
      const { data: sessionData } = await supabaseAdmin
        .from("game_sessions")
        .select(`
          id,
          name,
          start_date,
          end_date,
          sequence,
          type
        `)
        .in("id", registration.selected_session_ids)
        .order("sequence");
      selectedSessions = sessionData || [];
    }

    // For team data, use registration data as fallback if team not created yet
    const team = registration.teams || {
      id: null,
      name: registration.team_name,
      city: registration.city,
      region: registration.region,
      status: registration.status,
      payment_status: registration.payment_status,
    };

    // Get payment information via roster (only if team exists)
    let payment = null;
    if (team.id) {
      const { data: roster } = await supabaseAdmin
        .from("rosters")
        .select("id")
        .eq("team_id", team.id)
        .single();

      if (roster) {
        const { data: paymentData } = await supabaseAdmin
          .from("team_payments")
          .select("*")
          .eq("roster_id", roster.id)
          .eq("stripe_session_id", sessionId)
          .single();
        payment = paymentData;
      }
    }

    // Add registration-specific fields to team object
    team.selected_package = registration.selected_package;
    team.contact_email = registration.primary_contact_email;

    // Payment lookup errors are handled above, continue with available data

    // Handle webhook failure scenario - update our records if Stripe shows payment succeeded
    // but our database still shows pending
    if (paymentVerified && (team.payment_status === 'pending' || payment?.status === 'pending')) {
      console.log("Payment verified via Stripe API, updating database records...");

      // Update team status (only if team exists)
      if (team.id) {
        await supabaseAdmin
          .from("teams")
          .update({
            payment_status: 'completed',
            status: 'active'
          })
          .eq("id", team.id);
      }

      // Update payment record if it exists
      if (payment) {
        await supabaseAdmin
          .from("team_payments")
          .update({
            status: 'completed',
            paid_at: new Date().toISOString()
          })
          .eq("id", payment.id);
      }

      // Update local data for response
      team.payment_status = 'completed';
      team.status = 'active';
      if (payment) {
        payment.status = 'completed';
      }
    }

    // Return the registration data
    const registrationData = {
      team: {
        id: team.id,
        name: team.name,
        city: team.city,
        region: team.region,
        contact_email: team.contact_email,
        selected_package: team.selected_package,
        status: team.status,
        payment_status: team.payment_status,
      },
      payment: {
        amount: payment?.amount || session.amount_total || 0,
        currency: payment?.currency || session.currency || "USD",
        description: payment?.description || session.metadata?.packageName || "Registration",
        status: paymentStatus,
        verified: paymentVerified,
      },
      stripe_session: {
        id: sessionId,
        payment_status: session.payment_status,
        status: session.status,
      },
      selected_sessions: selectedSessions
    };

    return NextResponse.json(registrationData);
  } catch (error) {
    console.error("Registration success API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve registration details",
      },
      { status: 500 }
    );
  }
}