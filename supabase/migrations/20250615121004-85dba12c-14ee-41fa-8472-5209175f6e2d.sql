
-- 1. WBJEE Colleges Table
CREATE TABLE public.wbjee_colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- ex: Government, Private, University
  location TEXT NOT NULL,
  district TEXT,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  established INTEGER,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. WBJEE Branches Table (per college)
CREATE TABLE public.wbjee_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.wbjee_colleges(id) ON DELETE CASCADE,
  branch_name TEXT NOT NULL,
  degree TEXT, -- BTech, BArch, etc
  intake INTEGER,
  is_core BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. WBJEE Cutoffs Table (multi-year, multi-round, all categories)
CREATE TABLE public.wbjee_cutoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.wbjee_colleges(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.wbjee_branches(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  round INTEGER NOT NULL, -- ex: 1, 2, 3, Spot, etc
  category TEXT NOT NULL, -- General, OBC-A, OBC-B, SC, ST, PWD, etc
  opening_rank INTEGER,
  closing_rank INTEGER,
  domicile TEXT, -- Home, Other
  quota TEXT, -- GMR, PMR etc
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Add simple views to help with statistics (optional step for reporting)

-- 5. (Optional) Counselling Schedule Table
CREATE TABLE public.wbjee_counselling_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  event_date DATE NOT NULL,
  year INTEGER NOT NULL DEFAULT date_part('year', CURRENT_DATE)
);

-- 6. Indexes for efficient queries
CREATE INDEX ON public.wbjee_cutoffs (branch_id, year, round, category);
CREATE INDEX ON public.wbjee_colleges (name);

-- RLS: All public, just info, user can read. (No need for write policies)
ALTER TABLE public.wbjee_colleges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for all" ON public.wbjee_colleges FOR SELECT USING (true);

ALTER TABLE public.wbjee_branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for all" ON public.wbjee_branches FOR SELECT USING (true);

ALTER TABLE public.wbjee_cutoffs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for all" ON public.wbjee_cutoffs FOR SELECT USING (true);

ALTER TABLE public.wbjee_counselling_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for all" ON public.wbjee_counselling_schedule FOR SELECT USING (true);
