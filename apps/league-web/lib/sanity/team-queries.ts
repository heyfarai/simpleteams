import { groq } from 'next-sanity';

export const teamsQuery = groq`{
  "seasons": *[_type == "season" && defined(activeDivisions)] | order(year desc) {
    _id,
    name,
    year,
    isActive,
    "divisions": activeDivisions[status == "active" && defined(teams) && count(teams) > 0]{
      "division": division->{
        _id,
        name
      },
      "teamRefs": teams[]._ref
    }
  },
  "teams": *[_type == "team" && status == "active"] {
    _id,
    name,
    shortName,
    "logo": logo.asset._ref,
    coach,
    region,
    description,
    homeVenue,
    awards,
    stats,
    status,
    rosters[] {
      "season": season->{
        _id,
        name,
        year
      },
      seasonStats {
        wins,
        losses,
        ties,
        pointsFor,
        pointsAgainst,
        homeRecord,
        awayRecord,
        conferenceRecord
      }
    }
  }
}`;

export const teamsQueryAllStatus = groq`{
  "seasons": *[_type == "season" && defined(activeDivisions)] | order(year desc) {
    _id,
    name,
    year,
    isActive,
    "divisions": activeDivisions[status == "active" && defined(teams) && count(teams) > 0]{
      "division": division->{
        _id,
        name
      },
      "teamRefs": teams[]._ref
    }
  },
  "teams": *[_type == "team"] {
    _id,
    name,
    shortName,
    "logo": logo.asset._ref,
    coach,
    region,
    description,
    homeVenue,
    awards,
    stats,
    status,
    rosters[] {
      "season": season->{
        _id,
        name,
        year
      },
      seasonStats {
        wins,
        losses,
        ties,
        pointsFor,
        pointsAgainst,
        homeRecord,
        awayRecord,
        conferenceRecord
      }
    }
  }
}`;

export const teamDetailsQuery = groq`*[_type == "team" && _id == $teamId][0] {
  _id,
  name,
  "logo": logo.asset._ref,
  coach,
  region,
  description,
  homeVenue,
  awards,
  stats,
  rosters[] {
    "season": season->{
      _id,
      name,
      year
    },
    players[] {
      "player": player->{
        _id,
        name
      },
      jerseyNumber,
      position,
      status
    }
  }
}`;

// Query to get team data by Supabase team reference
export const teamBySupabaseIdQuery = groq`*[_type == "team" && supabaseTeamId == $supabaseTeamId][0] {
  _id,
  name,
  "logo": logo.asset._ref,
  coach,
  region,
  description,
  homeVenue,
  awards,
  stats,
  rosters[] {
    "season": season->{
      _id,
      name,
      year,
      startDate,
      endDate,
      isActive
    },
    players[] {
      "player": player->{
        _id,
        name
      },
      jerseyNumber,
      position,
      status
    }
  }
}`;

// Query to get all seasons for season tabs
export const seasonsQuery = groq`*[_type == "season"] | order(year desc) {
  _id,
  name,
  year,
  startDate,
  endDate,
  isActive,
  status
}`;
