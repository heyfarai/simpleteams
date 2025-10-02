// Database-agnostic player profile data fetching using service layer
import { playerService } from "@/lib/services";
import type { Player as DomainPlayer } from "@/lib/domain/models";

// Legacy interface for backward compatibility
export interface PlayerProfile {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  personalInfo: {
    gradYear: number;
    height: string;
    weight?: number;
    hometown: string;
    position: string;
  };
  photo?: {
    asset: {
      _ref: string;
    };
  };
  stats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    minutes: number;
    fieldGoalPercentage: number;
    gamesPlayed: number;
  };
  yearlyStats?: Array<{
    year: number;
    season: string;
    gamesPlayed: number;
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    minutes: number;
    fieldGoalPercentage: number;
  }>;
  sessionHighs?: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    minutes: number;
  };
  bio?: string;
  highlightVideos?: Array<{
    title: string;
    url: string;
    thumbnail?: string;
  }>;
  awards?: string[];
  social?: {
    instagram?: string;
    twitter?: string;
    hudl?: string;
  };
  team?: {
    _id: string;
    name: string;
    division: string;
    coach?: string;
    record?: string;
    logo?: string;
  };
}

// Transform domain model Player to legacy PlayerProfile interface
function transformToPlayerProfile(domainPlayer: DomainPlayer): PlayerProfile {
  return {
    _id: domainPlayer.id,
    name: domainPlayer.name,
    firstName: domainPlayer.firstName,
    lastName: domainPlayer.lastName,
    personalInfo: {
      gradYear: domainPlayer.gradYear,
      height: domainPlayer.height || "",
      weight: undefined, // Domain model doesn't have weight yet
      hometown: domainPlayer.hometown,
      position: domainPlayer.position,
    },
    photo: domainPlayer.photo ? {
      asset: {
        _ref: domainPlayer.photo, // Simplified for now
      }
    } : undefined,
    stats: {
      points: domainPlayer.stats.ppg,
      rebounds: domainPlayer.stats.rpg,
      assists: domainPlayer.stats.apg,
      steals: domainPlayer.stats.spg,
      blocks: domainPlayer.stats.bpg,
      minutes: domainPlayer.stats.mpg,
      fieldGoalPercentage: 0, // Domain model doesn't have FG% yet
      gamesPlayed: domainPlayer.gamesPlayed,
    },
    yearlyStats: undefined, // TODO: Implement yearly stats in domain model
    sessionHighs: undefined, // TODO: Implement session highs in domain model
    bio: undefined, // Domain model doesn't have bio yet
    highlightVideos: undefined, // TODO: Implement highlight videos in domain model
    awards: domainPlayer.awards,
    social: undefined, // Domain model doesn't have social yet
    team: {
      _id: domainPlayer.team.id,
      name: domainPlayer.team.name,
      division: domainPlayer.division.name,
      coach: domainPlayer.team.headCoach,
      record: undefined, // TODO: Calculate team record
      logo: domainPlayer.team.logo,
    },
  };
}

// Database-agnostic function using service layer
export async function fetchPlayerProfile(
  playerId: string
): Promise<PlayerProfile | null> {
  try {
    const player = await playerService.getPlayer(playerId);

    if (!player) return null;

    return transformToPlayerProfile(player);
  } catch (error) {
    console.error("Error fetching player profile:", error);
    return null;
  }
}