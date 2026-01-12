import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { Match } from '@/types';
import { EVIndicator } from '@/components/ui/EVIndicator';
import { PlanBadge } from '@/components/ui/PlanBadge';
import { Button } from '@/components/ui/button';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Link to={`/jogo/${match.id}`} className="block">
      <div className="card-metric animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded">
              {match.league}
            </span>
            {match.planRequired !== 'FREE' && (
              <PlanBadge plan={match.planRequired} />
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {match.time}
          </div>
        </div>

        {/* Teams */}
        <div className="mb-4">
          <h3 className="font-semibold text-foreground text-lg md:text-xl leading-tight">
            {match.homeTeam} vs {match.awayTeam}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5">
            Mercado: {match.market}
          </p>
        </div>

        {/* Stats - Mobile optimized */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Prob.</p>
            <p className="font-mono font-semibold text-foreground text-base md:text-lg">
              {(match.calculatedProbability * 100).toFixed(0)}%
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Odd</p>
            <p className="font-mono font-semibold text-foreground text-base md:text-lg">
              {match.marketOdds.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Justa</p>
            <p className="font-mono font-semibold text-primary text-base md:text-lg">
              {match.fairOdds.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <EVIndicator indicator={match.evIndicator} value={match.ev} showValue />
          <div className="flex items-center gap-1 text-primary text-sm font-medium">
            Ver análise
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>

        {match.planRequired !== 'FREE' && (
          <p className="mt-4 text-sm text-muted-foreground text-center border-t border-border pt-4">
            Disponível no plano {match.planRequired}
          </p>
        )}
      </div>
    </Link>
  );
}
