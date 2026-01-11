export type Plan = 'FREE' | 'PRO' | 'ELITE';

export type League = {
  id: string;
  name: string;
  country: string;
  flag: string;
  gamesAnalyzed: number;
  gamesWithValue: number;
  isActive: boolean;
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
  calculatedProbability: number;
  marketOdds: number;
  fairOdds: number;
  ev: number;
  evIndicator: EVIndicator;
  planRequired: Plan;
};

export type UserPlan = {
  current: Plan;
  isDemo: boolean;
};
