import { groq } from 'next-sanity'

export const seasonsQuery = groq`
  *[_type == "season"] {
    _id,
    name,
    year,
    startDate,
    endDate,
    isActive,
    status
  }
`

export const conferencesQuery = groq`
  *[_type == "conference"] {
    _id,
    name,
    season->{_id, name},
    divisions[]->{_id, name}
  }
`

export const divisionsQuery = groq`
  *[_type == "division"] {
    _id,
    name,
    conference->{_id, name},
    season->{_id, name}
  }
`

// Filter queries
export const filterDataQuery = groq`{
  "seasons": *[_type == "season"] {
    _id,
    name,
    isActive
  },
  "conferences": *[_type == "conference"] {
    _id,
    name,
    season->{_id, name}
  },
  "divisions": *[_type == "division"] {
    _id,
    name,
    conference->{_id, name}
  }
}`
