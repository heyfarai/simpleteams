import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

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
    order
  },
  "seasons": *[_type == "season"] | order(year desc) {
    _id,
    name,
    year
  }
}`

export async function fetchFilterData() {
  try {
    return await client.fetch(filterDataQuery)
  } catch (error) {
    console.error('Error fetching filter data:', error)
    return {
      sessions: [],
      divisions: [],
      seasons: []
    }
  }
}
