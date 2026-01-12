import { Link } from 'react-router-dom';
import { Clock, TrendingUp, Home, ChevronRight } from 'lucide-react';
import { Match } from '@/types';

interface SimpleMatchCardProps {
  match: Match;
}

export function SimpleMatchCard({ match }: SimpleMatchCardProps) {
  const getOpportunityLabel = (indicator: string) => {
    switch (indicator) {
      case 'positive':
        return { text: 'Favorável', className: 'text-success bg-success/10' };
      case 'neutral':
        return { text: 'Neutra', className: 'text-muted-foreground bg-muted/50' };
      default:
        return { text: 'Desfavorável', className: 'text-destructive/80 bg-destructive/10' };
    }
  };

  const opportunity = getOpportunityLabel(match.evIndicator);

  return (
    <Link 
      to={`/jogo/${match.id}`}
      className="card-metric block group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded font-medium">
          {match.league}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {match.time}
        </div>
      </div>

      {/* Teams */}
      <div className="mb-4">
        <h3 className="font-semibold text-card-foreground text-base leading-tight">
          {match.homeTeam}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          vs {match.awayTeam}
        </p>
      </div>

      {/* Market & Indicator */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${opportunity.className}`}>
          {opportunity.text}
        </span>
        <span className="text-xs text-muted-foreground truncate">
          {match.market}
        </span>
      </div>
    </Link>
  );
}

interface HomeAdvantageCardProps {
  match: Match;
}

export function HomeAdvantageCard({ match }: HomeAdvantageCardProps) {
  return (
    <Link 
      to={`/jogo/${match.id}`}
      className="card-compact block group h-full"
    >
      <div className="flex items-center gap-2 mb-3">
        <Home className="w-4 h-4 text-success" />
        <span className="text-xs font-medium text-success">Mandante</span>
      </div>

      <h3 className="font-semibold text-card-foreground text-base leading-tight mb-1">
        {match.homeTeam}
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        vs {match.awayTeam}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="truncate">{match.league}</span>
        <span>{match.time}</span>
      </div>
    </Link>
  );
}

// Full-width card for mobile carousel - shows 1 card at a time
export function MobileMatchCard({ match }: SimpleMatchCardProps) {
  const isPositive = match.evIndicator === 'positive';
  
  return (
    <Link 
      to={`/jogo/${match.id}`}
      className="card-mobile block scroll-item"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isPositive && <TrendingUp className="w-4 h-4 text-success" />}
          <span className="text-sm text-muted-foreground">
            {match.league}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {match.time}
        </div>
      </div>

      {/* Teams */}
      <div className="mb-4">
        <h3 className="font-semibold text-card-foreground text-lg leading-tight">
          {match.homeTeam}
        </h3>
        <p className="text-base text-muted-foreground mt-1">
          vs {match.awayTeam}
        </p>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${
            isPositive 
              ? 'text-success bg-success/10' 
              : 'text-muted-foreground bg-muted/50'
          }`}>
            {isPositive ? 'Favorável' : 'Neutra'}
          </span>
          <span className="text-sm text-muted-foreground">
            {match.market}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </Link>
  );
}

// Compact card for horizontal scrolling (legacy support)
export function CompactMatchCard({ match }: SimpleMatchCardProps) {
  return <MobileMatchCard match={match} />;
}
