
ALTER TABLE public.colleges ADD COLUMN accreditation text;
ALTER TABLE public.colleges ADD COLUMN website_url text;
ALTER TABLE public.colleges ADD COLUMN phone text;
ALTER TABLE public.colleges ADD COLUMN email text;
ALTER TABLE public.colleges ADD COLUMN address text;
ALTER TABLE public.colleges ADD COLUMN additional_images jsonb;
ALTER TABLE public.colleges ADD COLUMN facilities jsonb;
ALTER TABLE public.colleges ADD COLUMN courses_offered jsonb;
ALTER TABLE public.colleges ADD COLUMN placement_stats jsonb;
ALTER TABLE public.colleges ADD COLUMN awards jsonb;
ALTER TABLE public.colleges ADD COLUMN campus_area text;
ALTER TABLE public.colleges ADD COLUMN admission_process text;
ALTER TABLE public.colleges ADD COLUMN scholarships jsonb;
