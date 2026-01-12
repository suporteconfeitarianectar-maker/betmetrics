import { TeamStats } from '@/data/teamStats';
import { cn } from '@/lib/utils';

interface StatsComparisonProps {
  homeTeam: TeamStats;
  awayTeam: TeamStats;
}

export function StatsComparison({ homeTeam, awayTeam }: StatsComparisonProps) {
  const comparisons = [
    {
      label: 'Média de gols',
      home: homeTeam.avgGoalsScored,
      away: awayTeam.avgGoalsScored,
      format: (v: number) => v.toFixed(1),
      higherIsBetter: true,
    },
    {
      label: 'Média de gols sofridos',
      home: homeTeam.avgGoalsConceded,
      away: awayTeam.avgGoalsConceded,
      format: (v: number) => v.toFixed(1),
      higherIsBetter: false,
    },
    {
      label: 'Clean sheets',
      home: homeTeam.cleanSheets,
      away: awayTeam.cleanSheets,
      format: (v: number) => v.toString(),
      higherIsBetter: true,
    },
    {
      label: 'Jogos Over 2.5',
      home: homeTeam.over25Games,
      away: awayTeam.over25Games,
      format: (v: number) => `${v}/10`,
      higherIsBetter: null, // No preference
    },
    {
      label: 'Ambas marcaram',
      home: homeTeam.bothTeamsScored,
      away: awayTeam.bothTeamsScored,
      format: (v: number) => `${v}/10`,
      higherIsBetter: null,
    },
    {
      label: 'Forma atual',
      home: homeTeam.form,
      away: awayTeam.form,
      format: (v: number) => `${v}%`,
      higherIsBetter: true,
    },
  ];

  const getWinner = (home: number, away: number, higherIsBetter: boolean | null) => {
    if (higherIsBetter === null) return 'neutral';
    if (home === away) return 'neutral';
    if (higherIsBetter) {
      return home > away ? 'home' : 'away';
    }
    return home < away ? 'home' : 'away';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-primary">{homeTeam.team}</span>
        <span className="text-muted-foreground">vs</span>
        <span className="text-warning">{awayTeam.team}</span>
      </div>

      <div className="space-y-3">
        {comparisons.map((comp, i) => {
          const winner = getWinner(comp.home, comp.away, comp.higherIsBetter);
          const homePercentage = (comp.home / (comp.home + comp.away)) * 100;

          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className={cn(
                  "font-mono",
                  winner === 'home' && "text-success font-bold"
                )}>
                  {comp.format(comp.home)}
                </span>
                <span className="text-xs text-muted-foreground">{comp.label}</span>
                <span className={cn(
                  "font-mono",
                  winner === 'away' && "text-success font-bold"
                )}>
                  {comp.format(comp.away)}
                </span>
              </div>

              {/* Comparison bar */}
              <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                <div 
                  className={cn(
                    "transition-all",
                    winner === 'home' ? 'bg-primary' : 
                    winner === 'away' ? 'bg-primary/40' : 'bg-primary/60'
                  )}
                  style={{ width: `${homePercentage}%` }}
                />
                <div 
                  className={cn(
                    "transition-all",
                    winner === 'away' ? 'bg-warning' : 
                    winner === 'home' ? 'bg-warning/40' : 'bg-warning/60'
                  )}
                  style={{ width: `${100 - homePercentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
