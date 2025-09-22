-- Test inserting one team from Sanity
INSERT INTO teams (
  id,
  organization_id,
  name,
  short_name,
  city,
  logo_url,
  contact_email,
  primary_contact_name,
  primary_contact_email,
  status
) VALUES (
  '13111760-ab34-4d1e-a512-cfe0c830312e'::uuid,
  (SELECT id FROM organizations WHERE slug = 'nchc-basketball' LIMIT 1),
  'ONL-X Junior',
  'ONL-X',
  'Unknown',
  'https://cdn.sanity.io/images/6bhzpimk/dev/18cfc944781854847be224c38e4d516aaef1621a-200x200.png',
  'contact@onlx-junior.com',
  'Team Manager',
  'manager@onlx-junior.com',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  city = EXCLUDED.city,
  logo_url = EXCLUDED.logo_url,
  updated_at = NOW()
RETURNING id, name;