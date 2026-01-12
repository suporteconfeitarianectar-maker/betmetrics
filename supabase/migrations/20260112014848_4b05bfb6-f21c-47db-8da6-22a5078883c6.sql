-- Add type column to deposits to differentiate deposits from withdrawals
ALTER TABLE public.deposits ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'deposit';

-- Update the trigger function to handle both deposits and withdrawals
CREATE OR REPLACE FUNCTION public.update_bankroll_on_deposit()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.type = 'deposit' THEN
    UPDATE public.profiles 
    SET current_bankroll = current_bankroll + NEW.amount,
        initial_bankroll = initial_bankroll + NEW.amount
    WHERE user_id = NEW.user_id;
  ELSIF NEW.type = 'withdrawal' THEN
    UPDATE public.profiles 
    SET current_bankroll = current_bankroll - NEW.amount
    WHERE user_id = NEW.user_id;
  ELSIF NEW.type = 'initial' THEN
    UPDATE public.profiles 
    SET current_bankroll = NEW.amount,
        initial_bankroll = NEW.amount
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$function$;