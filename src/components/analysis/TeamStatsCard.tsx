import { TeamStats } from '@/data/teamStats';
import { Target, Shield, Flame, XCircle } from 'lucide-react';

interface TeamStatsCardProps {
  stats: TeamStats;
  isHome?: boolean;
}

export function TeamStatsCard({ stats, isHome }: TeamStatsCardProps) {
  const statsItems = [
    {
      icon: <Target className="w-4 h-4 text-success" />,
      label: 'Gols marcados',
      value: stats.goalsScored,
      subValue: `${stats.avgGoalsScored.toFixed(1)} por jogo`,
    },
    {
      icon: <Shield className="w-4 h-4 text-primary" />,
      label: 'Gols sofridos',
      value: stats.goalsConceded,
      subValue: `${stats.avgGoalsConceded.toFixed(1)} por jogo`,
    },
    {
      icon: <Flame className="w-4 h-4 text-warning" />,
      label: 'Clean sheets',
      value: stats.cleanSheets,
      subValue: 'Jogos sem sofrer gol',
    },
    {
      icon: <XCircle className="w-4 h-4 text-destructive" />,
      label: 'Não marcou',
      value: stats.failedToScore,
      subValue: 'Jogos sem marcar',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-foreground">
          {stats.team}
          {isHome !== undefined && (
            <span className="text-xs text-muted-foreground font-normal ml-2">
              ({isHome ? 'Casa' : 'Fora'})
            </span>
          )}
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statsItems.map((item, i) => (
          <div key={i} className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              {item.icon}
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{item.value}</p>
            <p className="text-[10px] text-muted-foreground">{item.subValue}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
