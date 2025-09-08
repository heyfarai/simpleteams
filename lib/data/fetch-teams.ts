import { client } from "@/lib/sanity/client";
import { teamsQuery, teamDetailsQuery } from "@/lib/sanity/team-queries";
import { Team } from "@/lib/types/teams";

async function fetchWithRetry<T>(query: string, retries = 3, delay = 1000): Promise<T> {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await client.fetch<T>(query);
    } catch (error) {
      lastError = error;
      if (error instanceof Error && error.message.includes('authentication')) {
        throw new Error('Authentication failed. Please check your Sanity token.');
      }
      if (i < retries - 1) await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
  throw lastError;
}

export async function fetchTeams(): Promise<Team[]> {
  try {
    // Fetch seasons with divisions and team references
    const [seasons, teamDetails] = await Promise.all([
      fetchWithRetry(teamsQuery),
      fetchWithRetry(teamDetailsQuery)
    ]);

    if (!seasons || !Array.isArray(seasons) || !teamDetails || !Array.isArray(teamDetails)) {
      throw new Error('Invalid response format from Sanity');
    }

    // Create a map of team details for quick lookup
    const teamDetailsMap = new Map(teamDetails.map((team: any) => [team._id, team]));

    // Transform seasons data into teams with division info
    const teams: Team[] = [];

    seasons.forEach((season: any) => {
      season.activeDivisions?.forEach((activeDivision: any) => {
        if (activeDivision.status === 'active' && activeDivision.teams) {
          activeDivision.teams.forEach((teamRef: any) => {
            const teamDetail = teamDetailsMap.get(teamRef._ref);
            if (teamDetail) {
              teams.push({
                id: teamDetail._id,
                name: teamDetail.name,
                logo: teamDetail.logo,
                division: activeDivision.division ? {
                  _id: activeDivision.division._id,
                  name: activeDivision.division.name
                } : undefined,
                season: {
                  _id: season._id,
                  name: season.name,
                  year: season.year
                },
                coach: teamDetail.coach || "TBA",
                region: teamDetail.region || "Unknown",
                description: teamDetail.description,
                homeVenue: teamDetail.homeVenue || "TBA",
                awards: teamDetail.awards || [],
                stats: {
                  wins: teamDetail.stats?.wins || 0,
                  losses: teamDetail.stats?.losses || 0,
                  pointsFor: teamDetail.stats?.pointsFor || 0,
                  pointsAgainst: teamDetail.stats?.pointsAgainst || 0,
                  gamesPlayed: teamDetail.stats?.gamesPlayed || 0
                },
              });
            }
          });
        }
      });
    });

    return teams;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
}

export async function fetchTeamFilters() {
  try {
    const [seasons, awards] = await Promise.all([
      // Fetch seasons with their active divisions
      client.fetch(`*[_type == "season"] | order(year desc) {
        _id,
        name,
        year,
        activeDivisions[] {
          division-> {
            _id,
            name
          },
          status,
          teamLimits
        }
      }`),
      // Fetch all unique awards
      client.fetch('*[_type == "team"].awards[]'),
    ]);

    // Extract divisions from active divisions in seasons
    interface Season {
      _id: string;
      activeDivisions: Array<{
        division: {
          _id: string;
          name: string;
        };
        status: string;
        teamLimits?: {
          min: number;
          max: number;
        };
      }>;
    }

    const divisions = (seasons || []).flatMap((season: Season) => 
      (season.activeDivisions || [])
        .filter(div => div?.status === 'active' && div?.division)
        .map(div => ({
          _id: div.division._id,
          name: div.division.name,
          season: {
            _ref: season._id
          }
        }))
    );

    return {
      seasons,
      divisions,
      awards: Array.from(new Set(awards.flat())),
    };
  } catch (error) {
    console.error("Error fetching filters:", error);
    throw error;
  }
}
