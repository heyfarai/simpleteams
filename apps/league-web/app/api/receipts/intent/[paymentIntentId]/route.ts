import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ paymentIntentId: string }> }
) {
  try {
    const { paymentIntentId } = await params;

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return NextResponse.json(
        { error: "Payment intent not found" },
        { status: 404 }
      );
    }

    // Return the receipt URL if available
    if (paymentIntent.receipt_url) {
      return NextResponse.json({
        receipt_url: paymentIntent.receipt_url,
        payment_intent_id: paymentIntentId,
        status: paymentIntent.status
      });
    } else {
      // Fallback: create a simple receipt HTML for test mode
      const receiptHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Receipt - ${paymentIntent.description || 'Payment'}</title>
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
        .test-mode {
            background-color: #f59e0b;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="test-mode">TEST MODE RECEIPT</div>
        <div class="header">
            <h1>Payment Receipt</h1>
            <p>Thank you for your payment!</p>
            <span class="status">${paymentIntent.status.toUpperCase()}</span>
        </div>

        <div class="row">
            <span>Payment ID:</span>
            <span>${paymentIntentId}</span>
        </div>
        <div class="row">
            <span>Description:</span>
            <span>${paymentIntent.description || 'Payment'}</span>
        </div>
        <div class="row">
            <span>Status:</span>
            <span>${paymentIntent.status}</span>
        </div>
        <div class="row">
            <span>Payment Date:</span>
            <span>${new Date((paymentIntent.created || 0) * 1000).toLocaleDateString()}</span>
        </div>

        <div class="total row">
            <span>Amount:</span>
            <span>$${((paymentIntent.amount || 0) / 100).toFixed(2)} ${(paymentIntent.currency || 'CAD').toUpperCase()}</span>
        </div>

        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
            <p>This is a test mode receipt. In live mode, you would receive an official Stripe receipt.</p>
            <p>Receipt generated on ${new Date().toLocaleDateString()}</p>
        </div>
    </div>
</body>
</html>`;

      return new Response(receiptHtml, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

  } catch (error) {
    console.error("Error retrieving payment intent receipt:", error);
    return NextResponse.json(
      { error: "Failed to retrieve receipt" },
      { status: 500 }
    );
  }
}