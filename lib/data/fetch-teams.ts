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
  divisions: SanityDivisionInfo[];
}

interface SanityTeam {
  _id: string;
  name: string;
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
}

interface SanityResponse {
  teams: SanityTeam[];
  seasons: SanitySeason[];
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

    // Find the specified season or default to most recent
    const activeSeason = seasonId 
      ? seasons.find(s => s._id === seasonId)
      : seasons[0];
    if (!activeSeason) {
      return teams.map((team) => ({
        ...team,
        id: team._id,
        division: undefined,
        season: undefined,
        coach: team.coach || "TBA",
        region: team.region || "Unknown",
        homeVenue: team.homeVenue || "TBA",
        awards: team.awards || [],
        stats: {
          wins: team.stats?.wins || 0,
          losses: team.stats?.losses || 0,
          pointsFor: team.stats?.pointsFor || 0,
          pointsAgainst: team.stats?.pointsAgainst || 0,
          gamesPlayed: team.stats?.gamesPlayed || 0,
        },
      }));
    }

    // Create a map of team divisions
    const teamDivisions = new Map<string, { _id: string; name: string }>();
    activeSeason.divisions.forEach((div) => {
      div.teamRefs.forEach((teamRef) => {
        teamDivisions.set(teamRef, {
          _id: div.division._id,
          name: div.division.name,
        });
      });
    });

    // Get list of team IDs in active season
    const activeTeamIds = new Set<string>();
    activeSeason.divisions.forEach((div) => {
      div.teamRefs.forEach((teamRef) => {
        activeTeamIds.add(teamRef);
      });
    });

    // Transform only teams that are in the active season
    return teams
      .filter((team) => activeTeamIds.has(team._id))
      .map((team) => ({
        ...team,
        id: team._id,
        division: teamDivisions.get(team._id),
        season: {
          _id: activeSeason._id,
          name: activeSeason.name,
          year: activeSeason.year,
        },
        coach: team.coach || "TBA",
        region: team.region || "Unknown",
        homeVenue: team.homeVenue || "TBA",
        awards: team.awards || [],
        stats: {
          wins: team.stats?.wins || 0,
          losses: team.stats?.losses || 0,
          pointsFor: team.stats?.pointsFor || 0,
          pointsAgainst: team.stats?.pointsAgainst || 0,
          gamesPlayed: team.stats?.gamesPlayed || 0,
        },
      }));
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
}

export async function fetchTeamDetails(teamId: string) {
  try {
    const team = await client.fetch(`*[_type == "team" && _id == $teamId][0] {
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
        }
      }
    }`, { teamId });

    if (!team) {
      throw new Error(`Team not found: ${teamId}`);
    }

    return {
      ...team,
      id: team._id,
      rosters: team.rosters || [],
      stats: {
        wins: team.stats?.wins || 0,
        losses: team.stats?.losses || 0,
        pointsFor: team.stats?.pointsFor || 0,
        pointsAgainst: team.stats?.pointsAgainst || 0,
        gamesPlayed: team.stats?.gamesPlayed || 0,
      }
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
      activeDivisions: season.divisions?.map((div: any) => ({
        division: {
          _id: div.division._id,
          name: div.division.name,
        },
        status: 'active'
      })) || []
    }));

    // Get divisions from all seasons for filter options
    const allDivisions = seasonsData.flatMap((season: any) => 
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
