import { Link } from 'react-router-dom';
import { ArrowRight, Clock, TrendingUp, Home } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded font-medium">
          {match.league}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          {match.time}
        </div>
      </div>

      {/* Teams */}
      <div className="mb-3">
        <h3 className="font-medium text-card-foreground text-sm leading-tight">
          {match.homeTeam}
        </h3>
        <p className="text-xs text-muted-foreground">
          vs {match.awayTeam}
        </p>
      </div>

      {/* Market & Indicator */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${opportunity.className}`}>
          {opportunity.text}
        </span>
        <span className="text-[10px] text-muted-foreground truncate">
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
      className="card-compact block group"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Home className="w-3 h-3 text-success" />
        <span className="text-[10px] font-medium text-success">Mandante</span>
      </div>

      <h3 className="font-medium text-card-foreground text-sm leading-tight mb-1">
        {match.homeTeam}
      </h3>
      <p className="text-[10px] text-muted-foreground mb-2">
        vs {match.awayTeam}
      </p>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="truncate">{match.league}</span>
        <span>{match.time}</span>
      </div>
    </Link>
  );
}

// Compact card for horizontal scrolling
export function CompactMatchCard({ match }: SimpleMatchCardProps) {
  const isPositive = match.evIndicator === 'positive';
  
  return (
    <Link 
      to={`/jogo/${match.id}`}
      className="card-compact block w-[160px] scroll-item"
    >
      <div className="flex items-center gap-1 mb-2">
        {isPositive && <TrendingUp className="w-3 h-3 text-success" />}
        <span className="text-[10px] text-muted-foreground truncate">
          {match.league}
        </span>
      </div>

      <h3 className="font-medium text-card-foreground text-xs leading-tight mb-0.5 truncate">
        {match.homeTeam}
      </h3>
      <p className="text-[10px] text-muted-foreground truncate mb-2">
        vs {match.awayTeam}
      </p>

      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-medium ${isPositive ? 'text-success' : 'text-muted-foreground'}`}>
          {isPositive ? 'Favorável' : 'Neutra'}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {match.time}
        </span>
      </div>
    </Link>
  );
}
