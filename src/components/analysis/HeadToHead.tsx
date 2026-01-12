import { MatchAnalysis } from '@/data/teamStats';
import { cn } from '@/lib/utils';

interface HeadToHeadProps {
  analysis: MatchAnalysis;
  homeTeam: string;
  awayTeam: string;
}

export function HeadToHead({ analysis, homeTeam, awayTeam }: HeadToHeadProps) {
  const { headToHead } = analysis;
  const totalGames = headToHead.homeWins + headToHead.draws + headToHead.awayWins;

  const stats = [
    {
      label: homeTeam,
      value: headToHead.homeWins,
      percentage: (headToHead.homeWins / totalGames) * 100,
      color: 'bg-primary',
    },
    {
      label: 'Empates',
      value: headToHead.draws,
      percentage: (headToHead.draws / totalGames) * 100,
      color: 'bg-muted-foreground',
    },
    {
      label: awayTeam,
      value: headToHead.awayWins,
      percentage: (headToHead.awayWins / totalGames) * 100,
      color: 'bg-warning',
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-foreground">
        Confrontos Diretos
        <span className="text-xs text-muted-foreground font-normal ml-2">
          (últimos {totalGames} jogos)
        </span>
      </h4>

      {/* Horizontal bar showing distribution */}
      <div className="flex h-8 rounded-lg overflow-hidden">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center justify-center text-xs font-bold text-white transition-all",
              stat.color
            )}
            style={{ width: `${stat.percentage}%` }}
          >
            {stat.value > 0 && stat.value}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-between text-sm">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded", stat.color)} />
            <span className="text-muted-foreground">
              {stat.label}: <span className="text-foreground font-medium">{stat.value}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Additional stats */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-2xl font-bold text-foreground">{headToHead.avgGoals.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">Média de gols por jogo</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-2xl font-bold text-foreground">{headToHead.bttsPercentage}%</p>
          <p className="text-xs text-muted-foreground">Jogos com ambas marcando</p>
        </div>
      </div>
    </div>
  );
}
