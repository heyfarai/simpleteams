-- Migration: Add multi-team support for users
-- This allows users to manage multiple teams

-- Step 1: Add user_id column to teams table
ALTER TABLE teams
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Remove the unique constraint on contact_email
-- (This allows multiple teams to have the same contact email)
ALTER TABLE teams
DROP CONSTRAINT IF EXISTS teams_contact_email_key;

-- Step 3: Create index for performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_teams_user_id ON teams(user_id);

-- Step 4: Create index for contact_email lookups (still useful for duplicate detection)
CREATE INDEX IF NOT EXISTS idx_teams_contact_email ON teams(contact_email);

-- Step 5: Update RLS policies to work with user_id
-- First drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON teams;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON teams;
DROP POLICY IF EXISTS "Enable update for team owners" ON teams;

-- Create new RLS policies for multi-team support
-- Allow users to see only their own teams
CREATE POLICY "Users can view their own teams" ON teams
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert teams for themselves
CREATE POLICY "Users can create teams for themselves" ON teams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own teams
CREATE POLICY "Users can update their own teams" ON teams
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own teams (if needed)
CREATE POLICY "Users can delete their own teams" ON teams
  FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on teams table
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Step 6: Create a function to help with team ownership
CREATE OR REPLACE FUNCTION get_user_teams(user_uuid UUID DEFAULT auth.uid())
RETURNS SETOF teams AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM teams
  WHERE user_id = user_uuid
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create a function to check if a user owns a team
CREATE OR REPLACE FUNCTION user_owns_team(team_uuid UUID, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM teams
    WHERE id = team_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Update team_payments to work with the new structure
-- Add user_id reference for easier lookups
ALTER TABLE team_payments
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_team_payments_user_id ON team_payments(user_id);

-- Update RLS policies for team_payments
DROP POLICY IF EXISTS "Enable read access for all users" ON team_payments;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON team_payments;

-- New policies for team_payments
CREATE POLICY "Users can view their team payments" ON team_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments for their teams" ON team_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable RLS on team_payments
ALTER TABLE team_payments ENABLE ROW LEVEL SECURITY;

-- Step 9: Create a view for easier team management
CREATE OR REPLACE VIEW user_team_dashboard AS
SELECT
  t.id,
  t.name,
  t.city,
  t.region,
  t.status,
  t.payment_status,
  t.selected_package,
  t.created_at,
  t.contact_email,
  COALESCE(
    (SELECT COUNT(*) FROM team_payments tp WHERE tp.team_id = t.id AND tp.status = 'completed'),
    0
  ) as completed_payments,
  COALESCE(
    (SELECT SUM(tp.amount) FROM team_payments tp WHERE tp.team_id = t.id AND tp.status = 'completed'),
    0
  ) as total_paid
FROM teams t
WHERE t.user_id = auth.uid()
ORDER BY t.created_at DESC;

-- Grant permissions for the view
GRANT SELECT ON user_team_dashboard TO authenticated;

COMMENT ON TABLE teams IS 'Teams table with multi-user support - users can own multiple teams';
COMMENT ON COLUMN teams.user_id IS 'References the authenticated user who owns this team';
COMMENT ON VIEW user_team_dashboard IS 'Convenient view showing all teams for the authenticated user with payment summary';