import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

import { FilterOptions } from '@/lib/sanity/types'

const filterDataQuery = groq`{
  "sessions": *[_type == "session"] | order(startDate desc) {
    _id,
    name,
    type,
    startDate,
    isActive
  },
  "divisions": *[_type == "division"] | order(order asc) {
    _id,
    name,
    order,
    "seasons": *[_type == "season"] | order(year desc) {
      _id, 
      name, 
      year, 
      status, 
      isActive
    }
  },
  "seasons": *[_type == "season"] | order(year desc) {
    _id,
    name,
    year,
    startDate,
    endDate,
    status,
    isActive
  },
  "teams": *[_type == "team"] {
    _id,
    name,
    shortName
  },
  "positions": *[_type == "player"].position[]
}`

export async function fetchFilterData(): Promise<FilterOptions> {
  try {
    return await client.fetch(filterDataQuery)
  } catch (error) {
    console.error('Error fetching filter data:', error)
    return {
      divisions: [],
      seasons: [],
      teams: [],
      positions: []
    }
  }
}
