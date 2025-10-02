import { NextRequest, NextResponse } from 'next/server';
import { paymentRepository } from '@simpleteams/database';
import { PaymentService } from '@simpleteams/services'; // was: @simpleteams/services/payment-service';

const paymentService = new PaymentService(paymentRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rosterId = searchParams.get('rosterId');

    if (!rosterId) {
      return NextResponse.json(
        { error: 'rosterId parameter is required' },
        { status: 400 }
      );
    }

    const summary = await paymentService.getPaymentSummaryByRoster(rosterId);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment summary' },
      { status: 500 }
    );
  }
}