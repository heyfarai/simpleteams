import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Stripe from "stripe";
import type { Database } from "@/lib/supabase/database.types";
import { createClient } from '@supabase/supabase-js';
import { getReturnUrl } from '@/lib/utils/url-utils';
import { getPackageConfig, isInstallmentAvailable, type PackageType } from '@/lib/config/packages';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Package configuration now imported from /lib/config/packages.ts

export async function POST(request: Request) {
  try {
    const { formData, currentUrl } = await request.json();

    // Validate required fields
    if (!formData.teamName || !formData.contactEmail || !formData.city || !formData.province) {
      return NextResponse.json(
        { error: "Missing required team information" },
        { status: 400 }
      );
    }

    // Get current package configuration (with early bird logic)
    const PACKAGE_CONFIG = getPackageConfig();
    const selectedPackage = formData.selectedPackage as PackageType;

    // Validate selected package
    if (!selectedPackage || !(selectedPackage in PACKAGE_CONFIG)) {
      return NextResponse.json(
        { error: "Invalid package selection" },
        { status: 400 }
      );
    }

    const packageConfig = PACKAGE_CONFIG[selectedPackage];

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

    // Create registration record (teams will be created after payment)
    const registrationData = {
      user_id: userId,
      team_name: formData.teamName,
      city: formData.city,
      region: formData.province,
      phone: formData.phone || null,
      primary_color: formData.primaryColors?.[0] || '#1e40af',
      secondary_color: formData.primaryColors?.[1] || '#fbbf24',
      accent_color: formData.primaryColors?.[2] || null,
      primary_contact_name: formData.primaryContactName,
      primary_contact_email: formData.contactEmail,
      primary_contact_phone: formData.primaryContactPhone || null,
      primary_contact_role: formData.primaryContactRole || 'manager',
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

    const { data: registration, error: registrationError } = await supabase
      .from("team_registrations")
      .insert(registrationData)
      .select()
      .single();

    if (registrationError) {
      console.error("Registration creation error:", registrationError);
      return NextResponse.json({ error: registrationError.message }, { status: 500 });
    }

    if (!registration) {
      return NextResponse.json(
        { error: "Failed to create registration" },
        { status: 500 }
      );
    }


    // Note: Payment record will be created by webhook after successful Stripe payment
    // We'll store the registration ID in Stripe metadata for the webhook to use

    // Create return URL function using client's current URL when available
    const getReturnUrlForStripe = (path: string) => {
      // Use client-provided URL if available (handles deploy previews correctly)
      if (currentUrl) {
        try {
          const url = new URL(currentUrl);
          return `${url.origin}${path}`;
        } catch (error) {
          console.warn('Invalid currentUrl provided:', currentUrl);
        }
      }

      // Fallback to server-side URL detection
      return getReturnUrl(path);
    };

    // Check if this should be an installment payment (using configuration)
    const isInstallment = formData.paymentMethod === 'installments' && isInstallmentAvailable(selectedPackage);

    let session;

    if (isInstallment) {
      const installmentConfig = packageConfig.installments!;

      // Create customer first for subscription schedule
      const customer = await stripe.customers.create({
        email: formData.contactEmail,
        name: formData.teamName,
        metadata: {
          registrationId: registration.id,
          teamName: formData.teamName,
        }
      });

      // Create subscription schedule using package configuration
      const subscriptionSchedule = await stripe.subscriptionSchedules.create({
        customer: customer.id,
        start_date: 'now',
        end_behavior: 'cancel',
        phases: [
          {
            items: [{ price: installmentConfig.installmentPriceId, quantity: 1 }],
            iterations: installmentConfig.installments,
            billing_cycle_anchor: 'automatic',
          }
        ],
        metadata: {
          registrationId: registration.id,
          contactEmail: formData.contactEmail,
          teamName: formData.teamName,
          selectedPackage: selectedPackage,
          paymentType: 'installments',
          installmentCount: installmentConfig.installments.toString()
        }
      });

      // Create checkout session for the subscription schedule
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: installmentConfig.installmentPriceId,
            quantity: 1,
          },
        ],
        success_url: `${getReturnUrlForStripe('/register/checkout/success')}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: getReturnUrlForStripe('/register/checkout'),
        customer: customer.id,
        metadata: {
          registrationId: registration.id,
          contactEmail: formData.contactEmail,
          teamName: formData.teamName,
          selectedPackage: selectedPackage,
          paymentType: 'installments',
          installmentCount: installmentConfig.installments.toString()
        },
      });
    } else {
      // Regular one-time payment
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: packageConfig.priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${getReturnUrlForStripe('/register/checkout/success')}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: getReturnUrlForStripe('/register/checkout'),
        metadata: {
          registrationId: registration.id,
          contactEmail: formData.contactEmail,
          teamName: formData.teamName,
          selectedPackage: formData.selectedPackage,
          packageName: packageConfig.name,
          paymentType: 'one-time'
        },
        customer_email: formData.contactEmail,
      });
    }

    // Update registration with Stripe session ID
    await supabase
      .from("team_registrations")
      .update({ stripe_session_id: session.id })
      .eq("id", registration.id);

    return NextResponse.json({
      checkoutUrl: session.url,
      registrationId: registration.id
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
