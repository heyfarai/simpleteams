// Repository factory - dependency injection point
import type { PlayerRepository } from "./player-repository";
import { SanityPlayerRepository } from "./sanity-player-repository";

// Could easily swap to PostgreSQL, MongoDB, etc.
// export { PostgreSQLPlayerRepository } from "./postgresql-player-repository";
// export { MongoPlayerRepository } from "./mongo-player-repository";

// Factory function - single place to change database implementation
export function createPlayerRepository(): PlayerRepository {
  // Environment-based switching
  const dbType = process.env.DATABASE_TYPE || "sanity";

  switch (dbType) {
    case "sanity":
      return new SanityPlayerRepository();
    // case "postgresql":
    //   return new PostgreSQLPlayerRepository();
    // case "mongodb":
    //   return new MongoPlayerRepository();
    default:
      return new SanityPlayerRepository();
  }
}

// Singleton instance for the app
export const playerRepository = createPlayerRepository();