import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { performanceData } from '@/data/mockData';

export function UserSummaryCards() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Resultado Líquido */}
      <div className="card-metric">
        <div className="flex items-center gap-2 mb-2">
          {performanceData.netResult >= 0 ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-destructive" />
          )}
          <span className="text-xs text-muted-foreground">Resultado líquido</span>
        </div>
        <p className={`text-xl font-bold ${performanceData.netResult >= 0 ? 'text-success' : 'text-destructive'}`}>
          {performanceData.netResult >= 0 ? '+' : ''}{formatCurrency(performanceData.netResult)}
        </p>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="text-success">Ganhos: {formatCurrency(performanceData.totalGains)}</span>
          <span className="text-destructive">Perdas: {formatCurrency(performanceData.totalLosses)}</span>
        </div>
      </div>

      {/* Últimos 7 dias */}
      <div className="card-metric">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Últimos 7 dias</span>
        </div>
        <p className={`text-xl font-bold ${performanceData.last7DaysTrend === 'positive' ? 'text-success' : 'text-destructive'}`}>
          {performanceData.last7DaysResult >= 0 ? '+' : ''}{formatCurrency(performanceData.last7DaysResult)}
        </p>
        <div className="mt-2 flex items-center gap-1">
          {performanceData.last7DaysTrend === 'positive' ? (
            <>
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-xs text-success">Período positivo</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-3 h-3 text-destructive" />
              <span className="text-xs text-destructive">Período negativo</span>
            </>
          )}
        </div>
      </div>

      {/* Status da Banca */}
      <div className="card-metric">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Banca atual</span>
        </div>
        <p className="text-xl font-bold text-foreground">
          {formatCurrency(performanceData.currentBankroll)}
        </p>
        <div className="mt-2 flex items-center gap-1">
          {performanceData.bankrollChange >= 0 ? (
            <>
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-xs text-success">+{performanceData.bankrollChange}% desde o início</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-3 h-3 text-destructive" />
              <span className="text-xs text-destructive">{performanceData.bankrollChange}% desde o início</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
