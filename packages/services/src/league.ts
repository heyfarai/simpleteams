// Global League Service - Singleton API for league-wide operations
import { seasonRepository } from '@simpleteams/database';
import type { Season } from '@simpleteams/types';

class LeagueService {
  private currentSeasonCache: Season | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  async getCurrentSeason(): Promise<Season | null> {
    const now = Date.now();

    // Return cached if still valid
    if (this.currentSeasonCache && now < this.cacheExpiry) {
      return this.currentSeasonCache;
    }

    try {
      // Fetch fresh data
      this.currentSeasonCache = await seasonRepository.findCurrent();
      this.cacheExpiry = now + this.CACHE_DURATION;
    } catch (error) {
      console.error('[League] Failed to fetch current season:', error);
      // Return cached data if available, even if expired, as fallback
      if (this.currentSeasonCache) {
        return this.currentSeasonCache;
      }
      throw error;
    }

    return this.currentSeasonCache;
  }

  async getName(): Promise<string> {
    const season = await this.getCurrentSeason();
    return season?.name || 'No Active Season';
  }

  async getCurrentSeasonId(): Promise<string | null> {
    const season = await this.getCurrentSeason();
    return season?.id || null;
  }

  async getYear(): Promise<number | null> {
    const season = await this.getCurrentSeason();
    return season?.year || null;
  }

  async getStatus(): Promise<string | null> {
    const season = await this.getCurrentSeason();
    return season?.status || null;
  }

  async isActive(): Promise<boolean> {
    const season = await this.getCurrentSeason();
    return season?.isActive || false;
  }

  // Force refresh cache - useful when seasons change
  invalidateCache(): void {
    this.currentSeasonCache = null;
    this.cacheExpiry = 0;
  }

  // Check if cache is valid
  isCacheValid(): boolean {
    return this.currentSeasonCache !== null && Date.now() < this.cacheExpiry;
  }

  // Get cache info for debugging
  getCacheInfo() {
    return {
      cached: this.currentSeasonCache !== null,
      expiresAt: new Date(this.cacheExpiry).toISOString(),
      isValid: this.isCacheValid(),
      cachedSeason: this.currentSeasonCache?.name || null
    };
  }
}

// Export singleton instance
export const league = new LeagueService();