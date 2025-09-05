-- Update Basketball League Database Schema
-- This script updates the schema to properly reflect the hierarchy:
-- Games -> Sessions -> Seasons

-- Create seasons table to manage Regular and Summer seasons
CREATE TABLE IF NOT EXISTS seasons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g., "2024 Regular Season", "2024 Summer League"
    season_type VARCHAR(20) NOT NULL CHECK (season_type IN ('Regular', 'Summer')),
    year INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table to group games within seasons
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g., "Week 1", "Playoffs Round 1", "Championship"
    session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('regular', 'playoff')),
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update divisions table to reference seasons instead of just year
ALTER TABLE divisions 
DROP COLUMN IF EXISTS season_year,
ADD COLUMN IF NOT EXISTS season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE;

-- Update games table to reference sessions instead of divisions directly
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE;

-- Update player_stats to reference seasons instead of just year
ALTER TABLE player_stats 
DROP COLUMN IF EXISTS season_year,
ADD COLUMN IF NOT EXISTS season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE;

-- Update player_awards to reference seasons instead of just year
ALTER TABLE player_awards 
DROP COLUMN IF EXISTS season_year,
ADD COLUMN IF NOT EXISTS season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE;

-- Create indexes for the new relationships
CREATE INDEX IF NOT EXISTS idx_divisions_season ON divisions(season_id);
CREATE INDEX IF NOT EXISTS idx_sessions_season ON sessions(season_id);
CREATE INDEX IF NOT EXISTS idx_games_session ON games(session_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_season ON player_stats(season_id);
CREATE INDEX IF NOT EXISTS idx_player_awards_season ON player_awards(season_id);

-- Add constraint to ensure only one active season per type per year
CREATE UNIQUE INDEX IF NOT EXISTS idx_seasons_active_unique 
ON seasons(season_type, year) 
WHERE is_active = TRUE;
