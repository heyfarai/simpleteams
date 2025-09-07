import { groq } from 'next-sanity';

export const teamsQuery = groq`*[_type == "team"] {
  _id,
  name,
  logo,
  division->{
    _id,
    name
  },
  coach,
  region,
  description,
  homeVenue,
  awards,
  "sessionIds": *[_type == "session" && references(^._id)]._id,
  stats
}`;
