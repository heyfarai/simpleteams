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
import { sessionEnrollmentService } from "./session-enrollment-service";
import { sessionService } from "./session-service";
import { league } from "./league";

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
    // For now, allow users to register multiple teams
    // In the future, we could add season-specific logic or reasonable limits
    // const userRegistrations = await this.getRegistrationsByUserId(userId);
    // const activeRegistrations = userRegistrations.filter(
    //   reg => reg.status === 'pending' || reg.status === 'approved'
    // );

    // Business rule: Allow multiple team registrations per user
    return true;
  }

  async createRegistrationWithValidation(
    userId: string,
    formData: any,
    packageSelection: any
  ): Promise<TeamRegistration> {
    // Validate user can register
    const canRegister = await this.canUserRegister(userId);
    if (!canRegister) {
      throw new Error('User already has an active registration');
    }

    // Handle session selection based on package type
    let selectedSessionIds = formData.selectedSessionIds || null;

    // For full-season packages, automatically select all sessions
    if (formData.selectedPackage === 'full-season') {
      try {
        const currentSeason = await league.getCurrentSeason();
        if (currentSeason) {
          const allSessions = await sessionService.getSessionsBySeason(currentSeason.id);
          selectedSessionIds = allSessions.map(session => session.id);
          console.log(`[DEBUG] Auto-populated ${selectedSessionIds.length} sessions for full-season package`);
        }
      } catch (error) {
        console.error('[ERROR] Failed to auto-populate sessions for full-season package:', error);
        // Continue with null - the validation will handle this appropriately
      }
    }

    // Create registration data
    const registrationData: any = {
      userId,
      teamName: formData.teamName,
      city: formData.city,
      region: formData.province || null,
      phone: formData.phone || null,
      primaryColor: formData.primaryColors?.[0] || '#1e40af',
      secondaryColor: formData.primaryColors?.[1] || '#fbbf24',
      accentColor: formData.primaryColors?.[2] || null,
      primaryContactName: formData.primaryContactName,
      primaryContactEmail: formData.contactEmail,
      primaryContactPhone: formData.primaryContactPhone || null,
      primaryContactRole: formData.primaryContactRole || 'manager',
      headCoachName: formData.headCoachName || null,
      headCoachEmail: formData.headCoachEmail || null,
      headCoachPhone: formData.headCoachPhone || null,
      headCoachCertifications: formData.headCoachCertifications || null,
      divisionPreference: formData.divisionPreference,
      registrationNotes: formData.registrationNotes || null,
      selectedPackage: formData.selectedPackage,
      selectedSessionIds: selectedSessionIds, // Now properly handled for all package types
      status: 'pending' as const,
      paymentStatus: 'pending' as const
    };

    return this.createRegistration(registrationData);
  }

  async linkStripeSession(registrationId: string, stripeSessionId: string): Promise<void> {
    await this.registrationRepository.updateStripeSessionId(registrationId, stripeSessionId);
  }

  // Session-related helper methods
  requiresSessionSelection(packageType: string): boolean {
    return ['two-session', 'pay-per-session'].includes(packageType);
  }

  validateSessionSelection(packageType: string, selectedSessionIds?: string[]): void {
    if (this.requiresSessionSelection(packageType)) {
      if (!selectedSessionIds || selectedSessionIds.length === 0) {
        throw new Error(`Session selection is required for ${packageType} package`);
      }

      // Validate session count based on package type
      if (packageType === 'two-session' && selectedSessionIds.length !== 2) {
        throw new Error('Two-session package requires exactly 2 sessions to be selected');
      }

      if (packageType === 'pay-per-session') {
        if (selectedSessionIds.length === 0) {
          throw new Error('Pay-per-session package requires exactly 1 session to be selected');
        }
        if (selectedSessionIds.length > 1) {
          throw new Error('Pay-per-session package allows only 1 session to be selected');
        }
      }
    }

    // For full-season packages, sessions should be auto-populated (no validation needed)
    // The system automatically selects all available sessions
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

    // Validate session selection for packages that require it
    this.validateSessionSelection(data.selectedPackage, data.selectedSessionIds);

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
        // Auto-enroll in sessions for full-season packages
        await this.handleAutoEnrollment(registration);
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

  private async handleAutoEnrollment(registration: TeamRegistration): Promise<void> {
    // Check if we have a teamId/rosterId to enroll
    if (!registration.teamId) {
      console.warn(`[DEBUG] No teamId found for registration ${registration.id}, skipping auto-enrollment`);
      return;
    }

    // Need to determine the current season
    try {
      const currentSeason = await league.getCurrentSeason();
      if (!currentSeason) {
        console.warn(`[DEBUG] No current season found, skipping auto-enrollment for registration ${registration.id}`);
        return;
      }

      // Handle different package types
      switch (registration.selectedPackage) {
        case 'full-season':
          // Auto-enroll in all sessions for the current season
          const allEnrollments = await sessionEnrollmentService.enrollTeamInAllSessions(
            registration.teamId,
            currentSeason.id
          );
          console.log(`[DEBUG] Auto-enrolled team ${registration.teamId} in ${allEnrollments.length} sessions for season ${currentSeason.id}`);
          break;

        case 'two-session':
        case 'pay-per-session':
          // Enroll in selected sessions only
          if (registration.selectedSessionIds && registration.selectedSessionIds.length > 0) {
            const enrollments = [];
            for (const sessionId of registration.selectedSessionIds) {
              try {
                const enrollment = await sessionEnrollmentService.enrollRosterInSession(
                  registration.teamId,
                  sessionId
                );
                enrollments.push(enrollment);
              } catch (error) {
                console.error(`[ERROR] Failed to enroll team ${registration.teamId} in session ${sessionId}:`, error);
              }
            }
            console.log(`[DEBUG] Enrolled team ${registration.teamId} in ${enrollments.length} selected sessions`);
          } else {
            console.warn(`[DEBUG] No sessions selected for ${registration.selectedPackage} package - registration ${registration.id}`);
          }
          break;

        default:
          console.log(`[DEBUG] Skipping auto-enrollment for package: ${registration.selectedPackage}`);
          break;
      }
    } catch (error) {
      console.error(`[ERROR] Auto-enrollment failed for registration ${registration.id}:`, error);
      // Don't throw - we don't want to fail the approval process if enrollment fails
    }
  }
}