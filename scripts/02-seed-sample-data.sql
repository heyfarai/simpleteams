-- Sample data for basketball league
-- This script populates the database with initial sample data

-- Insert sample divisions
INSERT INTO divisions (name, description, season_year) VALUES
('Diamond', 'Competitive league for adult men players', 2025),
('Premier', 'High-level competition for women players', 2025),
('Supreme', 'Development league for players under 18', 2025),
('Ascent', 'Fun, casual games for all skill levels', 2025);

-- Insert sample venues
INSERT INTO venues (name, address, city, state, zip_code, latitude, longitude) VALUES
('Downtown Sports Complex', '123 Main St', 'Springfield', 'IL', '62701', 39.7817, -89.6501),
('Westside Community Center', '456 Oak Ave', 'Springfield', 'IL', '62704', 39.7990, -89.6440),
('Northside Gymnasium', '789 Pine Rd', 'Springfield', 'IL', '62702', 39.8200, -89.6300),
('Central High School Gym', '321 School Dr', 'Springfield', 'IL', '62703', 39.7650, -89.6200);

-- Insert sample teams
INSERT INTO teams (name, division_id, coach_name, coach_email, region, wins, losses) VALUES
('ONL-X Senior', 1, 'Mike Johnson', 'mike@thunderbolts.com', 'North Springfield', 8, 2),
('Kingmo Elite', 1, 'Sarah Davis', 'sarah@firehawks.com', 'Downtown', 7, 3),
('Brockville Blazers', 1, 'Chris Wilson', 'chris@stormriders.com', 'West Side', 6, 4),
('Helisis', 2, 'Jennifer Brown', 'jen@lightning.com', 'East Springfield', 9, 1),
('Phoenix Rising', 2, 'Amanda Taylor', 'amanda@phoenix.com', 'South Side', 5, 5),
('Young Guns', 3, 'David Miller', 'david@youngguns.com', 'Central', 4, 2);

-- Insert sample players
INSERT INTO players (first_name, last_name, team_id, jersey_number, position, graduation_year, height_inches, bio) VALUES
('Marcus', 'Thompson', 1, 23, 'Point Guard', 2026, 72, 'Dynamic playmaker with excellent court vision and leadership skills.'),
('Tyler', 'Rodriguez', 1, 15, 'Shooting Guard', 2025, 75, 'Sharpshooter with range beyond the arc and clutch gene.'),
('Jordan', 'Williams', 1, 32, 'Forward', 2024, 78, 'Versatile forward who can score inside and out.'),
('Alex', 'Johnson', 2, 10, 'Center', 2025, 82, 'Dominant presence in the paint with soft touch around the rim.'),
('Casey', 'Davis', 2, 7, 'Guard', 2026, 70, 'Speedy guard with lockdown defense and transition scoring.'),
('Maya', 'Anderson', 4, 12, 'Forward', 2025, 73, 'Athletic forward with strong rebounding and mid-range game.'),
('Zoe', 'Martinez', 4, 24, 'Guard', 2024, 68, 'Floor general with exceptional passing ability and basketball IQ.'),
('Emma', 'Wilson', 5, 33, 'Center', 2026, 76, 'Physical post player with developing outside shot.');

-- Insert sample player stats
INSERT INTO player_stats (player_id, season_year, games_played, points_per_game, rebounds_per_game, assists_per_game) VALUES
(1, 2025, 10, 18.5, 4.2, 8.1),
(2, 2025, 10, 22.3, 5.1, 3.4),
(3, 2025, 9, 16.8, 7.9, 2.8),
(4, 2025, 10, 14.2, 11.5, 1.9),
(5, 2025, 10, 12.7, 3.8, 6.2),
(6, 2025, 10, 19.4, 8.3, 4.1),
(7, 2025, 9, 11.8, 2.9, 9.7),
(8, 2025, 8, 13.6, 9.2, 2.3);

-- Insert sample awards
INSERT INTO player_awards (player_id, award_name, season_year, description) VALUES
(1, 'MVP 2024', 2024, 'Most Valuable Player of the season'),
(2, 'All-Tournament Team', 2024, 'Selected for exceptional tournament performance'),
(6, 'Rookie of the Year', 2024, 'Outstanding first-year player'),
(7, 'Assist Leader', 2024, 'Led league in assists per game');

-- Insert sample games
INSERT INTO games (home_team_id, away_team_id, venue_id, game_date, division_id, status, home_score, away_score) VALUES
(1, 2, 1, '2025-01-15 19:00:00', 1, 'completed', 78, 72),
(3, 1, 2, '2025-01-18 20:00:00', 1, 'completed', 65, 81),
(4, 5, 3, '2025-01-20 18:30:00', 2, 'completed', 89, 76),
(2, 3, 1, '2025-01-25 19:30:00', 1, 'scheduled', NULL, NULL),
(1, 4, 4, '2025-01-28 20:00:00', 1, 'scheduled', NULL, NULL);

-- Insert sample sponsors
INSERT INTO sponsors (name, logo_url, website_url, description, tier, display_order) VALUES
('Springfield Sports Store', '/placeholder.svg?height=60&width=120', 'https://springfieldsports.com', 'Your local sports equipment headquarters', 'platinum', 1),
('Metro Bank', '/placeholder.svg?height=60&width=120', 'https://metrobank.com', 'Supporting community athletics', 'gold', 2),
('Pizza Palace', '/placeholder.svg?height=60&width=120', 'https://pizzapalace.com', 'Fuel your game with great pizza', 'silver', 3),
('Fitness First Gym', '/placeholder.svg?height=60&width=120', 'https://fitnessfirst.com', 'Train like a champion', 'standard', 4);

-- Insert sample news posts
INSERT INTO news_posts (title, content, excerpt, author_name, is_published, published_at) VALUES
('Season Playoffs Begin Next Week', 'The highly anticipated playoff season kicks off next Monday with four exciting matchups. Teams have been preparing intensively for what promises to be the most competitive postseason in league history...', 'Playoff season starts Monday with four exciting matchups', 'League Staff', true, '2025-01-20 10:00:00'),
('New Partnership with Springfield Sports Store', 'We are excited to announce our new partnership with Springfield Sports Store, who will be providing equipment discounts to all league participants...', 'New partnership brings equipment discounts to players', 'Admin Team', true, '2025-01-18 14:30:00'),
('Player Spotlight: Marcus Thompson', 'This week we highlight Marcus Thompson, the dynamic point guard leading the ONL-X Senior to an impressive 8-2 record this season...', 'Featured player leading ONL-X Senior to success', 'Sarah Johnson', true, '2025-01-15 09:00:00');
