// Development bypass for authentication
// Only use in development mode

export const DEV_MODE = process.env.NODE_ENV === 'development'

// Mock team data for development
export const MOCK_TEAM = {
  id: 'dev-team-123',
  name: 'Development Hawks',
  city: 'Toronto',
  region: 'Ontario',
  contact_email: 'dev@hawks.com',
  phone: '(555) 123-4567',
  primary_color: '#dc2626',
  secondary_color: '#facc15',
  accent_color: '#16a34a',
  primary_contact_name: 'John Developer',
  primary_contact_email: 'john@hawks.com',
  primary_contact_phone: '(555) 123-4567',
  primary_contact_role: 'manager',
  head_coach_name: 'Coach Mike',
  head_coach_email: 'coach@hawks.com',
  head_coach_phone: '(555) 987-6543',
  status: 'approved' as const,
  payment_status: 'paid' as const,
  logo_url: null,
  website: 'https://hawks.com',
  head_coach_certifications: 'NCCP Level 2',
  division_preference: 'Division A',
  registration_notes: 'Development team for testing',
  registration_date: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

// Mock user data
export const MOCK_USER = {
  id: 'dev-user-123',
  email: 'dev@hawks.com',
  aud: 'authenticated',
  role: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

// Mock players data
export const MOCK_PLAYERS = [
  {
    id: 'player-1',
    team_id: 'dev-team-123',
    first_name: 'Marcus',
    last_name: 'Johnson',
    email: 'marcus@example.com',
    phone: '(555) 111-1111',
    jersey_number: 23,
    position: 'PG' as const,
    height: '6\'2"',
    weight: 180,
    grad_year: 2025,
    status: 'active' as const,
    photo_url: null,
    date_of_birth: '2006-05-15',
    guardian_name: 'Sarah Johnson',
    guardian_phone: '(555) 111-2222',
    guardian_email: 'sarah@example.com',
    medical_notes: 'No known allergies',
    emergency_contact_name: 'Sarah Johnson',
    emergency_contact_phone: '(555) 111-2222',
    emergency_contact_relationship: 'Mother',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'player-2',
    team_id: 'dev-team-123',
    first_name: 'Tyler',
    last_name: 'Davis',
    email: 'tyler@example.com',
    phone: '(555) 222-2222',
    jersey_number: 15,
    position: 'SG' as const,
    height: '6\'4"',
    weight: 195,
    grad_year: 2024,
    status: 'active' as const,
    photo_url: null,
    date_of_birth: '2005-08-22',
    guardian_name: null,
    guardian_phone: null,
    guardian_email: null,
    medical_notes: null,
    emergency_contact_name: 'Mike Davis',
    emergency_contact_phone: '(555) 222-3333',
    emergency_contact_relationship: 'Father',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Mock payments data
export const MOCK_PAYMENTS = [
  {
    id: 'payment-1',
    team_id: 'dev-team-123',
    amount: 379500, // $3795 in cents
    currency: 'USD',
    description: '2025-26 Season Registration',
    status: 'completed' as const,
    payment_type: 'registration' as const,
    paid_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    stripe_session_id: 'cs_test_dev123',
    stripe_payment_intent_id: 'pi_test_dev123',
    receipt_url: null,
    receipt_number: 'REC-2025-001',
    due_date: null,
    notes: 'Development test payment'
  }
]