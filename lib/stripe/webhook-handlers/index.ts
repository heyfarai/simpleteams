import Stripe from "stripe";
import { NextResponse } from "next/server";
import { handleCheckoutCompleted } from "./checkout-completed";

// Map of event types to their handlers
const eventHandlers: Record<string, (event: Stripe.Event) => Promise<NextResponse>> = {
  "checkout.session.completed": handleCheckoutCompleted,
  // Add more event handlers as needed:
  // "payment_intent.succeeded": handlePaymentIntentSucceeded,
  // "payment_intent.payment_failed": handlePaymentIntentFailed,
  // "customer.subscription.created": handleSubscriptionCreated,
  // "customer.subscription.deleted": handleSubscriptionDeleted,
};

export async function handleWebhookEvent(event: Stripe.Event): Promise<NextResponse> {
  console.log("Webhook event:", event.type);

  const handler = eventHandlers[event.type];

  if (handler) {
    return await handler(event);
  }

  // Return success for unhandled events (Stripe best practice)
  console.log(`Unhandled event type: ${event.type}`);
  return NextResponse.json({ received: true });
}