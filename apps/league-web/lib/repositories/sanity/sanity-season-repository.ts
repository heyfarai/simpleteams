import { client } from "@/lib/sanity/client";
import type { SeasonRepository } from "../interfaces";
import type { Season } from "../../domain/models";
import { groq } from "next-sanity";

export class SanitySeasonRepository implements SeasonRepository {
  async findAll(): Promise<Season[]> {
    try {
      const query = groq`
        *[_type == "season"] | order(year desc) {
          _id,
          name,
          year,
          startDate,
          endDate,
          status,
          isActive
        }
      `;

      const seasons = await client.fetch(query);
      return seasons.map(this.transformSeason);
    } catch (error) {
      console.error("Error fetching all seasons:", error);
      return [];
    }
  }

  async findById(id: string): Promise<Season | null> {
    try {
      const query = groq`
        *[_type == "season" && _id == $id][0] {
          _id,
          name,
          year,
          startDate,
          endDate,
          status,
          isActive
        }
      `;

      const season = await client.fetch(query, { id });
      return season ? this.transformSeason(season) : null;
    } catch (error) {
      console.error("Error fetching season by ID:", error);
      return null;
    }
  }

  async findActive(): Promise<Season[]> {
    try {
      const query = groq`
        *[_type == "season" && (isActive == true || status == "active")] | order(year desc) {
          _id,
          name,
          year,
          startDate,
          endDate,
          status,
          isActive
        }
      `;

      const seasons = await client.fetch(query);
      return seasons.map(this.transformSeason);
    } catch (error) {
      console.error("Error fetching active seasons:", error);
      return [];
    }
  }

  async findCompleted(): Promise<Season[]> {
    try {
      const query = groq`
        *[_type == "season" && status == "completed"] | order(year desc) {
          _id,
          name,
          year,
          startDate,
          endDate,
          status,
          isActive
        }
      `;

      const seasons = await client.fetch(query);
      return seasons.map(this.transformSeason);
    } catch (error) {
      console.error("Error fetching completed seasons:", error);
      return [];
    }
  }

  async findCurrent(): Promise<Season | null> {
    try {
      const query = groq`
        *[_type == "season" && isActive == true][0] {
          _id,
          name,
          year,
          startDate,
          endDate,
          status,
          isActive
        }
      `;

      const season = await client.fetch(query);
      return season ? this.transformSeason(season) : null;
    } catch (error) {
      console.error("Error fetching current season:", error);
      return null;
    }
  }

  private transformSeason(sanitySeason: any): Season {
    return {
      id: sanitySeason._id,
      name: sanitySeason.name,
      year: sanitySeason.year,
      status: sanitySeason.status || (sanitySeason.isActive ? "active" : "inactive"),
    };
  }
}