// Development context - use real Sanity team IDs
export const DEV_SANITY_TEAM_ID = '13111760-ab34-4d1e-a512-cfe0c830312e' // ONL-X Junior
export const DEV_USER_ID = '00000000-0000-4000-8000-000000000001' // Valid UUID for dev user

// Mock user for development
export const DEV_USER = {
  id: DEV_USER_ID,
  email: 'dev@team.com',
  aud: 'authenticated',
  role: 'authenticated'
}

// Simple check for development mode
export const isDev = process.env.NODE_ENV === 'development'