import { createClient } from "@supabase/supabase-js";
import type { DivisionRepository } from "../interfaces";
import type { Division } from "@/lib/domain/models";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export class SupabaseDivisionRepository implements DivisionRepository {
  async findAll(): Promise<Division[]> {
    const { data, error } = await supabase
      .from("league_divisions")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching divisions:", error);
      return [];
    }

    return data?.map(this.transformDivision) || [];
  }

  async findById(id: string): Promise<Division | null> {
    const { data, error } = await supabase
      .from("league_divisions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching division:", error);
      return null;
    }

    return data ? this.transformDivision(data) : null;
  }

  async findBySeason(seasonId: string): Promise<Division[]> {
    const { data, error } = await supabase
      .from("season_divisions")
      .select(
        `
        league_divisions(
          id,
          name,
          description,
          eligibility,
          display_order,
          is_active
        )
      `
      )
      .eq("season_id", seasonId);

    if (error) {
      console.error("Error fetching divisions by season:", error);
      return [];
    }

    return data?.map((sd) => this.transformDivision(sd.league_divisions)) || [];
  }

  async findByActiveSeason(): Promise<Division[]> {
    const { data, error } = await supabase
      .from("season_divisions")
      .select(
        `
        league_divisions(
          id,
          name,
          description,
          eligibility,
          display_order,
          is_active
        ),
        seasons!inner(
          is_active
        )
      `
      )
      .eq("seasons.is_active", true)
      .order("league_divisions(display_order)", { ascending: true });

    if (error) {
      console.error("Error fetching divisions by active season:", error);
      return [];
    }

    return data?.map((sd) => this.transformDivision(sd.league_divisions)) || [];
  }

  async findByConference(conferenceId: string): Promise<Division[]> {
    // Not implemented yet - conferences not in current schema
    return [];
  }

  private transformDivision(data: any): Division {
    return {
      id: data.id,
      name: data.name,
      ageGroup: this.mapToAgeGroup(data.description || ""),
      conference: {
        id: "default",
        name: "Default Conference",
        season: {
          id: "default",
          name: "Default Season",
          year: new Date().getFullYear(),
          status: "active" as const
        }
      },
      isActive: data.is_active || false,
    };
  }

  private mapToAgeGroup(description: string): "ascent" | "supreme" | "premier" | "diamond" {
    const lower = description.toLowerCase();
    if (lower.includes("ascent")) return "ascent";
    if (lower.includes("supreme")) return "supreme";
    if (lower.includes("premier")) return "premier";
    if (lower.includes("diamond")) return "diamond";
    return "premier"; // Default fallback
  }
}
