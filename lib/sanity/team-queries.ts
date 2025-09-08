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

export const teamDetailsQuery = groq`*[_type == "team"] {
  _id,
  name,
  "logo": logo.asset._ref,
  coach,
  region,
  description,
  homeVenue,
  awards,
  stats
}`;
