import { client } from "@/lib/sanity/client";
import { teamsQuery } from "@/lib/sanity/team-queries";
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
    const teams = await fetchWithRetry(teamsQuery);
    if (!teams || !Array.isArray(teams)) {
      throw new Error('Invalid response format from Sanity');
    }
    return teams.map((team: any) => ({
      id: team._id,
      name: team.name,
      logo: team.logo,
      division: team.division?.name || "Unassigned",
      coach: team.coach || "TBA",
      region: team.region || "Unknown",
      description: team.description,
      homeVenue: team.homeVenue || "TBA",
      awards: team.awards || [],
      sessionIds: team.sessionIds || [],
      stats: {
        wins: team.stats?.wins || 0,
        losses: team.stats?.losses || 0,
        pointsFor: team.stats?.pointsFor || 0,
        pointsAgainst: team.stats?.pointsAgainst || 0,
        gamesPlayed: team.stats?.gamesPlayed || 0,
        streak: team.stats?.streak || [],
      },
    }));
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
}

export async function fetchTeamFilters() {
  try {
    const [divisions, years, sessions, awards] = await Promise.all([
      fetchWithRetry<string[]>('*[_type == "division"].name'),
      fetchWithRetry<string[]>('*[_type == "season"].year'),
      fetchWithRetry<string[]>('*[_type == "session"].name'),
      fetchWithRetry<string[]>('*[_type == "team"].awards[]'),
    ]);

    if (!divisions || !years || !sessions || !awards) {
      throw new Error('Invalid response format from Sanity');
    }

    return {
      divisions: Array.from(new Set(divisions)),
      years: Array.from(new Set(years)),
      sessions: Array.from(new Set(sessions)),
      awards: Array.from(new Set(awards.flat())),
    };
  } catch (error) {
    console.error("Error fetching filters:", error);
    throw error;
  }
}
