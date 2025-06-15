
-- Add human-readable name columns to wbjee_cutoffs for convenient CSV imports.
ALTER TABLE public.wbjee_cutoffs
  ADD COLUMN IF NOT EXISTS college_name TEXT,
  ADD COLUMN IF NOT EXISTS branch_name TEXT;
