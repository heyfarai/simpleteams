import Stripe from "stripe";
import { NextResponse } from "next/server";
import { sendConfirmationEmails } from "@/lib/email/registration-emails";
import { supabase } from "../clients";

export async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const registrationId = session.metadata?.registrationId;

  console.log("Processing completed checkout:", {
    registrationId,
  });

  if (!registrationId) {
    console.error("No registration ID in session metadata");
    return NextResponse.json(
      { error: "Missing registration ID" },
      { status: 400 }
    );
  }

  return await handleRegistrationPayment(session, registrationId);
}

async function handleRegistrationPayment(
  session: Stripe.Checkout.Session,
  registrationId: string
) {
  console.log("Processing registration payment:", { registrationId });

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

    // Update registration payment status
    const { error: updateRegistrationError } = await supabase
      .from("team_registrations")
      .update({
        payment_status: "paid",
        approved_at: new Date().toISOString(),
        status: "approved"
      })
      .eq("id", registrationId);

    if (updateRegistrationError) {
      console.error("Error updating registration:", updateRegistrationError);
      return NextResponse.json(
        { error: "Failed to update registration status" },
        { status: 500 }
      );
    }

    // Create team from registration data
    const teamData = {
      name: registration.team_name,
      city: registration.city,
      region: registration.region,
      phone: registration.phone,
      primary_color: registration.primary_color,
      secondary_color: registration.secondary_color,
      accent_color: registration.accent_color,
      primary_contact_name: registration.primary_contact_name,
      primary_contact_email: registration.primary_contact_email,
      primary_contact_phone: registration.primary_contact_phone,
      primary_contact_role: registration.primary_contact_role,
      head_coach_name: registration.head_coach_name,
      head_coach_email: registration.head_coach_email,
      head_coach_phone: registration.head_coach_phone,
      head_coach_certifications: registration.head_coach_certifications,
      status: "active"
    };

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert(teamData)
      .select()
      .single();

    if (teamError) {
      console.error("Error creating team:", teamError);
      return NextResponse.json(
        { error: "Failed to create team" },
        { status: 500 }
      );
    }

    // Update registration with created team ID
    const { error: linkTeamError } = await supabase
      .from("team_registrations")
      .update({
        team_id: team.id,
        team_created_at: new Date().toISOString()
      })
      .eq("id", registrationId);

    if (linkTeamError) {
      console.error("Error linking team to registration:", linkTeamError);
    }

    // Create roster for the team in the active season with selected division
    const { data: activeSeason } = await supabase
      .from("seasons")
      .select("id")
      .eq("is_active", true)
      .single();

    if (activeSeason) {
      // Get season division for the selected division
      const { data: seasonDivision } = await supabase
        .from("season_divisions")
        .select("id")
        .eq("season_id", activeSeason.id)
        .eq("division_id", registration.division_preference)
        .single();

      if (seasonDivision) {
        const rosterData = {
          team_id: team.id,
          season_id: activeSeason.id,
          season_division_id: seasonDivision.id,
          status: "approved",
          payment_status: "paid",
          registration_date: new Date().toISOString()
        };

        const { data: roster, error: rosterError } = await supabase
          .from("rosters")
          .insert(rosterData)
          .select()
          .single();

        if (rosterError) {
          console.error("Error creating roster:", rosterError);
        } else {
          // Create payment record linked to roster
          const paymentData = {
            roster_id: roster.id,
            amount: session.amount_total || 0,
            currency: session.currency?.toUpperCase() || "CAD",
            description: `${registration.selected_package} Registration - ${activeSeason.id}`,
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            status: "completed",
            paid_at: new Date().toISOString(),
            payment_type: "registration"
          };

          const { error: paymentError } = await supabase
            .from("team_payments")
            .insert(paymentData);

          if (paymentError) {
            console.error("Error creating payment record:", paymentError);
          }
        }
      }
    }

    // Send confirmation emails
    await sendConfirmationEmails(team, session);

    console.log(`Registration ${registrationId} completed, team ${team.id} created successfully`);
    return NextResponse.json({ received: true, teamId: team.id, registrationId });
  } catch (error) {
    console.error("Error processing registration payment:", error);
    return NextResponse.json(
      { error: "Internal server error processing payment" },
      { status: 500 }
    );
  }
}
