-- Force update the team status constraint
-- First drop all existing status constraints
ALTER TABLE teams DROP CONSTRAINT IF EXISTS teams_status_check;
ALTER TABLE teams DROP CONSTRAINT IF EXISTS check_status;

-- Add the new constraint with 'active' included
ALTER TABLE teams ADD CONSTRAINT teams_status_check
CHECK (status IN ('pending', 'active', 'approved', 'suspended', 'archived'));

-- Double check payment status too
ALTER TABLE teams DROP CONSTRAINT IF EXISTS teams_payment_status_check;
ALTER TABLE teams DROP CONSTRAINT IF EXISTS check_payment_status;

ALTER TABLE teams ADD CONSTRAINT teams_payment_status_check
CHECK (payment_status IN ('pending', 'paid', 'overdue', 'refunded', 'partial'));