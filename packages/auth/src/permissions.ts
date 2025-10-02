// Role-based permissions for front-office

export const PERMISSIONS = {
  // Team Manager permissions
  TEAM_MANAGER: {
    view_roster: true,
    edit_roster: true,
    view_payments: true,
    manage_team_details: true,
  },

  // League Admin permissions
  LEAGUE_ADMIN: {
    manage_games: true,
    manage_sessions: true,
    view_all_teams: true,
    schedule_games: true,
    manage_divisions: true,
  },

  // Super Admin permissions (all access)
  SUPER_ADMIN: {
    all: true,
  },
} as const;

export type Role = keyof typeof PERMISSIONS;
export type Permission = string;

export function hasPermission(role: Role, permission: Permission): boolean {
  if (role === 'SUPER_ADMIN') return true;

  const rolePermissions = PERMISSIONS[role];
  return rolePermissions[permission as keyof typeof rolePermissions] === true;
}
