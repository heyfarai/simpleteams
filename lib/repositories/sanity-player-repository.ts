import { client } from "@/lib/sanity/client";
import type {
  PlayerRepository,
  Player,
  StatCategory
} from "./player-repository";
import {
  playersInSeasonQuery,
  allPlayersWithDivisionQuery,
  featuredPlayersQuery,
} from "../data/player-queries";
import { transformPlayerData } from "../data/player-transformers";

// Sanity-specific implementation
export class SanityPlayerRepository implements PlayerRepository {
  async findAll(): Promise<Player[]> {
    try {
      const playersData = await client.fetch(allPlayersWithDivisionQuery);
      return playersData.map((player: any) => this.transformSanityPlayer(player));
    } catch (error) {
      console.error("Error fetching all players:", error);
      return [];
    }
  }

  async findBySeason(seasonId: string): Promise<Player[]> {
    try {
      if (seasonId === "all") {
        return this.findAll();
      }

      const teamsInSeason = await client.fetch(playersInSeasonQuery, { seasonId });
      const players: Player[] = [];

      teamsInSeason.forEach((team: any) => {
        const roster = team.roster;
        roster?.players?.forEach((rosterPlayer: any) => {
          const player = rosterPlayer.player;
          if (player) {
            players.push(this.transformSanityPlayer({
              ...player,
              teamInfo: team,
              roster,
              playerDetails: rosterPlayer,
            }));
          }
        });
      });

      return players;
    } catch (error) {
      console.error("Error fetching players by season:", error);
      return [];
    }
  }

  async findById(id: string): Promise<Player | null> {
    try {
      // Implementation for single player fetch
      const query = `*[_type == "player" && _id == $id][0] { /* player fields */ }`;
      const playerData = await client.fetch(query, { id });
      return playerData ? this.transformSanityPlayer(playerData) : null;
    } catch (error) {
      console.error("Error fetching player by ID:", error);
      return null;
    }
  }

  async findStatLeaders(seasonId?: string): Promise<Player[]> {
    if (seasonId === "all" || !seasonId) {
      return this.findAll();
    }
    return this.findBySeason(seasonId);
  }

  async findLeadersByCategory(category: StatCategory, seasonId?: string): Promise<Player[]> {
    const players = await this.findBySeason(seasonId || "all");

    return players
      .filter(player => this.getStatValue(player, category) > 0)
      .sort((a, b) => this.getStatValue(b, category) - this.getStatValue(a, category))
      .slice(0, 10);
  }

  async findFeatured(count: number = 4): Promise<Player[]> {
    try {
      const players = await client.fetch(featuredPlayersQuery);
      const topPlayers = players.slice(0, Math.min(20, players.length));

      // Random selection logic
      const selectedPlayers = [];
      const selectedIndices = new Set<number>();

      while (selectedPlayers.length < count && selectedIndices.size < topPlayers.length) {
        const randomIndex = Math.floor(Math.random() * topPlayers.length);
        if (!selectedIndices.has(randomIndex)) {
          selectedIndices.add(randomIndex);
          selectedPlayers.push(this.transformSanityPlayer(topPlayers[randomIndex]));
        }
      }

      return selectedPlayers;
    } catch (error) {
      console.error("Error fetching featured players:", error);
      return [];
    }
  }

  private transformSanityPlayer(sanityData: any): Player {
    const teamInfo = sanityData.teamInfo;
    const roster = teamInfo?.roster || sanityData.roster;
    const season = roster?.season;
    const division = roster?.division;
    const playerDetails = roster?.playerDetails || sanityData.playerDetails;

    return {
      id: sanityData._id,
      firstName: sanityData.firstName || "Unknown",
      lastName: sanityData.lastName || "Player",
      name: sanityData.name || `${sanityData.firstName || "Unknown"} ${sanityData.lastName || "Player"}`,
      team: {
        id: teamInfo?._id || "unknown",
        name: teamInfo?.name || "Free Agent",
      },
      jersey: playerDetails?.jerseyNumber || sanityData.jerseyNumber || 0,
      position: playerDetails?.position || "PG",
      gradYear: sanityData.personalInfo?.gradYear || new Date().getFullYear() + 1,
      height: sanityData.personalInfo?.height || "N/A",
      photo: sanityData.photo ? this.transformImageUrl(sanityData.photo) : undefined,
      stats: {
        ppg: sanityData.stats?.points || 0,
        rpg: sanityData.stats?.rebounds || 0,
        apg: sanityData.stats?.assists || 0,
        spg: sanityData.stats?.steals || 0,
        bpg: sanityData.stats?.blocks || 0,
        mpg: sanityData.stats?.minutes || 0,
      },
      awards: sanityData.awards || [],
      hasHighlight: (sanityData.highlightVideos?.length || 0) > 0,
      division: {
        id: division?._id || "unknown",
        name: division?.name || "Unknown",
        ageGroup: division?.ageGroup || "unknown",
      },
      gamesPlayed: sanityData.stats?.gamesPlayed || 0,
      season: {
        id: season?._id || "unknown",
        name: season?.name || "Unknown",
        year: season?.year || new Date().getFullYear(),
      },
      hometown: sanityData.personalInfo?.hometown || "Unknown",
    };
  }

  private getStatValue(player: Player, category: StatCategory): number {
    return player.stats[category];
  }

  private transformImageUrl(photo: any): string {
    // Import and use urlFor here, keeping Sanity-specific logic contained
    const { urlFor } = require("@/lib/sanity/client");
    return urlFor(photo).width(400).height(400).url();
  }
}