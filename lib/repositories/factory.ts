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

// Future implementations could be added here:
// import { PostgreSQLPlayerRepository } from "./postgresql/postgresql-player-repository";
// import { MongoPlayerRepository } from "./mongo/mongo-player-repository";

export class RepositoryFactory {
  private static instance: RepositoryFactory;
  private readonly dbType: string;

  private constructor() {
    this.dbType = process.env.DATABASE_TYPE || "sanity";
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
      // case "postgresql":
      //   return new PostgreSQLPlayerRepository();
      // case "mongodb":
      //   return new MongoPlayerRepository();
      default:
        return new SanityPlayerRepository();
    }
  }

  createTeamRepository(): TeamRepository {
    switch (this.dbType) {
      case "sanity":
        return new SanityTeamRepository();
      // case "postgresql":
      //   return new PostgreSQLTeamRepository();
      // case "mongodb":
      //   return new MongoTeamRepository();
      default:
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

export const playerRepository = factory.createPlayerRepository();
export const teamRepository = factory.createTeamRepository();
export const gameRepository = factory.createGameRepository();
export const seasonRepository = factory.createSeasonRepository();
export const divisionRepository = factory.createDivisionRepository();
export const filterRepository = factory.createFilterRepository();

// Export factory for testing and advanced use cases
export { factory as repositoryFactory };