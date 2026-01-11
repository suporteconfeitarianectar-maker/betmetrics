export type Plan = 'FREE' | 'PRO' | 'ELITE';

export type Country = {
  id: string;
  name: string;
  flag: string;
};

export type League = {
  id: string;
  name: string;
  country: string;
  flag: string;
  gamesAnalyzed: number;
  gamesWithValue: number;
  isActive: boolean;
};

export type Market = {
  id: string;
  name: string;
  description: string;
};

export type EVIndicator = 'positive' | 'neutral' | 'negative';

export type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  leagueId: string;
  date: string;
  time: string;
  market: string;
  marketId: string;
  calculatedProbability: number;
  marketOdds: number;
  fairOdds: number;
  ev: number;
  evIndicator: EVIndicator;
  planRequired: Plan;
  isHomeAdvantage?: boolean;
};

export type UserPlan = {
  current: Plan;
  isDemo: boolean;
};

export type PerformanceData = {
  roi: number;
  totalAnalyses: number;
  averageEV: number;
  winRate: number;
  totalGains: number;
  totalLosses: number;
  netResult: number;
  last7DaysResult: number;
  last7DaysTrend: 'positive' | 'negative';
  currentBankroll: number;
  initialBankroll: number;
  bankrollChange: number;
  bankrollHistory: { date: string; value: number }[];
};
