import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Match } from '@/types';
import { EVIndicator } from '@/components/ui/EVIndicator';
import { PlanBadge } from '@/components/ui/PlanBadge';
import { Button } from '@/components/ui/button';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="card-metric animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {match.league}
          </span>
          {match.planRequired !== 'FREE' && (
            <PlanBadge plan={match.planRequired} />
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {match.time}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-foreground text-lg">
          {match.homeTeam} vs {match.awayTeam}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Mercado: {match.market}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Prob. calculada</p>
          <p className="font-mono font-semibold text-foreground">
            {(match.calculatedProbability * 100).toFixed(0)}%
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Odd mercado</p>
          <p className="font-mono font-semibold text-foreground">
            {match.marketOdds.toFixed(2)}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Odd justa</p>
          <p className="font-mono font-semibold text-foreground">
            {match.fairOdds.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <EVIndicator indicator={match.evIndicator} value={match.ev} showValue />
        <Link to={`/jogo/${match.id}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
            Ver análise
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {match.planRequired !== 'FREE' && (
        <p className="mt-3 text-xs text-muted-foreground text-center border-t border-border pt-3">
          Funcionalidade disponível no plano {match.planRequired} (modo demonstração ativo)
        </p>
      )}
    </div>
  );
}
