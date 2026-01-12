-- Add CHECK constraint for CPF format validation (11 digits only)
ALTER TABLE public.profiles ADD CONSTRAINT cpf_format_check 
CHECK (cpf IS NULL OR cpf ~ '^[0-9]{11}$');

-- Update trigger functions to add explicit user_id validation for defense-in-depth

-- Update update_bankroll_on_bet_settle function with user validation
CREATE OR REPLACE FUNCTION public.update_bankroll_on_bet_settle()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  profit DECIMAL(10,2);
BEGIN
  -- Defense-in-depth: verify the operation is for the authenticated user
  -- Note: auth.uid() may be null in trigger context, so we skip this check if null
  -- The RLS policies on the bets table already ensure only the owner can UPDATE their bets
  IF auth.uid() IS NOT NULL AND NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot modify bets for other users';
  END IF;

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
$function$;

-- Update subtract_stake_on_bet_insert function with user validation
CREATE OR REPLACE FUNCTION public.subtract_stake_on_bet_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Defense-in-depth: verify the operation is for the authenticated user
  IF auth.uid() IS NOT NULL AND NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot place bets for other users';
  END IF;

  -- Subtract stake from bankroll when bet is placed
  UPDATE public.profiles 
  SET current_bankroll = current_bankroll - NEW.stake
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$function$;

-- Update update_bankroll_on_deposit function with user validation
CREATE OR REPLACE FUNCTION public.update_bankroll_on_deposit()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Defense-in-depth: verify the operation is for the authenticated user
  IF auth.uid() IS NOT NULL AND NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot modify deposits for other users';
  END IF;

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