-- Check existing seasons in database
SELECT id, name, year, is_active, organization_id
FROM seasons
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'nchc-basketball');