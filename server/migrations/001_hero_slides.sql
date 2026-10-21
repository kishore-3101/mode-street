-- Migration: 001_hero_slides.sql
-- Description: Create hero_slides table for storefront slideshow management

CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    storage_path TEXT,
    alt_text TEXT,
    link_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS trg_hero_slides_updated ON public.hero_slides;
CREATE TRIGGER trg_hero_slides_updated
    BEFORE UPDATE ON public.hero_slides
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Permissions
GRANT ALL ON TABLE public.hero_slides TO postgres, anon, authenticated, service_role;
