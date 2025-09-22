-- Import seasons from CSV
\copy seasons(id, organization_id, name, year, start_date, end_date, status, is_active) FROM 'seasons.csv' WITH (FORMAT csv, HEADER true);