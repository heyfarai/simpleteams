// Database-agnostic player data fetching using service layer
import { playerService, filterService } from "@/lib/services";
import type { Player, StatCategory, FilterOptions } from "@/lib/domain/models";

// Legacy interface for backward compatibility - transforms domain models to component expectations
export interface ShowcasePlayer {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  team: string;
  teamId: string;
  jersey: number;
  position: string;
  gradYear: number;
  height?: string;
  photo?: string;
  stats: {
    ppg: number;
    rpg: number;
    apg: number;
    spg: number;
    bpg: number;
    mpg: number;
  };
  awards: string[];
  hasHighlight: boolean;
  division: string;
  gamesPlayed: number;
  year: string;
  season: string;
  seasonId: string;
  hometown: string;
}

// Transform domain model Player to ShowcasePlayer for backward compatibility
function transformToShowcasePlayer(player: Player): ShowcasePlayer {
  return {
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    name: player.name,
    team: player.team.name,
    teamId: player.team.id,
    jersey: player.jersey,
    position: getPositionFullName(player.position),
    gradYear: player.gradYear,
    height: player.height || "N/A",
    photo: player.photo,
    stats: {
      ppg: player.stats.ppg,
      rpg: player.stats.rpg,
      apg: player.stats.apg,
      spg: player.stats.spg,
      bpg: player.stats.bpg,
      mpg: player.stats.mpg,
    },
    awards: player.awards,
    hasHighlight: player.hasHighlight,
    division: player.division.name,
    gamesPlayed: player.gamesPlayed,
    year: `${player.season.year}-${(player.season.year + 1).toString().slice(2)}`,
    season: player.season.name,
    seasonId: player.season.id,
    hometown: player.hometown,
  };
}

// Database-agnostic functions using service layer

export async function fetchPlayersBySeason(seasonId?: string): Promise<ShowcasePlayer[]> {
  try {
    const players = await playerService.getPlayersBySeason(seasonId);
    return players.map(transformToShowcasePlayer);
  } catch (error) {
    console.error("Error fetching players by season:", error);
    return [];
  }
}

export async function fetchAllPlayers(): Promise<ShowcasePlayer[]> {
  try {
    const players = await playerService.getAllPlayers();
    return players.map(transformToShowcasePlayer);
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
}

export async function fetchPlayerDetails(playerId: string): Promise<Player | null> {
  try {
    return await playerService.getPlayer(playerId);
  } catch (error) {
    console.error("Error fetching player details:", error);
    return null;
  }
}

export async function fetchStatLeaders(seasonId: string): Promise<ShowcasePlayer[]> {
  try {
    const players = await playerService.getStatLeaders(seasonId);
    return players.map(transformToShowcasePlayer);
  } catch (error) {
    console.error("Error fetching stat leaders:", error);
    return [];
  }
}

export async function fetchLeadersByCategory(
  category: StatCategory,
  seasonId?: string
): Promise<ShowcasePlayer[]> {
  try {
    const players = await playerService.getLeadersByCategory(category, seasonId);
    return players.map(transformToShowcasePlayer);
  } catch (error) {
    console.error(`Error fetching ${category} leaders:`, error);
    return [];
  }
}

export async function fetchFilterOptions(): Promise<FilterOptions> {
  try {
    return await filterService.getFilterOptions();
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return {
      seasons: [],
      divisions: [],
      teams: [],
      positions: ["PG", "SG", "SF", "PF", "C"],
      sessions: [],
    };
  }
}

export async function fetchFeaturedPlayers(count: number = 4): Promise<ShowcasePlayer[]> {
  try {
    const players = await playerService.getFeaturedPlayers(count);
    return players.map(transformToShowcasePlayer);
  } catch (error) {
    console.error("Error fetching featured players:", error);
    return [];
  }
}

// Helper function to convert position abbreviations to full names
function getPositionFullName(position: string): string {
  const positionMap: Record<string, string> = {
    PG: "Point Guard",
    SG: "Shooting Guard",
    SF: "Small Forward",
    PF: "Power Forward",
    C: "Center",
  };
  return positionMap[position] || position;
}

// Helper function to get position abbreviation from full name
export function getPositionAbbreviation(position: string): string {
  const positionMap: Record<string, string> = {
    "Point Guard": "PG",
    "Shooting Guard": "SG",
    "Small Forward": "SF",
    "Power Forward": "PF",
    Center: "C",
  };
  return positionMap[position] || position;
}