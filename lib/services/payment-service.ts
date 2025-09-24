// Payment service - all payment business logic, database agnostic
import type {
  TeamPayment,
  PaymentStatus,
  PaymentType
} from "../domain/models";
import type {
  PaymentRepository,
  CreatePaymentRequest,
  UpdatePaymentRequest
} from "../repositories/interfaces";

export class PaymentService {
  constructor(private paymentRepository: PaymentRepository) {}

  async getAllPayments(): Promise<TeamPayment[]> {
    return this.paymentRepository.findAll();
  }

  async getPaymentById(id: string): Promise<TeamPayment | null> {
    return this.paymentRepository.findById(id);
  }

  async getPaymentsByRosterId(rosterId: string): Promise<TeamPayment[]> {
    return this.paymentRepository.findByRosterId(rosterId);
  }

  async getPaymentsByStatus(status: PaymentStatus): Promise<TeamPayment[]> {
    return this.paymentRepository.findByStatus(status);
  }

  async getPaymentsByType(paymentType: PaymentType): Promise<TeamPayment[]> {
    return this.paymentRepository.findByPaymentType(paymentType);
  }

  async getPaymentByStripeSessionId(sessionId: string): Promise<TeamPayment | null> {
    return this.paymentRepository.findByStripeSessionId(sessionId);
  }

  async getPaymentByStripePaymentIntentId(paymentIntentId: string): Promise<TeamPayment | null> {
    return this.paymentRepository.findByStripePaymentIntentId(paymentIntentId);
  }

  async getOverduePayments(): Promise<TeamPayment[]> {
    return this.paymentRepository.findOverdue();
  }

  async createPayment(paymentData: CreatePaymentRequest): Promise<TeamPayment> {
    // Business logic validation
    if (paymentData.amount <= 0) {
      throw new Error('Payment amount must be positive');
    }

    if (!paymentData.description.trim()) {
      throw new Error('Payment description is required');
    }

    return this.paymentRepository.create(paymentData);
  }

  async updatePayment(id: string, updateData: UpdatePaymentRequest): Promise<TeamPayment> {
    // Business logic validation
    if (updateData.amount !== undefined && updateData.amount <= 0) {
      throw new Error('Payment amount must be positive');
    }

    return this.paymentRepository.update(id, updateData);
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<TeamPayment> {
    return this.paymentRepository.updateStatus(id, status);
  }

  async markPaymentAsPaid(
    id: string,
    paidAt?: Date,
    receiptUrl?: string
  ): Promise<TeamPayment> {
    return this.paymentRepository.markAsPaid(id, paidAt, receiptUrl);
  }

  async deletePayment(id: string): Promise<void> {
    return this.paymentRepository.delete(id);
  }

  // Business logic methods
  async calculateTotalAmountByRoster(rosterId: string): Promise<number> {
    const payments = await this.getPaymentsByRosterId(rosterId);
    return payments.reduce((total, payment) => total + payment.amount, 0);
  }

  async calculatePaidAmountByRoster(rosterId: string): Promise<number> {
    const payments = await this.getPaymentsByRosterId(rosterId);
    const paidPayments = payments.filter(p => p.status === 'paid');
    return paidPayments.reduce((total, payment) => total + payment.amount, 0);
  }

  async calculateOutstandingAmountByRoster(rosterId: string): Promise<number> {
    const total = await this.calculateTotalAmountByRoster(rosterId);
    const paid = await this.calculatePaidAmountByRoster(rosterId);
    return total - paid;
  }

  async hasOutstandingPayments(rosterId: string): Promise<boolean> {
    const outstanding = await this.calculateOutstandingAmountByRoster(rosterId);
    return outstanding > 0;
  }

  async getPaymentSummaryByRoster(rosterId: string) {
    const payments = await this.getPaymentsByRosterId(rosterId);
    const paidPayments = payments.filter(p => p.status === 'paid');
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const overduePayments = payments.filter(p =>
      p.status === 'pending' &&
      p.dueDate &&
      new Date(p.dueDate) < new Date()
    );

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
    const overdueAmount = overduePayments.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalPayments: payments.length,
      paidPayments: paidPayments.length,
      pendingPayments: pendingPayments.length,
      overduePayments: overduePayments.length,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      outstandingAmount: totalAmount - paidAmount,
    };
  }
}