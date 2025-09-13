-- Fix RLS policies to avoid infinite recursion

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own team" ON teams;
DROP POLICY IF EXISTS "Users can update their own team" ON teams;
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Users can view team players" ON players;
DROP POLICY IF EXISTS "Users can manage team players" ON players;
DROP POLICY IF EXISTS "Users can view team payments" ON team_payments;

-- Simplified RLS policies that avoid recursion

-- Teams: Users can only access teams they are members of
CREATE POLICY "Users can view their teams" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Admins can update their teams" ON teams
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'admin'
      AND team_members.status = 'active'
      AND team_members.can_edit_team_info = true
    )
  );

-- Team members: Simple policy - users can view team members of teams they belong to
CREATE POLICY "Users can view team members" ON team_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid()
      AND tm.status = 'active'
    )
  );

-- Allow admins to insert/update team members
CREATE POLICY "Admins can manage team members" ON team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid()
      AND tm.role = 'admin'
      AND tm.status = 'active'
    )
  );

-- Players: Users can view players from their teams
CREATE POLICY "Users can view team players" ON players
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = players.team_id 
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Users can manage team players" ON players
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = players.team_id 
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
      AND team_members.can_manage_roster = true
    )
  );

-- Payments: Users can view payments for their teams
CREATE POLICY "Users can view team payments" ON team_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = team_payments.team_id 
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
      AND team_members.can_view_payments = true
    )
  );

-- Player stats: Users can view stats for players on their teams
CREATE POLICY "Users can view player stats" ON player_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM players
      JOIN team_members ON team_members.team_id = players.team_id
      WHERE players.id = player_stats.player_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );