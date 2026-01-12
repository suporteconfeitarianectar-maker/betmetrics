import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
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
    <div className="scroll-container md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:mx-0 md:px-0">
      {/* Resultado Total */}
      <div className="card-compact scroll-item w-[200px] md:w-auto">
        <div className="flex items-center gap-1.5 mb-1.5">
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-success" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-destructive" />
          )}
          <span className="text-[10px] text-muted-foreground font-medium">Resultado</span>
        </div>
        <p className={`text-lg font-semibold ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? '+' : ''}{formatCurrency(stats.totalProfit)}
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="text-success/80">{stats.wonBets} greens</span>
          <span className="text-destructive/80">{stats.lostBets} reds</span>
        </div>
      </div>

      {/* Win Rate */}
      <div className="card-compact scroll-item w-[200px] md:w-auto">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Target className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-medium">Taxa de Acerto</span>
        </div>
        <p className={`text-lg font-semibold ${stats.winRate >= 50 ? 'text-success' : 'text-foreground'}`}>
          {stats.winRate.toFixed(1)}%
        </p>
        <div className="mt-1.5 flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">
            ROI: <span className={stats.roi >= 0 ? 'text-success' : 'text-destructive'}>
              {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(1)}%
            </span>
          </span>
        </div>
      </div>

      {/* Banca Atual */}
      <div className="card-compact scroll-item w-[200px] md:w-auto">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-medium">Banca</span>
        </div>
        <p className="text-lg font-semibold text-card-foreground">
          {formatCurrency(currentBankroll)}
        </p>
        <div className="mt-1.5 flex items-center gap-1">
          {bankrollChange !== 0 ? (
            <span className={`text-[10px] ${bankrollChange >= 0 ? 'text-success/80' : 'text-destructive/80'}`}>
              {bankrollChange >= 0 ? '+' : ''}{bankrollChange.toFixed(1)}% total
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground">
              {stats.pendingBets} apostas pendentes
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
