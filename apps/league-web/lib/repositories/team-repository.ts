// Optimized Team Repository - leverages materialized views and denormalized fields
import { createClient } from "@supabase/supabase-js";
import type { Team, TeamStats, Division, Season } from "@/lib/domain/models";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class TeamRepository {
  // Get all teams (fast query using denormalized fields)
  async getAllTeams(): Promise<Team[]> {
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

      if (error) throw error;

      return teams?.map(this.transformToTeamFromDenormalized) || [];
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
            season_division:season_divisions!inner(
              id,
              season:seasons!inner(
                id,
                name,
                year,
                status,
                is_active
              ),
              division:league_divisions(
                id,
                name,
                description,
                display_order
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
        .eq("status", "active");

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
            season_division:season_divisions!inner(
              id,
              season:seasons(
                id,
                name,
                year,
                status,
                is_active
              ),
              division:league_divisions!inner(
                id,
                name,
                description,
                display_order
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
    try {
      const { data: team, error } = await supabase
        .from("teams")
        .select(
          `
          *,
          rosters(
            id,
            status,
            season_division:season_divisions(
              id,
              season:seasons(
                id,
                name,
                year,
                status,
                is_active
              ),
              division:league_divisions(
                id,
                name,
                description,
                display_order
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
              point_differential,
              streak
            ),
            roster_players(
              id,
              jersey_number,
              position,
              status,
              player:players(
                id,
                first_name,
                last_name,
                photo_url
              )
            )
          )
        `
        )
        .eq("id", teamId)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }

      return team ? this.transformToTeamWithFullDetails(team) : null;
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
            ageGroup: "unknown",
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
        ageGroup: "unknown",
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
        ageGroup: "unknown",
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
    const roster = row.rosters?.[0];
    const stats = roster?.roster_season_stats?.[0];
    const seasonDivision = roster?.season_division;
    const division = seasonDivision?.division;
    const season = seasonDivision?.season;

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
          }
        : undefined,
      division: division
        ? {
            id: division.id,
            name: division.name,
            ageGroup: "unknown", // league_divisions don't have age_group
            skillLevel: "unknown", // we can derive from division name if needed
            conference: {
              id: season?.id || "",
              name: season?.name || "",
              season: {
                id: season?.id || "",
                name: season?.name || "",
                year: season?.year || 0,
                status: season?.status || "upcoming",
                isActive: season?.is_active || false,
              },
            },
          }
        : undefined,
      season: season
        ? {
            id: season.id,
            name: season.name,
            year: season.year,
            status: season.status,
            isActive: season.is_active,
          }
        : undefined,
    };
  }

  // Transform with full team details (slowest but most complete)
  private transformToTeamWithFullDetails(row: any): Team {
    // Find current roster (active season)
    const currentRoster = row.rosters?.find((r: any) => r.season_division?.season?.is_active);
    const stats = currentRoster?.roster_season_stats?.[0];
    const seasonDivision = currentRoster?.season_division;
    const division = seasonDivision?.division;
    const season = seasonDivision?.season;

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
          }
        : undefined,
      division: division
        ? {
            id: division.id,
            name: division.name,
            ageGroup: "unknown", // league_divisions don't have age_group
            skillLevel: "unknown", // we can derive from division name if needed
            conference: {
              id: season?.id || "",
              name: season?.name || "",
              season: {
                id: season?.id || "",
                name: season?.name || "",
                year: season?.year || 0,
                status: season?.status || "upcoming",
                isActive: season?.is_active || false,
              },
            },
          }
        : undefined,
      season: season
        ? {
            id: season.id,
            name: season.name,
            year: season.year,
            status: season.status,
            isActive: season.is_active,
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
            const stats: TeamStats = {
              wins: payload.new.wins,
              losses: payload.new.losses,
              ties: payload.new.ties || 0,
              pointsFor: payload.new.points_for || 0,
              pointsAgainst: payload.new.points_against || 0,
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
