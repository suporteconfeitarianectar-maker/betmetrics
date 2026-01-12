import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Bet {
  id: string;
  user_id: string;
  match_name: string;
  league: string | null;
  bet_type: string;
  odds: number;
  stake: number;
  potential_return: number;
  result: 'pending' | 'win' | 'loss' | 'void';
  profit_loss: number;
  created_at: string;
  settled_at: string | null;
}

export interface BetStats {
  totalBets: number;
  pendingBets: number;
  wonBets: number;
  lostBets: number;
  totalProfit: number;
  totalStaked: number;
  winRate: number;
  roi: number;
}

export function useBets() {
  const { user, profile, refreshProfile } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BetStats>({
    totalBets: 0,
    pendingBets: 0,
    wonBets: 0,
    lostBets: 0,
    totalProfit: 0,
    totalStaked: 0,
    winRate: 0,
    roi: 0,
  });

  const fetchBets = useCallback(async () => {
    if (!user) {
      setBets([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bets:', error);
        return;
      }

      const typedBets = (data || []).map(bet => ({
        ...bet,
        odds: Number(bet.odds),
        stake: Number(bet.stake),
        potential_return: Number(bet.potential_return),
        profit_loss: Number(bet.profit_loss),
        result: bet.result as 'pending' | 'win' | 'loss' | 'void',
      }));

      setBets(typedBets);
      calculateStats(typedBets);
    } catch (err) {
      console.error('Error in fetchBets:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const calculateStats = (betsData: Bet[]) => {
    const settledBets = betsData.filter(b => b.result !== 'pending' && b.result !== 'void');
    const wonBets = betsData.filter(b => b.result === 'win').length;
    const lostBets = betsData.filter(b => b.result === 'loss').length;
    const totalProfit = betsData.reduce((sum, b) => sum + b.profit_loss, 0);
    const totalStaked = settledBets.reduce((sum, b) => sum + b.stake, 0);
    const winRate = settledBets.length > 0 ? (wonBets / settledBets.length) * 100 : 0;
    const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;

    setStats({
      totalBets: betsData.length,
      pendingBets: betsData.filter(b => b.result === 'pending').length,
      wonBets,
      lostBets,
      totalProfit,
      totalStaked,
      winRate,
      roi,
    });
  };

  useEffect(() => {
    fetchBets();
  }, [fetchBets]);

  const addBet = async (bet: {
    match_name: string;
    league?: string;
    bet_type: string;
    odds: number;
    stake: number;
  }) => {
    if (!user) return { error: new Error('User not authenticated') };

    const { error } = await supabase
      .from('bets')
      .insert({
        user_id: user.id,
        match_name: bet.match_name,
        league: bet.league || null,
        bet_type: bet.bet_type,
        odds: bet.odds,
        stake: bet.stake,
      });

    if (!error) {
      await fetchBets();
      await refreshProfile();
    }

    return { error: error as Error | null };
  };

  const updateBetResult = async (betId: string, result: 'win' | 'loss' | 'void') => {
    if (!user) return { error: new Error('User not authenticated') };

    const { error } = await supabase
      .from('bets')
      .update({ result })
      .eq('id', betId)
      .eq('user_id', user.id);

    if (!error) {
      await fetchBets();
      await refreshProfile();
    }

    return { error: error as Error | null };
  };

  const deleteBet = async (betId: string) => {
    if (!user) return { error: new Error('User not authenticated') };

    // Database trigger (refund_stake_on_bet_delete) handles refund atomically
    const { error } = await supabase
      .from('bets')
      .delete()
      .eq('id', betId)
      .eq('user_id', user.id);

    if (!error) {
      await fetchBets();
      await refreshProfile();
    }

    return { error: error as Error | null };
  };

  return {
    bets,
    stats,
    loading,
    addBet,
    updateBetResult,
    deleteBet,
    refreshBets: fetchBets,
  };
}
