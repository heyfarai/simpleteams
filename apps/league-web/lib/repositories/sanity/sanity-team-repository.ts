import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import type { TeamRepository } from "../interfaces";
import type { Team } from "../../domain/models";
import { SanityTransformer } from "./transformers";

export class SanityTeamRepository implements TeamRepository {
  private transformer = new SanityTransformer();

  async findAll(): Promise<Team[]> {
    try {
      const query = groq`
        *[_type == "team"] | order(name asc) {
          _id,
          name,
          shortName,
          logo,
          location,
          colors,
          headCoach,
          staff,
          stats,
          status
        }
      `;

      const teams = await client.fetch(query);
      return teams.map((data: any) => this.transformer.toTeam(data));
    } catch (error) {
      console.error("Error fetching all teams:", error);
      return [];
    }
  }

  async findById(id: string): Promise<Team | null> {
    try {
      const query = groq`
        *[_type == "team" && _id == $id][0] {
          _id,
          name,
          shortName,
          logo,
          location {
            city,
            region,
            homeVenue-> {
              _id,
              name,
              address,
              city,
              region,
              coordinates
            }
          },
          colors,
          headCoach,
          staff,
          stats,
          status,
          rosters[] {
            season-> {
              _id,
              name,
              year,
              status
            },
            players[] {
              player-> {
                _id,
                name,
                firstName,
                lastName
              },
              jerseyNumber,
              position,
              status
            },
            seasonStats
          }
        }
      `;

      const teamData = await client.fetch(query, { id });
      return teamData ? this.transformer.toTeam(teamData) : null;
    } catch (error) {
      console.error("Error fetching team by ID:", error);
      return null;
    }
  }

  async findBySeason(seasonId: string): Promise<Team[]> {
    try {
      // First get the season with its active divisions and team assignments
      const seasonQuery = groq`
        *[_type == "season" && _id == $seasonId][0] {
          _id,
          name,
          year,
          status,
          activeDivisions[] {
            "division": division-> {
              _id,
              name,
              ageGroup,
              conference-> {
                _id,
                name
              }
            },
            teams[],
            status
          }
        }
      `;

      const season = await client.fetch(seasonQuery, { seasonId });
      if (!season || !season.activeDivisions) {
        return [];
      }

      // Collect all team IDs and their division assignments
      const teamDivisionMap = new Map<string, any>();

      season.activeDivisions.forEach((activeDivision: any) => {
        if (activeDivision.teams && activeDivision.status === 'active') {
          activeDivision.teams.forEach((teamRef: any) => {
            teamDivisionMap.set(teamRef._ref, {
              division: activeDivision.division,
              season: {
                _id: season._id,
                name: season.name,
                year: season.year,
                status: season.status
              }
            });
          });
        }
      });

      if (teamDivisionMap.size === 0) {
        return [];
      }

      // Now fetch the actual team data with season-specific stats
      const teamIds = Array.from(teamDivisionMap.keys());
      const teamsQuery = groq`
        *[_type == "team" && _id in $teamIds] | order(name asc) {
          _id,
          name,
          shortName,
          logo,
          location,
          colors,
          headCoach,
          staff,
          stats,
          status,
          "seasonStats": rosters[season._ref == $seasonId][0].seasonStats
        }
      `;

      const teams = await client.fetch(teamsQuery, { teamIds, seasonId });

      // Enhance teams with division and season data
      const enhancedTeams = teams.map((team: any) => {
        const divisionData = teamDivisionMap.get(team._id);
        return {
          ...team,
          divisionAssignment: divisionData
        };
      });

      return enhancedTeams.map((data: any) => this.transformer.toTeam(data));
    } catch (error) {
      console.error("Error fetching teams by season:", error);
      return [];
    }
  }

  async findByDivision(divisionId: string): Promise<Team[]> {
    try {
      const query = groq`
        *[_type == "team"] {
          _id,
          name,
          shortName,
          logo,
          location,
          colors,
          headCoach,
          staff,
          stats,
          status,
          "inDivision": count(*[_type == "division" && _id == $divisionId && conference->season._ref in ^.rosters[].season._ref]) > 0
        }[inDivision == true] | order(name asc)
      `;

      const teams = await client.fetch(query, { divisionId });
      return teams.map((data: any) => this.transformer.toTeam(data));
    } catch (error) {
      console.error("Error fetching teams by division:", error);
      return [];
    }
  }

  async findWithRosters(seasonId?: string): Promise<Team[]> {
    try {
      const query = seasonId ? groq`
        *[_type == "team" && count(rosters[season._ref == $seasonId]) > 0] | order(name asc) {
          _id,
          name,
          shortName,
          logo,
          location,
          colors,
          headCoach,
          staff,
          stats,
          status,
          rosters[season._ref == $seasonId] {
            season-> {
              _id,
              name,
              year,
              status
            },
            seasonStats,
            players[] {
              player-> {
                _id,
                name,
                firstName,
                lastName,
                personalInfo,
                photo,
                stats
              },
              jerseyNumber,
              position,
              status
            }
          }
        }
      ` : groq`
        *[_type == "team" && count(rosters) > 0] | order(name asc) {
          _id,
          name,
          shortName,
          logo,
          location,
          colors,
          headCoach,
          staff,
          stats,
          status,
          rosters[] {
            season-> {
              _id,
              name,
              year,
              status
            },
            seasonStats,
            players[] {
              player-> {
                _id,
                name,
                firstName,
                lastName,
                personalInfo,
                photo,
                stats
              },
              jerseyNumber,
              position,
              status
            }
          }
        }
      `;

      const teams = await client.fetch(query, seasonId ? { seasonId } : {});
      return teams.map((data: any) => this.transformer.toTeam(data));
    } catch (error) {
      console.error("Error fetching teams with rosters:", error);
      return [];
    }
  }

  async search(query: string): Promise<Team[]> {
    try {
      const searchQuery = groq`
        *[_type == "team" && (
          name match $searchTerm ||
          shortName match $searchTerm ||
          location.city match $searchTerm
        )] | order(name asc) {
          _id,
          name,
          shortName,
          logo,
          location,
          colors,
          headCoach,
          staff,
          stats,
          status
        }
      `;

      const teams = await client.fetch(searchQuery, {
        searchTerm: `${query}*`
      });

      return teams.map((data: any) => this.transformer.toTeam(data));
    } catch (error) {
      console.error("Error searching teams:", error);
      return [];
    }
  }
}