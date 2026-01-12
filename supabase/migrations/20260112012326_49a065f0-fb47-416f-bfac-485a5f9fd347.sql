-- Create deposits/aportes table to track user deposits to their bankroll
CREATE TABLE public.deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT DEFAULT 'Aporte',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own deposits" 
ON public.deposits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deposits" 
ON public.deposits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deposits" 
ON public.deposits 
FOR DELETE 
USING (auth.uid() = user_id);

-- Function to update bankroll when deposit is added
CREATE OR REPLACE FUNCTION public.update_bankroll_on_deposit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.profiles 
  SET current_bankroll = current_bankroll + NEW.amount,
      initial_bankroll = initial_bankroll + NEW.amount
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-update bankroll on deposit
CREATE TRIGGER on_deposit_inserted
  AFTER INSERT ON public.deposits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_bankroll_on_deposit();