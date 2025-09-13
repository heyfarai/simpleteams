-- Minimal Supabase schema - Auth and Payments only
-- Teams and Players live in Sanity

-- User team associations (links Supabase auth users to Sanity teams)
CREATE TABLE user_team_associations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Supabase auth user
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Sanity team reference (just store the Sanity team ID as text)
  sanity_team_id TEXT NOT NULL,
  
  -- Role and permissions
  role TEXT NOT NULL CHECK (role IN ('admin', 'coach', 'manager')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  
  -- Permissions
  can_manage_roster BOOLEAN DEFAULT false,
  can_view_payments BOOLEAN DEFAULT false,
  can_edit_team_info BOOLEAN DEFAULT false,
  
  UNIQUE(user_id, sanity_team_id)
);

-- Team payments (linked to Sanity teams by ID)
CREATE TABLE team_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Reference to Sanity team
  sanity_team_id TEXT NOT NULL,
  
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

-- Registration tracking (for teams that register but aren't in Sanity yet)
CREATE TABLE team_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Registration data
  team_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT,
  division_preference TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'refunded')),
  
  -- Stripe integration
  stripe_session_id TEXT,
  
  -- Once approved, this gets filled with Sanity team ID
  sanity_team_id TEXT,
  
  -- Registration metadata
  registration_notes TEXT
);

-- RLS Policies
ALTER TABLE user_team_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_registrations ENABLE ROW LEVEL SECURITY;

-- User team associations: Users can only see their own associations
CREATE POLICY "Users can view their own team associations" ON user_team_associations
  FOR SELECT USING (user_id = auth.uid());

-- Team payments: Users can view payments for teams they're associated with
CREATE POLICY "Users can view team payments" ON team_payments
  FOR SELECT USING (
    sanity_team_id IN (
      SELECT sanity_team_id FROM user_team_associations 
      WHERE user_id = auth.uid() 
      AND status = 'active'
      AND can_view_payments = true
    )
  );

-- Team registrations: Users can only see registrations they created
CREATE POLICY "Users can view their registrations" ON team_registrations
  FOR SELECT USING (primary_contact_email = auth.email());

-- Indexes
CREATE INDEX idx_user_team_associations_user_id ON user_team_associations(user_id);
CREATE INDEX idx_user_team_associations_sanity_team_id ON user_team_associations(sanity_team_id);
CREATE INDEX idx_team_payments_sanity_team_id ON team_payments(sanity_team_id);
CREATE INDEX idx_team_payments_stripe_session_id ON team_payments(stripe_session_id);
CREATE INDEX idx_team_registrations_contact_email ON team_registrations(primary_contact_email);
CREATE INDEX idx_team_registrations_sanity_team_id ON team_registrations(sanity_team_id);