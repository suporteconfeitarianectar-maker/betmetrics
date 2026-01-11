import { Link } from 'react-router-dom';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { Match } from '@/types';
import { Button } from '@/components/ui/button';

interface SimpleMatchCardProps {
  match: Match;
}

export function SimpleMatchCard({ match }: SimpleMatchCardProps) {
  const getOpportunityLabel = (indicator: string) => {
    switch (indicator) {
      case 'positive':
        return { text: 'Boa oportunidade', className: 'text-success bg-success/10' };
      case 'neutral':
        return { text: 'Neutra', className: 'text-muted-foreground bg-muted' };
      default:
        return { text: 'Desfavorável', className: 'text-destructive bg-destructive/10' };
    }
  };

  const opportunity = getOpportunityLabel(match.evIndicator);

  return (
    <Link 
      to={`/jogo/${match.id}`}
      className="card-metric animate-slide-up block hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
          {match.league}
        </span>
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
          {match.market}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${opportunity.className}`}>
          {opportunity.text}
        </span>
        <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary p-0">
          Ver análise
          <ArrowRight className="w-4 h-4" />
        </Button>
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
      className="card-metric animate-slide-up block hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-success" />
        <span className="text-xs font-medium text-success">Vantagem do mandante</span>
      </div>

      <div className="mb-3">
        <h3 className="font-semibold text-foreground">
          {match.homeTeam}
        </h3>
        <p className="text-sm text-muted-foreground">
          vs {match.awayTeam}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{match.league}</span>
        <span className="text-muted-foreground">{match.time}</span>
      </div>
    </Link>
  );
}
