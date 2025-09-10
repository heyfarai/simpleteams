import { groq } from 'next-sanity';

export const teamsQuery = groq`{
  "teams": *[_type == "team"] {
    _id,
    name,
    "logo": logo.asset._ref,
    coach,
    region,
    description,
    homeVenue,
    awards,
    stats
  },
  "seasons": *[_type == "season" && defined(activeDivisions)] | order(year desc) {
    _id,
    name,
    year,
    "divisions": activeDivisions[status == "active" && defined(teams) && count(teams) > 0]{
      "division": division->{
        _id,
        name
      },
      "teamRefs": teams[]._ref
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
