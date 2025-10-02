import { divisionRepository } from "@/lib/repositories/factory";
import type { Division } from "@/lib/domain/models";
import { SupabaseDivisionRepository } from "@/lib/repositories/supabase/supabase-division-repository";

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
    // Check if this is the Supabase repository with findByActiveSeason method
    if (divisionRepository instanceof SupabaseDivisionRepository) {
      return await divisionRepository.findByActiveSeason();
    }

    // Fallback: filter all divisions for active ones
    const allDivisions = await divisionRepository.findAll();
    return allDivisions.filter(division => division.isActive);
  }
}

export const divisionService = new DivisionService();