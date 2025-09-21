import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createTeamInSanity, addTeamToDivision } from "@/lib/sanity/team-service";
import { sendConfirmationEmails } from "@/lib/email/registration-emails";
import { supabase } from "../clients";

export async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const registrationId = session.metadata?.registrationId;
  const teamId = session.metadata?.teamId;
  const paymentId = session.metadata?.paymentId;

  console.log("Processing completed checkout:", {
    registrationId,
    teamId,
    paymentId,
  });

  // Handle new team registration flow (with teamId and paymentId)
  if (teamId && paymentId) {
    return await handleNewTeamRegistration(session, teamId, paymentId);
  }

  // Handle legacy registration flow (with registrationId)
  if (!registrationId) {
    console.error("No registration ID or team ID in session metadata");
    return NextResponse.json(
      { error: "Missing registration or team ID" },
      { status: 400 }
    );
  }

  return await handleLegacyRegistration(session, registrationId);
}

async function handleNewTeamRegistration(
  session: Stripe.Checkout.Session,
  teamId: string,
  paymentId: string
) {
  console.log("Processing new team registration payment:", {
    teamId,
    paymentId,
  });

  try {
    // Update team status to active
    const { error: teamError } = await supabase
      .from("teams")
      .update({
        status: "active",
        payment_status: "paid",
      })
      .eq("id", teamId);

    if (teamError) {
      console.error("Error updating team:", teamError);
      return NextResponse.json(
        { error: "Failed to update team status" },
        { status: 500 }
      );
    }

    // Get team info to get user_id
    const { data: teamInfo } = await supabase
      .from("teams")
      .select("user_id")
      .eq("id", teamId)
      .single();

    // Update payment status
    const { error: paymentError } = await supabase
      .from("team_payments")
      .update({
        status: "completed",
        stripe_payment_intent_id: session.payment_intent as string,
        paid_at: new Date().toISOString(),
        stripe_session_id: session.id,
        user_id: teamInfo?.user_id,
      })
      .eq("id", paymentId);

    if (paymentError) {
      console.error("Error updating payment:", paymentError);
      return NextResponse.json(
        { error: "Failed to update payment status" },
        { status: 500 }
      );
    }

    // Get team details for Sanity creation
    const { data: team, error: teamFetchError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    if (teamFetchError || !team) {
      console.error("Error fetching team details:", teamFetchError);
      return NextResponse.json(
        { error: "Failed to fetch team details" },
        { status: 500 }
      );
    }

    // Create team in Sanity
    const sanityTeam = await createTeamInSanity(team);

    // Add team to division
    const seasonId = process.env.NEXT_PUBLIC_ACTIVE_SEASON_ID || "1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3";
    await addTeamToDivision(seasonId, team.division_preference, sanityTeam._id);

    // Update team record with Sanity ID
    await supabase
      .from("teams")
      .update({ sanity_team_id: sanityTeam._id })
      .eq("id", team.id);

    // Send confirmation emails
    await sendConfirmationEmails(team, session);

    console.log(`Team ${teamId} payment completed successfully`);
    return NextResponse.json({ received: true, teamId });
  } catch (error) {
    console.error("Error processing new team registration:", error);
    return NextResponse.json(
      { error: "Internal server error processing payment" },
      { status: 500 }
    );
  }
}

async function handleLegacyRegistration(
  session: Stripe.Checkout.Session,
  registrationId: string
) {
  try {
    // Get registration details
    const { data: registration, error: registrationError } = await supabase
      .from("team_registrations")
      .select("*")
      .eq("id", registrationId)
      .single();

    if (registrationError || !registration) {
      console.error("Registration not found:", registrationId, registrationError);
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    if (!registration.division_preference) {
      console.error("No division preference found for registration:", registrationId);
      return NextResponse.json(
        { error: "Missing division preference" },
        { status: 400 }
      );
    }

    // Update registration status
    const { error: updateError } = await supabase
      .from("team_registrations")
      .update({
        payment_status: "deposit_paid",
        stripe_customer_id: session.customer as string,
      })
      .eq("id", registrationId);

    if (updateError) {
      console.error("Failed to update registration:", updateError);
      return NextResponse.json(
        { error: "Failed to update registration" },
        { status: 500 }
      );
    }

    // Create team in Sanity
    const sanityTeam = await createTeamInSanity(registration);

    // Add team to division
    const seasonId = process.env.NEXT_PUBLIC_ACTIVE_SEASON_ID || "1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3";
    await addTeamToDivision(seasonId, registration.division_preference, sanityTeam._id);

    // Update registration with Sanity team ID
    await supabase
      .from("team_registrations")
      .update({ sanity_team_id: sanityTeam._id })
      .eq("id", registrationId);

    console.log("Registration processed successfully:", {
      registrationId,
      teamId: sanityTeam._id,
      divisionId: registration.division_preference,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing checkout completion:", error);
    return NextResponse.json(
      { error: "Internal server error processing payment" },
      { status: 500 }
    );
  }
}