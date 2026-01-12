import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Deposit {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  created_at: string;
}

export function useDeposits() {
  const { user } = useAuth();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDeposits, setTotalDeposits] = useState(0);

  const fetchDeposits = async () => {
    if (!user) {
      setDeposits([]);
      setTotalDeposits(0);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching deposits:', error);
      setLoading(false);
      return;
    }

    const depositsData = (data || []) as Deposit[];
    setDeposits(depositsData);
    
    // Calculate total deposits
    const total = depositsData.reduce((sum, d) => sum + Number(d.amount), 0);
    setTotalDeposits(total);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchDeposits();
  }, [user]);

  const addDeposit = async (amount: number, description: string = 'Aporte') => {
    if (!user) return { error: new Error('User not authenticated') };

    const { error } = await supabase
      .from('deposits')
      .insert({
        user_id: user.id,
        amount,
        description
      });

    if (!error) {
      await fetchDeposits();
    }

    return { error };
  };

  const deleteDeposit = async (depositId: string) => {
    if (!user) return { error: new Error('User not authenticated') };

    const { error } = await supabase
      .from('deposits')
      .delete()
      .eq('id', depositId);

    if (!error) {
      await fetchDeposits();
    }

    return { error };
  };

  return {
    deposits,
    totalDeposits,
    loading,
    addDeposit,
    deleteDeposit,
    refreshDeposits: fetchDeposits
  };
}
