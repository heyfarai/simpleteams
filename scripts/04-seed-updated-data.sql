-- Seed data for the updated schema with proper hierarchy

-- Insert sample seasons
INSERT INTO seasons (name, season_type, year, start_date, end_date, is_active) VALUES
('2024 Regular Season', 'Regular', 2024, '2024-01-15', '2024-05-30', TRUE),
('2024 Summer League', 'Summer', 2024, '2024-06-01', '2024-08-31', FALSE),
('2025 Regular Season', 'Regular', 2025, '2025-01-15', '2025-05-30', FALSE);

-- Insert sample sessions for the 2024 Regular Season
INSERT INTO sessions (name, session_type, season_id, start_date, end_date, description) VALUES
('Week 1 - Season Opener', 'regular', 1, '2024-01-15', '2024-01-21', 'Opening week of the regular season'),
('Week 2 - Conference Matchups', 'regular', 1, '2024-01-22', '2024-01-28', 'Key conference rivalry games'),
('Week 3 - Mid-Season Push', 'regular', 1, '2024-01-29', '2024-02-04', 'Teams fighting for playoff position'),
('Playoffs - Quarterfinals', 'playoff', 1, '2024-05-01', '2024-05-07', 'First round of playoffs'),
('Playoffs - Semifinals', 'playoff', 1, '2024-05-08', '2024-05-14', 'Conference semifinals'),
('Championship Finals', 'playoff', 1, '2024-05-22', '2024-05-30', 'League championship game');

-- Update divisions to reference the current season
UPDATE divisions SET season_id = 1 WHERE season_id IS NULL;

-- Update existing games to reference appropriate sessions
UPDATE games SET session_id = 1 WHERE session_id IS NULL AND game_date >= '2024-01-15' AND game_date <= '2024-01-21';
UPDATE games SET session_id = 2 WHERE session_id IS NULL AND game_date >= '2024-01-22' AND game_date <= '2024-01-28';
UPDATE games SET session_id = 3 WHERE session_id IS NULL AND game_date >= '2024-01-29' AND game_date <= '2024-02-04';

-- Update player stats and awards to reference the current season
UPDATE player_stats SET season_id = 1 WHERE season_id IS NULL;
UPDATE player_awards SET season_id = 1 WHERE season_id IS NULL;
