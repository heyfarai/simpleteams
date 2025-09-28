import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/services/stripe-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const packageType = searchParams.get('packageType');
    const subscriptionId = searchParams.get('subscriptionId');

    if (!packageType && !subscriptionId) {
      return NextResponse.json(
        { error: 'Either packageType or subscriptionId is required' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe configuration missing' },
        { status: 500 }
      );
    }

    const stripeService = new StripeService(process.env.STRIPE_SECRET_KEY);

    const paymentDates = await stripeService.getUpcomingPaymentDates({
      packageType: packageType || undefined,
      subscriptionId: subscriptionId || undefined,
    });

    return NextResponse.json(paymentDates);
  } catch (error) {
    console.error('Error fetching payment schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment schedule' },
      { status: 500 }
    );
  }
}