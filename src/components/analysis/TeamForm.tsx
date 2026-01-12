import { TeamStats } from '@/data/teamStats';
import { cn } from '@/lib/utils';

interface TeamFormProps {
  stats: TeamStats;
  isHome?: boolean;
}

export function TeamForm({ stats, isHome }: TeamFormProps) {
  const wins = stats.last10Results.filter(r => r === 'W').length;
  const draws = stats.last10Results.filter(r => r === 'D').length;
  const losses = stats.last10Results.filter(r => r === 'L').length;
  const points = wins * 3 + draws;

  const getResultColor = (result: 'W' | 'D' | 'L') => {
    switch (result) {
      case 'W': return 'bg-success text-success-foreground';
      case 'D': return 'bg-muted text-muted-foreground';
      case 'L': return 'bg-destructive text-destructive-foreground';
    }
  };

  const getResultLabel = (result: 'W' | 'D' | 'L') => {
    switch (result) {
      case 'W': return 'V';
      case 'D': return 'E';
      case 'L': return 'D';
    }
  };

  return (
    <div className="space-y-4">
      {/* Team name and form indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            {stats.team}
            {isHome !== undefined && (
              <span className="text-xs text-muted-foreground font-normal">
                ({isHome ? 'Casa' : 'Fora'})
              </span>
            )}
          </h4>
          <p className="text-xs text-muted-foreground">
            Últimos 10 jogos: {wins}V {draws}E {losses}D
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{points}</div>
          <p className="text-xs text-muted-foreground">pontos</p>
        </div>
      </div>

      {/* Last 10 results */}
      <div className="flex gap-1">
        {stats.last10Results.map((result, i) => (
          <div
            key={i}
            className={cn(
              "w-6 h-6 rounded flex items-center justify-center text-xs font-bold",
              getResultColor(result)
            )}
            title={`Jogo ${i + 1}: ${result === 'W' ? 'Vitória' : result === 'D' ? 'Empate' : 'Derrota'}`}
          >
            {getResultLabel(result)}
          </div>
        ))}
      </div>

      {/* Form bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Momento atual</span>
          <span className={cn(
            "font-medium",
            stats.form >= 70 ? "text-success" : 
            stats.form >= 50 ? "text-warning" : "text-destructive"
          )}>
            {stats.form >= 70 ? 'Excelente' : stats.form >= 50 ? 'Regular' : 'Ruim'}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all",
              stats.form >= 70 ? "bg-success" : 
              stats.form >= 50 ? "bg-warning" : "bg-destructive"
            )}
            style={{ width: `${stats.form}%` }}
          />
        </div>
      </div>
    </div>
  );
}
