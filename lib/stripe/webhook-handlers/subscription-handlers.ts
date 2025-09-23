import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabase } from "../clients";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;

  console.log("Processing invoice payment:", {
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription,
    amount: invoice.amount_paid
  });

  // For installment payments, we track each payment
  if (invoice.subscription) {
    try {
      // Get subscription to find registration metadata
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const registrationId = subscription.metadata?.registrationId;

      if (registrationId) {
        // Create payment record for this installment
        const paymentData = {
          roster_id: null, // Will be set after registration completes
          amount: invoice.amount_paid || 0,
          currency: invoice.currency?.toUpperCase() || "CAD",
          description: `Installment Payment - ${invoice.number}`,
          stripe_payment_intent_id: invoice.payment_intent as string,
          status: "completed",
          paid_at: new Date().toISOString(),
          payment_type: "installment",
          installment_sequence: invoice.lines.data[0]?.period?.start ?
            Math.floor((Date.now() - (invoice.lines.data[0].period.start * 1000)) / (30 * 24 * 60 * 60 * 1000)) + 1 : 1
        };

        const { error: paymentError } = await supabase
          .from("team_payments")
          .insert(paymentData);

        if (paymentError) {
          console.error("Error creating installment payment record:", paymentError);
        }

        console.log(`Installment payment recorded for registration ${registrationId}`);
      }
    } catch (error) {
      console.error("Error processing installment payment:", error);
    }
  }

  return NextResponse.json({ received: true });
}

export async function handleInvoicePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;

  console.log("Invoice payment failed:", {
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription,
    amount: invoice.amount_due
  });

  // TODO: Handle failed installment payments
  // - Send notification emails
  // - Update payment status in database
  // - Potentially pause team access if multiple failures

  return NextResponse.json({ received: true });
}