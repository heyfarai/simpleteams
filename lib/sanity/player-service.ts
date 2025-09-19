import { client } from './client'
import type { SanityDocument } from '@sanity/client'

// Types based on Sanity schema
export interface PlayerPersonalInfo {
  dateOfBirth?: string
  gradYear?: number
  height?: string
  weight?: number
  hometown: string
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C' | 'G' | 'F' | 'F/C' | 'G/F' | 'P'
}

export interface PlayerStats {
  points?: number
  rebounds?: number
  assists?: number
  steals?: number
  blocks?: number
  minutes?: number
  fieldGoalPercentage?: number
  gamesPlayed?: number
}

export interface PlayerSocial {
  instagram?: string
  twitter?: string
  hudl?: string
}

export interface HighlightVideo {
  title: string
  url: string
  thumbnail?: any
}

export interface Player extends SanityDocument {
  name: string
  firstName: string
  lastName: string
  jerseyNumber: number
  personalInfo: PlayerPersonalInfo
  photo?: any
  stats?: PlayerStats
  awards?: string[]
  bio?: string
  highlightVideos?: HighlightVideo[]
  social?: PlayerSocial
  yearlyStats?: Array<{
    year: number
    season: string
    gamesPlayed?: number
    points?: number
    rebounds?: number
    assists?: number
    steals?: number
    blocks?: number
    minutes?: number
    fieldGoalPercentage?: number
  }>
  sessionHighs?: {
    points?: number
    rebounds?: number
    assists?: number
    steals?: number
    blocks?: number
    minutes?: number
  }
}

export interface RosterPlayer {
  player: {
    _ref: string
    _type: 'reference'
  }
  jerseyNumber: number
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C' | 'P'
  status: 'active' | 'inactive' | 'injured'
}

export interface CreatePlayerData {
  firstName: string
  lastName: string
  personalInfo: {
    gradYear?: number
    hometown: string
    position: PlayerPersonalInfo['position']
    dateOfBirth?: string
    height?: string
    weight?: number
  }
  jerseyNumber?: number
  bio?: string
}

export interface AddPlayerToRosterData {
  playerId: string
  teamId: string
  seasonId: string
  jerseyNumber: number
  position: RosterPlayer['position']
  status?: RosterPlayer['status']
}

class PlayerService {
  /**
   * Create a new player in Sanity
   */
  async createPlayer(data: CreatePlayerData): Promise<Player> {
    const playerDoc = {
      _type: 'player',
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      jerseyNumber: data.jerseyNumber || 0,
      personalInfo: data.personalInfo,
      bio: data.bio,
      stats: {
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        minutes: 0,
        fieldGoalPercentage: 0,
        gamesPlayed: 0
      },
      awards: [],
      yearlyStats: [],
      sessionHighs: {
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        minutes: 0
      }
    }

    return client.create(playerDoc)
  }

  /**
   * Get player by ID
   */
  async getPlayer(playerId: string): Promise<Player | null> {
    const query = `*[_type == "player" && _id == $playerId][0] {
      _id,
      _createdAt,
      _updatedAt,
      name,
      firstName,
      lastName,
      jerseyNumber,
      personalInfo,
      photo,
      stats,
      awards,
      bio,
      highlightVideos,
      social,
      yearlyStats,
      sessionHighs
    }`

    return client.fetch(query, { playerId })
  }

  /**
   * Search players by name or other criteria
   */
  async searchPlayers(searchTerm: string): Promise<Player[]> {
    const query = `*[_type == "player" && (
      name match $searchTerm + "*" ||
      firstName match $searchTerm + "*" ||
      lastName match $searchTerm + "*"
    )] | order(name asc) {
      _id,
      name,
      firstName,
      lastName,
      jerseyNumber,
      personalInfo,
      photo,
      stats
    }`

    return client.fetch(query, { searchTerm })
  }

  /**
   * Update player information
   */
  async updatePlayer(playerId: string, updates: Partial<CreatePlayerData>): Promise<Player> {
    const updateData: any = {}

    if (updates.firstName || updates.lastName) {
      updateData.firstName = updates.firstName
      updateData.lastName = updates.lastName
      updateData.name = `${updates.firstName || ''} ${updates.lastName || ''}`.trim()
    }

    if (updates.personalInfo) {
      updateData.personalInfo = updates.personalInfo
    }

    if (updates.jerseyNumber !== undefined) {
      updateData.jerseyNumber = updates.jerseyNumber
    }

    if (updates.bio !== undefined) {
      updateData.bio = updates.bio
    }

    return client.patch(playerId).set(updateData).commit()
  }

  /**
   * Delete a player (and remove from all rosters)
   */
  async deletePlayer(playerId: string): Promise<void> {
    // First, remove player from all team rosters
    await this.removePlayerFromAllRosters(playerId)

    // Then delete the player document
    await client.delete(playerId)
  }

  /**
   * Add player to a team roster
   */
  async addPlayerToRoster(data: AddPlayerToRosterData): Promise<void> {
    const { playerId, teamId, seasonId, jerseyNumber, position, status = 'active' } = data

    // First check if player already exists in this roster
    const existingQuery = `*[_type == "team" && _id == $teamId][0] {
      rosters[season._ref == $seasonId][0] {
        players[]
      }
    }`

    const existing = await client.fetch(existingQuery, { teamId, seasonId })

    if (existing?.rosters?.[0]?.players?.some((p: any) => p.player._ref === playerId)) {
      throw new Error('Player already exists in this roster')
    }

    // Check for jersey number conflicts
    if (existing?.rosters?.[0]?.players?.some((p: any) => p.jerseyNumber === jerseyNumber)) {
      throw new Error('Jersey number already taken in this roster')
    }

    // Add player to roster
    const rosterPlayer: RosterPlayer = {
      player: {
        _ref: playerId,
        _type: 'reference'
      },
      jerseyNumber,
      position,
      status
    }

    // Update the team document
    await client
      .patch(teamId)
      .setIfMissing({ rosters: [] })
      .insert('after', 'rosters[season._ref == $seasonId][0].players[-1]', [rosterPlayer])
      .commit({ seasonId })
  }

  /**
   * Remove player from a specific roster
   */
  async removePlayerFromRoster(playerId: string, teamId: string, seasonId: string): Promise<void> {
    // Get the current roster
    const query = `*[_type == "team" && _id == $teamId][0] {
      rosters[season._ref == $seasonId][0] {
        players[] {
          player,
          jerseyNumber,
          position,
          status
        }
      }
    }`

    const result = await client.fetch(query, { teamId, seasonId })
    const roster = result?.rosters?.[0]

    if (!roster) {
      throw new Error('Roster not found')
    }

    // Filter out the player
    const updatedPlayers = roster.players.filter((p: any) => p.player._ref !== playerId)

    // Update the roster
    await client
      .patch(teamId)
      .set({ [`rosters[season._ref == "${seasonId}"][0].players`]: updatedPlayers })
      .commit()
  }

  /**
   * Remove player from all rosters (helper for deletion)
   */
  private async removePlayerFromAllRosters(playerId: string): Promise<void> {
    // Find all teams that have this player
    const teamsQuery = `*[_type == "team" && rosters[].players[].player._ref == $playerId] {
      _id,
      rosters[] {
        season._ref,
        players[] {
          player,
          jerseyNumber,
          position,
          status
        }
      }
    }`

    const teams = await client.fetch(teamsQuery, { playerId })

    // Remove player from each roster
    for (const team of teams) {
      for (const roster of team.rosters) {
        const hasPlayer = roster.players.some((p: any) => p.player._ref === playerId)
        if (hasPlayer) {
          await this.removePlayerFromRoster(playerId, team._id, roster.season._ref)
        }
      }
    }
  }

  /**
   * Update player's roster information (jersey number, position, status)
   */
  async updatePlayerInRoster(
    playerId: string,
    teamId: string,
    seasonId: string,
    updates: {
      jerseyNumber?: number
      position?: RosterPlayer['position']
      status?: RosterPlayer['status']
    }
  ): Promise<void> {
    // Get current roster
    const query = `*[_type == "team" && _id == $teamId][0] {
      rosters[season._ref == $seasonId][0] {
        players[] {
          player,
          jerseyNumber,
          position,
          status
        }
      }
    }`

    const result = await client.fetch(query, { teamId, seasonId })
    const roster = result?.rosters?.[0]

    if (!roster) {
      throw new Error('Roster not found')
    }

    // Find and update the player
    const updatedPlayers = roster.players.map((p: any) => {
      if (p.player._ref === playerId) {
        return { ...p, ...updates }
      }
      return p
    })

    // Check for jersey number conflicts if updating jersey number
    if (updates.jerseyNumber) {
      const conflict = updatedPlayers.find((p: any) =>
        p.player._ref !== playerId && p.jerseyNumber === updates.jerseyNumber
      )
      if (conflict) {
        throw new Error('Jersey number already taken in this roster')
      }
    }

    // Update the roster
    await client
      .patch(teamId)
      .set({ [`rosters[season._ref == "${seasonId}"][0].players`]: updatedPlayers })
      .commit()
  }

  /**
   * Get all players in a specific roster
   */
  async getRosterPlayers(teamId: string, seasonId: string): Promise<any[]> {
    const query = `*[_type == "team" && _id == $teamId][0] {
      rosters[season._ref == $seasonId][0] {
        players[] {
          "player": player->{
            _id,
            name,
            firstName,
            lastName,
            personalInfo,
            photo,
            stats
          },
          jerseyNumber,
          position,
          status
        }
      }
    }`

    const result = await client.fetch(query, { teamId, seasonId })
    return result?.rosters?.[0]?.players || []
  }
}

export const playerService = new PlayerService()