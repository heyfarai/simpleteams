import { groq } from 'next-sanity'

export const playerProfileQuery = groq`*[_type == "player" && _id == $playerId][0] {
  _id,
  name,
  firstName,
  lastName,
  personalInfo {
    gradYear,
    height,
    weight,
    hometown
  },
  photo,
  stats {
    points,
    rebounds,
    assists,
    steals,
    blocks,
    minutes,
    fieldGoalPercentage,
    gamesPlayed
  },
  yearlyStats[] {
    year,
    season,
    gamesPlayed,
    points,
    rebounds,
    assists,
    steals,
    blocks,
    minutes,
    fieldGoalPercentage
  },
  sessionHighs {
    points,
    rebounds,
    assists,
    steals,
    blocks,
    minutes
  },
  awards,
  bio,
  highlightVideos[] {
    title,
    url,
    "thumbnail": thumbnail.asset->url
  },
  social {
    instagram,
    twitter,
    hudl
  },
  "team": *[_type == "team" && references(^._id)][0] {
    _id,
    name,
    division,
    coach,
    record,
    logo
  }
}`
