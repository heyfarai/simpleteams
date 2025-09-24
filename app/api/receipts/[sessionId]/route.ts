import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer', 'payment_intent']
    });

    // If there's a payment intent with receipt_url, redirect to official Stripe receipt
    if (session.payment_intent && typeof session.payment_intent === 'object' && session.payment_intent.receipt_url) {
      return NextResponse.redirect(session.payment_intent.receipt_url);
    }

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Create a simple receipt HTML
    const receiptHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Receipt - ${session.metadata?.teamName || 'Registration'}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .receipt {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            padding: 32px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
        }
        .total {
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 20px;
            font-weight: bold;
            font-size: 18px;
        }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            background-color: #10b981;
            color: white;
            font-size: 14px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <h1>Payment Receipt</h1>
            <p>Thank you for your registration payment!</p>
            <span class="status">PAID</span>
        </div>

        <div class="row">
            <span>Team Name:</span>
            <span>${session.metadata?.teamName || 'N/A'}</span>
        </div>
        <div class="row">
            <span>Contact Email:</span>
            <span>${session.metadata?.contactEmail || session.customer_email || 'N/A'}</span>
        </div>
        <div class="row">
            <span>Package:</span>
            <span>${session.metadata?.selectedPackage || 'N/A'}</span>
        </div>
        <div class="row">
            <span>Payment Method:</span>
            <span>${session.metadata?.paymentType === 'installments' ? '8-Month Installment Plan' : 'Full Payment'}</span>
        </div>
        <div class="row">
            <span>Session ID:</span>
            <span>${sessionId}</span>
        </div>
        <div class="row">
            <span>Payment Date:</span>
            <span>${new Date((session.created || 0) * 1000).toLocaleDateString()}</span>
        </div>

        <div class="total row">
            <span>Amount Paid:</span>
            <span>$${((session.amount_total || 0) / 100).toFixed(2)} ${(session.currency || 'CAD').toUpperCase()}</span>
        </div>

        ${session.metadata?.paymentType === 'installments' ? `
        <div style="margin-top: 20px; padding: 16px; background-color: #eff6ff; border-radius: 6px;">
            <h3 style="margin: 0 0 8px 0; color: #1d4ed8;">Installment Plan Details</h3>
            <p style="margin: 0; color: #1e40af;">This is the first payment of an 8-month installment plan. Subsequent payments of $437 will be charged monthly.</p>
        </div>
        ` : ''}

        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
            <p>Questions? Contact support@yourleague.com</p>
            <p>This receipt was generated on ${new Date().toLocaleDateString()}</p>
        </div>
    </div>
</body>
</html>`;

    return new Response(receiptHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error("Error retrieving receipt:", error);
    return NextResponse.json(
      { error: "Failed to retrieve receipt" },
      { status: 500 }
    );
  }
}