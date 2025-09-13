-- Team Management System Schema
-- Note: JWT secret is set automatically by Supabase

-- Teams table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Team identity
  name TEXT NOT NULL,
  short_name TEXT,
  city TEXT NOT NULL,
  region TEXT,
  
  -- Visual identity
  logo_url TEXT,
  primary_color TEXT DEFAULT '#1e40af',
  secondary_color TEXT DEFAULT '#fbbf24',
  accent_color TEXT,
  
  -- Contact information
  contact_email TEXT UNIQUE NOT NULL,
  phone TEXT,
  website TEXT,
  
  -- Management
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL,
  primary_contact_phone TEXT,
  primary_contact_role TEXT DEFAULT 'manager',
  
  head_coach_name TEXT,
  head_coach_email TEXT,
  head_coach_phone TEXT,
  head_coach_certifications TEXT,
  
  -- Registration info
  division_preference TEXT,
  registration_notes TEXT,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'archived')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'refunded'))
);

-- Team members (coaches, managers, etc.)
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  role TEXT NOT NULL CHECK (role IN ('admin', 'coach', 'assistant_coach', 'manager')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  
  -- Permissions
  can_manage_roster BOOLEAN DEFAULT false,
  can_view_payments BOOLEAN DEFAULT false,
  can_edit_team_info BOOLEAN DEFAULT false,
  
  UNIQUE(team_id, user_id)
);

-- Players table
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  
  -- Personal info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  
  -- Physical info
  height TEXT,
  weight INTEGER,
  
  -- Basketball info
  jersey_number INTEGER,
  position TEXT CHECK (position IN ('PG', 'SG', 'SF', 'PF', 'C')),
  grad_year INTEGER,
  
  -- Photos
  photo_url TEXT,
  
  -- Guardian info (for minors)
  guardian_name TEXT,
  guardian_phone TEXT,
  guardian_email TEXT,
  
  -- Medical/emergency
  medical_notes TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'injured', 'suspended')),
  
  UNIQUE(team_id, jersey_number)
);

-- Team payments table
CREATE TABLE team_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  
  -- Payment details
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'USD',
  description TEXT NOT NULL,
  
  -- Stripe integration
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  
  -- Dates
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Receipt
  receipt_url TEXT,
  receipt_number TEXT,
  
  -- Metadata
  payment_type TEXT DEFAULT 'registration' CHECK (payment_type IN ('registration', 'tournament', 'equipment', 'other')),
  notes TEXT
);

-- Player stats table (optional, for future use)
CREATE TABLE player_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  player_id UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  
  -- Season/game context
  season TEXT,
  game_date DATE,
  opponent TEXT,
  
  -- Stats
  points INTEGER DEFAULT 0,
  rebounds INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  steals INTEGER DEFAULT 0,
  blocks INTEGER DEFAULT 0,
  minutes_played INTEGER DEFAULT 0,
  field_goals_made INTEGER DEFAULT 0,
  field_goals_attempted INTEGER DEFAULT 0,
  three_pointers_made INTEGER DEFAULT 0,
  three_pointers_attempted INTEGER DEFAULT 0,
  free_throws_made INTEGER DEFAULT 0,
  free_throws_attempted INTEGER DEFAULT 0
);

-- RLS Policies
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

-- Teams: Users can only access their own team
CREATE POLICY "Users can view their own team" ON teams
  FOR SELECT USING (
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own team" ON teams
  FOR UPDATE USING (
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() 
      AND can_edit_team_info = true
    )
  );

-- Team members: Users can view members of their teams
CREATE POLICY "Users can view team members" ON team_members
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid()
    )
  );

-- Players: Users can manage players on their teams
CREATE POLICY "Users can view team players" ON players
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage team players" ON players
  FOR ALL USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() 
      AND can_manage_roster = true
    )
  );

-- Payments: Users can view payments for their teams
CREATE POLICY "Users can view team payments" ON team_payments
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() 
      AND can_view_payments = true
    )
  );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_teams_updated_at 
  BEFORE UPDATE ON teams 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at 
  BEFORE UPDATE ON players 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_teams_contact_email ON teams(contact_email);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_team_payments_team_id ON team_payments(team_id);
CREATE INDEX idx_team_payments_stripe_session_id ON team_payments(stripe_session_id);
CREATE INDEX idx_player_stats_player_id ON player_stats(player_id);