// Database-agnostic team data fetching using service layer
import { teamService, seasonService, filterService } from "@/lib/services";
import type { Team as DomainTeam } from "@/lib/domain/models";
import { Team } from "@/lib/types/teams"; // Legacy type for backward compatibility

// Transform domain model Team to legacy Team interface for backward compatibility
function transformToLegacyTeam(domainTeam: DomainTeam): Team {
  return {
    id: domainTeam.id,
    _id: domainTeam.id,
    name: domainTeam.name,
    shortName: domainTeam.shortName,
    logo: domainTeam.logo,
    coach: domainTeam.headCoach || "TBA",
    region: domainTeam.location?.city || "Unknown",
    homeVenue: domainTeam.location?.name || "TBA",
    awards: [], // Domain model doesn't have awards yet
    status: domainTeam.status,
    description: "", // Domain model doesn't have description yet
    division: domainTeam.division ? {
      _id: domainTeam.division.id,
      name: domainTeam.division.name,
      season: domainTeam.season ? {
        _ref: domainTeam.season.id,
      } : undefined,
    } : undefined,
    season: domainTeam.season ? {
      _id: domainTeam.season.id,
      name: domainTeam.season.name,
      year: domainTeam.season.year,
      isActive: Boolean(domainTeam.season.isActive),
      status: domainTeam.season.status,
    } : undefined,
    rosters: [], // Will be populated if needed
    stats: domainTeam.stats ? {
      wins: domainTeam.stats.wins,
      losses: domainTeam.stats.losses,
      ties: domainTeam.stats.ties || 0,
      pointsFor: domainTeam.stats.pointsFor || 0,
      pointsAgainst: domainTeam.stats.pointsAgainst || 0,
      gamesPlayed: (domainTeam.stats.wins + domainTeam.stats.losses + (domainTeam.stats.ties || 0)),
    } : {
      wins: 0,
      losses: 0,
      ties: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      gamesPlayed: 0,
    },
    showStats: Boolean(domainTeam.stats),
  };
}

// Database-agnostic functions using service layer

export async function fetchAllTeams(activeOnly: boolean = false): Promise<Team[]> {
  try {
    let teams: DomainTeam[];

    if (activeOnly) {
      teams = await teamService.getActiveTeams();
    } else {
      teams = await teamService.getAllTeams();
    }

    return teams.map(transformToLegacyTeam);
  } catch (error) {
    console.error("Error fetching all teams:", error);
    return [];
  }
}

export async function fetchTeams(seasonId?: string, activeOnly: boolean = false): Promise<Team[]> {
  try {
    let teams: DomainTeam[];

    if (seasonId) {
      teams = await teamService.getTeamsBySeason(seasonId);
    } else {
      // Get teams for current season
      const currentSeason = await seasonService.getCurrentSeason();
      if (currentSeason) {
        teams = await teamService.getTeamsBySeason(currentSeason.id);
      } else {
        teams = await teamService.getAllTeams();
      }
    }

    if (activeOnly) {
      teams = teams.filter(team => team.status === "active");
    }

    return teams.map(transformToLegacyTeam);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

export async function fetchTeamDetails(teamId: string) {
  try {
    const team = await teamService.getTeam(teamId);

    if (!team) {
      throw new Error(`Team not found: ${teamId}`);
    }

    // Transform to legacy format with additional details
    const legacyTeam = transformToLegacyTeam(team);

    // For team details, we might need additional roster information
    // This would require implementing player fetching by team in the service layer
    return {
      ...legacyTeam,
      rosters: [], // TODO: Implement roster fetching through service layer
    };
  } catch (error) {
    console.error("Error fetching team details:", error);
    throw error;
  }
}

export async function fetchTeamFilters() {
  try {
    // Use the same data source as games page for consistency
    const filterOptions = await filterService.getFilterOptions();

    // Transform to legacy filter format
    const transformedSeasons = filterOptions.seasons.map(season => ({
      _id: season.id,
      name: season.name,
      year: season.year,
      isActive: Boolean(season.isActive), // Use the explicit isActive field
      status: season.status,
      startDate: season.startDate,
      endDate: season.endDate,
      activeDivisions: [], // TODO: Get divisions for season
    }));

    return {
      seasons: transformedSeasons,
      divisions: filterOptions.divisions.map(division => ({
        _id: division.id,
        name: division.name,
        season: {
          _ref: division.conference.season.id,
        },
      })),
      awards: [], // TODO: Get unique awards from teams
    };
  } catch (error) {
    console.error("Error fetching filters:", error);
    return {
      seasons: [],
      divisions: [],
      awards: [],
    };
  }
}

// Additional utility functions using service layer

export async function fetchTeamsByDivision(divisionId: string): Promise<Team[]> {
  try {
    const teams = await teamService.getTeamsByDivision(divisionId);
    return teams.map(transformToLegacyTeam);
  } catch (error) {
    console.error("Error fetching teams by division:", error);
    return [];
  }
}

export async function searchTeams(query: string): Promise<Team[]> {
  try {
    const teams = await teamService.searchTeams(query);
    return teams.map(transformToLegacyTeam);
  } catch (error) {
    console.error("Error searching teams:", error);
    return [];
  }
}

export async function fetchTopTeamsByWins(seasonId?: string, limit: number = 10): Promise<Team[]> {
  try {
    const teams = await teamService.getTopTeamsByWins(seasonId, limit);
    return teams.map(transformToLegacyTeam);
  } catch (error) {
    console.error("Error fetching top teams:", error);
    return [];
  }
}