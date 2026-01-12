import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Fixture {
  id: number;
  date: string;
  timestamp: number;
  status: string;
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    round: string;
    priority: number;
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

export interface FixturesByLeague {
  [key: string]: Fixture[];
}

export function useFixtures() {
  const { user } = useAuth();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [fixturesByLeague, setFixturesByLeague] = useState<FixturesByLeague>({});
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
      if (data?.fixturesByLeague) {
        setFixturesByLeague(data.fixturesByLeague);
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

  return { fixtures, fixturesByLeague, loading, error, refetch: fetchFixtures };
}
