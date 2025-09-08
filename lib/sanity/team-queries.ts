import { groq } from 'next-sanity';

export const teamsQuery = groq`*[_type == "season"] {
  _id,
  name,
  year,
  activeDivisions[] {
    division-> {
      _id,
      name
    },
    status,
    teams[] {
      _ref,
      _type
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
