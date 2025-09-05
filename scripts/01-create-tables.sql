-- Basketball League Database Schema
-- This script creates the core tables for managing a basketball league

-- Divisions table (e.g., "Men's Open", "Women's Competitive", "Youth U18")
CREATE TABLE IF NOT EXISTS divisions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    season_year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url TEXT,
    division_id INTEGER REFERENCES divisions(id) ON DELETE CASCADE,
    coach_name VARCHAR(100),
    coach_email VARCHAR(255),
    region VARCHAR(100),
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    jersey_number INTEGER,
    position VARCHAR(20),
    graduation_year INTEGER,
    height_inches INTEGER,
    bio TEXT,
    headshot_url TEXT,
    highlight_video_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, jersey_number) -- Prevent duplicate jersey numbers per team
);

-- Player stats table (for showcasing top performers)
CREATE TABLE IF NOT EXISTS player_stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    season_year INTEGER NOT NULL,
    games_played INTEGER DEFAULT 0,
    points_per_game DECIMAL(4,1) DEFAULT 0,
    rebounds_per_game DECIMAL(4,1) DEFAULT 0,
    assists_per_game DECIMAL(4,1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, season_year)
);

-- Player awards table
CREATE TABLE IF NOT EXISTS player_awards (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    award_name VARCHAR(100) NOT NULL,
    season_year INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(20) NOT NULL,
    zip_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Games/Sessions table
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    home_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    away_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    venue_id INTEGER REFERENCES venues(id) ON DELETE SET NULL,
    game_date TIMESTAMP NOT NULL,
    division_id INTEGER REFERENCES divisions(id) ON DELETE CASCADE,
    is_tournament BOOLEAN DEFAULT FALSE,
    tournament_name VARCHAR(100),
    home_score INTEGER,
    away_score INTEGER,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media content table (for highlights, recaps, etc.)
CREATE TABLE IF NOT EXISTS media_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    media_type VARCHAR(20) NOT NULL, -- video, photo, article
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    game_id INTEGER REFERENCES games(id) ON DELETE SET NULL,
    player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    category VARCHAR(50), -- highlights, recap, interview, etc.
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News/Updates table
CREATE TABLE IF NOT EXISTS news_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_name VARCHAR(100),
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    description TEXT,
    tier VARCHAR(20) DEFAULT 'standard', -- platinum, gold, silver, standard
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles table (for admin access)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'viewer', -- league_admin, team_admin, viewer
    team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL, -- for team admins
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_division ON teams(division_id);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_games_date ON games(game_date);
CREATE INDEX IF NOT EXISTS idx_games_teams ON games(home_team_id, away_team_id);
CREATE INDEX IF NOT EXISTS idx_media_featured ON media_content(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_posts(is_published, published_at);
