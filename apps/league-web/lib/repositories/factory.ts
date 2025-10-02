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
  RegistrationRepository,
  PaymentRepository,
  GameSessionRepository,
  SessionEnrollmentRepository,
} from "./interfaces";

// Removed Sanity imports - using Supabase only

// Supabase implementations
import { SupabaseTeamRepository } from "./supabase-team-repository";
import { SupabaseSeasonRepository } from "./supabase-season-repository";
import { SupabaseDivisionRepository } from "./supabase/supabase-division-repository";
import { SupabasePlayerRepository } from "./supabase-player-repository";
import { SupabaseRegistrationRepository } from "./supabase-registration-repository";
import { SupabasePaymentRepository } from "./supabase-payment-repository";
import { SupabaseGameRepository } from "./supabase-game-repository";
import { SupabaseGameSessionRepository } from "./supabase-game-session-repository";
import { SupabaseSessionEnrollmentRepository } from "./supabase-session-enrollment-repository";

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
    switch (this.dbType) {
      case "supabase":
        return new SupabaseGameRepository();
      // case "postgresql":
      //   return new PostgreSQLGameRepository();
      // case "mongodb":
      //   return new MongoGameRepository();
      default:
        return new SupabaseGameRepository();
    }
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

  createRegistrationRepository(): RegistrationRepository {
    switch (this.dbType) {
      case "supabase":
        return new SupabaseRegistrationRepository();
      // case "postgresql":
      //   return new PostgreSQLRegistrationRepository();
      // case "mongodb":
      //   return new MongoRegistrationRepository();
      default:
        return new SupabaseRegistrationRepository();
    }
  }

  createPaymentRepository(): PaymentRepository {
    switch (this.dbType) {
      case "supabase":
        return new SupabasePaymentRepository();
      // case "postgresql":
      //   return new PostgreSQLPaymentRepository();
      // case "mongodb":
      //   return new MongoPaymentRepository();
      default:
        return new SupabasePaymentRepository();
    }
  }

  createGameSessionRepository(): GameSessionRepository {
    switch (this.dbType) {
      case "supabase":
        return new SupabaseGameSessionRepository();
      // case "postgresql":
      //   return new PostgreSQLGameSessionRepository();
      // case "mongodb":
      //   return new MongoGameSessionRepository();
      default:
        return new SupabaseGameSessionRepository();
    }
  }

  createSessionEnrollmentRepository(): SessionEnrollmentRepository {
    switch (this.dbType) {
      case "supabase":
        return new SupabaseSessionEnrollmentRepository();
      // case "postgresql":
      //   return new PostgreSQLSessionEnrollmentRepository();
      // case "mongodb":
      //   return new MongoSessionEnrollmentRepository();
      default:
        return new SupabaseSessionEnrollmentRepository();
    }
  }
}

// Singleton instances for the app
const factory = RepositoryFactory.getInstance();

console.log('🏭 Creating singleton repository instances...');
export const playerRepository = factory.createPlayerRepository();
export const teamRepository = factory.createTeamRepository();
export const seasonRepository = factory.createSeasonRepository();
export const divisionRepository = factory.createDivisionRepository();
export const registrationRepository = factory.createRegistrationRepository();
export const paymentRepository = factory.createPaymentRepository();
export const gameRepository = factory.createGameRepository();
export const gameSessionRepository = factory.createGameSessionRepository();
export const sessionEnrollmentRepository = factory.createSessionEnrollmentRepository();
// filterRepository not implemented for Supabase yet
console.log('🏭 Singleton repository instances created');

// Export factory for testing and advanced use cases
export { factory as repositoryFactory };
