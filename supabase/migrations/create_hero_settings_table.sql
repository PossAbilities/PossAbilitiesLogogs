CREATE TABLE IF NOT EXISTS public.hero_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    show_hero BOOLEAN NOT NULL DEFAULT false,
    image_url TEXT,
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert a default row if the table is empty
INSERT INTO public.hero_settings (id, show_hero, image_url, link_url)
SELECT '00000000-0000-0000-0000-000000000001', false, '', ''
WHERE NOT EXISTS (SELECT 1 FROM public.hero_settings);
