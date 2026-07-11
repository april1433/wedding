-- ================================================================
-- WEDDING SITE — Supabase Setup SQL
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ================================================================

-- 1. RSVP table
CREATE TABLE IF NOT EXISTS public.rsvp (
  id          bigserial PRIMARY KEY,
  created_at  timestamptz DEFAULT now(),
  name        text NOT NULL,
  attending   text NOT NULL,
  guests      int  DEFAULT 1,
  contact     text,
  message     text
);

-- 2. Guestbook table
CREATE TABLE IF NOT EXISTS public.guestbook (
  id         bigserial PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name       text NOT NULL,
  message    text NOT NULL
);

-- 3. Enable Row Level Security
ALTER TABLE public.rsvp      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

-- 4. Allow anyone to INSERT (guests submitting RSVP / guestbook)
CREATE POLICY "Allow public insert on rsvp"
  ON public.rsvp FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "Allow public insert on guestbook"
  ON public.guestbook FOR INSERT
  TO anon WITH CHECK (true);

-- 5. Allow anyone to SELECT (needed for guestbook display + admin)
CREATE POLICY "Allow public read on rsvp"
  ON public.rsvp FOR SELECT
  TO anon USING (true);

CREATE POLICY "Allow public read on guestbook"
  ON public.guestbook FOR SELECT
  TO anon USING (true);
