import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBets } from '@/hooks/useBets';

export function DynamicSummaryCards() {
  const { profile } = useAuth();
  const { stats } = useBets();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isPositive = stats.totalProfit >= 0;
  const currentBankroll = profile?.current_bankroll || 0;
  const initialBankroll = profile?.initial_bankroll || 0;
  const bankrollChange = initialBankroll > 0 
    ? ((currentBankroll - initialBankroll) / initialBankroll) * 100 
    : 0;

  return (
    <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
      {/* Banca Atual - Destaque principal no mobile */}
      <div className="card-mobile md:card-metric order-first">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground font-medium">Sua Banca</span>
            </div>
            <p className="text-3xl font-bold text-card-foreground">
              {formatCurrency(currentBankroll)}
            </p>
          </div>
          <div className="text-right">
            {bankrollChange !== 0 ? (
              <div className={`text-sm font-medium ${bankrollChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {bankrollChange >= 0 ? '+' : ''}{bankrollChange.toFixed(1)}%
                <p className="text-xs text-muted-foreground font-normal">total</p>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                {stats.pendingBets} pendentes
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resultado e Win Rate - Cards menores side by side no mobile */}
      <div className="grid grid-cols-2 gap-3 md:contents">
        {/* Resultado Total */}
        <div className="card-mobile md:card-metric">
          <div className="flex items-center gap-2 mb-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <span className="text-xs text-muted-foreground font-medium">Lucro</span>
          </div>
          <p className={`text-xl font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{formatCurrency(stats.totalProfit)}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-success">{stats.wonBets}W</span>
            <span className="text-destructive">{stats.lostBets}L</span>
          </div>
        </div>

        {/* Win Rate */}
        <div className="card-mobile md:card-metric">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">%</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">Taxa</span>
          </div>
          <p className={`text-xl font-bold ${stats.winRate >= 50 ? 'text-success' : 'text-foreground'}`}>
            {stats.winRate.toFixed(0)}%
          </p>
          <div className="mt-2 text-xs text-muted-foreground">
            ROI: <span className={stats.roi >= 0 ? 'text-success' : 'text-destructive'}>
              {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
