// Registration service - all registration business logic, database agnostic
import type {
  TeamRegistration,
  RegistrationStatus,
  PaymentStatus
} from "../domain/models";
import type {
  RegistrationRepository,
  CreateRegistrationRequest,
  UpdateRegistrationRequest
} from "../repositories/interfaces";

export class RegistrationService {
  constructor(private registrationRepository: RegistrationRepository) {}

  async getAllRegistrations(): Promise<TeamRegistration[]> {
    return this.registrationRepository.findAll();
  }

  async getRegistrationById(id: string): Promise<TeamRegistration | null> {
    return this.registrationRepository.findById(id);
  }

  async getRegistrationsByUserId(userId: string): Promise<TeamRegistration[]> {
    return this.registrationRepository.findByUserId(userId);
  }

  async getRegistrationsByStatus(status: RegistrationStatus): Promise<TeamRegistration[]> {
    return this.registrationRepository.findByStatus(status);
  }

  async getRegistrationByStripeSessionId(sessionId: string): Promise<TeamRegistration | null> {
    return this.registrationRepository.findByStripeSessionId(sessionId);
  }

  async createRegistration(registrationData: CreateRegistrationRequest): Promise<TeamRegistration> {
    // Business logic validation
    await this.validateRegistrationData(registrationData);

    // Set default values
    const dataWithDefaults = {
      ...registrationData,
      status: registrationData.status || 'pending' as RegistrationStatus,
      paymentStatus: registrationData.paymentStatus || 'pending' as PaymentStatus,
    };

    return this.registrationRepository.create(dataWithDefaults);
  }

  async updateRegistration(id: string, updateData: UpdateRegistrationRequest): Promise<TeamRegistration> {
    // Business logic validation for updates
    if (updateData.teamName !== undefined && !updateData.teamName.trim()) {
      throw new Error('Team name cannot be empty');
    }

    if (updateData.primaryContactEmail !== undefined && !this.isValidEmail(updateData.primaryContactEmail)) {
      throw new Error('Invalid primary contact email');
    }

    return this.registrationRepository.update(id, updateData);
  }

  async updateRegistrationStatus(id: string, status: RegistrationStatus): Promise<TeamRegistration> {
    // Business logic for status transitions
    const registration = await this.getRegistrationById(id);
    if (!registration) {
      throw new Error('Registration not found');
    }

    await this.validateStatusTransition(registration.status!, status);

    const updatedRegistration = await this.registrationRepository.updateStatus(id, status);

    // Trigger side effects based on status change
    await this.handleStatusChange(updatedRegistration, status);

    return updatedRegistration;
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<TeamRegistration> {
    return this.registrationRepository.updatePaymentStatus(id, paymentStatus);
  }

  async deleteRegistration(id: string): Promise<void> {
    const registration = await this.getRegistrationById(id);
    if (!registration) {
      throw new Error('Registration not found');
    }

    // Business logic: Can only delete pending registrations
    if (registration.status !== 'pending') {
      throw new Error('Cannot delete non-pending registration');
    }

    return this.registrationRepository.delete(id);
  }

  // Business logic methods
  async getPendingRegistrations(): Promise<TeamRegistration[]> {
    return this.getRegistrationsByStatus('pending');
  }

  async getApprovedRegistrations(): Promise<TeamRegistration[]> {
    return this.getRegistrationsByStatus('approved');
  }

  async approveRegistration(id: string): Promise<TeamRegistration> {
    return this.updateRegistrationStatus(id, 'approved');
  }

  async rejectRegistration(id: string): Promise<TeamRegistration> {
    return this.updateRegistrationStatus(id, 'rejected');
  }

  async cancelRegistration(id: string): Promise<TeamRegistration> {
    return this.updateRegistrationStatus(id, 'cancelled');
  }

  async getRegistrationSummary() {
    const allRegistrations = await this.getAllRegistrations();

    const summary = {
      total: allRegistrations.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      paymentPending: 0,
      paymentPaid: 0,
      byPackage: {} as Record<string, number>,
    };

    allRegistrations.forEach(reg => {
      // Count by status
      if (reg.status) {
        summary[reg.status as keyof typeof summary]++;
      }

      // Count by payment status
      if (reg.paymentStatus === 'pending') {
        summary.paymentPending++;
      } else if (reg.paymentStatus === 'paid') {
        summary.paymentPaid++;
      }

      // Count by package
      if (reg.selectedPackage) {
        summary.byPackage[reg.selectedPackage] = (summary.byPackage[reg.selectedPackage] || 0) + 1;
      }
    });

    return summary;
  }

  async canUserRegister(userId: string): Promise<boolean> {
    const userRegistrations = await this.getRegistrationsByUserId(userId);
    const activeRegistrations = userRegistrations.filter(
      reg => reg.status === 'pending' || reg.status === 'approved'
    );

    // Business rule: Users can only have one active registration per season
    return activeRegistrations.length === 0;
  }

  // Private validation methods
  private async validateRegistrationData(data: CreateRegistrationRequest): Promise<void> {
    if (!data.teamName.trim()) {
      throw new Error('Team name is required');
    }

    if (!data.city.trim()) {
      throw new Error('City is required');
    }

    if (!data.primaryContactName.trim()) {
      throw new Error('Primary contact name is required');
    }

    if (!this.isValidEmail(data.primaryContactEmail)) {
      throw new Error('Invalid primary contact email');
    }

    if (!data.divisionPreference.trim()) {
      throw new Error('Division preference is required');
    }

    if (!data.selectedPackage.trim()) {
      throw new Error('Selected package is required');
    }

    // Check if user can register
    const canRegister = await this.canUserRegister(data.userId);
    if (!canRegister) {
      throw new Error('User already has an active registration');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async validateStatusTransition(currentStatus: RegistrationStatus, newStatus: RegistrationStatus): Promise<void> {
    const validTransitions: Record<RegistrationStatus, RegistrationStatus[]> = {
      'pending': ['approved', 'rejected', 'cancelled'],
      'approved': ['cancelled'],
      'rejected': ['pending'],
      'cancelled': [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
  }

  private async handleStatusChange(registration: TeamRegistration, newStatus: RegistrationStatus): Promise<void> {
    // Handle side effects of status changes
    switch (newStatus) {
      case 'approved':
        // TODO: Send approval email, create team record, etc.
        console.log(`Registration ${registration.id} approved - would send approval email`);
        break;
      case 'rejected':
        // TODO: Send rejection email
        console.log(`Registration ${registration.id} rejected - would send rejection email`);
        break;
      case 'cancelled':
        // TODO: Handle cancellation logic (refunds, etc.)
        console.log(`Registration ${registration.id} cancelled - would handle cancellation`);
        break;
    }
  }
}