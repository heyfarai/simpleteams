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
