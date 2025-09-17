-- Add selected_package column to teams table
ALTER TABLE teams
ADD COLUMN selected_package TEXT CHECK (selected_package IN ('full-season', 'two-session', 'pay-per-session'));

-- Add comment for documentation
COMMENT ON COLUMN teams.selected_package IS 'The registration package selected by the team';

-- Add sanity_team_id column if it doesn't exist (for Sanity CMS integration)
ALTER TABLE teams
ADD COLUMN IF NOT EXISTS sanity_team_id TEXT UNIQUE;

COMMENT ON COLUMN teams.sanity_team_id IS 'Reference to the team record in Sanity CMS';