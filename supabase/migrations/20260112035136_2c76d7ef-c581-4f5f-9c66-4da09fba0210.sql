-- 1. Add explicit DENY policy for deposits UPDATE (financial records should be immutable)
CREATE POLICY "Deny all updates to deposits"
ON public.deposits
FOR UPDATE
USING (false);

-- 2. Create trigger to handle bet deletion refunds atomically
CREATE OR REPLACE FUNCTION refund_stake_on_bet_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Defense-in-depth: verify the operation is for the authenticated user
  IF auth.uid() IS NOT NULL AND OLD.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot delete bets for other users';
  END IF;

  -- Only refund stake if bet was still pending
  IF OLD.result = 'pending' THEN
    UPDATE public.profiles 
    SET current_bankroll = current_bankroll + OLD.stake
    WHERE user_id = OLD.user_id;
  END IF;
  
  RETURN OLD;
END;
$$;

CREATE TRIGGER on_bet_deleted
  BEFORE DELETE ON public.bets
  FOR EACH ROW
  EXECUTE FUNCTION refund_stake_on_bet_delete();