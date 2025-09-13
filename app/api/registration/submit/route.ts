import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const FULL_PRICE = 379500; // $3,795.00

export async function POST(request: Request) {
  try {
    const { formData } = await request.json();
    console.log("Processing registration:", formData);

    // Create registration record
    if (!formData.teamName) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    const registrationData = {
      season_id: process.env.NEXT_PUBLIC_ACTIVE_SEASON_ID!,
      team_name: formData.teamName,
      contact_email: formData.contactEmail,
      primary_contact_name: formData.primaryContactName,
      primary_contact_email: formData.primaryContactEmail,
      primary_contact_phone: formData.primaryContactPhone || "",
      primary_contact_role: formData.primaryContactRole,
      head_coach_name: formData.headCoachName,
      head_coach_email: formData.headCoachEmail,
      head_coach_phone: formData.headCoachPhone || "",
      head_coach_certifications: formData.headCoachCertifications || "",
      division_preference: formData.divisionPreference,
      payment_plan: "full",
    };

    console.log("Creating registration with:", registrationData);

    const { data: registration, error: regError } = await supabase
      .from("team_registrations")
      .insert(registrationData)
      .select()
      .single();

    if (regError) {
      console.error("Registration error:", regError);
      return NextResponse.json({ error: regError.message }, { status: 500 });
    }

    if (!registration) {
      console.error("No registration data returned");
      return NextResponse.json(
        { error: "Failed to create registration" },
        { status: 500 }
      );
    }

    console.log("Registration created:", registration);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Team Registration",
              description: "2025 Summer Series Registration",
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
        registrationId: registration.id,
      },
    });

    // Update registration with checkout session ID
    await supabase
      .from("team_registrations")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", registration.id);

    return NextResponse.json({ checkoutUrl: session.url });
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
