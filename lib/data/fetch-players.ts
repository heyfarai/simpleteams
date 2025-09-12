import { client, urlFor } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import {
  allPlayersQuery,
  allTeamsWithRostersQuery,
  playerDetailsQuery,
  filterOptionsQuery,
  leaderboardQueries,
  type StatCategory,
} from "@/lib/sanity/player-queries";

// Helper function to assign divisions to players based on team
const getDivisionForPlayer = (player: any, teamIndex: number): string => {
  const divisions = ["Premier", "Diggity", "Supreme", "Ascent", "Diamond"];
  // Distribute teams across divisions
  return divisions[teamIndex % divisions.length];
};
import {
  SanityTeam,
  SanityPlayer,
  PlayerWithTeamInfo,
  FilterOptions,
  SanityRosterPlayer,
} from "@/lib/sanity/types";

// Transform player data for the showcase component
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

// Fetch players filtered by season
export async function fetchPlayersBySeason(
  seasonId?: string
): Promise<ShowcasePlayer[]> {
  try {
    if (!seasonId || seasonId === "all") {
      // Return all players if no season filter
      return fetchAllPlayers();
    }

    // Get players for specific season
    const playersInSeasonQuery = groq`
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
              jerseyNumber,
              personalInfo,
              photo,
              stats,
              awards,
              bio,
              highlightVideos
            },
            position,
            status
          }
        }
      }
    `;

    const teamsInSeason = await client.fetch(playersInSeasonQuery, {
      seasonId,
    });

    // Transform to ShowcasePlayer format
    const showcasePlayers: ShowcasePlayer[] = [];

    teamsInSeason.forEach((team: any, teamIndex: number) => {
      const roster = team.roster;
      const season = roster?.season;

      roster?.players?.forEach((rosterPlayer: any) => {
        const player = rosterPlayer.player;
        if (!player) return;

        showcasePlayers.push({
          id: player._id,
          firstName: player.firstName || "Unknown",
          lastName: player.lastName || "Player",
          name:
            player.name ||
            `${player.firstName || "Unknown"} ${player.lastName || "Player"}`,
          team: team.name,
          teamId: team._id,
          jersey: player.jerseyNumber || 7,
          position: getPositionFullName(rosterPlayer.position || "PG"),
          gradYear:
            player.personalInfo?.gradYear || new Date().getFullYear() + 1,
          height: player.personalInfo?.height || "N/A",
          photo: player.photo
            ? urlFor(player.photo).width(400).height(400).url()
            : undefined,
          stats: {
            ppg: player.stats?.points || 0,
            rpg: player.stats?.rebounds || 0,
            apg: player.stats?.assists || 0,
            spg: player.stats?.steals || 0,
            bpg: player.stats?.blocks || 0,
            mpg: player.stats?.minutes || 0,
          },
          awards: player.awards || [],
          hasHighlight: (player.highlightVideos?.length || 0) > 0,
          division: getDivisionForPlayer(player, teamIndex), // Assign division based on team
          gamesPlayed: player.stats?.gamesPlayed || 0,
          year: season
            ? `${season.year}-${(season.year + 1).toString().slice(2)}`
            : "Unknown",
          season: season?.name || "Unknown",
          seasonId: season?._id || seasonId,
          hometown: player.personalInfo?.hometown || "Unknown",
        });
      });
    });

    return showcasePlayers;
  } catch (error) {
    console.error("Error fetching players by season:", error);
    return [];
  }
}

// Fetch all players from all teams
export async function fetchAllPlayers(): Promise<ShowcasePlayer[]> {
  try {
    // Simplified query to get players with their team info directly
    const playersWithTeamsQuery = groq`
      *[_type == "player"] {
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
            season->{
              _id,
              name,
              year
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

    const playersData = await client.fetch(playersWithTeamsQuery);

    // Transform players with their team info
    const showcasePlayers: ShowcasePlayer[] = playersData.map((player: any) => {
      const teamInfo = player.teamInfo;
      const roster = teamInfo?.roster;
      const season = roster?.season;
      const playerDetails = roster?.playerDetails;
      return {
        id: player._id,
        firstName: player.firstName || "Unknown",
        lastName: player.lastName || "Player",
        name:
          player.name ||
          `${player.firstName || "Unknown"} ${player.lastName || "Player"}`,
        team: teamInfo?.name || "Free Agent",
        teamId: teamInfo?._id || "unknown",
        jersey: playerDetails?.jerseyNumber || 7,
        position: getPositionFullName(playerDetails?.position || "PG"),
        gradYear: player.personalInfo?.gradYear || new Date().getFullYear() + 1,
        height: player.personalInfo?.height || "N/A",
        headshot: player.photo
          ? urlFor(player.photo).width(400).height(400).url()
          : undefined,
        stats: {
          ppg: player.stats?.points || 0,
          rpg: player.stats?.rebounds || 0,
          apg: player.stats?.assists || 0,
          spg: player.stats?.steals || 0,
          bpg: player.stats?.blocks || 0,
          mpg: player.stats?.minutes || 0,
        },
        awards: player.awards || [],
        hasHighlight: (player.highlightVideos?.length || 0) > 0,
        division: "Diamond", // TODO: Get actual division from team/season data
        gamesPlayed: player.stats?.gamesPlayed || 0,
        year: season
          ? `${season.year}-${(season.year + 1).toString().slice(2)}`
          : "Unknown",
        season: season?.name || "Unknown",
        seasonId: season?._id || "unknown",
        hometown: player.personalInfo?.hometown || "Unknown",
      };
    });

    return showcasePlayers;
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
}

// Fetch a specific player with full details
export async function fetchPlayerDetails(
  playerId: string
): Promise<PlayerWithTeamInfo | null> {
  try {
    const player = await client.fetch(playerDetailsQuery, { playerId });
    return player;
  } catch (error) {
    console.error("Error fetching player details:", error);
    return null;
  }
}

// Fetch stat leaders using optimized queries
export async function fetchStatLeaders(
  seasonId: string
): Promise<ShowcasePlayer[]> {
  try {
    // For now, return all players filtered by season ID
    // TODO: Add season filtering to the leaderboard queries
    const allPlayers = await fetchAllPlayers();
    if (seasonId === "all") {
      return allPlayers;
    }
    return allPlayers.filter((player) => player.seasonId === seasonId);
  } catch (error) {
    console.error("Error fetching stat leaders:", error);
    return [];
  }
}

// Fetch leaders for a specific stat category (optimized)
export async function fetchLeadersByCategory(
  category: StatCategory,
  seasonId?: string
): Promise<ShowcasePlayer[]> {
  try {
    // Get all players for the season (or all players if no season)
    const seasonPlayers = await fetchPlayersBySeason(seasonId);

    // Filter players with stats for this category and sort
    const statField = getStatField(category);
    const seasonLeadersWithStats = seasonPlayers
      .filter((player) => player.stats[statField] > 0)
      .sort((a, b) => b.stats[statField] - a.stats[statField])
      .slice(0, 10); // Top 10 leaders

    // If no leaders found in specific season, fall back to global leaders
    if (seasonLeadersWithStats.length === 0 && seasonId && seasonId !== "all") {
      const globalPlayers = await fetchPlayersBySeason(); // Get all players
      const globalLeadersWithStats = globalPlayers
        .filter((player) => player.stats[statField] > 0)
        .sort((a, b) => b.stats[statField] - a.stats[statField])
        .slice(0, 10);

      return globalLeadersWithStats;
    }

    return seasonLeadersWithStats;
  } catch (error) {
    console.error(`Error fetching ${category} leaders:`, error);
    return [];
  }
}

// Helper function to map stat categories to stat fields
function getStatField(category: StatCategory): keyof ShowcasePlayer["stats"] {
  switch (category) {
    case "ppg":
      return "ppg";
    case "rpg":
      return "rpg";
    case "apg":
      return "apg";
    case "spg":
      return "spg";
    case "bpg":
      return "bpg";
    case "mpg":
      return "mpg";
    default:
      return "ppg";
  }
}

// Fetch filter options for the showcase
export async function fetchFilterOptions(): Promise<FilterOptions> {
  try {
    const filterQuery = groq`{
      "seasons": *[_type == "season"] | order(year desc) {
        _id, name, year, status
      },
      "divisions": *[_type == "division"] {
        _id, name, ageGroup, skillLevel
      },
      "teams": *[_type == "team"] | order(name asc) {
        _id, name, shortName
      },
      "positions": ["PG", "SG", "SF", "PF", "C"]
    }`;

    const options = await client.fetch(filterQuery);

    return options;
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return {
      seasons: [],
      divisions: [],
      teams: [],
      positions: ["PG", "SG", "SF", "PF", "C"],
    };
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

// Fetch random featured players for spotlight
export async function fetchFeaturedPlayers(
  count: number = 4
): Promise<ShowcasePlayer[]> {
  try {
    // Get all players with their latest season stats
    const featuredPlayersQuery = groq`
      *[_type == "player" && defined(stats) && stats.points > 0] {
        _id,
        name,
        firstName,
        lastName,
        jerseyNumber,
        personalInfo,
        photo,
        stats,
        awards,
        highlightVideos,
        "teamInfo": *[_type == "team" && references(^._id)][0] {
          _id,
          name,
          "roster": rosters[players[].player._ref match ^._id][0] {
            season->{
              _id,
              name,
              year
            },
            "playerDetails": players[player._ref == ^._id][0] {
              jerseyNumber,
              position,
              status
            }
          }
        }
      } | order(stats.points desc)
    `;

    const players = await client.fetch(featuredPlayersQuery);

    // Randomly select 'count' players from the top performers
    const topPlayers = players.slice(0, Math.min(20, players.length)); // Get top 20 scorers
    const selectedPlayers = [];
    const selectedIndices = new Set<number>();

    while (
      selectedPlayers.length < count &&
      selectedIndices.size < topPlayers.length
    ) {
      const randomIndex = Math.floor(Math.random() * topPlayers.length);
      if (!selectedIndices.has(randomIndex)) {
        selectedIndices.add(randomIndex);
        const player = topPlayers[randomIndex];
        const teamInfo = player.teamInfo;
        const roster = teamInfo?.roster;
        const season = roster?.season;
        const playerDetails = roster?.playerDetails;
        selectedPlayers.push({
          id: player._id,
          firstName: player.firstName || "Unknown",
          lastName: player.lastName || "Player",
          name:
            player.name ||
            `${player.firstName || "Unknown"} ${player.lastName || "Player"}`,
          team: teamInfo?.name || "Free Agent",
          teamId: teamInfo?._id || "unknown",
          jersey: player.jerseyNumber || 0,
          position: getPositionFullName(playerDetails?.position || "PG"),
          gradYear:
            player.personalInfo?.gradYear || new Date().getFullYear() + 1,
          height: player.personalInfo?.height || "N/A",
          headshot: player.photo
            ? urlFor(player.photo).width(400).height(400).url()
            : undefined,
          stats: {
            ppg: player.stats?.points || 0,
            rpg: player.stats?.rebounds || 0,
            apg: player.stats?.assists || 0,
            spg: player.stats?.steals || 0,
            bpg: player.stats?.blocks || 0,
            mpg: player.stats?.minutes || 0,
          },
          awards: player.awards || [],
          hasHighlight: (player.highlightVideos?.length || 0) > 0,
          division: "Diamond", // TODO: Get actual division
          gamesPlayed: player.stats?.gamesPlayed || 0,
          year: season
            ? `${season.year}-${(season.year + 1).toString().slice(2)}`
            : "Unknown",
          season: season?.name || "Unknown",
          seasonId: season?._id || "unknown",
          hometown: player.personalInfo?.hometown || "Unknown",
        });
      }
    }

    return selectedPlayers;
  } catch (error) {
    console.error("Error fetching featured players:", error);
    return [];
  }
}
