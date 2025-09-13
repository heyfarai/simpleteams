-- Insert a development team to work with
-- Run this once to create a team you can use for development

INSERT INTO teams (
  id,
  name,
  city,
  region,
  contact_email,
  phone,
  primary_color,
  secondary_color,
  primary_contact_name,
  primary_contact_email,
  primary_contact_phone,
  primary_contact_role,
  head_coach_name,
  head_coach_email,
  status,
  payment_status
) VALUES (
  'hardcoded-team-123',
  'Development Hawks',
  'Toronto',
  'Ontario', 
  'dev@hawks.com',
  '(555) 123-4567',
  '#dc2626',
  '#facc15',
  'John Developer',
  'john@hawks.com',
  '(555) 123-4567',
  'manager',
  'Coach Mike',
  'coach@hawks.com',
  'approved',
  'paid'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

-- Insert a few sample players
INSERT INTO players (
  team_id,
  first_name,
  last_name,
  jersey_number,
  position,
  height,
  weight,
  grad_year,
  status
) VALUES 
  ('hardcoded-team-123', 'Marcus', 'Johnson', 23, 'PG', '6''2"', 180, 2025, 'active'),
  ('hardcoded-team-123', 'Tyler', 'Davis', 15, 'SG', '6''4"', 195, 2024, 'active'),
  ('hardcoded-team-123', 'Alex', 'Wilson', 7, 'SF', '6''6"', 210, 2025, 'active')
ON CONFLICT DO NOTHING;

-- Insert a sample payment
INSERT INTO team_payments (
  team_id,
  amount,
  currency,
  description,
  status,
  payment_type,
  paid_at
) VALUES (
  'hardcoded-team-123',
  379500,
  'USD',
  '2025-26 Season Registration',
  'completed',
  'registration',
  NOW() - INTERVAL '7 days'
)
ON CONFLICT DO NOTHING;