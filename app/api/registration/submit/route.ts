import { supabaseAdmin } from "@/lib/supabase/client-safe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const FULL_PRICE = 379500; // $3,795.00

export async function POST(request: Request) {
  try {
    const { formData } = await request.json();
    console.log("Processing registration:", formData);

    // Validate required fields
    if (!formData.teamName || !formData.contactEmail || !formData.city || !formData.province) {
      return NextResponse.json(
        { error: "Missing required team information" },
        { status: 400 }
      );
    }

    // Create team record in our new structure
    const teamData = {
      name: formData.teamName,
      city: formData.city,
      region: formData.province,
      contact_email: formData.contactEmail,
      phone: formData.phone || null,
      primary_color: formData.primaryColors?.[0] || '#1e40af',
      secondary_color: formData.primaryColors?.[1] || '#fbbf24',
      accent_color: formData.primaryColors?.[2] || null,
      primary_contact_name: formData.primaryContactName,
      primary_contact_email: formData.primaryContactEmail,
      primary_contact_phone: formData.primaryContactPhone || null,
      primary_contact_role: formData.primaryContactRole,
      head_coach_name: formData.headCoachName || null,
      head_coach_email: formData.headCoachEmail || null,
      head_coach_phone: formData.headCoachPhone || null,
      head_coach_certifications: formData.headCoachCertifications || null,
      division_preference: formData.divisionPreference,
      registration_notes: formData.registrationNotes || null,
      status: 'pending',
      payment_status: 'pending'
    };

    console.log("Creating team with:", teamData);

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const { data: team, error: teamError } = await supabaseAdmin
      .from("teams")
      .insert(teamData)
      .select()
      .single();

    if (teamError) {
      console.error("Team creation error:", teamError);
      return NextResponse.json({ error: teamError.message }, { status: 500 });
    }

    if (!team) {
      console.error("No team data returned");
      return NextResponse.json(
        { error: "Failed to create team" },
        { status: 500 }
      );
    }

    console.log("Team created:", team);

    // Create initial payment record
    const paymentData = {
      team_id: team.id,
      amount: FULL_PRICE,
      currency: 'USD',
      description: '2025-26 Season Registration',
      payment_type: 'registration',
      status: 'pending'
    };

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("team_payments")
      .insert(paymentData)
      .select()
      .single();

    if (paymentError) {
      console.error("Payment creation error:", paymentError);
      // Don't fail the registration if payment record creation fails
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Team Registration",
              description: `${formData.teamName} - 2025-26 Season Registration`,
            },
            unit_amount: FULL_PRICE,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/register?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/register`,
      metadata: {
        teamId: team.id,
        paymentId: payment?.id || '',
        contactEmail: formData.contactEmail,
        teamName: formData.teamName
      },
    });

    // Update payment record with Stripe session ID
    if (payment) {
      await supabaseAdmin
        .from("team_payments")
        .update({ stripe_session_id: session.id })
        .eq("id", payment.id);
    }

    return NextResponse.json({ 
      checkoutUrl: session.url,
      teamId: team.id 
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process registration",
      },
      { status: 500 }
    );
  }
}
