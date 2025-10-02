import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import type { FilterRepository } from "../interfaces";
import type { FilterOptions } from "../../domain/models";
import { filterOptionsQuery } from "../../sanity/player-queries";
import { SanityTransformer } from "./transformers";

export class SanityFilterRepository implements FilterRepository {
  private transformer = new SanityTransformer();

  async getFilterOptions(): Promise<FilterOptions> {
    try {

      // Enhanced query to get all required fields
      const enhancedQuery = groq`{
        "sessions": *[_type == "session"] | order(startDate desc) {
          _id,
          name,
          type,
          startDate,
          isActive
        },
        "seasons": *[_type == "season"] | order(year desc) {
          _id,
          name,
          year,
          startDate,
          endDate,
          status,
          isActive
        },
        "divisions": *[_type == "division"] | order(order asc) {
          _id,
          name,
          ageGroup,
          skillLevel,
          "conference": conference->{
            _id,
            name,
            "season": season->{
              _id,
              name,
              year,
              status,
              isActive
            }
          }
        },
        "teams": *[_type == "team"] {
          _id,
          name,
          shortName
        },
        "positions": ["PG", "SG", "SF", "PF", "C"]
      }`;

      const options = await client.fetch(enhancedQuery);
      const transformed = this.transformer.toFilterOptions(options);
      return transformed;
    } catch (error) {
      console.error("Error fetching filter options:", error);
      return {
        sessions: [],
        seasons: [],
        divisions: [],
        teams: [],
        positions: ["PG", "SG", "SF", "PF", "C"],
      };
    }
  }
}