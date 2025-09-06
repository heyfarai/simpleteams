import { Player } from "../sample-data";

export const samplePlayers: Player[] = [
  {
    id: "1",
    name: "Marcus Thompson",
    teamId: "2",
    position: "Point Guard",
    jerseyNumber: 23,
    gradYear: "2025",
    height: "6'2\"",
    weight: "185 lbs",
    photo: "/basketball-player-portrait-action-shot.png",
    stats: {
      points: 18.5,
      rebounds: 4.2,
      assists: 8.1,
      steals: 2.3,
      blocks: 0.4,
      minutes: 32.5,
      fieldGoalPercentage: 47.2,
      gamesPlayed: 15,
    },
    yearlyStats: [
      {
        year: 2024,
        season: "Regular Season",
        points: 18.5,
        rebounds: 4.2,
        assists: 8.1,
        steals: 2.3,
        blocks: 0.4,
        minutes: 32.5,
        fieldGoalPercentage: 47.2,
        gamesPlayed: 15,
      },
      // ... other yearly stats
    ],
    sessionHighs: {
      points: 32,
      rebounds: 8,
      assists: 12,
      steals: 5,
    },
    awards: ["MVP 2024", "All-Tournament 2024", "Most Improved 2023"],
    bio: "2025 guard with elite first step and lockdown defense. Loves transition play and thrives in high-pressure matchups. Natural leader who elevates teammates' performance.",
    highlightVideo: "https://example.com/marcus-highlights",
    highlightVideos: [
      // ... highlight videos
    ],
    region: "North Springfield",
    hometown: "Springfield, IL",
    division: "Diamond",
    scoutingNotes:
      "High motor combo guard with natural court vision. D1 potential if outside shooting continues to improve. Excellent leadership qualities and basketball IQ.",
    social: {
      instagram: "@mthompson23",
      twitter: "@MarcusHoops23",
      hudl: "https://hudl.com/profile/marcus-thompson",
    },
    contactEmail: "marcus.thompson@email.com",
  },
  // ... other players
];
