-- Create fixtures cache table
CREATE TABLE public.fixtures_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_date DATE NOT NULL UNIQUE,
  fixtures JSONB NOT NULL DEFAULT '[]',
  fixtures_by_league JSONB NOT NULL DEFAULT '{}',
  api_calls_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fixtures_cache ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read cache (shared cache)
CREATE POLICY "Anyone can read fixtures cache"
ON public.fixtures_cache
FOR SELECT
TO authenticated
USING (true);

-- Only service role can insert/update (edge function)
CREATE POLICY "Service role can manage cache"
ON public.fixtures_cache
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_fixtures_cache_updated_at
BEFORE UPDATE ON public.fixtures_cache
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on date for fast lookups
CREATE INDEX idx_fixtures_cache_date ON public.fixtures_cache(cache_date);