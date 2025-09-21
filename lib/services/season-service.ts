// Season service - all season business logic, database agnostic
import type { Season } from "../domain/models";
import { seasonRepository } from "../repositories/factory";

export class SeasonService {
  async getAllSeasons(): Promise<Season[]> {
    return seasonRepository.findAll();
  }

  async getSeasonById(id: string): Promise<Season | null> {
    return seasonRepository.findById(id);
  }

  async getActiveSeasons(): Promise<Season[]> {
    return seasonRepository.findActive();
  }

  async getCompletedSeasons(): Promise<Season[]> {
    return seasonRepository.findCompleted();
  }

  async getCurrentSeason(): Promise<Season | null> {
    return seasonRepository.findCurrent();
  }

  // Business logic methods
  async getRecentSeasons(limit = 5): Promise<Season[]> {
    const allSeasons = await this.getAllSeasons();
    return allSeasons.slice(0, limit);
  }

  async getSeasonOptions(): Promise<Array<{ id: string; name: string; year: number }>> {
    const seasons = await this.getAllSeasons();
    return seasons.map(season => ({
      id: season.id,
      name: season.name,
      year: season.year
    }));
  }
}

// Export singleton instance
export const seasonService = new SeasonService();