// Repository interfaces - define what we need, not how we get it
import type {
  Player,
  Team,
  Game,
  Division,
  Season,
  Conference,
  FilterOptions,
  StatCategory,
  Official,
  Venue,
  TeamRegistration,
  TeamPayment,
  PaymentStatus,
  RegistrationStatus,
  PaymentType,
  GameSession,
  RosterSessionEnrollment,
} from "../domain/models";

export interface PlayerRepository {
  findAll(): Promise<Player[]>;
  findById(id: string): Promise<Player | null>;
  findBySeason(seasonId: string): Promise<Player[]>;
  findByTeam(teamId: string, includeInactive?: boolean): Promise<Player[]>;
  findStatLeaders(seasonId?: string): Promise<Player[]>;
  findLeadersByCategory(category: StatCategory, seasonId?: string): Promise<Player[]>;
  findFeatured(count: number): Promise<Player[]>;
  search(query: string): Promise<Player[]>;
  create(playerData: CreatePlayerRequest): Promise<Player>;
  update(id: string, playerData: UpdatePlayerRequest): Promise<Player>;
  softDelete(id: string): Promise<void>;
}

export interface CreatePlayerRequest {
  firstName: string;
  lastName: string;
  personalInfo?: {
    gradYear?: number;
    hometown?: string;
    position?: string;
    dateOfBirth?: string;
    height?: string;
    weight?: number;
  };
  jerseyNumber?: number;
  bio?: string;
  teamId: string;
  rosterData?: {
    jerseyNumber: number;
    position: string;
    status: string;
  };
}

export interface UpdatePlayerRequest {
  firstName?: string;
  lastName?: string;
  personalInfo?: {
    gradYear?: number;
    hometown?: string;
    position?: string;
    dateOfBirth?: string;
    height?: string;
    weight?: number;
  };
  jerseyNumber?: number;
  bio?: string;
  rosterData?: {
    jerseyNumber?: number;
    position?: string;
    status?: string;
  };
}

export interface TeamRepository {
  findAll(): Promise<Team[]>;
  findById(id: string): Promise<Team | null>;
  findBySeason(seasonId: string): Promise<Team[]>;
  findByDivision(divisionId: string): Promise<Team[]>;
  findWithRosters(seasonId?: string): Promise<Team[]>;
  findByUserId(userId: string): Promise<Team[]>;
  search(query: string): Promise<Team[]>;
}

export interface GameRepository {
  findAll(includeArchived?: boolean): Promise<Game[]>;
  findById(id: string): Promise<Game | null>;
  findBySeason(seasonId: string, includeArchived?: boolean): Promise<Game[]>;
  findByTeam(teamId: string, includeArchived?: boolean): Promise<Game[]>;
  findByDivision(divisionId: string, includeArchived?: boolean): Promise<Game[]>;
  findByDateRange(startDate: string, endDate: string, includeArchived?: boolean): Promise<Game[]>;
  findUpcoming(limit?: number, includeArchived?: boolean): Promise<Game[]>;
  findCompleted(limit?: number, includeArchived?: boolean): Promise<Game[]>;
  // Session-based queries
  findBySession(sessionId: string, includeArchived?: boolean): Promise<Game[]>;
  findByTeamAndSession(rosterId: string, sessionId: string, includeArchived?: boolean): Promise<Game[]>;
  findBySeasonAndSession(seasonId: string, sessionId: string, includeArchived?: boolean): Promise<Game[]>;
  // Update operations
  update(id: string, gameData: UpdateGameRequest): Promise<Game>;
  create(gameData: CreateGameRequest): Promise<Game>;
}

export interface UpdateGameRequest {
  date?: string;
  time?: string;
  status?: string;
  homeScore?: number;
  awayScore?: number;
  venueId?: string;
  isArchived?: boolean;
}

export interface CreateGameRequest {
  date: string;
  time: string;
  homeTeamId: string;
  awayTeamId: string;
  seasonId: string;
  divisionId?: string;
  venueId?: string;
  status?: string;
  isArchived?: boolean;
}

export interface DivisionRepository {
  findAll(): Promise<Division[]>;
  findById(id: string): Promise<Division | null>;
  findBySeason(seasonId: string): Promise<Division[]>;
  findByConference(conferenceId: string): Promise<Division[]>;
}

export interface SeasonRepository {
  findAll(): Promise<Season[]>;
  findById(id: string): Promise<Season | null>;
  findActive(): Promise<Season[]>;
  findCompleted(): Promise<Season[]>;
  findCurrent(): Promise<Season | null>;
}

export interface ConferenceRepository {
  findAll(): Promise<Conference[]>;
  findById(id: string): Promise<Conference | null>;
  findBySeason(seasonId: string): Promise<Conference[]>;
}

export interface FilterRepository {
  getFilterOptions(): Promise<FilterOptions>;
}

export interface OfficialRepository {
  findAll(): Promise<Official[]>;
  findById(id: string): Promise<Official | null>;
  findByGame(gameId: string): Promise<Official[]>;
}

export interface VenueRepository {
  findAll(): Promise<Venue[]>;
  findById(id: string): Promise<Venue | null>;
  search(query: string): Promise<Venue[]>;
}

// Registration Repository
export interface RegistrationRepository {
  findAll(): Promise<TeamRegistration[]>;
  findById(id: string): Promise<TeamRegistration | null>;
  findByUserId(userId: string): Promise<TeamRegistration[]>;
  findByStatus(status: RegistrationStatus): Promise<TeamRegistration[]>;
  findByStripeSessionId(sessionId: string): Promise<TeamRegistration | null>;
  create(registrationData: CreateRegistrationRequest): Promise<TeamRegistration>;
  update(id: string, updateData: UpdateRegistrationRequest): Promise<TeamRegistration>;
  updateStatus(id: string, status: RegistrationStatus): Promise<TeamRegistration>;
  updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<TeamRegistration>;
  delete(id: string): Promise<void>;
}

export interface CreateRegistrationRequest {
  userId: string;
  teamName: string;
  city: string;
  region?: string;
  phone?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoUrl?: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  primaryContactRole?: string;
  headCoachName?: string;
  headCoachEmail?: string;
  headCoachPhone?: string;
  headCoachCertifications?: string;
  divisionPreference: string;
  registrationNotes?: string;
  selectedPackage: string;
  selectedSessionIds?: string[];
  status?: RegistrationStatus;
  paymentStatus?: PaymentStatus;
  stripeSessionId?: string;
}

export interface UpdateRegistrationRequest {
  teamName?: string;
  city?: string;
  region?: string;
  phone?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoUrl?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  primaryContactRole?: string;
  headCoachName?: string;
  headCoachEmail?: string;
  headCoachPhone?: string;
  headCoachCertifications?: string;
  divisionPreference?: string;
  registrationNotes?: string;
  selectedPackage?: string;
  status?: RegistrationStatus;
  paymentStatus?: PaymentStatus;
  stripeSessionId?: string;
  teamId?: string;
}

// Payment Repository
export interface PaymentRepository {
  findAll(): Promise<TeamPayment[]>;
  findById(id: string): Promise<TeamPayment | null>;
  findByRosterId(rosterId: string): Promise<TeamPayment[]>;
  findByStatus(status: PaymentStatus): Promise<TeamPayment[]>;
  findByPaymentType(paymentType: PaymentType): Promise<TeamPayment[]>;
  findByStripeSessionId(sessionId: string): Promise<TeamPayment | null>;
  findByStripePaymentIntentId(paymentIntentId: string): Promise<TeamPayment | null>;
  findOverdue(): Promise<TeamPayment[]>;
  findInstallmentPaymentByUserAndTeam(userId: string, teamId: string): Promise<TeamPayment | null>;
  create(paymentData: CreatePaymentRequest): Promise<TeamPayment>;
  update(id: string, updateData: UpdatePaymentRequest): Promise<TeamPayment>;
  updateStatus(id: string, status: PaymentStatus): Promise<TeamPayment>;
  markAsPaid(id: string, paidAt?: Date, receiptUrl?: string): Promise<TeamPayment>;
  delete(id: string): Promise<void>;
}

export interface CreatePaymentRequest {
  rosterId: string;
  amount: number;
  currency?: string;
  description: string;
  paymentType?: PaymentType;
  status?: PaymentStatus;
  dueDate?: Date;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  notes?: string;
}

export interface UpdatePaymentRequest {
  amount?: number;
  currency?: string;
  description?: string;
  paymentType?: PaymentType;
  status?: PaymentStatus;
  dueDate?: Date;
  paidAt?: Date;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  receiptNumber?: string;
  receiptUrl?: string;
  notes?: string;
}

// Game Session Repository
export interface GameSessionRepository {
  findAll(): Promise<GameSession[]>;
  findById(id: string): Promise<GameSession | null>;
  findBySeason(seasonId: string): Promise<GameSession[]>;
  findBySeasonAndType(seasonId: string, type: 'regular' | 'playoffs'): Promise<GameSession[]>;
  findActive(): Promise<GameSession[]>;
  create(sessionData: CreateGameSessionRequest): Promise<GameSession>;
  update(id: string, updateData: UpdateGameSessionRequest): Promise<GameSession>;
  delete(id: string): Promise<void>;
}

export interface CreateGameSessionRequest {
  seasonId: string;
  name: string;
  sequence: number;
  startDate: string;
  endDate: string;
  type: 'regular' | 'playoffs';
  maxTeams?: number;
  isActive?: boolean;
}

export interface UpdateGameSessionRequest {
  name?: string;
  sequence?: number;
  startDate?: string;
  endDate?: string;
  type?: 'regular' | 'playoffs';
  maxTeams?: number;
  isActive?: boolean;
}

// Session Enrollment Repository
export interface SessionEnrollmentRepository {
  findAll(): Promise<RosterSessionEnrollment[]>;
  findById(id: string): Promise<RosterSessionEnrollment | null>;
  findByRoster(rosterId: string): Promise<RosterSessionEnrollment[]>;
  findBySession(sessionId: string): Promise<RosterSessionEnrollment[]>;
  findByRosterAndSession(rosterId: string, sessionId: string): Promise<RosterSessionEnrollment | null>;
  create(enrollmentData: CreateSessionEnrollmentRequest): Promise<RosterSessionEnrollment>;
  delete(id: string): Promise<void>;
  deleteByRosterAndSession(rosterId: string, sessionId: string): Promise<void>;
}

export interface CreateSessionEnrollmentRequest {
  rosterId: string;
  sessionId: string;
  enrolledViaPackage: string;
  enrollmentDate?: Date;
}