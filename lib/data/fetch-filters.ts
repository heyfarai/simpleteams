// Database-agnostic filter data fetching using service layer
import { filterService } from "@/lib/services";
import { FilterOptions } from '@/lib/domain/models';

export async function fetchFilterData(): Promise<FilterOptions> {
  try {
    const result = await filterService.getFilterOptions();
    return result;
  } catch (error) {
    console.error('Error fetching filter data via service:', error);
    return {
      sessions: [],
      seasons: [],
      divisions: [],
      teams: [],
      positions: ["PG", "SG", "SF", "PF", "C"]
    };
  }
}