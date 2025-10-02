import { NextRequest, NextResponse } from 'next/server';
import { paymentRepository } from '@/lib/repositories/factory';
import { PaymentService } from '@/lib/services/payment-service';
import type { PaymentStatus, PaymentType } from '@/lib/domain/models';

const paymentService = new PaymentService(paymentRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rosterId = searchParams.get('rosterId');
    const status = searchParams.get('status') as PaymentStatus;
    const type = searchParams.get('type') as PaymentType;
    const teamId = searchParams.get('teamId');

    let payments;

    if (rosterId) {
      payments = await paymentService.getPaymentsByRosterId(rosterId);
    } else if (status === 'overdue') {
      payments = await paymentService.getOverduePayments();
    } else if (status) {
      payments = await paymentService.getPaymentsByStatus(status);
    } else if (type) {
      payments = await paymentService.getPaymentsByType(type);
    } else {
      payments = await paymentService.getAllPayments();
    }

    // Filter by team if teamId is provided (for dashboard use)
    if (teamId && !rosterId) {
      // This would require a more complex query or service method
      // For now, we'll filter on the frontend or add this to the service
      console.warn('Team-based filtering not implemented yet, use rosterId instead');
    }

    return NextResponse.json({
      payments,
      count: payments.length
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      rosterId,
      amount,
      description,
      dueDate,
      paymentType,
      stripeSessionId,
      stripePaymentIntentId
    } = body;

    if (!rosterId || !amount || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: rosterId, amount, description' },
        { status: 400 }
      );
    }

    const paymentData = {
      rosterId,
      amount: Math.round(amount * 100), // Convert to cents
      description,
      dueDate,
      paymentType: paymentType || 'one-time',
      stripeSessionId,
      stripePaymentIntentId
    };

    const payment = await paymentService.createPayment(paymentData);

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create payment'
      },
      { status: 500 }
    );
  }
}