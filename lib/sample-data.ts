// Sample data structure matching the new hierarchy: Games -> Sessions -> Seasons

export interface Season {
  id: string;
  name: string;
  type: "Regular" | "Summer";
  year: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  status: "draft" | "active" | "completed" | "archived";
  locations: string[]; // Location IDs assigned to this season
  officials: string[]; // Official IDs assigned to this season
  createdAt: string;
  updatedAt: string;
}

export interface Conference {
  id: string;
  name: string;
  seasonId: string;
  divisions: Division[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Division {
  id: string;
  name: string;
  conferenceId: string;
  seasonId: string;
  teams: string[]; // Team IDs assigned to this division
  maxTeams?: number;
  minTeams?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  name: string;
  type: "regular" | "playoff" | "Regular" | "Playoff" | "Tournament";
  seasonId: string;
  startDate: string;
  endDate: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: string;
  sessionId: string;
  seasonId: string;
  divisionId?: string;
  homeTeamId: string;
  awayTeamId: string;
  locationId?: string;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  assignedOfficials?: string[]; // Official IDs
  status:
    | "scheduled"
    | "live"
    | "completed"
    | "cancelled"
    | "postponed"
    | "in-progress";
  homeScore?: number;
  awayScore?: number;
  division: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  city?: string;
  region?: string;
  primaryColors?: string[];
  division: string;
  divisionId?: string;
  seasonId?: string;
  coach: string;
  coaches?: Coach[];
  contacts?: Contact[];
  record: string;
  description: string;
  founded: string;
  homeVenue: string;
  awards: string[];
  sessionIds: string[];
  status?: "active" | "inactive" | "pending";
  registrationDate?: string;
  isPersistent?: boolean; // Teams persist across seasons
  stats?: {
    wins: number;
    losses: number;
    pointsFor: number;
    pointsAgainst: number;
    gamesPlayed: number;
    streak: Array<"W" | "L" | "T">; // Last 5 games
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Coach {
  id: string;
  name: string;
  role: "head" | "assistant" | "volunteer";
  email?: string;
  phone?: string;
  certifications?: string[];
}

export interface Contact {
  id: string;
  name: string;
  role: "manager" | "parent" | "coordinator";
  email: string;
  phone?: string;
  isPrimary: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity?: number;
  facilities: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Official {
  id: string;
  name: string;
  email: string;
  phone?: string;
  certificationLevel: "certified" | "trainee" | "veteran";
  specialties: string[];
  availability: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  jerseyNumber: number;
  gradYear: string;
  height: string;
  weight: string;
  photo: string;
  stats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    minutes: number;
    fieldGoalPercentage: number;
    gamesPlayed: number;
  };
  yearlyStats: {
    year: number;
    season: string;
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    minutes: number;
    fieldGoalPercentage: number;
    gamesPlayed: number;
  }[];
  sessionHighs: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
  };
  awards: string[];
  bio: string;
  highlightVideo?: string;
  highlightVideos: {
    title: string;
    url: string;
    thumbnail: string;
  }[];
  region: string;
  hometown: string;
  division: string;
  scoutingNotes?: string;
  social: {
    instagram?: string;
    twitter?: string;
    hudl?: string;
  };
  contactEmail?: string;
}

// Sample Seasons
export const sampleSeasons: Season[] = [
  {
    id: "1",
    name: "2024-25 Championship Season",
    type: "Regular",
    year: 2024,
    startDate: "2024-10-01",
    endDate: "2025-03-31",
    isActive: true,
    status: "active",
    locations: ["loc-1", "loc-2", "loc-3"],
    officials: ["off-1", "off-2", "off-3"],
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-09-20T00:00:00Z",
  },
  {
    id: "2",
    name: "2024 Summer Development League",
    type: "Summer",
    year: 2024,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    isActive: false,
    status: "completed",
    locations: ["loc-1", "loc-4"],
    officials: ["off-1", "off-4"],
    createdAt: "2024-04-15T00:00:00Z",
    updatedAt: "2024-08-31T00:00:00Z",
  },
];

// Sample Conferences
export const sampleConferences: Conference[] = [
  {
    id: "conf-1",
    name: "Eastern Conference",
    seasonId: "1",
    divisions: [
      {
        id: "div-1",
        name: "Diamond Division",
        conferenceId: "conf-1",
        seasonId: "1",
        teams: ["1", "2", "5", "7"],
        maxTeams: 6,
        minTeams: 4,
        description: "Top-tier competitive division",
        createdAt: "2024-09-01T00:00:00Z",
        updatedAt: "2024-09-15T00:00:00Z",
      },
      {
        id: "div-2",
        name: "Premier Division",
        conferenceId: "conf-1",
        seasonId: "1",
        teams: ["3", "4", "6", "8"],
        maxTeams: 6,
        minTeams: 4,
        description: "Competitive division for developing teams",
        createdAt: "2024-09-01T00:00:00Z",
        updatedAt: "2024-09-15T00:00:00Z",
      },
    ],
    description: "Primary conference for established teams",
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2024-09-15T00:00:00Z",
  },
  {
    id: "conf-2",
    name: "Western Conference",
    seasonId: "1",
    divisions: [
      {
        id: "div-3",
        name: "Development Division",
        conferenceId: "conf-2",
        seasonId: "1",
        teams: [],
        maxTeams: 8,
        minTeams: 4,
        description: "Entry-level division for new teams",
        createdAt: "2024-09-01T00:00:00Z",
        updatedAt: "2024-09-15T00:00:00Z",
      },
    ],
    description: "Conference for developing and new teams",
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2024-09-15T00:00:00Z",
  },
];

// Sample Sessions
export const sampleSessions: Session[] = [
  {
    id: "1",
    name: "Session 1 – Jan 10–11",
    type: "regular",
    seasonId: "1",
    startDate: "2025-01-10",
    endDate: "2025-01-11",
    description: "Opening weekend of the championship season",
    isActive: true,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Session 2 – Jan 17–18",
    type: "regular",
    seasonId: "1",
    startDate: "2025-01-17",
    endDate: "2025-01-18",
    description: "Second weekend of regular season play",
    isActive: true,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "3",
    name: "Championship Finals – Mar 15–16",
    type: "Tournament",
    seasonId: "1",
    startDate: "2025-03-15",
    endDate: "2025-03-16",
    description: "Season championship tournament",
    isActive: false,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "4",
    name: "Summer Tournament",
    type: "regular",
    seasonId: "2",
    startDate: "2024-07-01",
    endDate: "2024-07-31",
    description: "Summer league games and development",
    isActive: false,
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2024-07-31T00:00:00Z",
  },
];

// Sample Teams
export const sampleTeams: Team[] = [
  {
    id: "1",
    name: "ONL-X Senior",
    logo: null,
    city: "Springfield",
    region: "Central Illinois",
    primaryColors: ["#1e40af", "#fbbf24"],
    division: "Diamond Division",
    divisionId: "div-1",
    seasonId: "1",
    coach: "Coach Martinez",
    coaches: [
      {
        id: "coach-1",
        name: "Coach Martinez",
        role: "head",
        email: "martinez@thunderbolts.com",
        phone: "(555) 123-4567",
        certifications: ["Level 3 Certified", "Youth Development"],
      },
    ],
    contacts: [
      {
        id: "contact-1",
        name: "Sarah Martinez",
        role: "manager",
        email: "sarah.martinez@thunderbolts.com",
        phone: "(555) 123-4568",
        isPrimary: true,
      },
    ],
    record: "12-3",
    description:
      "Dominant force in the Diamond Division with explosive offensive plays.",
    founded: "2019",
    homeVenue: "Thunder Arena",
    awards: [
      "Division Champion 2024",
      "Tournament Winner 2023",
      "Best Record 2024",
    ],
    sessionIds: ["1", "2", "3"],
    status: "active",
    registrationDate: "2024-08-15T00:00:00Z",
    isPersistent: true,
    stats: {
      wins: 12,
      losses: 3,
      pointsFor: 1425,
      pointsAgainst: 1185,
      gamesPlayed: 15,
      streak: ["W", "W", "W", "L", "W"],
    },
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-09-20T00:00:00Z",
  },
  {
    id: "2",
    name: "Kingmo Elite",
    logo: null,
    city: "Springfield",
    region: "Central Illinois",
    primaryColors: ["#ef4444", "#eab308"],
    division: "Diamond Division",
    divisionId: "div-1",
    seasonId: "1",
    coach: "Coach Johnson",
    coaches: [
      {
        id: "coach-2",
        name: "Coach Johnson",
        role: "head",
        email: "johnson@firehawks.com",
        phone: "(555) 123-4569",
        certifications: ["Level 2 Certified", "Youth Development"],
      },
    ],
    contacts: [
      {
        id: "contact-2",
        name: "John Johnson",
        role: "manager",
        email: "john.johnson@firehawks.com",
        phone: "(555) 123-4570",
        isPrimary: true,
      },
    ],
    record: "10-5",
    description: "Known for their aggressive defense and fast-break offense.",
    founded: "2020",
    homeVenue: "Hawks Nest",
    awards: ["Defensive Team 2024", "Most Improved 2023"],
    sessionIds: ["1", "2"],
    status: "active",
    registrationDate: "2024-08-15T00:00:00Z",
    isPersistent: true,
    stats: {
      wins: 10,
      losses: 5,
      pointsFor: 1275,
      pointsAgainst: 1200,
      gamesPlayed: 15,
      streak: ["L", "W", "W", "L", "W"],
    },
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-09-20T00:00:00Z",
  },
  {
    id: "3",
    name: "Brockville Blazers",
    logo: null,
    city: "Springfield",
    region: "Central Illinois",
    primaryColors: ["#3b82f6", "#ec4899"],
    division: "Premier Division",
    divisionId: "div-2",
    seasonId: "1",
    coach: "Coach Williams",
    coaches: [
      {
        id: "coach-3",
        name: "Coach Williams",
        role: "head",
        email: "williams@stormriders.com",
        phone: "(555) 123-4571",
        certifications: ["Level 1 Certified", "Youth Development"],
      },
    ],
    contacts: [
      {
        id: "contact-3",
        name: "Laura Williams",
        role: "manager",
        email: "laura.williams@stormriders.com",
        phone: "(555) 123-4572",
        isPrimary: true,
      },
    ],
    record: "8-7",
    description: "Young team with incredible potential and team chemistry.",
    founded: "2021",
    homeVenue: "Storm Center",
    awards: ["Rising Stars 2024", "Best Teamwork 2023"],
    sessionIds: ["1", "2", "4"],
    status: "active",
    registrationDate: "2024-08-15T00:00:00Z",
    isPersistent: true,
    stats: {
      wins: 8,
      losses: 7,
      pointsFor: 1125,
      pointsAgainst: 1140,
      gamesPlayed: 15,
      streak: ["W", "L", "W", "W", "L"],
    },
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-09-20T00:00:00Z",
  },
  {
    id: "4",
    name: "Helisis",
    logo: null,
    city: "Springfield",
    region: "Central Illinois",
    primaryColors: ["#fbbf24", "#1e40af"],
    division: "Premier Division",
    divisionId: "div-2",
    seasonId: "1",
    coach: "Coach Davis",
    coaches: [
      {
        id: "coach-4",
        name: "Coach Davis",
        role: "head",
        email: "davis@lightningstrikes.com",
        phone: "(555) 123-4573",
        certifications: ["Level 3 Certified", "Youth Development"],
      },
    ],
    contacts: [
      {
        id: "contact-4",
        name: "David Davis",
        role: "manager",
        email: "david.davis@lightningstrikes.com",
        phone: "(555) 123-4574",
        isPrimary: true,
      },
    ],
    record: "11-4",
    description: "Fast-paced team that excels in transition basketball.",
    founded: "2018",
    homeVenue: "Lightning Court",
    awards: [
      "Division Champion 2023",
      "Fast Break Award 2024",
      "Coach of Year 2023",
    ],
    sessionIds: ["1", "2", "3", "4"],
    status: "active",
    registrationDate: "2024-08-15T00:00:00Z",
    isPersistent: true,
    stats: {
      wins: 11,
      losses: 4,
      pointsFor: 1380,
      pointsAgainst: 1220,
      gamesPlayed: 15,
      streak: ["W", "W", "L", "W", "W"],
    },
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-09-20T00:00:00Z",
  },
  {
    id: "5",
    name: "Montreal Wildcats",
    logo: "/placeholder.svg?height=64&width=64",
    city: "Springfield",
    region: "Central Illinois",
    primaryColors: ["#fbbf24", "#1e40af"],
    division: "Diamond Division",
    divisionId: "div-1",
    seasonId: "1",
    coach: "Coach Thompson",
    coaches: [
      {
        id: "coach-5",
        name: "Coach Thompson",
        role: "head",
        email: "thompson@blazingcomets.com",
        phone: "(555) 123-4575",
        certifications: ["Level 2 Certified", "Youth Development"],
      },
    ],
    contacts: [
      {
        id: "contact-5",
        name: "Emily Thompson",
        role: "manager",
        email: "emily.thompson@blazingcomets.com",
        phone: "(555) 123-4576",
        isPrimary: true,
      },
    ],
    record: "9-6",
    description: "High-energy team with explosive scoring ability.",
    founded: "2020",
    homeVenue: "Comet Arena",
    awards: ["Rookie Team 2023"],
    sessionIds: ["1", "2"],
    status: "active",
    registrationDate: "2024-08-15T00:00:00Z",
    isPersistent: true,
    stats: {
      wins: 9,
      losses: 6,
      pointsFor: 1290,
      pointsAgainst: 1265,
      gamesPlayed: 15,
      streak: ["L", "L", "W", "W", "L"],
    },
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-09-20T00:00:00Z",
  },
  {
    id: "6",
    name: "BGC Regional",
    logo: "/placeholder.svg?height=64&width=64",
    city: "Springfield",
    region: "Central Illinois",
    primaryColors: ["#fbbf24", "#1e40af"],
    division: "Premier Division",
    divisionId: "div-2",
    seasonId: "1",
    coach: "Coach Anderson",
    coaches: [
      {
        id: "coach-6",
        name: "Coach Anderson",
        role: "head",
        email: "anderson@steelwolves.com",
        phone: "(555) 123-4577",
        certifications: ["Level 1 Certified", "Youth Development"],
      },
    ],
    contacts: [
      {
        id: "contact-6",
        name: "Chris Anderson",
        role: "manager",
        email: "chris.anderson@steelwolves.com",
        phone: "(555) 123-4578",
        isPrimary: true,
      },
    ],
    record: "7-8",
    description: "Defensive-minded team with strong fundamentals.",
    founded: "2019",
    homeVenue: "Wolf Den",
    awards: ["Best Defense 2023"],
    sessionIds: ["1", "2"],
    status: "active",
    registrationDate: "2024-08-15T00:00:00Z",
    isPersistent: true,
    stats: {
      wins: 7,
      losses: 8,
      pointsFor: 1050,
      pointsAgainst: 1095,
      gamesPlayed: 15,
      streak: ["L", "W", "L", "L", "W"],
    },
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-09-20T00:00:00Z",
  },
  {
    id: "7",
    name: "Golden Eagles",
    logo: "/placeholder.svg?height=64&width=64",
    city: "Springfield",
    region: "Central Illinois",
    primaryColors: ["#fbbf24", "#1e40af"],
    division: "Diamond Division",
    divisionId: "div-1",
    seasonId: "1",
    coach: "Coach Rodriguez",
    coaches: [
      {
        id: "coach-7",
        name: "Coach Rodriguez",
        role: "head",
        email: "rodriguez@goldeneagles.com",
        phone: "(555) 123-4579",
        certifications: ["Level 3 Certified", "Youth Development"],
      },
    ],
    contacts: [
      {
        id: "contact-7",
        name: "Rachel Rodriguez",
        role: "manager",
        email: "rachel.rodriguez@goldeneagles.com",
        phone: "(555) 123-4580",
        isPrimary: true,
      },
    ],
    record: "6-9",
    description: "Young developing team with promising talent.",
    founded: "2022",
    homeVenue: "Eagle's Nest",
    awards: [],
    sessionIds: ["1", "2"],
    status: "active",
    registrationDate: "2024-08-15T00:00:00Z",
    isPersistent: true,
    stats: {
      wins: 6,
      losses: 9,
      pointsFor: 1125,
      pointsAgainst: 1275,
      gamesPlayed: 15,
      streak: ["L", "L", "L", "W", "L"],
    },
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-09-20T00:00:00Z",
  },
  {
    id: "8",
    name: "Crimson Tigers",
    logo: "/placeholder.svg?height=64&width=64",
    city: "Springfield",
    region: "Central Illinois",
    primaryColors: ["#fbbf24", "#1e40af"],
    division: "Premier Division",
    divisionId: "div-2",
    seasonId: "1",
    coach: "Coach Lee",
    coaches: [
      {
        id: "coach-8",
        name: "Coach Lee",
        role: "head",
        email: "lee@crimsontigers.com",
        phone: "(555) 123-4581",
        certifications: ["Level 2 Certified", "Youth Development"],
      },
    ],
    contacts: [
      {
        id: "contact-8",
        name: "Michael Lee",
        role: "manager",
        email: "michael.lee@crimsontigers.com",
        phone: "(555) 123-4582",
        isPrimary: true,
      },
    ],
    record: "5-10",
    description: "Rebuilding team focused on player development.",
    founded: "2021",
    homeVenue: "Tiger Court",
    awards: [],
    sessionIds: ["1", "2"],
    status: "active",
    registrationDate: "2024-08-15T00:00:00Z",
    isPersistent: true,
    stats: {
      wins: 5,
      losses: 10,
      pointsFor: 1020,
      pointsAgainst: 1200,
      gamesPlayed: 15,
      streak: ["L", "L", "W", "L", "L"],
    },
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-09-20T00:00:00Z",
  },
];

// Sample Players
export const samplePlayers: Player[] = [
  {
    id: "1",
    name: "Marcus Thompson",
    teamId: "1",
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
      {
        year: 2024,
        season: "Summer League",
        points: 16.8,
        rebounds: 3.9,
        assists: 7.4,
        steals: 2.1,
        blocks: 0.3,
        minutes: 28.2,
        fieldGoalPercentage: 44.8,
        gamesPlayed: 12,
      },
      {
        year: 2023,
        season: "Regular Season",
        points: 14.2,
        rebounds: 3.5,
        assists: 6.8,
        steals: 1.9,
        blocks: 0.2,
        minutes: 29.1,
        fieldGoalPercentage: 42.1,
        gamesPlayed: 18,
      },
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
      {
        title: "32pt Game vs Kingmo Elite",
        url: "https://example.com/marcus-32pt-game",
        thumbnail: "/basketball-highlight-thumbnail-1.jpg",
      },
      {
        title: "12 Assists vs Brockville Blazers",
        url: "https://example.com/marcus-assists",
        thumbnail: "/basketball-highlight-thumbnail-2.jpg",
      },
      {
        title: "Clutch Performance - Championship",
        url: "https://example.com/marcus-clutch",
        thumbnail: "/basketball-highlight-thumbnail-3.jpg",
      },
    ],
    region: "North Springfield",
    hometown: "Springfield, IL",
    division: "Diamond Division",
    scoutingNotes:
      "High motor combo guard with natural court vision. D1 potential if outside shooting continues to improve. Excellent leadership qualities and basketball IQ.",
    social: {
      instagram: "@mthompson23",
      twitter: "@MarcusHoops23",
      hudl: "https://hudl.com/profile/marcus-thompson",
    },
    contactEmail: "marcus.thompson@email.com",
  },
  {
    id: "2",
    name: "Jordan Hayes",
    teamId: "1",
    position: "Center",
    jerseyNumber: 34,
    gradYear: "2024",
    height: "6'8\"",
    weight: "220 lbs",
    photo: "/basketball-player-portrait-action-shot.png",
    stats: {
      points: 15.2,
      rebounds: 11.8,
      assists: 2.1,
      steals: 0.8,
      blocks: 2.7,
      minutes: 28.4,
      fieldGoalPercentage: 58.3,
      gamesPlayed: 15,
    },
    yearlyStats: [
      {
        year: 2024,
        season: "Regular Season",
        points: 15.2,
        rebounds: 11.8,
        assists: 2.1,
        steals: 0.8,
        blocks: 2.7,
        minutes: 28.4,
        fieldGoalPercentage: 58.3,
        gamesPlayed: 15,
      },
      {
        year: 2024,
        season: "Summer League",
        points: 13.6,
        rebounds: 10.2,
        assists: 1.8,
        steals: 0.6,
        blocks: 2.4,
        minutes: 25.1,
        fieldGoalPercentage: 55.7,
        gamesPlayed: 12,
      },
      {
        year: 2023,
        season: "Regular Season",
        points: 11.8,
        rebounds: 9.4,
        assists: 1.5,
        steals: 0.5,
        blocks: 2.1,
        minutes: 24.8,
        fieldGoalPercentage: 52.4,
        gamesPlayed: 16,
      },
    ],
    sessionHighs: {
      points: 24,
      rebounds: 18,
      assists: 5,
      blocks: 6,
    },
    awards: ["Defensive Player 2024"],
    bio: "Dominant center who controls the paint on both ends of the floor. Exceptional shot blocker with soft touch around the rim.",
    highlightVideos: [
      {
        title: "18 Rebounds vs Lightning",
        url: "https://example.com/jordan-rebounds",
        thumbnail: "/basketball-highlight-thumbnail-4.jpg",
      },
      {
        title: "6 Blocks Defensive Showcase",
        url: "https://example.com/jordan-blocks",
        thumbnail: "/basketball-highlight-thumbnail-5.jpg",
      },
    ],
    region: "North Springfield",
    hometown: "Chicago, IL",
    division: "Diamond Division",
    scoutingNotes:
      "Elite rim protector with developing offensive skills. Strong fundamentals and excellent work ethic. College-ready size and athleticism.",
    social: {
      instagram: "@jhayes34",
      hudl: "https://hudl.com/profile/jordan-hayes",
    },
  },
  {
    id: "3",
    name: "Alex Rivera",
    teamId: "2",
    position: "Shooting Guard",
    jerseyNumber: 12,
    gradYear: "2025",
    height: "6'4\"",
    weight: "190 lbs",
    photo: "/basketball-player-portrait-action-shot.png",
    stats: {
      points: 22.1,
      rebounds: 5.3,
      assists: 3.7,
      steals: 1.9,
      blocks: 0.6,
      minutes: 35.2,
      fieldGoalPercentage: 44.8,
      gamesPlayed: 15,
    },
    yearlyStats: [
      {
        year: 2024,
        season: "Regular Season",
        points: 22.1,
        rebounds: 5.3,
        assists: 3.7,
        steals: 1.9,
        blocks: 0.6,
        minutes: 35.2,
        fieldGoalPercentage: 44.8,
        gamesPlayed: 15,
      },
      {
        year: 2024,
        season: "Summer League",
        points: 19.4,
        rebounds: 4.8,
        assists: 3.2,
        steals: 1.6,
        blocks: 0.4,
        minutes: 32.1,
        fieldGoalPercentage: 41.2,
        gamesPlayed: 11,
      },
      {
        year: 2023,
        season: "Regular Season",
        points: 17.8,
        rebounds: 4.1,
        assists: 2.9,
        steals: 1.4,
        blocks: 0.3,
        minutes: 30.5,
        fieldGoalPercentage: 39.8,
        gamesPlayed: 17,
      },
    ],
    sessionHighs: {
      points: 38,
      rebounds: 9,
      assists: 7,
      steals: 4,
    },
    awards: ["Leading Scorer 2024", "Clutch Player 2024"],
    bio: "Prolific scorer with unlimited range and clutch gene. Thrives in pressure situations and never backs down from big moments.",
    highlightVideos: [
      {
        title: "38pt Explosion vs Thunder",
        url: "https://example.com/alex-38pts",
        thumbnail: "/basketball-highlight-thumbnail-6.jpg",
      },
      {
        title: "Game Winner Collection",
        url: "https://example.com/alex-clutch",
        thumbnail: "/basketball-highlight-thumbnail-7.jpg",
      },
    ],
    region: "South Metro",
    hometown: "Phoenix, AZ",
    division: "Diamond Division",
    scoutingNotes:
      "Pure scorer with deep range and fearless mentality. Needs to improve defensive consistency but has all the tools to play at next level.",
    social: {
      instagram: "@arivera_hoops",
      twitter: "@AlexRivera12",
    },
    contactEmail: "alex.rivera@email.com",
  },
  {
    id: "4",
    name: "Damon Williams",
    teamId: "2",
    position: "Power Forward",
    jerseyNumber: 21,
    gradYear: "2024",
    height: "6'7\"",
    weight: "210 lbs",
    photo: "/basketball-player-portrait-action-shot.png",
    stats: {
      points: 16.8,
      rebounds: 9.4,
      assists: 2.8,
      steals: 1.2,
      blocks: 1.9,
      minutes: 30.1,
      fieldGoalPercentage: 52.1,
      gamesPlayed: 15,
    },
    awards: ["All-Defense 2024"],
    bio: "Versatile forward with strong rebounding instincts and developing offensive game.",
    region: "South Metro",
    hometown: "Atlanta, GA",
    division: "Diamond Division",
  },
  {
    id: "5",
    name: "Tyler Johnson",
    teamId: "3",
    position: "Point Guard",
    jerseyNumber: 5,
    gradYear: "2025",
    height: "6'0\"",
    weight: "175 lbs",
    photo: "/basketball-player-portrait-action-shot.png",
    stats: {
      points: 14.3,
      rebounds: 3.1,
      assists: 9.7,
      steals: 2.8,
      blocks: 0.2,
      minutes: 33.8,
      fieldGoalPercentage: 41.2,
      gamesPlayed: 15,
    },
    awards: ["Assist Leader 2024", "Steal Leader 2024"],
    bio: "Floor general with exceptional court vision and defensive instincts.",
    region: "West Valley",
    hometown: "Denver, CO",
    division: "Premier Division",
  },
  {
    id: "6",
    name: "Kevin Brown",
    teamId: "3",
    position: "Center",
    jerseyNumber: 44,
    gradYear: "2024",
    height: "6'9\"",
    weight: "235 lbs",
    photo: "/basketball-player-portrait-action-shot.png",
    stats: {
      points: 12.6,
      rebounds: 10.2,
      assists: 1.4,
      steals: 0.6,
      blocks: 3.1,
      minutes: 26.7,
      fieldGoalPercentage: 61.4,
      gamesPlayed: 15,
    },
    awards: ["Block Leader 2024"],
    bio: "Defensive anchor with elite shot-blocking ability and strong fundamentals.",
    region: "West Valley",
    hometown: "Portland, OR",
    division: "Premier Division",
  },
  {
    id: "7",
    name: "Chris Davis",
    teamId: "4",
    position: "Shooting Guard",
    jerseyNumber: 3,
    gradYear: "2025",
    height: "6'3\"",
    weight: "180 lbs",
    photo: "/basketball-player-portrait-action-shot.png",
    stats: {
      points: 19.4,
      rebounds: 4.8,
      assists: 4.2,
      steals: 1.7,
      blocks: 0.3,
      minutes: 31.5,
      fieldGoalPercentage: 46.8,
      gamesPlayed: 15,
    },
    awards: ["Sixth Man 2024"],
    bio: "Dynamic scorer off the bench with clutch shooting ability.",
    region: "West Valley",
    hometown: "Seattle, WA",
    division: "Premier Division",
  },
  {
    id: "8",
    name: "Mike Anderson",
    teamId: "4",
    position: "Small Forward",
    jerseyNumber: 15,
    gradYear: "2024",
    height: "6'6\"",
    weight: "200 lbs",
    photo: "/basketball-player-portrait-action-shot.png",
    stats: {
      points: 17.2,
      rebounds: 6.9,
      assists: 5.1,
      steals: 1.4,
      blocks: 0.8,
      minutes: 34.6,
      fieldGoalPercentage: 48.3,
      gamesPlayed: 15,
    },
    awards: ["All-Around Player 2024"],
    bio: "Versatile wing player who contributes in all statistical categories.",
    region: "West Valley",
    hometown: "Los Angeles, CA",
    division: "Premier Division",
  },
  {
    id: "9",
    name: "James Wilson",
    teamId: "5",
    position: "Point Guard",
    jerseyNumber: 1,
    gradYear: "2025",
    height: "5'11\"",
    weight: "170 lbs",
    photo: "/basketball-player-portrait-action-shot.png",
    stats: {
      points: 13.8,
      rebounds: 2.9,
      assists: 7.3,
      steals: 2.1,
      blocks: 0.1,
      minutes: 29.4,
      fieldGoalPercentage: 43.7,
      gamesPlayed: 15,
    },
    awards: ["Rising Star 2024"],
    bio: "Quick point guard with excellent ball-handling skills and court awareness.",
    region: "North Springfield",
    hometown: "Milwaukee, WI",
    division: "Diamond Division",
  },
  {
    id: "10",
    name: "Robert Garcia",
    teamId: "5",
    position: "Power Forward",
    jerseyNumber: 32,
    gradYear: "2024",
    height: "6'8\"",
    weight: "215 lbs",
    photo: "/basketball-player-portrait-action-shot.png",
    stats: {
      points: 15.7,
      rebounds: 8.6,
      assists: 2.3,
      steals: 1.0,
      blocks: 1.5,
      minutes: 27.8,
      fieldGoalPercentage: 54.2,
      gamesPlayed: 15,
    },
    awards: ["Hustle Award 2024"],
    bio: "Hard-working forward with strong rebounding and interior presence.",
    region: "North Springfield",
    hometown: "San Antonio, TX",
    division: "Diamond Division",
  },
];

// Sample Games
export const sampleGames: Game[] = [
  {
    id: "1",
    sessionId: "1",
    seasonId: "1",
    divisionId: "div-1",
    homeTeamId: "1",
    awayTeamId: "2",
    locationId: "loc-1",
    date: "2025-01-10",
    time: "7:00 PM",
    venue: "Thunder Arena",
    venueAddress: "123 Sports Complex Dr, City, State 12345",
    assignedOfficials: ["off-1", "off-2"],
    status: "scheduled",
    division: "Diamond Division",
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "2",
    sessionId: "2",
    seasonId: "1",
    divisionId: "div-2",
    homeTeamId: "3",
    awayTeamId: "4",
    locationId: "loc-2",
    date: "2025-01-17",
    time: "6:30 PM",
    venue: "Storm Center",
    venueAddress: "456 Basketball Ave, City, State 12345",
    assignedOfficials: ["off-2", "off-3"],
    status: "scheduled",
    division: "Premier Division",
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
];

// Sample Locations
export const sampleLocations: Location[] = [
  {
    id: "loc-1",
    name: "Thunder Arena",
    address: "123 Sports Complex Dr",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    capacity: 2500,
    facilities: ["Main Court", "Warm-up Area", "Concessions", "Parking"],
    contactName: "Arena Manager",
    contactPhone: "(555) 100-0001",
    contactEmail: "manager@thunderarena.com",
    isActive: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-09-20T00:00:00Z",
  },
  {
    id: "loc-2",
    name: "Storm Center",
    address: "456 Basketball Ave",
    city: "Springfield",
    state: "IL",
    zipCode: "62702",
    capacity: 1800,
    facilities: ["Main Court", "Training Room", "Locker Rooms"],
    contactName: "Facility Director",
    contactPhone: "(555) 100-0002",
    contactEmail: "director@stormcenter.com",
    isActive: true,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-08-15T00:00:00Z",
  },
];

// Sample Officials
export const sampleOfficials: Official[] = [
  {
    id: "off-1",
    name: "Referee Johnson",
    email: "johnson@officials.com",
    phone: "(555) 200-0001",
    certificationLevel: "veteran",
    specialties: ["Championship Games", "Playoff Officiating"],
    availability: ["weekends", "evenings"],
    isActive: true,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-09-15T00:00:00Z",
  },
  {
    id: "off-2",
    name: "Referee Smith",
    email: "smith@officials.com",
    phone: "(555) 200-0002",
    certificationLevel: "certified",
    specialties: ["Youth Games", "Regular Season"],
    availability: ["weekends"],
    isActive: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-08-20T00:00:00Z",
  },
];

// Helper functions
export function getTeamById(id: string): Team | undefined {
  return sampleTeams.find((team) => team.id === id);
}

export function getPlayersByTeam(teamId: string): Player[] {
  return samplePlayers.filter((player) => player.teamId === teamId);
}

export function getSessionById(id: string): Session | undefined {
  return sampleSessions.find((session) => session.id === id);
}

export function getSeasonById(id: string): Season | undefined {
  return sampleSeasons.find((season) => season.id === id);
}

export function getGamesBySession(sessionId: string): Game[] {
  return sampleGames.filter((game) => game.sessionId === sessionId);
}

export function getSessionsBySeason(seasonId: string): Session[] {
  return sampleSessions.filter((session) => session.seasonId === seasonId);
}

export function getTeamsBySession(sessionId: string): Team[] {
  return sampleTeams.filter((team) => team.sessionIds.includes(sessionId));
}

export function getLocationById(id: string): Location | undefined {
  return sampleLocations.find((location) => location.id === id);
}

export function getOfficialById(id: string): Official | undefined {
  return sampleOfficials.find((official) => official.id === id);
}

export function getConferencesBySeason(seasonId: string): Conference[] {
  return sampleConferences.filter(
    (conference) => conference.seasonId === seasonId
  );
}

export function getDivisionsByConference(conferenceId: string): Division[] {
  const conference = sampleConferences.find((conf) => conf.id === conferenceId);
  return conference?.divisions || [];
}

export const sampleData = {
  seasons: sampleSeasons,
  conferences: sampleConferences,
  sessions: sampleSessions,
  teams: sampleTeams,
  players: samplePlayers,
  games: sampleGames,
  locations: sampleLocations,
  officials: sampleOfficials,
  divisions: [
    { id: "div-1", name: "Diamond Division" },
    { id: "div-2", name: "Premier Division" },
    { id: "div-3", name: "Development Division" },
  ],
};
