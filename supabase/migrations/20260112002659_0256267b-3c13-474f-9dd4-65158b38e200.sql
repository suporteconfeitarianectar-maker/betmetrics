-- Create bets table for user betting history
CREATE TABLE public.bets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_name TEXT NOT NULL,
  league TEXT,
  bet_type TEXT NOT NULL,
  odds DECIMAL(10,2) NOT NULL,
  stake DECIMAL(10,2) NOT NULL,
  potential_return DECIMAL(10,2) GENERATED ALWAYS AS (stake * odds) STORED,
  result TEXT CHECK (result IN ('pending', 'win', 'loss', 'void')) DEFAULT 'pending',
  profit_loss DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  settled_at TIMESTAMP WITH TIME ZONE
);

-- Add bankroll column to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_bankroll DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS initial_bankroll DECIMAL(10,2) DEFAULT 0;

-- Enable RLS on bets
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;

-- RLS policies for bets
CREATE POLICY "Users can view their own bets"
ON public.bets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bets"
ON public.bets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bets"
ON public.bets FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bets"
ON public.bets FOR DELETE
USING (auth.uid() = user_id);

-- Function to update bankroll when bet is settled
CREATE OR REPLACE FUNCTION public.update_bankroll_on_bet_settle()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profit DECIMAL(10,2);
BEGIN
  -- Only process if result changed from pending to win/loss
  IF OLD.result = 'pending' AND NEW.result IN ('win', 'loss', 'void') THEN
    IF NEW.result = 'win' THEN
      profit := (NEW.stake * NEW.odds) - NEW.stake;
      NEW.profit_loss := profit;
    ELSIF NEW.result = 'loss' THEN
      profit := -NEW.stake;
      NEW.profit_loss := profit;
    ELSE -- void
      profit := 0;
      NEW.profit_loss := 0;
    END IF;
    
    NEW.settled_at := now();
    
    -- Update user's bankroll
    UPDATE public.profiles 
    SET current_bankroll = current_bankroll + profit
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for bankroll update
CREATE TRIGGER on_bet_settled
  BEFORE UPDATE ON public.bets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_bankroll_on_bet_settle();

-- Function to subtract stake when bet is placed
CREATE OR REPLACE FUNCTION public.subtract_stake_on_bet_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Subtract stake from bankroll when bet is placed
  UPDATE public.profiles 
  SET current_bankroll = current_bankroll - NEW.stake
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger for stake subtraction
CREATE TRIGGER on_bet_placed
  AFTER INSERT ON public.bets
  FOR EACH ROW
  EXECUTE FUNCTION public.subtract_stake_on_bet_insert();