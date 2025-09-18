import { supabaseAdmin } from "@/lib/supabase/client-safe";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Package pricing configuration
const PACKAGE_CONFIG = {
  "full-season": {
    priceId: "price_1S8P39IYuurzinGIpebnrU1W",
    amount: 349500, // $3,495.00
    name: "Full Season Team Registration",
    description: "12+ games + playoffs - Pick any 3 season sessions × 4 games each"
  },
  "two-session": {
    priceId: "price_1S8P48IYuurzinGI3U41qWWR",
    amount: 179500, // $1,795.00
    name: "Two Session Pack Registration",
    description: "6 games max (3 per session)"
  },
  "pay-per-session": {
    priceId: "price_1S8P4KIYuurzinGI2Yb8SpnS",
    amount: 79500, // $795.00
    name: "Pay Per Session Registration",
    description: "3 games max per session"
  }
} as const;

export async function POST(request: Request) {
  try {
    const { formData } = await request.json();

    // Validate required fields
    if (!formData.teamName || !formData.contactEmail || !formData.city || !formData.province) {
      return NextResponse.json(
        { error: "Missing required team information" },
        { status: 400 }
      );
    }

    // Validate selected package
    if (!formData.selectedPackage || !(formData.selectedPackage in PACKAGE_CONFIG)) {
      return NextResponse.json(
        { error: "Invalid package selection" },
        { status: 400 }
      );
    }

    const packageConfig = PACKAGE_CONFIG[formData.selectedPackage as keyof typeof PACKAGE_CONFIG];

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Get user from session if authenticated
    const cookieStore = await cookies();
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // Required for SSR but not used in API routes
          },
          remove(name: string, options: any) {
            // Required for SSR but not used in API routes
          },
        },
      }
    );

    // Try server-side auth first, fallback to client-provided user ID
    const { data: { user: currentUser }, error: authError } = await supabaseServer.auth.getUser();
    let userId: string;

    if (currentUser) {
      // User is authenticated via server-side session
      userId = currentUser.id;
    } else if (formData.userId) {
      // User is authenticated but session not detected server-side, use client-provided ID
      userId = formData.userId;
    } else {
      // Create new user account using admin client

      const { data: newUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: formData.contactEmail,
        email_confirm: true, // Auto-confirm the email for registration
        user_metadata: {
          first_registration: true,
          primary_contact_name: formData.primaryContactName
        }
      });

      if (userError || !newUser.user) {
        console.error("User creation error:", userError);

        // Handle case where user already exists
        if (userError?.code === 'email_exists') {
          return NextResponse.json({
            error: "duplicate_email",
            message: "This email is already registered. Please sign in to add another team to your account.",
            suggestion: "login_required"
          }, { status: 409 });
        }

        return NextResponse.json(
          { error: "Failed to create user account" },
          { status: 500 }
        );
      }

      userId = newUser.user.id;
    }

    // Create team record in our new structure
    const teamData = {
      user_id: userId, // Link team to user account
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
      selected_package: formData.selectedPackage,
      status: 'pending',
      payment_status: 'pending'
    };


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
      return NextResponse.json(
        { error: "Failed to create team" },
        { status: 500 }
      );
    }


    // Create initial payment record
    const paymentData = {
      team_id: team.id,
      user_id: userId, // Link payment to user account
      amount: packageConfig.amount,
      currency: 'USD',
      description: `${packageConfig.name} - 2025-26 Season`,
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
          price: packageConfig.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/register/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/register/checkout`,
      metadata: {
        teamId: team.id,
        paymentId: payment?.id || '',
        contactEmail: formData.contactEmail,
        teamName: formData.teamName,
        selectedPackage: formData.selectedPackage,
        packageName: packageConfig.name
      },
      customer_email: formData.contactEmail,
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
