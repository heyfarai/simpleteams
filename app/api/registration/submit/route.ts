import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getReturnUrl } from '@/lib/utils/url-utils';
import { getPackageConfig, isInstallmentAvailable, type PackageType } from '@/lib/config/packages';
import { registrationService } from '@/lib/services';
import { StripeService } from '@/lib/services/stripe-service';

// Initialize Stripe service
const stripeService = new StripeService(process.env.STRIPE_SECRET_KEY!);

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

    // Create registration using service layer
    const registration = await registrationService.createRegistrationWithValidation(
      userId,
      formData,
      packageConfig
    );


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

    // Create Stripe checkout session using service
    const session = await stripeService.createCheckoutSession({
      packageType: selectedPackage,
      paymentMethod: isInstallment ? 'installments' : 'full',
      customerEmail: formData.contactEmail,
      customerName: formData.teamName,
      metadata: {
        registrationId: registration.id,
        contactEmail: formData.contactEmail,
        teamName: formData.teamName,
        selectedPackage: selectedPackage,
        packageName: packageConfig.name,
      },
      successUrl: `${getReturnUrlForStripe('/register/checkout/success')}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: getReturnUrlForStripe('/register/checkout'),
    });

    // Update registration with Stripe session ID using service
    await registrationService.linkStripeSession(registration.id, session.id);

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
