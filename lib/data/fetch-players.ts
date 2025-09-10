import { client, urlFor } from '@/lib/sanity/client'
import { 
  allPlayersQuery,
  allTeamsWithRostersQuery,
  playerDetailsQuery, 
  filterOptionsQuery,
  leaderboardQueries,
  type StatCategory
} from '@/lib/sanity/player-queries'
import { 
  SanityTeam, 
  SanityPlayer, 
  PlayerWithTeamInfo, 
  FilterOptions,
  SanityRosterPlayer 
} from '@/lib/sanity/types'

// Transform player data for the showcase component
export interface ShowcasePlayer {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  team: string;
  teamId: string;
  jersey: number;
  position: string;
  gradYear: number;
  height?: string;
  headshot?: string;
  stats: {
    ppg: number;
    rpg: number;
    apg: number;
    spg: number;
    bpg: number;
    mpg: number;
  };
  awards: string[];
  hasHighlight: boolean;
  division: string;
  gamesPlayed: number;
  year: string;
  season: string;
  hometown: string;
}

// Fetch all players from all teams
export async function fetchAllPlayers(): Promise<ShowcasePlayer[]> {
  try {
    // Fetch all players and all teams separately
    const [allPlayers, allTeams] = await Promise.all([
      client.fetch(allPlayersQuery),
      client.fetch(allTeamsWithRostersQuery)
    ])

    // Create a map of player ID to team/roster info
    const playerTeamMap = new Map<string, Array<{
      team: any,
      roster: any,
      rosterPlayer: any
    }>>()

    allTeams.forEach((team: any) => {
      team.rosters?.forEach((roster: any) => {
        roster.players.forEach((rosterPlayer: any) => {
          const playerId = rosterPlayer.player._id
          if (!playerTeamMap.has(playerId)) {
            playerTeamMap.set(playerId, [])
          }
          playerTeamMap.get(playerId)!.push({
            team,
            roster,
            rosterPlayer
          })
        })
      })
    })

    // Transform players with their team info (use most recent team/season)
    const showcasePlayers: ShowcasePlayer[] = allPlayers.map((player: any) => {
      const teamInfo = playerTeamMap.get(player._id)
      
      // Use the most recent team/season info, or fallback values
      const mostRecentInfo = teamInfo?.[0] || {
        team: { name: 'Free Agent', _id: 'unknown' },
        roster: { season: { year: new Date().getFullYear(), name: 'Current' } },
        rosterPlayer: { jerseyNumber: 0, position: 'PG' }
      }

      return {
        id: player._id, // Use actual player ID
        firstName: player.firstName || 'Unknown',
        lastName: player.lastName || 'Player',
        name: player.name || `${player.firstName || 'Unknown'} ${player.lastName || 'Player'}`,
        team: mostRecentInfo.team.name,
        teamId: mostRecentInfo.team._id,
        jersey: mostRecentInfo.rosterPlayer.jerseyNumber || 0,
        position: getPositionFullName(mostRecentInfo.rosterPlayer.position || 'PG'),
        gradYear: player.personalInfo?.gradYear || new Date().getFullYear() + 1,
        height: player.personalInfo?.height || 'N/A',
        headshot: player.photo ? urlFor(player.photo).width(400).height(400).url() : undefined,
        stats: {
          ppg: player.stats?.points || 0,
          rpg: player.stats?.rebounds || 0,
          apg: player.stats?.assists || 0,
          spg: player.stats?.steals || 0,
          bpg: player.stats?.blocks || 0,
          mpg: player.stats?.minutes || 0,
        },
        awards: player.awards || [],
        hasHighlight: (player.highlightVideos?.length || 0) > 0,
        division: 'Diamond', // TODO: Get actual division from team/season data
        gamesPlayed: player.stats?.gamesPlayed || 0,
        year: mostRecentInfo.roster.season.year.toString(),
        season: mostRecentInfo.roster.season.name,
        hometown: player.personalInfo?.hometown || 'Unknown'
      }
    })

    return showcasePlayers
  } catch (error) {
    console.error('Error fetching players:', error)
    return []
  }
}

// Fetch a specific player with full details
export async function fetchPlayerDetails(playerId: string): Promise<PlayerWithTeamInfo | null> {
  try {
    const player = await client.fetch(playerDetailsQuery, { playerId })
    return player
  } catch (error) {
    console.error('Error fetching player details:', error)
    return null
  }
}

// Fetch stat leaders using optimized queries
export async function fetchStatLeaders(year: string, season: string): Promise<ShowcasePlayer[]> {
  try {
    // For now, return all players filtered by year/season
    // TODO: Add year/season filtering to the leaderboard queries
    const allPlayers = await fetchAllPlayers()
    return allPlayers.filter(player => 
      player.year === year && player.season === season
    )
  } catch (error) {
    console.error('Error fetching stat leaders:', error)
    return []
  }
}

// Fetch leaders for a specific stat category (optimized)
export async function fetchLeadersByCategory(category: StatCategory): Promise<ShowcasePlayer[]> {
  try {
    const query = leaderboardQueries[category]
    const leaders = await client.fetch(query)
    
    // We need to get team info for these players
    const [allTeams] = await Promise.all([
      client.fetch(allTeamsWithRostersQuery)
    ])

    // Create player-team mapping
    const playerTeamMap = new Map<string, any>()
    allTeams.forEach((team: any) => {
      team.rosters?.forEach((roster: any) => {
        roster.players.forEach((rosterPlayer: any) => {
          const playerId = rosterPlayer.player._id
          if (!playerTeamMap.has(playerId)) {
            playerTeamMap.set(playerId, {
              team,
              roster,
              rosterPlayer
            })
          }
        })
      })
    })

    // Transform to ShowcasePlayer format
    return leaders.map((player: any) => {
      const teamInfo = playerTeamMap.get(player._id) || {
        team: { name: 'Free Agent', _id: 'unknown' },
        roster: { season: { year: new Date().getFullYear(), name: 'Current' } },
        rosterPlayer: { jerseyNumber: 0, position: 'PG' }
      }

      return {
        id: player._id,
        firstName: player.firstName || 'Unknown',
        lastName: player.lastName || 'Player',
        name: player.name || `${player.firstName || 'Unknown'} ${player.lastName || 'Player'}`,
        team: teamInfo.team.name,
        teamId: teamInfo.team._id,
        jersey: teamInfo.rosterPlayer.jerseyNumber || 0,
        position: getPositionFullName(teamInfo.rosterPlayer.position || 'PG'),
        gradYear: player.personalInfo?.gradYear || new Date().getFullYear() + 1,
        height: player.personalInfo?.height || 'N/A',
        headshot: player.photo ? urlFor(player.photo).width(400).height(400).url() : undefined,
        stats: {
          ppg: player.stats?.points || 0,
          rpg: player.stats?.rebounds || 0,
          apg: player.stats?.assists || 0,
          spg: player.stats?.steals || 0,
          bpg: player.stats?.blocks || 0,
          mpg: player.stats?.minutes || 0,
        },
        awards: player.awards || [],
        hasHighlight: (player.highlightVideos?.length || 0) > 0,
        division: 'Diamond',
        gamesPlayed: player.stats?.gamesPlayed || 0,
        year: teamInfo.roster.season.year.toString(),
        season: teamInfo.roster.season.name,
        hometown: player.personalInfo?.hometown || 'Unknown'
      }
    })
  } catch (error) {
    console.error(`Error fetching ${category} leaders:`, error)
    return []
  }
}

// Fetch filter options for the showcase
export async function fetchFilterOptions(): Promise<FilterOptions> {
  try {
    const options = await client.fetch(filterOptionsQuery)
    return options
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return {
      seasons: [],
      divisions: [],
      teams: [],
      positions: ['PG', 'SG', 'SF', 'PF', 'C']
    }
  }
}

// Helper function to convert position abbreviations to full names
function getPositionFullName(position: string): string {
  const positionMap: Record<string, string> = {
    'PG': 'Point Guard',
    'SG': 'Shooting Guard',
    'SF': 'Small Forward',
    'PF': 'Power Forward',
    'C': 'Center'
  }
  return positionMap[position] || position
}

// Helper function to get position abbreviation from full name
export function getPositionAbbreviation(position: string): string {
  const positionMap: Record<string, string> = {
    'Point Guard': 'PG',
    'Shooting Guard': 'SG',
    'Small Forward': 'SF',
    'Power Forward': 'PF',
    'Center': 'C'
  }
  return positionMap[position] || position
}
