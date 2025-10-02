import type { RosterSessionEnrollment, GameSession } from "@simpleteams/types";
import { sessionEnrollmentRepository } from "@simpleteams/database";
import { sessionService } from "./session-service";

export class SessionEnrollmentService {
  async getAllEnrollments(): Promise<RosterSessionEnrollment[]> {
    return sessionEnrollmentRepository.findAll();
  }

  async getEnrollmentById(id: string): Promise<RosterSessionEnrollment | null> {
    return sessionEnrollmentRepository.findById(id);
  }

  async getTeamEnrollments(rosterId: string): Promise<RosterSessionEnrollment[]> {
    console.log('[DEBUG] SessionEnrollmentService.getTeamEnrollments called with:', rosterId);
    const enrollments = await sessionEnrollmentRepository.findByRoster(rosterId);
    console.log('[DEBUG] SessionEnrollmentRepository returned:', enrollments.length, 'enrollments');
    return enrollments;
  }

  async getSessionEnrollments(sessionId: string): Promise<RosterSessionEnrollment[]> {
    return sessionEnrollmentRepository.findBySession(sessionId);
  }

  async getTeamSessionEnrollment(rosterId: string, sessionId: string): Promise<RosterSessionEnrollment | null> {
    return sessionEnrollmentRepository.findByRosterAndSession(rosterId, sessionId);
  }

  async isTeamEnrolledInSession(rosterId: string, sessionId: string): Promise<boolean> {
    const enrollment = await this.getTeamSessionEnrollment(rosterId, sessionId);
    return enrollment !== null;
  }

  // Core enrollment methods
  async enrollTeamInSession(
    rosterId: string,
    sessionId: string,
    enrolledViaPackage: string,
    enrollmentDate?: Date
  ): Promise<RosterSessionEnrollment> {
    // Check if already enrolled
    const existingEnrollment = await this.getTeamSessionEnrollment(rosterId, sessionId);
    if (existingEnrollment) {
      throw new Error(`Team is already enrolled in this session`);
    }

    return sessionEnrollmentRepository.create({
      rosterId,
      sessionId,
      enrolledViaPackage,
      enrollmentDate: enrollmentDate || new Date(),
    });
  }

  async unenrollTeamFromSession(rosterId: string, sessionId: string): Promise<void> {
    return sessionEnrollmentRepository.deleteByRosterAndSession(rosterId, sessionId);
  }

  async deleteEnrollment(id: string): Promise<void> {
    return sessionEnrollmentRepository.delete(id);
  }

  // Package-based enrollment methods
  async enrollTeamInAllSessions(rosterId: string, seasonId: string): Promise<RosterSessionEnrollment[]> {
    console.log('[DEBUG] SessionEnrollmentService.enrollTeamInAllSessions called with:', { rosterId, seasonId });

    // Get all sessions for the season
    const sessions = await sessionService.getSessionsBySeason(seasonId);
    console.log('[DEBUG] Found sessions for season:', sessions.length);

    if (sessions.length === 0) {
      console.warn('[DEBUG] No sessions found for season:', seasonId);
      return [];
    }

    const enrollments: RosterSessionEnrollment[] = [];

    // Enroll in each session
    for (const session of sessions) {
      try {
        // Check if already enrolled to avoid duplicates
        const existingEnrollment = await this.getTeamSessionEnrollment(rosterId, session.id);
        if (existingEnrollment) {
          console.log('[DEBUG] Team already enrolled in session:', session.name);
          enrollments.push(existingEnrollment);
          continue;
        }

        const enrollment = await this.enrollTeamInSession(
          rosterId,
          session.id,
          'full-season'
        );
        enrollments.push(enrollment);
        console.log('[DEBUG] Enrolled team in session:', session.name);
      } catch (error) {
        console.error('[DEBUG] Failed to enroll team in session:', session.name, error);
        // Continue with other sessions rather than failing completely
      }
    }

    console.log('[DEBUG] Total enrollments created:', enrollments.length);
    return enrollments;
  }

  async enrollTeamInSelectedSessions(
    rosterId: string,
    sessionIds: string[],
    packageType: 'two-session' | 'pay-per-session'
  ): Promise<RosterSessionEnrollment[]> {
    const enrollments: RosterSessionEnrollment[] = [];

    for (const sessionId of sessionIds) {
      try {
        const enrollment = await this.enrollTeamInSession(
          rosterId,
          sessionId,
          packageType
        );
        enrollments.push(enrollment);
      } catch (error) {
        console.error('Failed to enroll team in session:', sessionId, error);
        // Continue with other sessions
      }
    }

    return enrollments;
  }

  // Business logic methods
  async getTeamSessionsWithDetails(rosterId: string): Promise<{
    enrollment: RosterSessionEnrollment;
    session: GameSession;
  }[]> {
    const enrollments = await this.getTeamEnrollments(rosterId);

    const sessionDetails = await Promise.all(
      enrollments.map(async (enrollment) => {
        const session = enrollment.session || await sessionService.getSessionById(enrollment.sessionId);
        return {
          enrollment,
          session: session!
        };
      })
    );

    return sessionDetails
      .filter(detail => detail.session)
      .sort((a, b) => a.session.sequence - b.session.sequence);
  }

  async getSessionTeamCount(sessionId: string): Promise<number> {
    const enrollments = await this.getSessionEnrollments(sessionId);
    return enrollments.length;
  }

  async getAvailableSpots(sessionId: string): Promise<number | null> {
    const session = await sessionService.getSessionById(sessionId);
    if (!session || !session.maxTeams) {
      return null; // No limit
    }

    const currentCount = await this.getSessionTeamCount(sessionId);
    return Math.max(0, session.maxTeams - currentCount);
  }

  async isSessionFull(sessionId: string): Promise<boolean> {
    const availableSpots = await this.getAvailableSpots(sessionId);
    return availableSpots === 0;
  }

  // Helper methods for package validation
  async validatePackageEnrollment(
    rosterId: string,
    sessionIds: string[],
    packageType: string
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validate package-specific rules
    switch (packageType) {
      case 'two-session':
        if (sessionIds.length !== 2) {
          errors.push('Two-session package requires exactly 2 sessions');
        }
        break;
      case 'pay-per-session':
        if (sessionIds.length === 0) {
          errors.push('Must select at least one session');
        }
        break;
    }

    // Check if sessions exist and are available
    for (const sessionId of sessionIds) {
      const session = await sessionService.getSessionById(sessionId);
      if (!session) {
        errors.push(`Session ${sessionId} not found`);
        continue;
      }

      if (!session.isActive) {
        errors.push(`Session ${session.name} is not active`);
      }

      const isFull = await this.isSessionFull(sessionId);
      if (isFull) {
        errors.push(`Session ${session.name} is full`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const sessionEnrollmentService = new SessionEnrollmentService();