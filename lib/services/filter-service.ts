// Filter service - all filter business logic, database agnostic
import type { FilterOptions } from "../domain/models";
import { filterRepository } from "../repositories/factory";

export class FilterService {
  async getFilterOptions(): Promise<FilterOptions> {
    return filterRepository.getFilterOptions();
  }

  // Business logic methods for common filter operations
  async getSeasonOptions(): Promise<Array<{ id: string; name: string; year: number }>> {
    const options = await this.getFilterOptions();
    return options.seasons.map(season => ({
      id: season.id,
      name: season.name,
      year: season.year
    }));
  }

  async getDivisionOptions(): Promise<Array<{ id: string; name: string }>> {
    const options = await this.getFilterOptions();
    return options.divisions.map(division => ({
      id: division.id,
      name: division.name
    }));
  }

  async getTeamOptions(): Promise<Array<{ id: string; name: string }>> {
    const options = await this.getFilterOptions();
    return options.teams.map(team => ({
      id: team.id,
      name: team.name
    }));
  }

  async getPositionOptions(): Promise<string[]> {
    const options = await this.getFilterOptions();
    return options.positions || ["PG", "SG", "SF", "PF", "C"];
  }
}

// Export singleton instance
export const filterService = new FilterService();