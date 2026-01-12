import { Check, X, RotateCcw, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Bet } from '@/hooks/useBets';
import { cn } from '@/lib/utils';

interface BetCardProps {
  bet: Bet;
  onUpdateResult: (betId: string, result: 'win' | 'loss' | 'void') => void;
  onDelete: (betId: string) => void;
}

export function BetCard({ bet, onUpdateResult, onDelete }: BetCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getResultBadge = () => {
    switch (bet.result) {
      case 'win':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success">
            Ganhou
          </span>
        );
      case 'loss':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/20 text-destructive">
            Perdeu
          </span>
        );
      case 'void':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            Anulada
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning/20 text-warning flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pendente
          </span>
        );
    }
  };

  return (
    <div className={cn(
      "card-metric p-4 space-y-3",
      bet.result === 'win' && "border-l-4 border-l-success",
      bet.result === 'loss' && "border-l-4 border-l-destructive",
      bet.result === 'pending' && "border-l-4 border-l-warning"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">
            {bet.match_name}
          </h4>
          {bet.league && (
            <p className="text-xs text-muted-foreground truncate">
              {bet.league}
            </p>
          )}
        </div>
        {getResultBadge()}
      </div>

      {/* Bet details */}
      <div className="flex items-center gap-3 text-sm">
        <span className="px-2 py-1 bg-muted rounded text-foreground font-medium">
          {bet.bet_type}
        </span>
        <span className="text-muted-foreground">
          @ <span className="text-foreground font-medium">{bet.odds.toFixed(2)}</span>
        </span>
      </div>

      {/* Values */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Stake</p>
          <p className="font-medium text-foreground">{formatCurrency(bet.stake)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Retorno</p>
          <p className="font-medium text-foreground">{formatCurrency(bet.potential_return)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Lucro/Perda</p>
          <p className={cn(
            "font-medium",
            bet.profit_loss > 0 && "text-success",
            bet.profit_loss < 0 && "text-destructive",
            bet.profit_loss === 0 && "text-muted-foreground"
          )}>
            {bet.profit_loss >= 0 ? '+' : ''}{formatCurrency(bet.profit_loss)}
          </p>
        </div>
      </div>

      {/* Date */}
      <p className="text-xs text-muted-foreground">
        Criada em {formatDate(bet.created_at)}
        {bet.settled_at && ` • Encerrada em ${formatDate(bet.settled_at)}`}
      </p>

      {/* Actions */}
      {bet.result === 'pending' && (
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-success border-success/30 hover:bg-success/10"
            onClick={() => onUpdateResult(bet.id, 'win')}
          >
            <Check className="w-4 h-4 mr-1" />
            Green
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => onUpdateResult(bet.id, 'loss')}
          >
            <X className="w-4 h-4 mr-1" />
            Red
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => onUpdateResult(bet.id, 'void')}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => onDelete(bet.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
