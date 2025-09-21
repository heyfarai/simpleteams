// Team service - all team business logic, database agnostic
import type { Team } from "../domain/models";
import { teamRepository } from "../repositories/factory";

export class TeamService {
  async getAllTeams(): Promise<Team[]> {
    return teamRepository.findAll();
  }

  async getTeamById(id: string): Promise<Team | null> {
    return teamRepository.findById(id);
  }

  async getTeamsBySeason(seasonId: string): Promise<Team[]> {
    return teamRepository.findBySeason(seasonId);
  }

  async getTeamsByDivision(divisionId: string): Promise<Team[]> {
    return teamRepository.findByDivision(divisionId);
  }

  async getTeamsWithRosters(seasonId?: string): Promise<Team[]> {
    return teamRepository.findWithRosters(seasonId);
  }

  async searchTeams(query: string): Promise<Team[]> {
    return teamRepository.search(query);
  }

  // Business logic methods
  async getActiveTeams(): Promise<Team[]> {
    const allTeams = await this.getAllTeams();
    return allTeams.filter(team => team.status === "active");
  }

  async getTeamsByStatus(status: string): Promise<Team[]> {
    const allTeams = await this.getAllTeams();
    return allTeams.filter(team => team.status === status);
  }

  async getTopTeamsByWins(seasonId?: string, limit = 10): Promise<Team[]> {
    const teams = seasonId ?
      await this.getTeamsBySeason(seasonId) :
      await this.getAllTeams();

    return teams
      .filter(team => team.stats?.wins !== undefined)
      .sort((a, b) => (b.stats?.wins || 0) - (a.stats?.wins || 0))
      .slice(0, limit);
  }
}

// Export singleton instance
export const teamService = new TeamService();