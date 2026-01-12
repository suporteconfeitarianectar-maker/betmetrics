import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Fixture {
  id: number;
  date: string;
  timestamp: number;
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
  };
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
}

export function useFixtures() {
  const { user } = useAuth();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFixtures = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fnError } = await supabase.functions.invoke('get-fixtures');

      if (fnError) {
        console.error('Error fetching fixtures:', fnError);
        setError('Erro ao buscar jogos');
        return;
      }

      if (data?.fixtures) {
        setFixtures(data.fixtures);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, [user]);

  return { fixtures, loading, error, refetch: fetchFixtures };
}
