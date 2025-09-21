import { client } from "@/lib/sanity/client";
import type { DivisionRepository } from "../interfaces";
import type { Division } from "../../domain/models";
import { groq } from "next-sanity";

export class SanityDivisionRepository implements DivisionRepository {
  async findAll(): Promise<Division[]> {
    try {
      const query = groq`
        *[_type == "division"] | order(order asc) {
          _id,
          name,
          ageGroup,
          skillLevel,
          order,
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
        }
      `;

      const divisions = await client.fetch(query);
      return divisions.map(this.transformDivision);
    } catch (error) {
      console.error("Error fetching all divisions:", error);
      return [];
    }
  }

  async findById(id: string): Promise<Division | null> {
    try {
      const query = groq`
        *[_type == "division" && _id == $id][0] {
          _id,
          name,
          ageGroup,
          skillLevel,
          order,
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
        }
      `;

      const division = await client.fetch(query, { id });
      return division ? this.transformDivision(division) : null;
    } catch (error) {
      console.error("Error fetching division by ID:", error);
      return null;
    }
  }

  async findBySeason(seasonId: string): Promise<Division[]> {
    try {
      const query = groq`
        *[_type == "division" && conference->season._ref == $seasonId] | order(order asc) {
          _id,
          name,
          ageGroup,
          skillLevel,
          order,
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
        }
      `;

      const divisions = await client.fetch(query, { seasonId });
      return divisions.map(this.transformDivision);
    } catch (error) {
      console.error("Error fetching divisions by season:", error);
      return [];
    }
  }

  async findByConference(conferenceId: string): Promise<Division[]> {
    try {
      const query = groq`
        *[_type == "division" && conference._ref == $conferenceId] | order(order asc) {
          _id,
          name,
          ageGroup,
          skillLevel,
          order,
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
        }
      `;

      const divisions = await client.fetch(query, { conferenceId });
      return divisions.map(this.transformDivision);
    } catch (error) {
      console.error("Error fetching divisions by conference:", error);
      return [];
    }
  }

  private transformDivision(sanityDivision: any): Division {
    return {
      id: sanityDivision._id,
      name: sanityDivision.name,
      ageGroup: sanityDivision.ageGroup || "adult",
      skillLevel: sanityDivision.skillLevel,
      conference: {
        id: sanityDivision.conference?._id || "",
        name: sanityDivision.conference?.name || "",
        season: {
          id: sanityDivision.conference?.season?._id || "",
          name: sanityDivision.conference?.season?.name || "",
          year: sanityDivision.conference?.season?.year || new Date().getFullYear(),
          status: sanityDivision.conference?.season?.status || "active",
        },
      },
    };
  }
}