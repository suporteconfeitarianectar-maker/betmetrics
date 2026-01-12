// Team statistics for the last 10 games
export interface TeamStats {
  team: string;
  last10Results: ('W' | 'D' | 'L')[];
  goalsScored: number;
  goalsConceded: number;
  avgGoalsScored: number;
  avgGoalsConceded: number;
  cleanSheets: number;
  failedToScore: number;
  bothTeamsScored: number;
  over25Games: number;
  over15Games: number;
  homeWins?: number;
  awayWins?: number;
  form: number; // 0-100
}

export interface MatchAnalysis {
  matchId: string;
  homeTeam: TeamStats;
  awayTeam: TeamStats;
  headToHead: {
    homeWins: number;
    draws: number;
    awayWins: number;
    avgGoals: number;
    bttsPercentage: number;
  };
  predictions: {
    homeWin: { probability: number; confidence: 'alta' | 'média' | 'baixa' };
    draw: { probability: number; confidence: 'alta' | 'média' | 'baixa' };
    awayWin: { probability: number; confidence: 'alta' | 'média' | 'baixa' };
    over25: { probability: number; confidence: 'alta' | 'média' | 'baixa' };
    btts: { probability: number; confidence: 'alta' | 'média' | 'baixa' };
  };
}

// Mock team statistics
export const teamStats: Record<string, TeamStats> = {
  'Flamengo': {
    team: 'Flamengo',
    last10Results: ['W', 'W', 'D', 'W', 'L', 'W', 'W', 'D', 'W', 'L'],
    goalsScored: 22,
    goalsConceded: 11,
    avgGoalsScored: 2.2,
    avgGoalsConceded: 1.1,
    cleanSheets: 4,
    failedToScore: 1,
    bothTeamsScored: 6,
    over25Games: 7,
    over15Games: 9,
    homeWins: 5,
    form: 75,
  },
  'Palmeiras': {
    team: 'Palmeiras',
    last10Results: ['W', 'D', 'W', 'W', 'W', 'L', 'D', 'W', 'L', 'W'],
    goalsScored: 19,
    goalsConceded: 9,
    avgGoalsScored: 1.9,
    avgGoalsConceded: 0.9,
    cleanSheets: 5,
    failedToScore: 2,
    bothTeamsScored: 5,
    over25Games: 6,
    over15Games: 8,
    awayWins: 3,
    form: 70,
  },
  'Corinthians': {
    team: 'Corinthians',
    last10Results: ['D', 'W', 'L', 'W', 'D', 'W', 'L', 'W', 'D', 'W'],
    goalsScored: 17,
    goalsConceded: 14,
    avgGoalsScored: 1.7,
    avgGoalsConceded: 1.4,
    cleanSheets: 2,
    failedToScore: 2,
    bothTeamsScored: 7,
    over25Games: 8,
    over15Games: 9,
    homeWins: 4,
    form: 60,
  },
  'São Paulo': {
    team: 'São Paulo',
    last10Results: ['W', 'L', 'W', 'D', 'W', 'L', 'W', 'D', 'L', 'W'],
    goalsScored: 15,
    goalsConceded: 12,
    avgGoalsScored: 1.5,
    avgGoalsConceded: 1.2,
    cleanSheets: 3,
    failedToScore: 3,
    bothTeamsScored: 6,
    over25Games: 5,
    over15Games: 7,
    awayWins: 2,
    form: 55,
  },
  'Manchester City': {
    team: 'Manchester City',
    last10Results: ['W', 'W', 'W', 'D', 'W', 'W', 'L', 'W', 'W', 'W'],
    goalsScored: 28,
    goalsConceded: 8,
    avgGoalsScored: 2.8,
    avgGoalsConceded: 0.8,
    cleanSheets: 5,
    failedToScore: 0,
    bothTeamsScored: 5,
    over25Games: 8,
    over15Games: 10,
    homeWins: 6,
    form: 88,
  },
  'Liverpool': {
    team: 'Liverpool',
    last10Results: ['W', 'W', 'D', 'W', 'W', 'W', 'D', 'W', 'L', 'W'],
    goalsScored: 25,
    goalsConceded: 10,
    avgGoalsScored: 2.5,
    avgGoalsConceded: 1.0,
    cleanSheets: 4,
    failedToScore: 1,
    bothTeamsScored: 6,
    over25Games: 8,
    over15Games: 9,
    awayWins: 5,
    form: 82,
  },
  'Grêmio': {
    team: 'Grêmio',
    last10Results: ['W', 'D', 'W', 'L', 'W', 'D', 'W', 'W', 'D', 'L'],
    goalsScored: 16,
    goalsConceded: 11,
    avgGoalsScored: 1.6,
    avgGoalsConceded: 1.1,
    cleanSheets: 3,
    failedToScore: 2,
    bothTeamsScored: 6,
    over25Games: 5,
    over15Games: 8,
    homeWins: 4,
    form: 62,
  },
  'Internacional': {
    team: 'Internacional',
    last10Results: ['L', 'W', 'D', 'W', 'L', 'W', 'D', 'W', 'L', 'D'],
    goalsScored: 14,
    goalsConceded: 13,
    avgGoalsScored: 1.4,
    avgGoalsConceded: 1.3,
    cleanSheets: 2,
    failedToScore: 3,
    bothTeamsScored: 6,
    over25Games: 4,
    over15Games: 7,
    awayWins: 2,
    form: 50,
  },
  'Atlético-MG': {
    team: 'Atlético-MG',
    last10Results: ['W', 'W', 'L', 'W', 'D', 'W', 'W', 'L', 'W', 'D'],
    goalsScored: 20,
    goalsConceded: 12,
    avgGoalsScored: 2.0,
    avgGoalsConceded: 1.2,
    cleanSheets: 3,
    failedToScore: 1,
    bothTeamsScored: 7,
    over25Games: 7,
    over15Games: 9,
    homeWins: 5,
    form: 68,
  },
  'Cruzeiro': {
    team: 'Cruzeiro',
    last10Results: ['D', 'L', 'W', 'D', 'W', 'L', 'D', 'W', 'L', 'W'],
    goalsScored: 13,
    goalsConceded: 14,
    avgGoalsScored: 1.3,
    avgGoalsConceded: 1.4,
    cleanSheets: 2,
    failedToScore: 3,
    bothTeamsScored: 6,
    over25Games: 4,
    over15Games: 6,
    awayWins: 2,
    form: 48,
  },
  'Real Madrid': {
    team: 'Real Madrid',
    last10Results: ['W', 'W', 'W', 'D', 'W', 'L', 'W', 'W', 'D', 'W'],
    goalsScored: 24,
    goalsConceded: 9,
    avgGoalsScored: 2.4,
    avgGoalsConceded: 0.9,
    cleanSheets: 4,
    failedToScore: 1,
    bothTeamsScored: 5,
    over25Games: 7,
    over15Games: 9,
    homeWins: 6,
    form: 80,
  },
  'Barcelona': {
    team: 'Barcelona',
    last10Results: ['W', 'D', 'W', 'W', 'L', 'W', 'W', 'D', 'W', 'L'],
    goalsScored: 22,
    goalsConceded: 11,
    avgGoalsScored: 2.2,
    avgGoalsConceded: 1.1,
    cleanSheets: 3,
    failedToScore: 1,
    bothTeamsScored: 6,
    over25Games: 7,
    over15Games: 9,
    awayWins: 4,
    form: 72,
  },
  'Juventus': {
    team: 'Juventus',
    last10Results: ['D', 'W', 'D', 'L', 'W', 'D', 'W', 'D', 'L', 'W'],
    goalsScored: 14,
    goalsConceded: 10,
    avgGoalsScored: 1.4,
    avgGoalsConceded: 1.0,
    cleanSheets: 4,
    failedToScore: 2,
    bothTeamsScored: 5,
    over25Games: 3,
    over15Games: 6,
    homeWins: 3,
    form: 52,
  },
  'Inter': {
    team: 'Inter',
    last10Results: ['W', 'W', 'W', 'D', 'W', 'W', 'L', 'W', 'D', 'W'],
    goalsScored: 21,
    goalsConceded: 8,
    avgGoalsScored: 2.1,
    avgGoalsConceded: 0.8,
    cleanSheets: 5,
    failedToScore: 1,
    bothTeamsScored: 4,
    over25Games: 6,
    over15Games: 8,
    awayWins: 5,
    form: 78,
  },
  'Bayern Munich': {
    team: 'Bayern Munich',
    last10Results: ['W', 'W', 'W', 'W', 'D', 'W', 'W', 'L', 'W', 'W'],
    goalsScored: 32,
    goalsConceded: 12,
    avgGoalsScored: 3.2,
    avgGoalsConceded: 1.2,
    cleanSheets: 3,
    failedToScore: 0,
    bothTeamsScored: 7,
    over25Games: 9,
    over15Games: 10,
    homeWins: 6,
    form: 85,
  },
  'Dortmund': {
    team: 'Dortmund',
    last10Results: ['W', 'L', 'W', 'W', 'D', 'L', 'W', 'W', 'L', 'W'],
    goalsScored: 24,
    goalsConceded: 18,
    avgGoalsScored: 2.4,
    avgGoalsConceded: 1.8,
    cleanSheets: 2,
    failedToScore: 1,
    bothTeamsScored: 8,
    over25Games: 8,
    over15Games: 9,
    awayWins: 3,
    form: 62,
  },
  'PSG': {
    team: 'PSG',
    last10Results: ['W', 'W', 'W', 'D', 'W', 'W', 'W', 'D', 'W', 'L'],
    goalsScored: 26,
    goalsConceded: 8,
    avgGoalsScored: 2.6,
    avgGoalsConceded: 0.8,
    cleanSheets: 5,
    failedToScore: 0,
    bothTeamsScored: 5,
    over25Games: 7,
    over15Games: 10,
    homeWins: 6,
    form: 84,
  },
  'Lyon': {
    team: 'Lyon',
    last10Results: ['D', 'W', 'L', 'W', 'D', 'L', 'W', 'D', 'W', 'L'],
    goalsScored: 15,
    goalsConceded: 14,
    avgGoalsScored: 1.5,
    avgGoalsConceded: 1.4,
    cleanSheets: 2,
    failedToScore: 2,
    bothTeamsScored: 7,
    over25Games: 5,
    over15Games: 7,
    awayWins: 2,
    form: 48,
  },
  'Galatasaray': {
    team: 'Galatasaray',
    last10Results: ['W', 'W', 'D', 'W', 'L', 'W', 'W', 'D', 'W', 'L'],
    goalsScored: 21,
    goalsConceded: 12,
    avgGoalsScored: 2.1,
    avgGoalsConceded: 1.2,
    cleanSheets: 3,
    failedToScore: 1,
    bothTeamsScored: 7,
    over25Games: 7,
    over15Games: 9,
    homeWins: 5,
    form: 72,
  },
  'Fenerbahçe': {
    team: 'Fenerbahçe',
    last10Results: ['W', 'D', 'W', 'W', 'D', 'L', 'W', 'W', 'L', 'W'],
    goalsScored: 19,
    goalsConceded: 11,
    avgGoalsScored: 1.9,
    avgGoalsConceded: 1.1,
    cleanSheets: 3,
    failedToScore: 1,
    bothTeamsScored: 6,
    over25Games: 6,
    over15Games: 8,
    awayWins: 4,
    form: 68,
  },
  'Al-Hilal': {
    team: 'Al-Hilal',
    last10Results: ['W', 'W', 'W', 'W', 'D', 'W', 'W', 'L', 'W', 'W'],
    goalsScored: 28,
    goalsConceded: 9,
    avgGoalsScored: 2.8,
    avgGoalsConceded: 0.9,
    cleanSheets: 4,
    failedToScore: 0,
    bothTeamsScored: 6,
    over25Games: 8,
    over15Games: 10,
    homeWins: 6,
    form: 86,
  },
  'Al-Nassr': {
    team: 'Al-Nassr',
    last10Results: ['W', 'D', 'W', 'L', 'W', 'W', 'D', 'W', 'L', 'W'],
    goalsScored: 22,
    goalsConceded: 12,
    avgGoalsScored: 2.2,
    avgGoalsConceded: 1.2,
    cleanSheets: 3,
    failedToScore: 1,
    bothTeamsScored: 7,
    over25Games: 7,
    over15Games: 9,
    awayWins: 4,
    form: 70,
  },
};

// Get match analysis
export function getMatchAnalysis(matchId: string, homeTeamName: string, awayTeamName: string): MatchAnalysis | null {
  const homeTeam = teamStats[homeTeamName];
  const awayTeam = teamStats[awayTeamName];

  if (!homeTeam || !awayTeam) return null;

  // Calculate predictions based on stats
  const homeFormAdvantage = (homeTeam.form - awayTeam.form) / 100;
  const homeGoalAdvantage = (homeTeam.avgGoalsScored - awayTeam.avgGoalsConceded) / 2;
  const awayGoalAdvantage = (awayTeam.avgGoalsScored - homeTeam.avgGoalsConceded) / 2;

  // Simple probability calculations
  let homeWinProb = 0.35 + homeFormAdvantage * 0.2 + homeGoalAdvantage * 0.1 + 0.05; // Home advantage
  let drawProb = 0.28 - Math.abs(homeFormAdvantage) * 0.1;
  let awayWinProb = 0.32 - homeFormAdvantage * 0.2 + awayGoalAdvantage * 0.1;

  // Normalize
  const total = homeWinProb + drawProb + awayWinProb;
  homeWinProb = homeWinProb / total;
  drawProb = drawProb / total;
  awayWinProb = awayWinProb / total;

  // Over 2.5 based on average goals
  const avgTotalGoals = homeTeam.avgGoalsScored + awayTeam.avgGoalsScored;
  const over25Prob = Math.min(0.85, Math.max(0.25, (avgTotalGoals - 1.5) / 3));

  // BTTS based on both teams' scoring/conceding patterns
  const bttsProb = Math.min(0.85, Math.max(0.3, 
    ((homeTeam.bothTeamsScored + awayTeam.bothTeamsScored) / 20) * 0.6 +
    (1 - (homeTeam.failedToScore + awayTeam.failedToScore) / 20) * 0.4
  ));

  const getConfidence = (prob: number): 'alta' | 'média' | 'baixa' => {
    if (prob >= 0.6) return 'alta';
    if (prob >= 0.45) return 'média';
    return 'baixa';
  };

  return {
    matchId,
    homeTeam,
    awayTeam,
    headToHead: {
      homeWins: 3,
      draws: 2,
      awayWins: 2,
      avgGoals: 2.7,
      bttsPercentage: 57,
    },
    predictions: {
      homeWin: { probability: homeWinProb, confidence: getConfidence(homeWinProb) },
      draw: { probability: drawProb, confidence: getConfidence(drawProb) },
      awayWin: { probability: awayWinProb, confidence: getConfidence(awayWinProb) },
      over25: { probability: over25Prob, confidence: getConfidence(over25Prob) },
      btts: { probability: bttsProb, confidence: getConfidence(bttsProb) },
    },
  };
}
