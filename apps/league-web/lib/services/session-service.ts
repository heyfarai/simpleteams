import type { GameSession } from "../domain/models";
import { gameSessionRepository } from "../repositories/factory";

export class SessionService {
  async getAllSessions(): Promise<GameSession[]> {
    return gameSessionRepository.findAll();
  }

  async getSessionById(id: string): Promise<GameSession | null> {
    return gameSessionRepository.findById(id);
  }

  async getSessionsBySeason(seasonId: string): Promise<GameSession[]> {
    console.log('[DEBUG] SessionService.getSessionsBySeason called with:', seasonId);
    const sessions = await gameSessionRepository.findBySeason(seasonId);
    console.log('[DEBUG] SessionRepository returned:', sessions.length, 'sessions');
    return sessions;
  }

  async getActiveSessionsBySeason(seasonId: string): Promise<GameSession[]> {
    const allSessions = await this.getSessionsBySeason(seasonId);
    return allSessions.filter(session => session.isActive);
  }

  async getRegularSessions(seasonId: string): Promise<GameSession[]> {
    return gameSessionRepository.findBySeasonAndType(seasonId, 'regular');
  }

  async getPlayoffSessions(seasonId: string): Promise<GameSession[]> {
    return gameSessionRepository.findBySeasonAndType(seasonId, 'playoffs');
  }

  async getActiveSessions(): Promise<GameSession[]> {
    return gameSessionRepository.findActive();
  }

  // Business logic methods
  async getSessionOptions(seasonId?: string): Promise<Array<{ id: string; name: string; sequence: number; type: string }>> {
    let sessions: GameSession[];

    if (seasonId) {
      sessions = await this.getSessionsBySeason(seasonId);
    } else {
      sessions = await this.getActiveSessions();
    }

    return sessions
      .sort((a, b) => a.sequence - b.sequence)
      .map(session => ({
        id: session.id,
        name: session.name,
        sequence: session.sequence,
        type: session.type
      }));
  }

  async createSession(sessionData: {
    seasonId: string;
    name: string;
    sequence: number;
    startDate: string;
    endDate: string;
    type: 'regular' | 'playoffs';
    maxTeams?: number;
  }): Promise<GameSession> {
    return gameSessionRepository.create(sessionData);
  }

  async updateSession(id: string, updateData: {
    name?: string;
    sequence?: number;
    startDate?: string;
    endDate?: string;
    type?: 'regular' | 'playoffs';
    maxTeams?: number;
    isActive?: boolean;
  }): Promise<GameSession> {
    return gameSessionRepository.update(id, updateData);
  }

  async deleteSession(id: string): Promise<void> {
    return gameSessionRepository.delete(id);
  }

  // Utility methods for common session operations
  async getCurrentSession(seasonId: string): Promise<GameSession | null> {
    const now = new Date();
    const sessions = await this.getActiveSessions();

    // Find session where current date is between start and end date
    const currentSession = sessions.find(session => {
      const startDate = new Date(session.startDate);
      const endDate = new Date(session.endDate);
      return now >= startDate && now <= endDate;
    });

    return currentSession || null;
  }

  async getNextSession(seasonId: string): Promise<GameSession | null> {
    const now = new Date();
    const sessions = await this.getSessionsBySeason(seasonId);

    // Find the next session that hasn't started yet
    const upcomingSessions = sessions
      .filter(session => new Date(session.startDate) > now)
      .sort((a, b) => a.sequence - b.sequence);

    return upcomingSessions[0] || null;
  }
}

// Export singleton instance
export const sessionService = new SessionService();