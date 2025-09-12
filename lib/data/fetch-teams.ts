import { client } from "@/lib/sanity/client";
import { teamsQuery, teamDetailsQuery } from "@/lib/sanity/team-queries";
import { Team } from "@/lib/types/teams";

async function fetchWithRetry<T>(
  query: string,
  retries = 3,
  delay = 1000
): Promise<T> {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await client.fetch<T>(query);
    } catch (error) {
      lastError = error;
      if (error instanceof Error && error.message.includes("authentication")) {
        throw new Error(
          "Authentication failed. Please check your Sanity token."
        );
      }
      if (i < retries - 1)
        await new Promise((r) => setTimeout(r, delay * (i + 1)));
    }
  }
  throw lastError;
}

interface SanityDivisionInfo {
  division: {
    _id: string;
    name: string;
  };
  teamRefs: string[];
}

interface SanitySeason {
  _id: string;
  name: string;
  year: number;
  isActive?: boolean;
  divisions: SanityDivisionInfo[];
}

interface SanityRoster {
  season: {
    _id: string;
    name: string;
    year: number;
  };
  players?: Array<{
    player: {
      _id: string;
      name: string;
    };
    jerseyNumber: number;
    position: string;
    status: 'active' | 'inactive' | 'injured';
  }>;
  seasonStats?: {
    wins?: number;
    losses?: number;
    ties?: number;
    pointsFor?: number;
    pointsAgainst?: number;
    gamesPlayed?: number;
  };
}

interface SanityTeam {
  _id: string;
  name: string;
  shortName?: string;
  logo?: string;
  coach?: string;
  region?: string;
  description?: string;
  homeVenue?: string;
  awards?: string[];
  stats?: {
    wins?: number;
    losses?: number;
    pointsFor?: number;
    pointsAgainst?: number;
    gamesPlayed?: number;
  };
  divisions?: Array<{
    season: {
      _id: string;
      name: string;
      year: number;
    };
    division: {
      _id: string;
      name: string;
    };
  }>;
  rosters?: Array<{
    season: {
      _id: string;
      name: string;
      year: number;
    };
    seasonStats?: {
      wins?: number;
      losses?: number;
      ties?: number;
      pointsFor?: number;
      pointsAgainst?: number;
      homeRecord?: string;
      awayRecord?: string;
      conferenceRecord?: string;
    };
  }>;
}

interface SanityResponse {
  teams: SanityTeam[];
  seasons: SanitySeason[];
}

interface SanityAllTeamsResponse {
  teams: SanityTeam[];
}

export async function fetchAllTeams(): Promise<Team[]> {
  try {
    const allTeamsQuery = `{
      "teams": *[_type == "team"] {
        _id,
        name,
        shortName,
        logo,
        coach,
        region,
        description,
        homeVenue,
        awards,
        stats,
        "divisions": *[_type == "seasonDivision" && references(^._id)]{
          "season": season->{
            _id,
            name,
            year
          },
          "division": division->{
            _id,
            name
          }
        },
        rosters[] {
          "season": season->{
            _id,
            name,
            year
          },
          seasonStats {
            wins,
            losses,
            ties,
            pointsFor,
            pointsAgainst,
            homeRecord,
            awayRecord,
            conferenceRecord
          }
        }
      }
    }`;

    const data = await fetchWithRetry<SanityAllTeamsResponse>(allTeamsQuery);

    if (!data?.teams || !Array.isArray(data.teams)) {
      throw new Error("Invalid response format from Sanity");
    }

    const { teams } = data;

    // Transform all teams without season filtering
    return teams.map((team) => {
      // Get the most recent roster for stats
      const mostRecentRoster = team.rosters?.sort(
        (a, b) => b.season.year - a.season.year
      )[0];

      const hasStats = Boolean(
        mostRecentRoster?.seasonStats?.wins !== null &&
          mostRecentRoster?.seasonStats?.wins !== undefined &&
          mostRecentRoster?.seasonStats?.losses !== null &&
          mostRecentRoster?.seasonStats?.losses !== undefined
      );

      // Get the most recent division info
      const mostRecentDivision = team.divisions?.sort(
        (a, b) => b.season.year - a.season.year
      )[0];

      return {
        ...team,
        id: team._id,
        division: mostRecentDivision?.division,
        season: mostRecentDivision?.season || {
          _id: "",
          name: "No Season",
          year: 0,
        },
        coach: team.coach || "TBA",
        region: team.region || "Unknown",
        homeVenue: team.homeVenue || "TBA",
        awards: team.awards || [],
        rosters: (team.rosters ?? []).map((roster) => ({
          season: roster.season,
          seasonStats: roster.seasonStats
            ? {
                wins: roster.seasonStats.wins ?? 0,
                losses: roster.seasonStats.losses ?? 0,
                ties: roster.seasonStats.ties ?? 0,
                pointsFor: roster.seasonStats.pointsFor ?? 0,
                pointsAgainst: roster.seasonStats.pointsAgainst ?? 0,
                gamesPlayed:
                  (roster.seasonStats.wins ?? 0) +
                  (roster.seasonStats.losses ?? 0) +
                  (roster.seasonStats.ties ?? 0),
              }
            : undefined,
        })),
        stats:
          hasStats && mostRecentRoster?.seasonStats
            ? {
                wins: mostRecentRoster.seasonStats.wins ?? 0,
                losses: mostRecentRoster.seasonStats.losses ?? 0,
                pointsFor: mostRecentRoster.seasonStats.pointsFor ?? 0,
                pointsAgainst: mostRecentRoster.seasonStats.pointsAgainst ?? 0,
                gamesPlayed:
                  (mostRecentRoster.seasonStats.wins ?? 0) +
                  (mostRecentRoster.seasonStats.losses ?? 0) +
                  (mostRecentRoster.seasonStats.ties ?? 0),
              }
            : {
                wins: 0,
                losses: 0,
                pointsFor: 0,
                pointsAgainst: 0,
                gamesPlayed: 0,
              },
        showStats: hasStats,
      };
    });
  } catch (error) {
    console.error("Error fetching all teams:", error);
    throw error;
  }
}

export async function fetchTeams(seasonId?: string): Promise<Team[]> {
  try {
    const data = await fetchWithRetry<SanityResponse>(teamsQuery);
    if (
      !data?.teams ||
      !Array.isArray(data.teams) ||
      !data?.seasons ||
      !Array.isArray(data.seasons)
    ) {
      throw new Error("Invalid response format from Sanity");
    }

    const { teams, seasons } = data;

    // Find the specified season or default to the first active season
    let targetSeason = seasonId
      ? seasons.find((s) => s._id === seasonId)
      : seasons.find((s) => s.isActive) || seasons[0];

    if (!targetSeason) {
      return [];
    }

    // Get all team IDs that are in divisions of the target season
    const seasonTeamIds = new Set<string>();
    const teamDivisions = new Map<string, { _id: string; name: string }>();
    
    targetSeason.divisions.forEach((div) => {
      div.teamRefs.forEach((teamRef) => {
        seasonTeamIds.add(teamRef);
        teamDivisions.set(teamRef, div.division);
      });
    });

    // Filter and transform teams that are in the target season
    return teams
      .filter((team) => seasonTeamIds.has(team._id))
      .map((team) => {
        // Find roster for target season
        const activeRoster = team.rosters?.find(
          (r) => r.season._id === targetSeason._id
        );

        // Find the division for this team in the target season
        const teamDivision = targetSeason.divisions.find(div => 
          div.teamRefs.includes(team._id)
        )?.division;

        const hasStats = Boolean(
          activeRoster?.seasonStats?.wins !== null &&
            activeRoster?.seasonStats?.wins !== undefined &&
            activeRoster?.seasonStats?.losses !== null &&
            activeRoster?.seasonStats?.losses !== undefined
        );

        return {
          ...team,
          id: team._id,
          division: teamDivisions.get(team._id),
          season: {
            _id: targetSeason._id,
            name: targetSeason.name,
            year: targetSeason.year,
          },
          coach: team.coach || "TBA",
          region: team.region || "Unknown",
          homeVenue: team.homeVenue || "TBA",
          awards: team.awards || [],
          rosters: (team.rosters ?? []).map((roster) => ({
            season: roster.season,
            seasonStats: roster.seasonStats
              ? {
                  wins: roster.seasonStats.wins ?? 0,
                  losses: roster.seasonStats.losses ?? 0,
                  ties: roster.seasonStats.ties ?? 0,
                  pointsFor: roster.seasonStats.pointsFor ?? 0,
                  pointsAgainst: roster.seasonStats.pointsAgainst ?? 0,
                  gamesPlayed:
                    (roster.seasonStats.wins ?? 0) +
                    (roster.seasonStats.losses ?? 0) +
                    (roster.seasonStats.ties ?? 0),
                }
              : undefined,
          })),
          stats:
            hasStats && activeRoster?.seasonStats
              ? {
                  wins: activeRoster.seasonStats.wins ?? 0,
                  losses: activeRoster.seasonStats.losses ?? 0,
                  pointsFor: activeRoster.seasonStats.pointsFor ?? 0,
                  pointsAgainst: activeRoster.seasonStats.pointsAgainst ?? 0,
                  gamesPlayed:
                    (activeRoster.seasonStats.wins ?? 0) +
                    (activeRoster.seasonStats.losses ?? 0) +
                    (activeRoster.seasonStats.ties ?? 0),
                }
              : {
                  wins: 0,
                  losses: 0,
                  pointsFor: 0,
                  pointsAgainst: 0,
                  gamesPlayed: 0,
                },
          showStats: hasStats,
        };
      });
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
}

export async function fetchTeamDetails(teamId: string) {
  try {
    const team = await client.fetch<SanityTeam & { rosters?: SanityRoster[] }>(
      `*[_type == "team" && _id == $teamId][0] {
      _id,
      name,
      "logo": logo.asset._ref,
      coach,
      region,
      description,
      homeVenue,
      awards,
      stats,
      rosters[] {
        "season": season->{
          _id,
          name,
          year
        },
        players[] {
          "player": player->{
            _id,
            name
          },
          jerseyNumber,
          position,
          status
        },
        seasonStats {
          wins,
          losses,
          ties,
          pointsFor,
          pointsAgainst,
          gamesPlayed
        }
      }
    }`,
      { teamId }
    );

    if (!team) {
      throw new Error(`Team not found: ${teamId}`);
    }

    return {
      ...team,
      id: team._id,
      rosters: (team.rosters || []).map((roster: SanityRoster) => {
        if (!roster.season || !roster.players) {
          console.warn(`Invalid roster data for team ${teamId}:`, roster);
          return null;
        }
        return {
          season: roster.season,
          players: roster.players.map(player => ({
            player: player.player,
            jerseyNumber: player.jerseyNumber,
            position: player.position,
            status: player.status
          })),
          seasonStats: roster.seasonStats || {
            wins: 0,
            losses: 0,
            ties: 0,
            pointsFor: 0,
            pointsAgainst: 0,
            gamesPlayed: 0
          }
        };
      }).filter((roster): roster is NonNullable<typeof roster> => roster !== null),
      stats: {
        wins: team.stats?.wins || 0,
        losses: team.stats?.losses || 0,
        pointsFor: team.stats?.pointsFor || 0,
        pointsAgainst: team.stats?.pointsAgainst || 0,
        gamesPlayed: team.stats?.gamesPlayed || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching team details:", error);
    throw error;
  }
}

export async function fetchTeamFilters() {
  try {
    const [seasonsData, awards] = await Promise.all([
      // Fetch seasons with their active divisions
      client.fetch(`*[_type == "season"] | order(year desc) {
        _id,
        name,
        year,
        isActive,
        "divisions": activeDivisions[status == "active" && defined(teams) && count(teams) > 0]{
          "division": division->{
            _id,
            name
          }
        }
      }`),
      // Fetch all unique awards
      client.fetch('*[_type == "team"].awards[]'),
    ]);

    // Transform seasons to include divisions properly
    const seasons = seasonsData.map((season: any) => ({
      _id: season._id,
      name: season.name,
      year: season.year,
      isActive: season.isActive || false,
      activeDivisions:
        season.divisions?.map((div: any) => ({
          division: {
            _id: div.division._id,
            name: div.division.name,
          },
          status: "active",
        })) || [],
    }));

    // Get divisions from all seasons for filter options
    const allDivisions = seasonsData.flatMap(
      (season: any) =>
        season.divisions?.map((div: any) => ({
          _id: div.division._id,
          name: div.division.name,
          season: {
            _ref: season._id,
          },
        })) || []
    );

    return {
      seasons,
      divisions: allDivisions,
      awards: Array.from(new Set(awards.flat())),
    };
  } catch (error) {
    console.error("Error fetching filters:", error);
    throw error;
  }
}
