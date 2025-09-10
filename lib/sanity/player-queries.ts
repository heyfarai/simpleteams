import { groq } from 'next-sanity'

// Simple query to get all players
export const allPlayersQuery = groq`
  *[_type == "player"] | order(lastName asc) {
    _id,
    name,
    firstName,
    lastName,
    personalInfo {
      dateOfBirth,
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
    awards,
    bio,
    highlightVideos[] {
      title,
      url,
      thumbnail
    },
    social {
      instagram,
      twitter,
      hudl
    }
  }
`

// Simple query to get all teams with their rosters
export const allTeamsWithRostersQuery = groq`
  *[_type == "team"] {
    _id,
    name,
    shortName,
    logo,
    location,
    colors,
    rosters[] {
      season->{
        _id,
        name,
        year,
        status
      },
      players[] {
        player->{
          _id
        },
        jerseyNumber,
        position,
        status
      }
    }
  }
`

// Legacy query - keeping for backward compatibility
export const playersWithStatsQuery = allPlayersQuery

// Query to get a specific player with full details
export const playerDetailsQuery = groq`
  *[_type == "player" && _id == $playerId][0] {
    _id,
    name,
    firstName,
    lastName,
    personalInfo {
      dateOfBirth,
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
    awards,
    bio,
    highlightVideos[] {
      title,
      url,
      thumbnail
    },
    social {
      instagram,
      twitter,
      hudl
    },
    "teamInfo": *[_type == "team" && references(^._id)] {
      _id,
      name,
      shortName,
      logo,
      colors,
      "roster": rosters[players[].player._ref match ^._id][0] {
        season->{
          _id,
          name,
          year
        },
        "playerDetails": players[player._ref == ^._id][0] {
          jerseyNumber,
          position,
          status
        }
      }
    }[0]
  }
`

// Efficient leaderboard queries - pre-sorted and limited
export const pointsLeadersQuery = groq`
  *[_type == "player" && defined(stats) && stats.points > 0] | order(stats.points desc) [0...10] {
    _id,
    name,
    firstName,
    lastName,
    personalInfo {
      gradYear,
      height,
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
      gamesPlayed
    },
    awards,
    highlightVideos[] {
      title,
      url
    }
  }
`

export const reboundsLeadersQuery = groq`
  *[_type == "player" && defined(stats) && stats.rebounds > 0] | order(stats.rebounds desc) [0...10] {
    _id,
    name,
    firstName,
    lastName,
    personalInfo {
      gradYear,
      height,
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
      gamesPlayed
    },
    awards,
    highlightVideos[] {
      title,
      url
    }
  }
`

export const assistsLeadersQuery = groq`
  *[_type == "player" && defined(stats) && stats.assists > 0] | order(stats.assists desc) [0...10] {
    _id,
    "seasonStats": *[_type == "team" && references(^._id)].rosters[].players[player._ref == ^._id][0] {
      "season": season->,
      stats {
        points,
        rebounds,
        assists,
        steals,
        blocks,
        minutes,
        gamesPlayed
      }
    },
    _id,
    name,
    firstName,
    lastName,
    personalInfo {
      gradYear,
      height,
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
      gamesPlayed
    },
    awards,
    highlightVideos[] {
      title,
      url
    }
  }
`

export const stealsLeadersQuery = groq`
  *[_type == "player" && defined(stats) && stats.steals > 0] | order(stats.steals desc) [0...10] {
    _id,
    "seasonStats": *[_type == "team" && references(^._id)].rosters[].players[player._ref == ^._id][0] {
      "season": season->,
      stats {
        points,
        rebounds,
        assists,
        steals,
        blocks,
        minutes,
        gamesPlayed
      }
    },
    _id,
    name,
    firstName,
    lastName,
    personalInfo {
      gradYear,
      height,
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
      gamesPlayed
    },
    awards,
    highlightVideos[] {
      title,
      url
    }
  }
`

export const blocksLeadersQuery = groq`
  *[_type == "player" && defined(stats) && stats.blocks > 0] | order(stats.blocks desc) [0...10] {
    _id,
    "seasonStats": *[_type == "team" && references(^._id)].rosters[].players[player._ref == ^._id][0] {
      "season": season->,
      stats {
        points,
        rebounds,
        assists,
        steals,
        blocks,
        minutes,
        gamesPlayed
      }
    },
    _id,
    name,
    firstName,
    lastName,
    personalInfo {
      gradYear,
      height,
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
      gamesPlayed
    },
    awards,
    highlightVideos[] {
      title,
      url
    }
  }
`

export const minutesLeadersQuery = groq`
  *[_type == "player" && defined(stats) && stats.minutes > 0] | order(stats.minutes desc) [0...10] {
    _id,
    "seasonStats": *[_type == "team" && references(^._id)].rosters[].players[player._ref == ^._id][0] {
      "season": season->,
      stats {
        points,
        rebounds,
        assists,
        steals,
        blocks,
        minutes,
        gamesPlayed
      }
    },
    _id,
    name,
    firstName,
    lastName,
    personalInfo {
      gradYear,
      height,
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
      gamesPlayed
    },
    awards,
    highlightVideos[] {
      title,
      url
    }
  }
`

// Query to get all available seasons and divisions for filtering
export const filterOptionsQuery = groq`{
  "seasons": *[_type == "season"] {
    _id,
    name,
    year,
    status
  },
  "divisions": *[_type == "division"] {
    _id,
    name,
    ageGroup,
    skillLevel,
    conference->{
      _id,
      name
    }
  },
  "teams": *[_type == "team"] {
    _id,
    name,
    shortName
  },
  "positions": ["PG", "SG", "SF", "PF", "C"]
}`

// Map of stat categories to their corresponding queries
export const leaderboardQueries = {
  ppg: pointsLeadersQuery,
  rpg: reboundsLeadersQuery,
  apg: assistsLeadersQuery,
  spg: stealsLeadersQuery,
  bpg: blocksLeadersQuery,
  mpg: minutesLeadersQuery
} as const

export type StatCategory = keyof typeof leaderboardQueries
