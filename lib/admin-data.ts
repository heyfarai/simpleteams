// Admin data structure for multi-tenant League Admin Panel
// Hierarchy: Seasons → Conferences → Divisions → Teams

import {
  type Season,
  type Team,
  type Location,
  type Official,
  type Session,
  type Game,
  sampleSeasons,
  sampleTeams,
  sampleLocations,
  sampleOfficials,
  sampleSessions,
  sampleGames,
  getTeamById,
  getSessionById,
  getLocationById,
  getOfficialById,
} from "./sample-data";

export interface TeamAdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "head_coach" | "team_manager" | "assistant_coach";
  teamId: string;
  permissions: string[];
  isActive: boolean;
  invitedBy?: string;
  invitedAt?: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamPermission {
  id: string;
  name: string;
  description: string;
  category: "profile" | "roster" | "payments" | "staff";
}

export interface TeamRegistration {
  id: string;
  teamId: string;
  seasonId: string;
  status: "pending" | "approved" | "rejected" | "withdrawn";
  divisionPreference?: string;
  assignedDivisionId?: string;
  registrationFee: number;
  registrationDate: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamInvoice {
  id: string;
  teamId: string;
  seasonId: string;
  type: "registration" | "tournament" | "equipment" | "facility";
  description: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  invoiceNumber: string;
  paymentProof?: string;
  paidAt?: string;
  paidBy?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamPayment {
  id: string;
  invoiceId: string;
  teamId: string;
  amount: number;
  paymentMethod: "cash" | "check" | "bank_transfer" | "online";
  paymentProof: string;
  uploadedBy: string;
  uploadedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  status: "pending" | "verified" | "rejected";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const adminSeasons = sampleSeasons;
export const adminTeams = sampleTeams;
export const adminLocations = sampleLocations;
export const adminOfficials = sampleOfficials;
export const adminSessions = sampleSessions;
export const adminGames = sampleGames;

// Sample data exports
export const sampleTeamRegistrations: TeamRegistration[] = [
  {
    id: "reg-1",
    teamId: "1",
    seasonId: "2024",
    status: "approved",
    divisionPreference: "Diamond Division",
    assignedDivisionId: "div-1",
    registrationFee: 500,
    registrationDate: "2024-08-15",
    approvedBy: "admin-1",
    approvedAt: "2024-08-20",
    createdAt: "2024-08-15",
    updatedAt: "2024-08-20",
  },
  {
    id: "reg-2",
    teamId: "2",
    seasonId: "2024",
    status: "pending",
    divisionPreference: "Diamond Division",
    registrationFee: 500,
    registrationDate: "2024-08-18",
    createdAt: "2024-08-18",
    updatedAt: "2024-08-18",
  },
];

export const sampleTeamInvoices: TeamInvoice[] = [
  {
    id: "inv-1",
    teamId: "1",
    seasonId: "2024",
    type: "registration",
    description: "Season Registration Fee",
    amount: 500,
    dueDate: "2024-09-01",
    status: "paid",
    invoiceNumber: "INV-2024-001",
    paidAt: "2024-08-25",
    paidBy: "team-admin-1",
    createdBy: "admin-1",
    createdAt: "2024-08-20",
    updatedAt: "2024-08-25",
  },
  {
    id: "inv-2",
    teamId: "2",
    seasonId: "2024",
    type: "registration",
    description: "Season Registration Fee",
    amount: 500,
    dueDate: "2024-09-01",
    status: "pending",
    invoiceNumber: "INV-2024-002",
    createdBy: "admin-1",
    createdAt: "2024-08-20",
    updatedAt: "2024-08-20",
  },
];

export const sampleTeamPayments: TeamPayment[] = [
  {
    id: "pay-1",
    invoiceId: "inv-1",
    teamId: "1",
    amount: 500,
    paymentMethod: "bank_transfer",
    paymentProof: "/uploads/payment-proof-1.pdf",
    uploadedBy: "team-admin-1",
    uploadedAt: "2024-08-25",
    verifiedBy: "admin-1",
    verifiedAt: "2024-08-26",
    status: "verified",
    createdAt: "2024-08-25",
    updatedAt: "2024-08-26",
  },
];

export const sampleTeamPermissions: TeamPermission[] = [
  {
    id: "perm-1",
    name: "Edit Team Profile",
    description: "Can edit team name, logo, and basic information",
    category: "profile",
  },
  {
    id: "perm-2",
    name: "Manage Roster",
    description: "Can add, remove, and edit player information",
    category: "roster",
  },
  {
    id: "perm-3",
    name: "View Payments",
    description: "Can view team invoices and payment history",
    category: "payments",
  },
  {
    id: "perm-4",
    name: "Upload Payment Proof",
    description: "Can upload payment receipts and proof of payment",
    category: "payments",
  },
  {
    id: "perm-5",
    name: "Manage Staff",
    description: "Can invite and manage team staff members",
    category: "staff",
  },
  {
    id: "perm-6",
    name: "Assign Roles",
    description: "Can assign roles and permissions to staff members",
    category: "staff",
  },
];

export const adminSampleData = {
  seasons: adminSeasons,
  teams: adminTeams,
  locations: adminLocations,
  officials: adminOfficials,
  sessions: adminSessions,
  games: adminGames,
  teamRegistrations: sampleTeamRegistrations,
  teamInvoices: sampleTeamInvoices,
  teamPayments: sampleTeamPayments,
  teamPermissions: sampleTeamPermissions,
};

// Helper functions for admin data
export function getAdminSeasonById(id: string): Season | undefined {
  return adminSeasons.find((season) => season.id === id);
}

export function getConferenceById(id: string): any | undefined {
  for (const season of adminSeasons) {
    const conference = season.conferences.find((conf) => conf.id === id);
    if (conference) return conference;
  }
  return undefined;
}

export function getDivisionById(id: string): any | undefined {
  for (const season of adminSeasons) {
    for (const conference of season.conferences) {
      const division = conference.divisions.find((div) => div.id === id);
      if (division) return division;
    }
  }
  return undefined;
}

export function getAdminTeamById(id: string): Team | undefined {
  return getTeamById(id);
}

export function getAdminLocationById(id: string): Location | undefined {
  return getLocationById(id);
}

export function getAdminOfficialById(id: string): Official | undefined {
  return getOfficialById(id);
}

export function getAdminSessionById(id: string): Session | undefined {
  return getSessionById(id);
}

export function getAdminGameById(id: string): Game | undefined {
  return adminGames.find((game) => game.id === id);
}

export function getAdminSessionsBySeason(seasonId: string): Session[] {
  return adminSessions.filter((session) => session.seasonId === seasonId);
}

export function getAdminGamesBySession(
  sessionId: string
): Array<Game & { homeTeam: string; awayTeam: string; locationName: string }> {
  const games = adminGames.filter((game) => game.sessionId === sessionId);

  return games.map((game) => {
    const homeTeam = getTeamById(game.homeTeamId);
    const awayTeam = getTeamById(game.awayTeamId);
    const location = getLocationById(game.locationId || "");

    return {
      ...game,
      homeTeam: homeTeam?.name || "Unknown Team",
      awayTeam: awayTeam?.name || "Unknown Team",
      locationName: location?.name || game.venue || "TBD",
    };
  });
}

export function getAdminGamesByDivision(divisionId: string): Game[] {
  return adminGames.filter((game) => game.divisionId === divisionId);
}

export function getAdminTeamsByDivision(divisionId: string): Team[] {
  return adminTeams.filter((team) => team.divisionId === divisionId);
}

export function getAdminLocationsBySeason(seasonId: string): Location[] {
  const season = getAdminSeasonById(seasonId);
  if (!season) return [];
  return season.locations.map(getLocationById).filter(Boolean) as Location[];
}

export function getAdminOfficialsBySeason(seasonId: string): Official[] {
  const season = getAdminSeasonById(seasonId);
  if (!season) return [];
  return season.officials.map(getOfficialById).filter(Boolean) as Official[];
}

// Helper functions for team admin functionality
export function getTeamAdminsByTeamId(teamId: string): any[] {
  // Placeholder for team admin users data
  return [];
}

export function getTeamRegistrationsByTeamId(
  teamId: string
): TeamRegistration[] {
  // Placeholder for team registrations data
  return [];
}

export function getTeamInvoicesByTeamId(teamId: string): TeamInvoice[] {
  // Placeholder for team invoices data
  return [];
}

export function getTeamPaymentsByTeamId(teamId: string): TeamPayment[] {
  // Placeholder for team payments data
  return [];
}

export function getTeamRegistrationsBySeasonId(
  seasonId: string
): TeamRegistration[] {
  // Placeholder for team registrations data
  return [];
}

export function getAdminTeamsByRegistrationStatus(status: string): Team[] {
  // Placeholder for team registrations data
  return [];
}

export function getTeamPermissionsByRole(role: string): string[] {
  const rolePermissions = {
    head_coach: ["perm-1", "perm-2", "perm-3", "perm-4"],
    team_manager: ["perm-3", "perm-4", "perm-5", "perm-6"],
    assistant_coach: ["perm-3"],
  };
  return rolePermissions[role] || [];
}

// Alias exports
export const sampleAdminSeasons = adminSeasons;
export const getTeamsByDivision = getAdminTeamsByDivision;
export const getAdminSessionsBySeasonId = getAdminSessionsBySeason;
export const getAdminGamesBySessionId = getAdminGamesBySession;
export const getGamesBySession = getAdminGamesBySession;
export const getSessionsBySeason = getAdminSessionsBySeason;

export { getSessionById, getLocationById } from "./sample-data";
