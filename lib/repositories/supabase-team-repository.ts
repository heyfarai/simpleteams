// Team Repository - leverages materialized views and denormalized fields
import { createClient } from "@supabase/supabase-js";
import type { TeamRepository } from "./interfaces";
import type { Team, TeamStats, Division, Season } from "@/lib/domain/models";

// Use service role key on server side, anon key on client side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  typeof window === "undefined"
    ? process.env.SUPABASE_SERVICE_ROLE_KEY! // Server side
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Client side

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseTeamRepository implements TeamRepository {
  // Interface methods
  async findAll(): Promise<Team[]> {
    return this.getAllTeams();
  }

  async findById(id: string): Promise<Team | null> {
    return this.getTeamById(id);
  }

  async findBySeason(seasonId: string): Promise<Team[]> {
    return this.getTeamsBySeason(seasonId);
  }

  async findByDivision(divisionId: string): Promise<Team[]> {
    return this.getTeamsByDivision(divisionId);
  }

  async findWithRosters(seasonId?: string): Promise<Team[]> {
    // For now, return all teams - this could be optimized later
    return seasonId ? this.getTeamsBySeason(seasonId) : this.getAllTeams();
  }

  async search(query: string): Promise<Team[]> {
    return this.searchTeams(query);
  }

  // Get all teams (fast query using denormalized fields)
  async getAllTeams(): Promise<Team[]> {
    console.log("🗄️ SupabaseTeamRepository.getAllTeams() called");
    try {
      const { data: teams, error } = await supabase
        .from("teams")
        .select(
          `
          id,
          name,
          short_name,
          logo_url,
          city,
          region,
          primary_color,
          secondary_color,
          head_coach_name,
          status,
          current_division_name,
          current_season_year
        `
        )
        .eq("status", "active");

      if (error) {
        console.error("🗄️ Supabase query error:", error);
        throw error;
      }

      const transformedTeams =
        teams?.map(this.transformToTeamFromDenormalized) || [];
      return transformedTeams;
    } catch (error) {
      console.error("Error fetching all teams:", error);
      throw error;
    }
  }

  // Get current active teams (uses materialized view)
  async getActiveTeams(): Promise<Team[]> {
    try {
      const { data: currentRosters, error } = await supabase
        .from("current_rosters")
        .select(
          `
          team_id,
          team_name,
          team_short_name,
          logo_url,
          city,
          division_id,
          division_name,
          season_id,
          season_name,
          season_year
        `
        )
        .order("team_name");

      if (error) throw error;

      // Deduplicate teams (since view has one row per player)
      const teamMap = new Map();
      currentRosters?.forEach((row) => {
        if (!teamMap.has(row.team_id)) {
          teamMap.set(row.team_id, this.transformToTeamFromCurrentRoster(row));
        }
      });

      return Array.from(teamMap.values());
    } catch (error) {
      console.error("Error fetching active teams:", error);
      throw error;
    }
  }

  // Get teams by season (optimized with roster join)
  async getTeamsBySeason(seasonId: string): Promise<Team[]> {
    try {
      const { data: teams, error } = await supabase
        .from("teams")
        .select(
          `
          id,
          name,
          short_name,
          logo_url,
          city,
          region,
          primary_color,
          secondary_color,
          head_coach_name,
          status,
          rosters!inner(
            id,
            season_division:season_divisions(
              division:league_divisions(
                id,
                name,
                description
              ),
              season:seasons!inner(
                id,
                name,
                year,
                status,
                is_active
              )
            ),
            roster_season_stats(
              wins,
              losses,
              ties,
              points_for,
              points_against,
              games_played,
              win_percentage,
              point_differential
            )
          )
        `
        )
        .eq("rosters.season_division.season.id", seasonId)
        .eq("status", "active")
        .not("rosters.season_division", "is", null); // Ensure season_division is not null

      if (error) throw error;

      return teams?.map(this.transformToTeamWithRoster) || [];
    } catch (error) {
      console.error("Error fetching teams by season:", error);
      throw error;
    }
  }

  // Get teams by division (very fast with roster constraint)
  async getTeamsByDivision(divisionId: string): Promise<Team[]> {
    try {
      const { data: teams, error } = await supabase
        .from("teams")
        .select(
          `
          id,
          name,
          short_name,
          logo_url,
          city,
          region,
          primary_color,
          secondary_color,
          head_coach_name,
          status,
          rosters!inner(
            id,
            season_division:season_divisions(
              division:league_divisions!inner(
                id,
                name,
                description
              ),
              season:seasons(
                id,
                name,
                year,
                status,
                is_active
              )
            ),
            roster_season_stats(
              wins,
              losses,
              ties,
              points_for,
              points_against,
              games_played,
              win_percentage,
              point_differential
            )
          )
        `
        )
        .eq("rosters.season_division.division.id", divisionId)
        .eq("status", "active");

      if (error) throw error;

      return teams?.map(this.transformToTeamWithRoster) || [];
    } catch (error) {
      console.error("Error fetching teams by division:", error);
      throw error;
    }
  }

  // Get team by ID with full details
  async getTeamById(teamId: string): Promise<Team | null> {
    console.log(
      "🗄️ SupabaseTeamRepository.getTeamById() called with ID:",
      teamId
    );
    try {
      // Simplified query to start with - just get basic team data
      const { data: team, error } = await supabase
        .from("teams")
        .select(
          `
          id,
          name,
          short_name,
          logo_url,
          city,
          region,
          primary_color,
          secondary_color,
          head_coach_name,
          status,
          current_division_name,
          current_season_year
        `
        )
        .eq("id", teamId)
        .single();

      if (error) {
        console.error("🗄️ Supabase query error for team:", error);
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }

      const transformedTeam = team
        ? this.transformToTeamFromDenormalized(team)
        : null;
      return transformedTeam;
    } catch (error) {
      console.error("Error fetching team by ID:", error);
      throw error;
    }
  }

  // Search teams (fast with text search on indexed fields)
  async searchTeams(query: string): Promise<Team[]> {
    try {
      const { data: teams, error } = await supabase
        .from("teams")
        .select(
          `
          id,
          name,
          short_name,
          logo_url,
          city,
          region,
          primary_color,
          secondary_color,
          head_coach_name,
          status,
          current_division_name,
          current_season_year
        `
        )
        .or(
          `name.ilike.%${query}%,short_name.ilike.%${query}%,city.ilike.%${query}%`
        )
        .eq("status", "active")
        .limit(20);

      if (error) throw error;

      return teams?.map(this.transformToTeamFromDenormalized) || [];
    } catch (error) {
      console.error("Error searching teams:", error);
      throw error;
    }
  }

  // Get top teams by wins (uses materialized view for performance)
  async getTopTeamsByWins(
    seasonId?: string,
    limit: number = 10
  ): Promise<Team[]> {
    try {
      let query = supabase
        .from("team_standings")
        .select("*")
        .order("wins", { ascending: false })
        .limit(limit);

      if (seasonId) {
        query = query.eq("season_id", seasonId);
      }

      const { data: standings, error } = await query;

      if (error) throw error;

      return standings?.map(this.transformToTeamFromStandings) || [];
    } catch (error) {
      console.error("Error fetching top teams by wins:", error);
      throw error;
    }
  }

  // Create a new team
  async createTeam(teamData: Partial<Team>): Promise<Team> {
    try {
      const { data: team, error } = await supabase
        .from("teams")
        .insert({
          name: teamData.name,
          short_name: teamData.shortName,
          city: teamData.location?.city,
          region: teamData.location?.region,
          logo_url: teamData.logo,
          primary_color: teamData.colors?.primary,
          secondary_color: teamData.colors?.secondary,
          accent_color: teamData.colors?.accent,
          contact_email: `${teamData.name
            ?.toLowerCase()
            .replace(/\s+/g, "")}@temp.com`, // Temporary
          head_coach_name: teamData.headCoach,
          primary_contact_name: teamData.headCoach || "Unknown",
          primary_contact_email: `${teamData.name
            ?.toLowerCase()
            .replace(/\s+/g, "")}@temp.com`,
          organization_id: process.env.DEFAULT_ORGANIZATION_ID || "default-org",
        })
        .select()
        .single();

      if (error) throw error;

      return this.transformToTeamFromDenormalized(team);
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  }

  // Update team information
  async updateTeam(teamId: string, updates: Partial<Team>): Promise<Team> {
    try {
      const { data: team, error } = await supabase
        .from("teams")
        .update({
          name: updates.name,
          short_name: updates.shortName,
          city: updates.location?.city,
          region: updates.location?.region,
          logo_url: updates.logo,
          primary_color: updates.colors?.primary,
          secondary_color: updates.colors?.secondary,
          accent_color: updates.colors?.accent,
          head_coach_name: updates.headCoach,
        })
        .eq("id", teamId)
        .select()
        .single();

      if (error) throw error;

      return this.transformToTeamFromDenormalized(team);
    } catch (error) {
      console.error("Error updating team:", error);
      throw error;
    }
  }

  // Get team standings (fast materialized view query)
  async getTeamStandings(
    seasonId?: string,
    divisionId?: string
  ): Promise<any[]> {
    try {
      let query = supabase
        .from("team_standings")
        .select("*")
        .order("division_name")
        .order("division_rank");

      if (seasonId) {
        query = query.eq("season_id", seasonId);
      }

      if (divisionId) {
        query = query.eq("division_id", divisionId);
      }

      const { data: standings, error } = await query;

      if (error) throw error;

      return standings || [];
    } catch (error) {
      console.error("Error fetching team standings:", error);
      throw error;
    }
  }

  // Transform methods for different query patterns

  // Transform from denormalized fields (fastest)
  private transformToTeamFromDenormalized(row: any): Team {
    return {
      id: row.id,
      name: row.name,
      shortName: row.short_name,
      logo: row.logo_url,
      location: {
        city: row.city,
        region: row.region,
      },
      colors: {
        primary: row.primary_color,
        secondary: row.secondary_color,
        accent: row.accent_color,
      },
      headCoach: row.head_coach_name,
      status: row.status,
      // Use denormalized fields for current context
      division: row.current_division_name
        ? {
            id: "",
            name: row.current_division_name,
            ageGroup: "premier",
            conference: {
              id: "",
              name: "",
              season: {
                id: "",
                name: "",
                year: row.current_season_year || 0,
                status: "active",
              },
            },
          }
        : undefined,
      season: row.current_season_year
        ? {
            id: "",
            name: "",
            year: row.current_season_year,
            status: "active",
          }
        : undefined,
    };
  }

  // Transform from current_rosters materialized view
  private transformToTeamFromCurrentRoster(row: any): Team {
    return {
      id: row.team_id,
      name: row.team_name,
      shortName: row.team_short_name,
      logo: row.logo_url,
      location: { city: row.city },
      status: "active",
      division: {
        id: row.division_id,
        name: row.division_name,
        ageGroup: "premier",
        conference: {
          id: row.season_id,
          name: row.season_name,
          season: {
            id: row.season_id,
            name: row.season_name,
            year: row.season_year,
            status: "active",
          },
        },
      },
      season: {
        id: row.season_id,
        name: row.season_name,
        year: row.season_year,
        status: "active",
        isActive: true,
      },
    };
  }

  // Transform from team_standings materialized view
  private transformToTeamFromStandings(row: any): Team {
    return {
      id: row.team_id,
      name: row.team_name,
      shortName: row.short_name,
      logo: row.logo_url,
      location: { city: "Unknown" },
      status: "active",
      stats: {
        wins: row.wins,
        losses: row.losses,
        ties: row.ties,
        pointsFor: row.points_for,
        pointsAgainst: row.points_against,
      },
      division: {
        id: row.division_id,
        name: row.division_name,
        ageGroup: "premier",
        conference: {
          id: row.season_id,
          name: "",
          season: {
            id: row.season_id,
            name: "",
            year: row.season_year,
            status: "active",
          },
        },
      },
    };
  }

  // Transform with roster details (most complete but slower)
  private transformToTeamWithRoster(row: any): Team {
    // Find the roster with a valid season_division (not null)
    const roster =
      row.rosters?.find((r: any) => r.season_division != null) ||
      row.rosters?.[0];
    // roster_season_stats can be either an array or single object, handle both
    const stats = Array.isArray(roster?.roster_season_stats)
      ? roster?.roster_season_stats?.[0]
      : roster?.roster_season_stats;

    return {
      id: row.id,
      name: row.name,
      shortName: row.short_name,
      logo: row.logo_url,
      location: {
        city: row.city,
        region: row.region,
      },
      colors: {
        primary: row.primary_color,
        secondary: row.secondary_color,
        accent: row.accent_color,
      },
      headCoach: row.head_coach_name,
      status: row.status,
      stats: stats
        ? {
            wins: stats.wins,
            losses: stats.losses,
            ties: stats.ties,
            pointsFor: stats.points_for,
            pointsAgainst: stats.points_against,
            gamesPlayed: stats.games_played,
          }
        : undefined,
      division: roster?.season_division?.division
        ? {
            id: roster.season_division.division.id,
            name: roster.season_division.division.name,
            ageGroup: roster.season_division.division.description,
            skillLevel: roster.season_division.division.description,
            conference: {
              id: roster.season_division.season?.id || "",
              name: roster.season_division.season?.name || "",
              season: {
                id: roster.season_division.season?.id || "",
                name: roster.season_division.season?.name || "",
                year: roster.season_division.season?.year || 0,
                status: roster.season_division.season?.status || "upcoming",
                isActive: roster.season_division.season?.is_active || false,
              },
            },
          }
        : undefined,
      season: roster?.season_division?.season
        ? {
            id: roster.season_division.season.id,
            name: roster.season_division.season.name,
            year: roster.season_division.season.year,
            status: roster.season_division.season.status,
            isActive: roster.season_division.season.is_active,
          }
        : undefined,
    };
  }

  // Transform with full team details (slowest but most complete)
  private transformToTeamWithFullDetails(row: any): Team {
    // Find current roster (active season)
    const currentRoster = row.rosters?.find((r: any) => r.season?.is_active);
    const stats = currentRoster?.roster_season_stats?.[0];

    return {
      id: row.id,
      name: row.name,
      shortName: row.short_name,
      logo: row.logo_url,
      location: {
        city: row.city,
        region: row.region,
      },
      colors: {
        primary: row.primary_color,
        secondary: row.secondary_color,
        accent: row.accent_color,
      },
      headCoach: row.head_coach_name,
      status: row.status,
      stats: stats
        ? {
            wins: stats.wins,
            losses: stats.losses,
            ties: stats.ties,
            pointsFor: stats.points_for,
            pointsAgainst: stats.points_against,
            gamesPlayed: stats.games_played,
          }
        : undefined,
      division: currentRoster?.season_division?.division
        ? {
            id: currentRoster.season_division.division.id,
            name: currentRoster.season_division.division.name,
            ageGroup: currentRoster.season_division.division.description,
            skillLevel: currentRoster.season_division.division.description,
            conference: {
              id: currentRoster.season_division.season?.id || "",
              name: currentRoster.season_division.season?.name || "",
              season: {
                id: currentRoster.season_division.season?.id || "",
                name: currentRoster.season_division.season?.name || "",
                year: currentRoster.season_division.season?.year || 0,
                status:
                  currentRoster.season_division.season?.status || "upcoming",
                isActive:
                  currentRoster.season_division.season?.is_active || false,
              },
            },
          }
        : undefined,
      season: currentRoster?.season_division?.season
        ? {
            id: currentRoster.season_division.season.id,
            name: currentRoster.season_division.season.name,
            year: currentRoster.season_division.season.year,
            status: currentRoster.season_division.season.status,
            isActive: currentRoster.season_division.season.is_active,
          }
        : undefined,
    };
  }

  // Real-time subscriptions
  subscribeToTeamUpdates(teamId: string, callback: (team: Team) => void) {
    return supabase
      .channel(`team:${teamId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
          filter: `id=eq.${teamId}`,
        },
        async () => {
          try {
            const updatedTeam = await this.getTeamById(teamId);
            if (updatedTeam) {
              callback(updatedTeam);
            }
          } catch (error) {
            console.error("Error in team subscription callback:", error);
          }
        }
      )
      .subscribe();
  }

  subscribeToTeamStatsUpdates(
    teamId: string,
    callback: (stats: TeamStats) => void
  ) {
    return supabase
      .channel(`team-stats:${teamId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "roster_season_stats",
          filter: `roster_id=in.(select id from rosters where team_id=eq.${teamId})`,
        },
        (payload) => {
          if (payload.new) {
            const newData = payload.new as any;
            const stats: TeamStats = {
              wins: newData.wins || 0,
              losses: newData.losses || 0,
              ties: newData.ties || 0,
              pointsFor: newData.points_for || 0,
              pointsAgainst: newData.points_against || 0,
            };
            callback(stats);
          }
        }
      )
      .subscribe();
  }

  // Utility to refresh materialized views
  async refreshMaterializedViews(): Promise<void> {
    try {
      await supabase.rpc("refresh_performance_views");
    } catch (error) {
      console.error("Error refreshing materialized views:", error);
    }
  }
}
