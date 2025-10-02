import { client } from "@/lib/sanity/client";
import type { PlayerRepository } from "../interfaces";
import type { Player, StatCategory } from "../../domain/models";
import {
  allPlayersQuery,
  playerDetailsQuery,
} from "../../sanity/player-queries";
import { SanityTransformer } from "./transformers";

export class SanityPlayerRepository implements PlayerRepository {
  private transformer = new SanityTransformer();

  async findAll(): Promise<Player[]> {
    try {
      const playersData = await client.fetch(allPlayersQuery);
      return playersData.map((data: any) => this.transformer.toPlayer(data));
    } catch (error) {
      console.error("Error fetching all players:", error);
      return [];
    }
  }

  async findById(id: string): Promise<Player | null> {
    try {
      const query = `
        *[_type == "player" && _id == $id][0] {
          _id,
          name,
          firstName,
          lastName,
          personalInfo,
          photo,
          stats,
          awards,
          bio,
          highlightVideos,
          "teamInfo": *[_type == "team" && references(^._id)][0] {
            _id,
            name,
            "roster": rosters[players[].player._ref match ^._id][0] {
              season-> {
                _id,
                name,
                year
              },
              "division": *[_type == "division" && conference->season._ref == ^.season._ref][0] {
                _id,
                name,
                ageGroup
              },
              "playerDetails": players[player._ref == ^._id][0] {
                jerseyNumber,
                position,
                status
              }
            }
          }
        }
      `;
      const playerData = await client.fetch(query, { id });
      return playerData ? this.transformer.toPlayer(playerData) : null;
    } catch (error) {
      console.error("Error fetching player by ID:", error);
      return null;
    }
  }

  async findBySeason(seasonId: string): Promise<Player[]> {
    try {
      if (seasonId === "all") {
        return this.findAll();
      }

      const query = `
        *[_type == "team" && count(rosters[season._ref == $seasonId]) > 0] {
          _id,
          name,
          "roster": rosters[season._ref == $seasonId][0] {
            season-> { _id, name, year },
            players[] {
              player-> {
                _id,
                name,
                firstName,
                lastName,
                personalInfo,
                photo,
                stats,
                awards,
                bio,
                highlightVideos
              },
              position,
              status,
              jerseyNumber
            }
          }
        }
      `;

      const teamsInSeason = await client.fetch(query, { seasonId });
      const players: Player[] = [];

      teamsInSeason.forEach((team: any) => {
        const roster = team.roster;
        roster?.players?.forEach((rosterPlayer: any) => {
          const player = rosterPlayer.player;
          if (player) {
            players.push(this.transformer.toPlayer({
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

  async findByTeam(teamId: string): Promise<Player[]> {
    try {
      const query = `
        *[_type == "team" && _id == $teamId][0] {
          _id,
          name,
          rosters[] {
            season-> { _id, name, year },
            "division": *[_type == "division" && conference->season._ref == ^.season._ref][0] {
              _id,
              name,
              ageGroup
            },
            players[] {
              player-> {
                _id,
                name,
                firstName,
                lastName,
                personalInfo,
                photo,
                stats,
                awards,
                bio,
                highlightVideos
              },
              position,
              status,
              jerseyNumber
            }
          }
        }
      `;

      const teamData = await client.fetch(query, { teamId });
      if (!teamData) return [];

      const players: Player[] = [];
      teamData.rosters?.forEach((roster: any) => {
        roster.players?.forEach((rosterPlayer: any) => {
          const player = rosterPlayer.player;
          if (player) {
            players.push(this.transformer.toPlayer({
              ...player,
              teamInfo: teamData,
              roster,
              playerDetails: rosterPlayer,
            }));
          }
        });
      });

      return players;
    } catch (error) {
      console.error("Error fetching players by team:", error);
      return [];
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
      const query = `
        *[_type == "player" && defined(stats) && stats.points > 0] | order(stats.points desc) {
          _id,
          name,
          firstName,
          lastName,
          personalInfo,
          photo,
          stats,
          awards,
          highlightVideos,
          "teamInfo": *[_type == "team" && references(^._id)][0] {
            _id,
            name,
            "roster": rosters[players[].player._ref match ^._id][0] {
              season->{ _id, name, year },
              "playerDetails": players[player._ref == ^._id][0] {
                jerseyNumber,
                position,
                status
              }
            }
          }
        }
      `;

      const players = await client.fetch(query);
      const topPlayers = players.slice(0, Math.min(20, players.length));

      const selectedPlayers = [];
      const selectedIndices = new Set<number>();

      while (selectedPlayers.length < count && selectedIndices.size < topPlayers.length) {
        const randomIndex = Math.floor(Math.random() * topPlayers.length);
        if (!selectedIndices.has(randomIndex)) {
          selectedIndices.add(randomIndex);
          selectedPlayers.push(this.transformer.toPlayer(topPlayers[randomIndex]));
        }
      }

      return selectedPlayers;
    } catch (error) {
      console.error("Error fetching featured players:", error);
      return [];
    }
  }

  async search(query: string): Promise<Player[]> {
    try {
      const searchQuery = `
        *[_type == "player" && (
          name match $searchTerm ||
          firstName match $searchTerm ||
          lastName match $searchTerm
        )] {
          _id,
          name,
          firstName,
          lastName,
          personalInfo,
          photo,
          stats,
          awards,
          bio,
          highlightVideos,
          "teamInfo": *[_type == "team" && references(^._id)][0] {
            _id,
            name,
            "roster": rosters[players[].player._ref match ^._id][0] {
              season-> {
                _id,
                name,
                year
              },
              "division": *[_type == "division" && conference->season._ref == ^.season._ref][0] {
                _id,
                name,
                ageGroup
              },
              "playerDetails": players[player._ref == ^._id][0] {
                jerseyNumber,
                position,
                status
              }
            }
          }
        }
      `;

      const players = await client.fetch(searchQuery, {
        searchTerm: `${query}*`
      });

      return players.map((data: any) => this.transformer.toPlayer(data));
    } catch (error) {
      console.error("Error searching players:", error);
      return [];
    }
  }

  private getStatValue(player: Player, category: StatCategory): number {
    return player.stats[category];
  }
}