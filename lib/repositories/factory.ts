// Repository factory - single place to change database implementation
import type {
  PlayerRepository,
  TeamRepository,
  GameRepository,
  DivisionRepository,
  SeasonRepository,
  ConferenceRepository,
  FilterRepository,
  OfficialRepository,
  VenueRepository,
} from "./interfaces";

import { SanityPlayerRepository } from "./sanity/sanity-player-repository";
import { SanityTeamRepository } from "./sanity/sanity-team-repository";
import { SanityFilterRepository } from "./sanity/sanity-filter-repository";
import { SanityGameRepository } from "./sanity/sanity-game-repository";
import { SanitySeasonRepository } from "./sanity/sanity-season-repository";
import { SanityDivisionRepository } from "./sanity/sanity-division-repository";

// Supabase implementations
import { SupabaseTeamRepository } from "./supabase-team-repository";
import { SupabaseSeasonRepository } from "./supabase-season-repository";
import { SupabaseDivisionRepository } from "./supabase/supabase-division-repository";
import { SupabasePlayerRepository } from "./supabase-player-repository";

// Future implementations could be added here:
// import { PostgreSQLPlayerRepository } from "./postgresql/postgresql-player-repository";
// import { MongoPlayerRepository } from "./mongo/mongo-player-repository";

export class RepositoryFactory {
  private static instance: RepositoryFactory;
  private readonly dbType: string;

  private constructor() {
    const serverDbType = process.env.DATABASE_TYPE;
    const clientDbType = process.env.NEXT_PUBLIC_DATABASE_TYPE;
    this.dbType = serverDbType || clientDbType || "sanity";
    console.log('🏭 RepositoryFactory constructor - serverDbType:', serverDbType);
    console.log('🏭 RepositoryFactory constructor - clientDbType:', clientDbType);
    console.log('🏭 RepositoryFactory constructor - final dbType:', this.dbType);
  }

  static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  createPlayerRepository(): PlayerRepository {
    switch (this.dbType) {
      case "sanity":
        return new SanityPlayerRepository();
      case "supabase":
        return new SupabasePlayerRepository();
      // case "postgresql":
      //   return new PostgreSQLPlayerRepository();
      // case "mongodb":
      //   return new MongoPlayerRepository();
      default:
        return new SanityPlayerRepository();
    }
  }

  createTeamRepository(): TeamRepository {
    console.log('🏭 RepositoryFactory.createTeamRepository() - dbType:', this.dbType);
    switch (this.dbType) {
      case "sanity":
        console.log('🏭 Creating SanityTeamRepository');
        return new SanityTeamRepository();
      case "supabase":
        console.log('🏭 Creating SupabaseTeamRepository');
        return new SupabaseTeamRepository();
      // case "postgresql":
      //   return new PostgreSQLTeamRepository();
      // case "mongodb":
      //   return new MongoTeamRepository();
      default:
        console.log('🏭 Creating default SanityTeamRepository');
        return new SanityTeamRepository();
    }
  }

  createFilterRepository(): FilterRepository {
    switch (this.dbType) {
      case "sanity":
        return new SanityFilterRepository();
      // case "postgresql":
      //   return new PostgreSQLFilterRepository();
      // case "mongodb":
      //   return new MongoFilterRepository();
      default:
        return new SanityFilterRepository();
    }
  }

  createGameRepository(): GameRepository {
    switch (this.dbType) {
      case "sanity":
        return new SanityGameRepository();
      // case "postgresql":
      //   return new PostgreSQLGameRepository();
      // case "mongodb":
      //   return new MongoGameRepository();
      default:
        return new SanityGameRepository();
    }
  }

  createDivisionRepository(): DivisionRepository {
    switch (this.dbType) {
      case "sanity":
        return new SanityDivisionRepository();
      case "supabase":
        return new SupabaseDivisionRepository();
      // case "postgresql":
      //   return new PostgreSQLDivisionRepository();
      // case "mongodb":
      //   return new MongoDivisionRepository();
      default:
        return new SanityDivisionRepository();
    }
  }

  createSeasonRepository(): SeasonRepository {
    switch (this.dbType) {
      case "sanity":
        return new SanitySeasonRepository();
      case "supabase":
        return new SupabaseSeasonRepository();
      // case "postgresql":
      //   return new PostgreSQLSeasonRepository();
      // case "mongodb":
      //   return new MongoSeasonRepository();
      default:
        return new SanitySeasonRepository();
    }
  }

  createConferenceRepository(): ConferenceRepository {
    throw new Error("ConferenceRepository not implemented yet");
  }

  createOfficialRepository(): OfficialRepository {
    throw new Error("OfficialRepository not implemented yet");
  }

  createVenueRepository(): VenueRepository {
    throw new Error("VenueRepository not implemented yet");
  }
}

// Singleton instances for the app
const factory = RepositoryFactory.getInstance();

console.log('🏭 Creating singleton repository instances...');
export const playerRepository = factory.createPlayerRepository();
export const teamRepository = factory.createTeamRepository();
export const gameRepository = factory.createGameRepository();
export const seasonRepository = factory.createSeasonRepository();
export const divisionRepository = factory.createDivisionRepository();
export const filterRepository = factory.createFilterRepository();
console.log('🏭 Singleton repository instances created');

// Export factory for testing and advanced use cases
export { factory as repositoryFactory };
