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

    if (!session.metadata?.teamId) {
      return NextResponse.json(
        { error: "No team information found for this session" },
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

    const { data: team, error: teamError } = await supabaseAdmin
      .from("teams")
      .select("*")
      .eq("id", session.metadata.teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("team_payments")
      .select("*")
      .eq("team_id", team.id)
      .eq("stripe_session_id", sessionId)
      .single();

    if (paymentError) {
      console.error("Payment lookup error:", paymentError);
      // Don't fail if payment record isn't found, use session data instead
    }

    // Handle webhook failure scenario - update our records if Stripe shows payment succeeded
    // but our database still shows pending
    if (paymentVerified && (team.payment_status === 'pending' || payment?.status === 'pending')) {
      console.log("Payment verified via Stripe API, updating database records...");

      // Update team status
      await supabaseAdmin
        .from("teams")
        .update({
          payment_status: 'completed',
          status: 'active'
        })
        .eq("id", team.id);

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
      }
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