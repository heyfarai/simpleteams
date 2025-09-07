import { client } from './client'
import { filterDataQuery } from './queries'

export type FilterData = {
  seasons: Array<{ _id: string; name: string; isActive: boolean }>;
  conferences: Array<{ _id: string; name: string; season?: { _id: string; name: string } }>;
  divisions: Array<{ _id: string; name: string; conference?: { _id: string; name: string } }>;
}

export async function getFilterData(): Promise<FilterData> {
  try {
    const data = await client.fetch(filterDataQuery)
    return {
      seasons: data.seasons || [],
      conferences: data.conferences || [],
      divisions: data.divisions || []
    }
  } catch (error) {
    console.error('Error fetching filter data:', error)
    return {
      seasons: [],
      conferences: [],
      divisions: []
    }
  }
}
