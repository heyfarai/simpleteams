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

// Removed Sanity imports - using Supabase only

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
    this.dbType = serverDbType || clientDbType || "supabase";
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
      case "supabase":
        return new SupabasePlayerRepository();
      // case "postgresql":
      //   return new PostgreSQLPlayerRepository();
      // case "mongodb":
      //   return new MongoPlayerRepository();
      default:
        return new SupabasePlayerRepository();
    }
  }

  createTeamRepository(): TeamRepository {
    console.log('🏭 RepositoryFactory.createTeamRepository() - dbType:', this.dbType);
    switch (this.dbType) {
      case "supabase":
        console.log('🏭 Creating SupabaseTeamRepository');
        return new SupabaseTeamRepository();
      // case "postgresql":
      //   return new PostgreSQLTeamRepository();
      // case "mongodb":
      //   return new MongoTeamRepository();
      default:
        console.log('🏭 Creating default SupabaseTeamRepository');
        return new SupabaseTeamRepository();
    }
  }

  createFilterRepository(): FilterRepository {
    throw new Error("FilterRepository not implemented for Supabase yet");
  }

  createGameRepository(): GameRepository {
    throw new Error("GameRepository not implemented for Supabase yet");
  }

  createDivisionRepository(): DivisionRepository {
    switch (this.dbType) {
      case "supabase":
        return new SupabaseDivisionRepository();
      // case "postgresql":
      //   return new PostgreSQLDivisionRepository();
      // case "mongodb":
      //   return new MongoDivisionRepository();
      default:
        return new SupabaseDivisionRepository();
    }
  }

  createSeasonRepository(): SeasonRepository {
    switch (this.dbType) {
      case "supabase":
        return new SupabaseSeasonRepository();
      // case "postgresql":
      //   return new PostgreSQLSeasonRepository();
      // case "mongodb":
      //   return new MongoSeasonRepository();
      default:
        return new SupabaseSeasonRepository();
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
export const seasonRepository = factory.createSeasonRepository();
export const divisionRepository = factory.createDivisionRepository();
// gameRepository and filterRepository not implemented for Supabase yet
console.log('🏭 Singleton repository instances created');

// Export factory for testing and advanced use cases
export { factory as repositoryFactory };
