// Billing service - orchestrates payment and Stripe services for billing operations
import { PaymentService } from "./payment-service";
import { StripeService } from "./stripe-service";

export interface BillingPortalRequest {
  userId: string;
  teamId: string;
  returnUrl?: string;
}

export interface BillingPortalResponse {
  portalUrl: string;
}

export class BillingService {
  constructor(
    private paymentService: PaymentService,
    private stripeService: StripeService
  ) {}

  async createBillingPortalSession(request: BillingPortalRequest): Promise<BillingPortalResponse> {
    // Step 1: Validate access and get payment details
    const validation = await this.paymentService.validateBillingPortalAccess(
      request.userId,
      request.teamId
    );

    if (!validation.isValid || !validation.payment) {
      throw new Error(validation.error || "Invalid billing portal access");
    }

    // Step 2: Get customer ID from Stripe session
    const payment = validation.payment;
    if (!payment.stripeSessionId) {
      throw new Error("Could not find customer information");
    }

    const session = await this.stripeService.getCheckoutSession(payment.stripeSessionId);
    const customerId = typeof session.customer === 'string'
      ? session.customer
      : session.customer?.id;

    if (!customerId) {
      throw new Error("Could not find customer information");
    }

    // Step 3: Create billing portal session
    const returnUrl = request.returnUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/payments`;
    const portalSession = await this.stripeService.createBillingPortalSession(customerId, returnUrl);

    return {
      portalUrl: portalSession.url
    };
  }
}