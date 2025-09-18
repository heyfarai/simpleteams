import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Stripe from "stripe";
import type { Database } from "@/lib/supabase/database.types";
import { createClient } from '@supabase/supabase-js';

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

    // Create properly typed Supabase admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);

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
          set(_name: string, _value: string, _options: any) {
            // Required for SSR but not used in API routes
          },
          remove(_name: string, _options: any) {
            // Required for SSR but not used in API routes
          },
        },
      }
    );

    // Try server-side auth first, fallback to client-provided user ID
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    let userId: string;

    if (currentUser) {
      // User is authenticated via server-side session
      userId = currentUser.id;
      console.log("Using server-side authenticated user:", userId);
    } else if (formData.userId) {
      // User is authenticated but session not detected server-side, use client-provided ID
      userId = formData.userId;
      console.log("Using client-provided authenticated user:", userId);
    } else {
      // No authenticated user - this should require sign-in first
      return NextResponse.json({
        error: "authentication_required",
        message: "Please sign in to register your team. We'll send you a magic link to complete authentication.",
        suggestion: "login_required"
      }, { status: 401 });
    }

    // Create team record in our new structure
    const teamData: Database['public']['Tables']['teams']['Insert'] = {
      user_id: userId,
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
      primary_contact_role: formData.primaryContactRole || 'Team Manager',
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

    const { data: team, error: teamError } = await supabase
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
    const paymentData: Database['public']['Tables']['team_payments']['Insert'] = {
      team_id: team.id,
      user_id: userId,
      amount: packageConfig.amount,
      currency: 'USD',
      description: `${packageConfig.name} - 2025-26 Season`,
      payment_type: 'registration',
      status: 'pending'
    };

    const { data: payment, error: paymentError } = await supabase
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
      await supabase
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
