export interface SanityGame {
  _id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  homeTeam: {
    _id: string;
    name: string;
    logo: string;
  };
  awayTeam: {
    _id: string;
    name: string;
    logo: string;
  };
  division: {
    _id: string;
    name: string;
  };
  status: 'scheduled' | 'live' | 'completed' | 'cancelled' | 'postponed';
  homeScore?: number;
  awayScore?: number;
}

export interface SanityDivision {
  _id: string;
  name: string;
  description?: string;
}

export interface SanityPlayer {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  personalInfo: {
    dateOfBirth?: string;
    gradYear: number;
    height?: string;
    weight?: number;
    hometown: string;
  };
  photo?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  stats?: {
    points: number;
    rebounds: number;
    assists: number;
    steals?: number;
    blocks?: number;
    minutes?: number;
    fieldGoalPercentage?: number;
    gamesPlayed: number;
  };
  awards?: string[];
  bio?: string;
  highlightVideos?: Array<{
    title: string;
    url: string;
    thumbnail?: string;
  }>;
  social?: {
    instagram?: string;
    twitter?: string;
    hudl?: string;
  };
}

export interface SanityTeam {
  _id: string;
  name: string;
  shortName?: string;
  logo?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  location: {
    city: string;
    region?: string;
  };
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
  rosters?: SanityRoster[];
}

export interface SanityRoster {
  season: {
    _id: string;
    name: string;
    year: number;
    status: string;
  };
  players: SanityRosterPlayer[];
}

export interface SanityRosterPlayer {
  player: SanityPlayer;
  jerseyNumber: number;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  status: 'active' | 'inactive' | 'injured';
}

export interface SanitySeason {
  _id: string;
  name: string;
  year: number;
  status: 'upcoming' | 'active' | 'completed';
}

export interface PlayerWithTeamInfo extends SanityPlayer {
  teamInfo?: {
    _id: string;
    name: string;
    shortName?: string;
    logo?: any;
    colors: {
      primary: string;
      secondary?: string;
      accent?: string;
    };
    roster?: {
      season: SanitySeason;
      playerDetails: {
        jerseyNumber: number;
        position: string;
        status: string;
      };
    };
  };
}

export interface FilterOptions {
  seasons: SanitySeason[];
  divisions: SanityDivision[];
  teams: Pick<SanityTeam, '_id' | 'name' | 'shortName'>[];
  positions: string[];
}
