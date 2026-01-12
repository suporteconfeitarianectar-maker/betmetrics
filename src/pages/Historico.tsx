import { useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/cards/StatCard';
import { BetCard } from '@/components/bets/BetCard';
import { TrendingUp, Target, BarChart3, Percent, AlertCircle, Loader2 } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useBets } from '@/hooks/useBets';
import { toast } from 'sonner';

export default function Historico() {
  const { user, profile } = useAuth();
  const { bets, stats, loading, updateBetResult, deleteBet } = useBets();

  // Generate bankroll history from bets
  const bankrollHistory = useMemo(() => {
    if (!profile || bets.length === 0) {
      return [{ date: 'Início', value: profile?.initial_bankroll || 0 }];
    }

    const settledBets = bets
      .filter(b => b.result !== 'pending' && b.settled_at)
      .sort((a, b) => new Date(a.settled_at!).getTime() - new Date(b.settled_at!).getTime());

    if (settledBets.length === 0) {
      return [{ date: 'Início', value: profile.initial_bankroll || 0 }];
    }

    let runningTotal = profile.initial_bankroll || 0;
    const history = [{ date: 'Início', value: runningTotal }];

    settledBets.forEach((bet, index) => {
      runningTotal += bet.profit_loss;
      const date = new Date(bet.settled_at!).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
      history.push({ 
        date: history.length <= 7 ? date : `${index + 1}`, 
        value: runningTotal 
      });
    });

    return history;
  }, [bets, profile]);

  const handleUpdateResult = async (betId: string, result: 'win' | 'loss' | 'void') => {
    const { error } = await updateBetResult(betId, result);
    if (error) {
      toast.error('Erro ao atualizar aposta');
    } else {
      toast.success(result === 'win' ? 'Green! 🎉' : result === 'loss' ? 'Red 😢' : 'Aposta anulada');
    }
  };

  const handleDeleteBet = async (betId: string) => {
    const { error } = await deleteBet(betId);
    if (error) {
      toast.error('Erro ao excluir aposta');
    } else {
      toast.success('Aposta excluída');
    }
  };

  const settledBets = bets.filter(b => b.result !== 'pending');

  if (!user) {
    return (
      <Layout>
        <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Faça login para acessar</h2>
          <p className="text-muted-foreground text-center">
            Você precisa estar logado para ver seu histórico.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <section>
          <h1 className="text-2xl font-bold text-foreground">
            Histórico e Performance
          </h1>
          <p className="text-muted-foreground text-sm">
            Acompanhe o desempenho das suas apostas ao longo do tempo
          </p>
        </section>

        {/* Stats overview */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            label="ROI Total"
            value={`${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`}
            subValue={`R$ ${stats.totalProfit.toFixed(0)} lucro`}
            trend={stats.roi >= 0 ? 'up' : 'down'}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <StatCard
            label="Total de Apostas"
            value={stats.totalBets.toString()}
            subValue={`${stats.pendingBets} pendentes`}
            icon={<BarChart3 className="w-4 h-4" />}
          />
          <StatCard
            label="Total Apostado"
            value={`R$ ${stats.totalStaked.toFixed(0)}`}
            subValue="Valor total"
            icon={<Target className="w-4 h-4" />}
          />
          <StatCard
            label="Taxa de Acerto"
            value={`${stats.winRate.toFixed(1)}%`}
            subValue={`${stats.wonBets}W / ${stats.lostBets}L`}
            icon={<Percent className="w-4 h-4" />}
          />
        </section>

        {/* Chart */}
        <section className="card-metric">
          <h3 className="font-semibold text-foreground mb-4">
            Evolução da Banca
          </h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : bankrollHistory.length > 1 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bankrollHistory}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    domain={['dataMin - 50', 'dataMax + 50']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Banca']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Adicione apostas para ver a evolução da banca</p>
            </div>
          )}
        </section>

        {/* Settled Bets */}
        {settledBets.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-semibold text-foreground">
              Apostas Finalizadas ({settledBets.length})
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {settledBets.map((bet) => (
                <BetCard
                  key={bet.id}
                  bet={bet}
                  onUpdateResult={handleUpdateResult}
                  onDelete={handleDeleteBet}
                />
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
          <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium">Aviso importante</p>
            <p className="text-sm text-muted-foreground mt-1">
              Resultados passados não garantem resultados futuros. 
              Aposte com responsabilidade e dentro das suas possibilidades financeiras.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
