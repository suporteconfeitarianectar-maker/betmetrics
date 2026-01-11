import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { League } from '@/types';

interface LeagueCardProps {
  league: League;
}

export function LeagueCard({ league }: LeagueCardProps) {
  return (
    <Link to={`/ligas/${league.id}`}>
      <div className="card-metric group cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{league.flag}</span>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {league.name}
              </h3>
              <p className="text-sm text-muted-foreground">{league.country}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Jogos analisados</p>
            <p className="text-lg font-semibold text-foreground font-mono">
              {league.gamesAnalyzed}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Com valor</p>
            <p className="text-lg font-semibold text-success font-mono">
              {league.gamesWithValue}
            </p>
          </div>
          <div className="flex-1 text-right">
            <span className={`text-xs px-2 py-1 rounded ${league.isActive ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
              {league.isActive ? 'Ativo' : 'Demo'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
