import { divisionRepository } from "@/lib/repositories/factory";
import type { Division } from "@/lib/types";

export class DivisionService {
  async getAllDivisions(): Promise<Division[]> {
    return await divisionRepository.findAll();
  }

  async getDivisionById(id: string): Promise<Division | null> {
    return await divisionRepository.findById(id);
  }

  async getDivisionsBySeason(seasonId: string): Promise<Division[]> {
    return await divisionRepository.findBySeason(seasonId);
  }

  async getActiveDivisions(): Promise<Division[]> {
    // Check if Supabase repository has findByActiveSeason method
    if ('findByActiveSeason' in divisionRepository) {
      return await (divisionRepository as any).findByActiveSeason();
    }

    // Fallback to all divisions if not available
    return await divisionRepository.findAll();
  }
}

export const divisionService = new DivisionService();