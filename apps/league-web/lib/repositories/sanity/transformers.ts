import { urlFor } from "@/lib/sanity/client";
import type {
  Player,
  Team,
  Game,
  Division,
  Season,
  Conference,
  Venue,
  Official,
  FilterOptions,
} from "../../domain/models";

// Transforms Sanity data to domain models
export class SanityTransformer {
  toPlayer(sanityData: any): Player {
    const teamInfo = sanityData.teamInfo;
    const roster = teamInfo?.roster || sanityData.roster;
    const season = roster?.season;
    const division = roster?.division;
    const playerDetails = roster?.playerDetails || sanityData.playerDetails;

    return {
      id: sanityData._id,
      firstName: sanityData.firstName || "Unknown",
      lastName: sanityData.lastName || "Player",
      name: sanityData.name || `${sanityData.firstName || "Unknown"} ${sanityData.lastName || "Player"}`,
      team: this.toTeam(teamInfo),
      jersey: playerDetails?.jerseyNumber || sanityData.jerseyNumber || 0,
      position: playerDetails?.position || "PG",
      gradYear: sanityData.personalInfo?.gradYear || new Date().getFullYear() + 1,
      height: sanityData.personalInfo?.height || "N/A",
      photo: sanityData.photo ? this.transformImageUrl(sanityData.photo) : undefined,
      stats: {
        ppg: sanityData.stats?.points || 0,
        rpg: sanityData.stats?.rebounds || 0,
        apg: sanityData.stats?.assists || 0,
        spg: sanityData.stats?.steals || 0,
        bpg: sanityData.stats?.blocks || 0,
        mpg: sanityData.stats?.minutes || 0,
        fgPercentage: sanityData.stats?.fieldGoalPercentage,
        ftPercentage: sanityData.stats?.freeThrowPercentage,
        threePointPercentage: sanityData.stats?.threePointPercentage,
      },
      awards: sanityData.awards || [],
      hasHighlight: (sanityData.highlightVideos?.length || 0) > 0,
      division: this.toDivision(division),
      gamesPlayed: sanityData.stats?.gamesPlayed || 0,
      season: this.toSeason(season),
      hometown: sanityData.personalInfo?.hometown || "Unknown",
    };
  }

  toTeam(sanityData: any): Team {
    if (!sanityData) {
      return {
        id: "unknown",
        name: "Free Agent",
        status: "inactive" as const,
      };
    }

    // Extract division and season from divisionAssignment (from season.activeDivisions) or fallback to roster
    const division = sanityData.divisionAssignment?.division ? this.toDivision(sanityData.divisionAssignment.division) :
                    sanityData.roster?.division ? this.toDivision(sanityData.roster.division) : undefined;
    const season = sanityData.divisionAssignment?.season ? this.toSeason(sanityData.divisionAssignment.season) :
                  sanityData.roster?.season ? this.toSeason(sanityData.roster.season) : undefined;

    return {
      id: sanityData._id,
      name: sanityData.name,
      shortName: sanityData.shortName,
      logo: sanityData.logo ? this.transformImageUrl(sanityData.logo) : undefined,
      location: sanityData.location ? {
        city: sanityData.location.city,
        region: sanityData.location.region,
        homeVenue: sanityData.location.homeVenue ? this.toVenue(sanityData.location.homeVenue) : undefined,
      } : undefined,
      colors: sanityData.colors ? {
        primary: sanityData.colors.primary,
        secondary: sanityData.colors.secondary,
        accent: sanityData.colors.accent,
      } : undefined,
      headCoach: sanityData.headCoach,
      staff: sanityData.staff?.map((member: any) => ({
        name: member.name,
        role: member.role,
        email: member.email,
        phone: member.phone,
      })),
      stats: sanityData.seasonStats ? {
        wins: sanityData.seasonStats.wins || 0,
        losses: sanityData.seasonStats.losses || 0,
        ties: sanityData.seasonStats.ties || 0,
        pointsFor: sanityData.seasonStats.pointsFor || 0,
        pointsAgainst: sanityData.seasonStats.pointsAgainst || 0,
        gamesPlayed: (sanityData.seasonStats.wins || 0) + (sanityData.seasonStats.losses || 0) + (sanityData.seasonStats.ties || 0),
      } : sanityData.stats ? {
        wins: sanityData.stats.wins || 0,
        losses: sanityData.stats.losses || 0,
        ties: sanityData.stats.ties || 0,
        pointsFor: 0,
        pointsAgainst: 0,
        gamesPlayed: (sanityData.stats.wins || 0) + (sanityData.stats.losses || 0) + (sanityData.stats.ties || 0),
      } : undefined,
      status: sanityData.status || "active",
      division,
      season,
    };
  }

  toGame(sanityData: any): Game {
    return {
      id: sanityData._id,
      title: sanityData.title,
      date: sanityData.date,
      time: sanityData.time,
      venue: this.toVenue(sanityData.venue),
      homeTeam: this.toTeam(sanityData.homeTeam),
      awayTeam: this.toTeam(sanityData.awayTeam),
      division: this.toDivision(sanityData.division),
      season: this.toSeason(sanityData.season),
      status: sanityData.status,
      homeScore: sanityData.homeScore,
      awayScore: sanityData.awayScore,
      officials: sanityData.officials?.map((official: any) => this.toOfficial(official)),
    };
  }

  toDivision(sanityData: any): Division {
    if (!sanityData) {
      return {
        id: "unknown",
        name: "Unknown",
        ageGroup: "diamond" as const,
        conference: this.toConference(null),
      };
    }

    return {
      id: sanityData._id,
      name: sanityData.name,
      ageGroup: sanityData.ageGroup,
      skillLevel: sanityData.skillLevel,
      conference: this.toConference(sanityData.conference),
      teamLimits: sanityData.teamLimits ? {
        maxTeams: sanityData.teamLimits.maxTeams,
        minTeams: sanityData.teamLimits.minTeams,
        currentTeams: sanityData.teamLimits.currentTeams,
      } : undefined,
    };
  }

  toSeason(sanityData: any): Season {
    if (!sanityData) {
      return {
        id: "unknown",
        name: "Unknown",
        year: new Date().getFullYear(),
        status: "completed" as const,
      };
    }

    return {
      id: sanityData._id,
      name: sanityData.name,
      year: sanityData.year,
      startDate: sanityData.startDate,
      endDate: sanityData.endDate,
      status: sanityData.status || "completed",
      isActive: sanityData.isActive,
    };
  }

  toConference(sanityData: any): Conference {
    if (!sanityData) {
      return {
        id: "unknown",
        name: "Unknown",
        season: this.toSeason(null),
      };
    }

    return {
      id: sanityData._id,
      name: sanityData.name,
      season: this.toSeason(sanityData.season),
      description: sanityData.description,
      commissioner: sanityData.commissioner ? {
        name: sanityData.commissioner.name,
        email: sanityData.commissioner.email,
        phone: sanityData.commissioner.phone,
      } : undefined,
    };
  }

  toVenue(sanityData: any): Venue {
    if (!sanityData) {
      return {
        id: "unknown",
        name: "TBD",
        address: "TBD",
        city: "TBD",
      };
    }

    return {
      id: sanityData._id,
      name: sanityData.name,
      address: sanityData.address,
      city: sanityData.city,
      region: sanityData.region,
      coordinates: sanityData.coordinates ? {
        latitude: sanityData.coordinates.lat,
        longitude: sanityData.coordinates.lng,
      } : undefined,
    };
  }

  toOfficial(sanityData: any): Official {
    return {
      id: sanityData._id,
      name: sanityData.name,
      level: sanityData.level,
      contact: sanityData.contact ? {
        email: sanityData.contact.email,
        phone: sanityData.contact.phone,
      } : undefined,
    };
  }

  toFilterOptions(sanityData: any): FilterOptions {
    return {
      sessions: sanityData.sessions?.map((session: any) => ({
        id: session._id,
        name: session.name,
        type: session.type,
        startDate: session.startDate,
        isActive: session.isActive,
      })) || [],
      seasons: sanityData.seasons?.map((season: any) => this.toSeason(season)) || [],
      divisions: sanityData.divisions?.map((division: any) => this.toDivision(division)) || [],
      teams: sanityData.teams?.map((team: any) => ({
        id: team._id,
        name: team.name,
        shortName: team.shortName,
      })) || [],
      positions: sanityData.positions || ["PG", "SG", "SF", "PF", "C"],
    };
  }

  private transformImageUrl(photo: any): string {
    return urlFor(photo).width(400).height(400).url();
  }
}