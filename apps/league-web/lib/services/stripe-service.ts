// Stripe service - handles all Stripe-related business logic
import Stripe from 'stripe';
import { getPackageConfig, isInstallmentAvailable, type PackageType } from '@simpleteams/config';

export interface StripeCheckoutOptions {
  packageType: PackageType;
  paymentMethod: 'full' | 'installments';
  customerEmail: string;
  customerName: string;
  metadata: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeSubscriptionOptions {
  customerId: string;
  priceId: string;
  installments: number;
  metadata: Record<string, string>;
}

export class StripeService {
  private stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey);
  }

  /**
   * Create a checkout session for registration payment
   */
  async createCheckoutSession(options: StripeCheckoutOptions): Promise<Stripe.Checkout.Session> {
    const packageConfig = getPackageConfig()[options.packageType];
    if (!packageConfig) {
      throw new Error(`Invalid package type: ${options.packageType}`);
    }

    const isInstallmentPayment =
      options.paymentMethod === 'installments' &&
      isInstallmentAvailable(options.packageType);

    if (isInstallmentPayment) {
      return this.createSubscriptionCheckoutSession(options, packageConfig);
    } else {
      return this.createOneTimeCheckoutSession(options, packageConfig);
    }
  }

  /**
   * Create a customer for subscription payments
   */
  async createCustomer(email: string, name: string, metadata: Record<string, string>): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email,
      name,
      metadata,
    });
  }

  /**
   * Create a subscription schedule for installment payments
   */
  async createSubscriptionSchedule(options: StripeSubscriptionOptions): Promise<Stripe.SubscriptionSchedule> {
    return this.stripe.subscriptionSchedules.create({
      customer: options.customerId,
      start_date: 'now',
      end_behavior: 'cancel',
      phases: [
        {
          items: [{ price: options.priceId, quantity: 1 }],
          iterations: options.installments,
          billing_cycle_anchor: 'automatic',
        }
      ],
      metadata: options.metadata,
    });
  }

  /**
   * Retrieve a checkout session
   */
  async getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'subscription', 'customer'],
    });
  }

  /**
   * Retrieve a customer
   */
  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      throw new Error('Customer has been deleted');
    }
    return customer as Stripe.Customer;
  }

  /**
   * Update customer billing portal session
   */
  async createBillingPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session> {
    return this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price', 'customer', 'schedule'],
    });
  }

  /**
   * List customer subscriptions
   */
  async getCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
      expand: ['data.items.data.price'],
    });
    return subscriptions.data;
  }

  /**
   * Process webhook events
   */
  async processWebhookEvent(payload: string | Buffer, signature: string, endpointSecret: string): Promise<Stripe.Event> {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  /**
   * Create refund
   */
  async createRefund(paymentIntentId: string, amount?: number, reason?: string): Promise<Stripe.Refund> {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
      reason: reason as Stripe.RefundCreateParams.Reason,
    });
  }

  // Private helper methods
  private async createOneTimeCheckoutSession(
    options: StripeCheckoutOptions,
    packageConfig: any
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: packageConfig.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
      metadata: {
        ...options.metadata,
        paymentType: 'one-time',
      },
      customer_email: options.customerEmail,
    });
  }

  private async createSubscriptionCheckoutSession(
    options: StripeCheckoutOptions,
    packageConfig: any
  ): Promise<Stripe.Checkout.Session> {
    if (!packageConfig.installments?.enabled) {
      throw new Error('Installments not available for this package');
    }

    // Create customer first for subscription schedule
    const customer = await this.createCustomer(
      options.customerEmail,
      options.customerName,
      options.metadata
    );

    // Create subscription schedule
    await this.createSubscriptionSchedule({
      customerId: customer.id,
      priceId: packageConfig.installments.installmentPriceId,
      installments: packageConfig.installments.installments,
      metadata: {
        ...options.metadata,
        installmentCount: packageConfig.installments.installments.toString(),
      },
    });

    // Create checkout session for the subscription
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: packageConfig.installments.installmentPriceId,
          quantity: 1,
        },
      ],
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
      customer: customer.id,
      metadata: {
        ...options.metadata,
        paymentType: 'installments',
        installmentCount: packageConfig.installments.installments.toString(),
      },
    });
  }

  /**
   * Validate webhook event types
   */
  isValidWebhookEventType(eventType: string): boolean {
    const validTypes = [
      'checkout.session.completed',
      'invoice.payment_succeeded',
      'invoice.payment_failed',
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
    ];
    return validTypes.includes(eventType);
  }

  /**
   * Get upcoming payment dates for subscription or calculate for new subscription
   */
  async getUpcomingPaymentDates(options: {
    subscriptionId?: string;
    packageType?: string;
    startDate?: Date;
  }): Promise<{ dates: string[], nextPayment: string | null }> {
    try {
      if (options.subscriptionId) {
        // Get real dates from existing subscription
        const subscription = await this.getSubscription(options.subscriptionId);
        return this.calculateDatesFromSubscription(subscription);
      } else if (options.packageType) {
        // Calculate preview dates for checkout
        return this.calculatePreviewDates(options.packageType, options.startDate);
      }

      return { dates: [], nextPayment: null };
    } catch (error) {
      console.error('Error getting upcoming payment dates:', error);
      return { dates: [], nextPayment: null };
    }
  }

  /**
   * Extract metadata from webhook event
   */
  extractEventMetadata(event: Stripe.Event): Record<string, string> {
    const object = event.data.object as any;
    return object.metadata || {};
  }

  // Private helper methods for payment date calculation
  private calculateDatesFromSubscription(subscription: Stripe.Subscription): { dates: string[], nextPayment: string | null } {
    const currentPeriodEnd = subscription.current_period_end * 1000; // Convert to milliseconds
    const dates: string[] = [];
    const nextPaymentDate = new Date(currentPeriodEnd);

    // Add next payment date
    dates.push(this.formatPaymentDate(nextPaymentDate));

    // Add subsequent monthly payments (up to 3 future payments for display)
    for (let i = 1; i < 3; i++) {
      const futureDate = new Date(nextPaymentDate);
      futureDate.setMonth(futureDate.getMonth() + i);
      dates.push(this.formatPaymentDate(futureDate));
    }

    return {
      dates,
      nextPayment: this.formatPaymentDate(nextPaymentDate)
    };
  }

  private calculatePreviewDates(packageType: string, startDate?: Date): { dates: string[], nextPayment: string | null } {
    const { getInstallmentDetails } = require('@/lib/config/packages');
    const installmentDetails = getInstallmentDetails(packageType);

    if (!installmentDetails) {
      return { dates: [], nextPayment: null };
    }

    const dates: string[] = [];
    const baseDate = startDate || new Date();

    // Generate dates for each installment (skip first payment as it's "today")
    for (let i = 1; i < installmentDetails.installments; i++) {
      const paymentDate = new Date(baseDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);
      dates.push(this.formatPaymentDate(paymentDate));
    }

    const nextPayment = dates.length > 0 ? dates[0] : null;

    return { dates, nextPayment };
  }

  private formatPaymentDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}