-- ============================================================
-- InvitaCon SaaS - Database Schema
-- Run this SQL in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ------------------------------------------------
-- 1. PROFILES TABLE
-- Extended user data linked to auth.users
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to fire on every new signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);


-- ------------------------------------------------
-- 2. TEMPLATES TABLE
-- Base designs created by the admin (JSON structure)
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'wedding',
  description TEXT,
  thumbnail_url TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Templates are readable by everyone (public gallery)
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are publicly readable"
  ON public.templates FOR SELECT
  USING (is_active = TRUE);


-- ------------------------------------------------
-- 3. INVITATIONS TABLE
-- Each user's customized invitation instance
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Mi Invitación',
  slug TEXT UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'paid')),
  version INTEGER NOT NULL DEFAULT 1,
  og_image_url TEXT,
  event_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for fast slug lookups (public guest view)
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON public.invitations(user_id);

-- RLS for invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Owners can do anything with their own invitations
CREATE POLICY "Users can view their own invitations"
  ON public.invitations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own invitations"
  ON public.invitations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invitations"
  ON public.invitations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invitations"
  ON public.invitations FOR DELETE
  USING (auth.uid() = user_id);

-- Public can view PAID invitations (guest view)
CREATE POLICY "Public can view paid invitations"
  ON public.invitations FOR SELECT
  USING (status = 'paid');


-- ------------------------------------------------
-- 4. GUESTS TABLE
-- RSVP responses from guests
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'declined', 'pending')),
  dietary_requirements TEXT,
  plus_ones INTEGER DEFAULT 0,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON public.guests(invitation_id);

-- RLS for guests
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Invitation owners can view their guests
CREATE POLICY "Invitation owners can view guests"
  ON public.guests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = guests.invitation_id
      AND invitations.user_id = auth.uid()
    )
  );

-- Anyone can insert a guest (public RSVP form — no auth required)
CREATE POLICY "Anyone can RSVP to a paid invitation"
  ON public.guests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = guests.invitation_id
      AND invitations.status = 'paid'
    )
  );


-- ------------------------------------------------
-- 5. SEED DATA: Wedding Template
-- ------------------------------------------------
INSERT INTO public.templates (name, slug, category, description, content)
VALUES (
  'Boda Clásica',
  'boda-clasica',
  'wedding',
  'Diseño elegante y atemporal para bodas',
  '{
    "version": 1,
    "sections": {
      "hero": {
        "title": "Ana & Luis",
        "subtitle": "¡Nos casamos!",
        "date": "2026-06-15",
        "coverImage": ""
      },
      "story": {
        "title": "Nuestra Historia",
        "text": "Cuéntale a tus invitados vuestra historia de amor..."
      },
      "details": {
        "ceremony": {
          "title": "Ceremonia",
          "time": "12:00",
          "location": "Iglesia de San Juan",
          "mapUrl": ""
        },
        "reception": {
          "title": "Celebración",
          "time": "14:00",
          "location": "Finca Las Rosas",
          "mapUrl": ""
        }
      },
      "gallery": {
        "images": []
      },
      "rsvp": {
        "enabled": true,
        "deadline": "",
        "allowPlusOnes": true,
        "askDietary": true
      }
    },
    "design": {
      "colorPalette": "rose",
      "fontFamily": "Playfair Display",
      "accentColor": "#be185d"
    }
  }'
)
ON CONFLICT (slug) DO NOTHING;
