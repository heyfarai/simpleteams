import { NextRequest, NextResponse } from "next/server";
import { BillingService, PaymentService, StripeService } from "@simpleteams/services";
import { paymentRepository } from "@simpleteams/database";

// Create service instances
const paymentService = new PaymentService(paymentRepository);
const stripeService = new StripeService(process.env.STRIPE_SECRET_KEY!);
const billingService = new BillingService(paymentService, stripeService);

export async function POST(request: NextRequest) {
  try {
    const { userId, teamId } = await request.json();

    // Use the billing service to handle the entire flow
    const result = await billingService.createBillingPortalSession({
      userId,
      teamId
    });

    return NextResponse.json({
      portal_url: result.portalUrl,
    });

  } catch (error) {
    console.error("Error creating billing portal session:", error);

    // Handle specific error messages for better UX
    const message = error instanceof Error ? error.message : "Failed to create billing portal session";

    // Determine status code based on error message
    let status = 500;
    if (message.includes("required") || message.includes("Invalid")) {
      status = 400;
    } else if (message.includes("not found") || message.includes("No subscription")) {
      status = 404;
    }

    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}