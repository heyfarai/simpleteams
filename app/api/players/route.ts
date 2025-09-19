import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { getCurrentUser } from '@/lib/supabase/auth'

// Server-side Sanity client with write permissions
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'dev',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
})

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()
    const { playerData, rosterData } = body

    console.log('🔍 API: Creating player with data:', { playerData, rosterData })

    // Create player in Sanity
    const player = await sanity.create({
      _type: 'player',
      name: `${playerData.firstName} ${playerData.lastName}`,
      firstName: playerData.firstName,
      lastName: playerData.lastName,
      jerseyNumber: playerData.jerseyNumber || 0,
      personalInfo: {
        ...playerData.personalInfo,
        // Only include gradYear if it's provided
        ...(playerData.personalInfo.gradYear && { gradYear: playerData.personalInfo.gradYear })
      },
      bio: playerData.bio,
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
    })

    console.log('🔍 API: Player created in Sanity:', player)

    // Add player to roster if roster data is provided
    if (rosterData && rosterData.seasonId && rosterData.sanityTeamId) {
      console.log('🔍 API: Adding player to roster with Sanity team ID:', rosterData.sanityTeamId)

      const actualRosterData = {
        ...rosterData,
        teamId: rosterData.sanityTeamId
      }
      console.log('🔍 API: Adding player to roster:', actualRosterData)

      // First check if player already exists in this roster
      const existingQuery = `*[_type == "team" && _id == $teamId][0] {
        rosters[season._ref == $seasonId][0] {
          players[]
        }
      }`

      const existing = await sanity.fetch(existingQuery, {
        teamId: actualRosterData.teamId,
        seasonId: actualRosterData.seasonId
      })

      if (existing?.rosters?.[0]?.players?.some((p: any) => p.player._ref === player._id)) {
        throw new Error('Player already exists in this roster')
      }

      // Check for jersey number conflicts
      if (existing?.rosters?.[0]?.players?.some((p: any) => p.jerseyNumber === actualRosterData.jerseyNumber)) {
        throw new Error('Jersey number already taken in this roster')
      }

      // Get current roster or create empty roster structure
      const teamQuery = `*[_type == "team" && _id == $teamId][0] {
        rosters[] {
          season,
          players[]
        }
      }`

      const team = await sanity.fetch(teamQuery, { teamId: actualRosterData.teamId })
      let rosters = team?.rosters || []

      // Find existing roster for this season or create new one
      let targetRosterIndex = rosters.findIndex((r: any) => r.season._ref === actualRosterData.seasonId)

      if (targetRosterIndex === -1) {
        // Create new roster for this season
        rosters.push({
          _key: `roster-${Date.now()}`,
          season: {
            _type: 'reference',
            _ref: actualRosterData.seasonId
          },
          players: [],
          seasonStats: {
            wins: 0,
            losses: 0,
            ties: 0,
            pointsFor: 0,
            pointsAgainst: 0,
            conferenceRecord: '0-0-0'
          }
        })
        targetRosterIndex = rosters.length - 1
      }

      // Add player to roster
      const rosterPlayer = {
        _key: `player-${Date.now()}`,
        player: {
          _ref: player._id,
          _type: 'reference'
        },
        jerseyNumber: actualRosterData.jerseyNumber,
        position: actualRosterData.position,
        status: actualRosterData.status || 'active'
      }

      rosters[targetRosterIndex].players = rosters[targetRosterIndex].players || []
      rosters[targetRosterIndex].players.push(rosterPlayer)

      // Update the team document
      await sanity
        .patch(actualRosterData.teamId)
        .set({ rosters })
        .commit()

      console.log('🔍 API: Player added to roster successfully')
    }

    return NextResponse.json({
      success: true,
      player: {
        _id: player._id,
        name: player.name,
        firstName: player.firstName,
        lastName: player.lastName
      }
    })

  } catch (error) {
    console.error('❌ API: Error creating player:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create player'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const playerId = searchParams.get('id')

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID is required' },
        { status: 400 }
      )
    }

    // Fetch player data from Sanity
    const query = `*[_type == "player" && _id == $playerId][0] {
      _id,
      name,
      firstName,
      lastName,
      jerseyNumber,
      personalInfo,
      bio,
      stats,
      awards,
      yearlyStats,
      sessionHighs
    }`

    const player = await sanity.fetch(query, { playerId })

    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Player not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      player
    })

  } catch (error) {
    console.error('❌ API: Error fetching player:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch player'
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { playerId, playerData, rosterData } = body

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID is required' },
        { status: 400 }
      )
    }

    // Update player in Sanity
    const updatedPlayer = await sanity
      .patch(playerId)
      .set({
        name: `${playerData.firstName} ${playerData.lastName}`,
        firstName: playerData.firstName,
        lastName: playerData.lastName,
        jerseyNumber: playerData.jerseyNumber || 0,
        personalInfo: {
          ...playerData.personalInfo,
          ...(playerData.personalInfo.gradYear && { gradYear: playerData.personalInfo.gradYear })
        },
        bio: playerData.bio,
      })
      .commit()

    // Update roster data if provided
    if (rosterData && rosterData.teamId && rosterData.seasonId) {
      const teamQuery = `*[_type == "team" && _id == $teamId][0] {
        rosters[] {
          season,
          players[]
        }
      }`

      const team = await sanity.fetch(teamQuery, { teamId: rosterData.teamId })
      let rosters = team?.rosters || []

      // Find the roster for this season
      const rosterIndex = rosters.findIndex((r: any) => r.season._ref === rosterData.seasonId)

      if (rosterIndex !== -1 && rosters[rosterIndex].players) {
        // Find and update the player in the roster
        const playerIndex = rosters[rosterIndex].players.findIndex(
          (p: any) => p.player._ref === playerId
        )

        if (playerIndex !== -1) {
          // Update roster player data
          rosters[rosterIndex].players[playerIndex] = {
            ...rosters[rosterIndex].players[playerIndex],
            jerseyNumber: rosterData.jerseyNumber,
            position: rosterData.position,
            status: rosterData.status || 'active'
          }

          // Update the team document
          await sanity
            .patch(rosterData.teamId)
            .set({ rosters })
            .commit()
        }
      }
    }

    return NextResponse.json({
      success: true,
      player: {
        _id: updatedPlayer._id,
        name: updatedPlayer.name,
        firstName: updatedPlayer.firstName,
        lastName: updatedPlayer.lastName
      }
    })

  } catch (error) {
    console.error('❌ API: Error updating player:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update player'
      },
      { status: 500 }
    )
  }
}