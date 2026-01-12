import { useState, useMemo } from 'react';
import { Bet } from '@/hooks/useBets';
import { TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { startOfDay, startOfWeek, startOfMonth, isAfter } from 'date-fns';

interface FinancialSummaryProps {
  bets: Bet[];
}

type Period = 'day' | 'week' | 'month' | 'all';

export function FinancialSummary({ bets }: FinancialSummaryProps) {
  const [period, setPeriod] = useState<Period>('all');

  const filteredStats = useMemo(() => {
    const now = new Date();
    let startDate: Date | null = null;

    switch (period) {
      case 'day':
        startDate = startOfDay(now);
        break;
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      default:
        startDate = null;
    }

    const filtered = startDate
      ? bets.filter((bet) => isAfter(new Date(bet.created_at), startDate!))
      : bets;

    const settledBets = filtered.filter(
      (b) => b.result === 'win' || b.result === 'loss'
    );

    const totalWins = filtered
      .filter((b) => b.result === 'win')
      .reduce((sum, b) => sum + b.profit_loss, 0);

    const totalLosses = Math.abs(
      filtered
        .filter((b) => b.result === 'loss')
        .reduce((sum, b) => sum + b.profit_loss, 0)
    );

    const netResult = totalWins - totalLosses;
    const wonCount = filtered.filter((b) => b.result === 'win').length;
    const lostCount = filtered.filter((b) => b.result === 'loss').length;
    const winRate = settledBets.length > 0 
      ? (wonCount / settledBets.length) * 100 
      : 0;

    return {
      totalWins,
      totalLosses,
      netResult,
      wonCount,
      lostCount,
      totalBets: filtered.length,
      settledBets: settledBets.length,
      winRate,
    };
  }, [bets, period]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const periodLabels: Record<Period, string> = {
    day: 'Hoje',
    week: 'Esta Semana',
    month: 'Este Mês',
    all: 'Todo Período',
  };

  return (
    <div className="card-metric p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Resumo Financeiro</h3>
        </div>
        <div className="flex gap-1">
          {(['day', 'week', 'month', 'all'] as Period[]).map((p) => (
            <Button
              key={p}
              variant={period === p ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPeriod(p)}
              className="text-xs h-7 px-2"
            >
              {periodLabels[p]}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Total Ganhos */}
        <div className="bg-success/10 border border-success/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">Ganhos</span>
          </div>
          <p className="text-lg font-bold text-success">
            {formatCurrency(filteredStats.totalWins)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3 text-success" />
            <span className="text-xs text-muted-foreground">
              {filteredStats.wonCount} apostas
            </span>
          </div>
        </div>

        {/* Total Perdas */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <span className="text-xs text-muted-foreground">Perdas</span>
          </div>
          <p className="text-lg font-bold text-destructive">
            {formatCurrency(filteredStats.totalLosses)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowDownRight className="w-3 h-3 text-destructive" />
            <span className="text-xs text-muted-foreground">
              {filteredStats.lostCount} apostas
            </span>
          </div>
        </div>

        {/* Resultado Líquido */}
        <div className={cn(
          "rounded-lg p-3 border col-span-2 md:col-span-1",
          filteredStats.netResult >= 0 
            ? "bg-success/5 border-success/20" 
            : "bg-destructive/5 border-destructive/20"
        )}>
          <div className="flex items-center gap-2 mb-1">
            {filteredStats.netResult >= 0 ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <span className="text-xs text-muted-foreground">Resultado Líquido</span>
          </div>
          <p className={cn(
            "text-xl font-bold",
            filteredStats.netResult >= 0 ? "text-success" : "text-destructive"
          )}>
            {filteredStats.netResult >= 0 ? '+' : ''}{formatCurrency(filteredStats.netResult)}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{filteredStats.settledBets} finalizadas</span>
            <span>•</span>
            <span>{filteredStats.winRate.toFixed(0)}% acerto</span>
          </div>
        </div>
      </div>
    </div>
  );
}
