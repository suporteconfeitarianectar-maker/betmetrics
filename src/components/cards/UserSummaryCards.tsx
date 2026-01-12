import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { performanceData } from '@/data/mockData';

export function UserSummaryCards() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isPositive = performanceData.netResult >= 0;
  const is7DaysPositive = performanceData.last7DaysTrend === 'positive';
  const isBankrollUp = performanceData.bankrollChange >= 0;

  return (
    <div className="scroll-container md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:mx-0 md:px-0">
      {/* Resultado Líquido */}
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
          {isPositive ? '+' : ''}{formatCurrency(performanceData.netResult)}
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="text-success/80">+{formatCurrency(performanceData.totalGains)}</span>
          <span className="text-destructive/80">-{formatCurrency(Math.abs(performanceData.totalLosses))}</span>
        </div>
      </div>

      {/* Últimos 7 dias */}
      <div className="card-compact scroll-item w-[200px] md:w-auto">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-medium">7 dias</span>
        </div>
        <p className={`text-lg font-semibold ${is7DaysPositive ? 'text-success' : 'text-destructive'}`}>
          {performanceData.last7DaysResult >= 0 ? '+' : ''}{formatCurrency(performanceData.last7DaysResult)}
        </p>
        <div className="mt-1.5 flex items-center gap-1">
          {is7DaysPositive ? (
            <span className="text-[10px] text-success/80">Período positivo</span>
          ) : (
            <span className="text-[10px] text-destructive/80">Período negativo</span>
          )}
        </div>
      </div>

      {/* Status da Banca */}
      <div className="card-compact scroll-item w-[200px] md:w-auto">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-medium">Banca</span>
        </div>
        <p className="text-lg font-semibold text-card-foreground">
          {formatCurrency(performanceData.currentBankroll)}
        </p>
        <div className="mt-1.5 flex items-center gap-1">
          {isBankrollUp ? (
            <span className="text-[10px] text-success/80">+{performanceData.bankrollChange}% total</span>
          ) : (
            <span className="text-[10px] text-destructive/80">{performanceData.bankrollChange}% total</span>
          )}
        </div>
      </div>
    </div>
  );
}
