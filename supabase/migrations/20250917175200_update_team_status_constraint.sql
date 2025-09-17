-- Update team status constraint to include 'active'
ALTER TABLE teams DROP CONSTRAINT IF EXISTS teams_status_check;
ALTER TABLE teams ADD CONSTRAINT teams_status_check
CHECK (status IN ('pending', 'active', 'approved', 'suspended', 'archived'));

-- Also update payment_status constraint to make sure it includes all needed statuses
ALTER TABLE teams DROP CONSTRAINT IF EXISTS teams_payment_status_check;
ALTER TABLE teams ADD CONSTRAINT teams_payment_status_check
CHECK (payment_status IN ('pending', 'paid', 'overdue', 'refunded', 'partial'));