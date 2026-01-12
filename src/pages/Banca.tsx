import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/cards/StatCard';
import { BetCard } from '@/components/bets/BetCard';
import { AddBetModal } from '@/components/bets/AddBetModal';
import { AddDepositModal } from '@/components/bets/AddDepositModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Wallet, 
  TrendingUp, 
  Calculator, 
  History, 
  Plus, 
  Loader2, 
  PlusCircle,
  Banknote
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBets } from '@/hooks/useBets';
import { useDeposits } from '@/hooks/useDeposits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Banca() {
  const { user, profile, refreshProfile } = useAuth();
  const { bets, stats, loading, updateBetResult, deleteBet } = useBets();
  const { deposits, totalDeposits, addDeposit, loading: depositsLoading } = useDeposits();
  
  const [showAddBet, setShowAddBet] = useState(false);
  const [showAddDeposit, setShowAddDeposit] = useState(false);
  const [bancaInicial, setBancaInicial] = useState(0);
  const [stakePercent, setStakePercent] = useState([2]);
  const [saving, setSaving] = useState(false);
  const [hasSetInitialBankroll, setHasSetInitialBankroll] = useState(false);

  useEffect(() => {
    if (profile) {
      setBancaInicial(profile.initial_bankroll || 0);
      setHasSetInitialBankroll((profile.initial_bankroll || 0) > 0);
    }
  }, [profile]);

  const bancaAtual = profile?.current_bankroll || 0;
  const stakeValue = (bancaAtual * stakePercent[0]) / 100;
  const bankrollChange = profile?.initial_bankroll 
    ? ((bancaAtual - profile.initial_bankroll) / profile.initial_bankroll) * 100 
    : 0;

  const handleSetInitialBankroll = async () => {
    if (!user) return;
    if (bancaInicial <= 0) {
      toast.error('Valor deve ser maior que zero');
      return;
    }
    
    setSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        initial_bankroll: bancaInicial,
        current_bankroll: bancaInicial
      })
      .eq('user_id', user.id);

    setSaving(false);

    if (error) {
      toast.error('Erro ao definir banca inicial');
      return;
    }

    toast.success('Banca inicial definida com sucesso!');
    setHasSetInitialBankroll(true);
    await refreshProfile();
  };

  const handleAddDeposit = async (amount: number, description: string) => {
    const { error } = await addDeposit(amount, description);
    
    if (error) {
      toast.error('Erro ao adicionar aporte');
      return { error };
    }

    toast.success(`Aporte de R$ ${amount.toFixed(2)} adicionado!`);
    await refreshProfile();
    return { error: null };
  };

  const handleUpdateResult = async (betId: string, result: 'win' | 'loss' | 'void') => {
    const { error } = await updateBetResult(betId, result);
    if (error) {
      toast.error('Erro ao atualizar aposta');
    } else {
      toast.success(result === 'win' ? 'Green! 🎉' : result === 'loss' ? 'Red 😢' : 'Aposta anulada');
      await refreshProfile();
    }
  };

  const handleDeleteBet = async (betId: string) => {
    const { error } = await deleteBet(betId);
    if (error) {
      toast.error('Erro ao excluir aposta');
    } else {
      toast.success('Aposta excluída');
      await refreshProfile();
    }
  };

  const pendingBets = bets.filter(b => b.result === 'pending');
  const settledBets = bets.filter(b => b.result !== 'pending');

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (!user) {
    return (
      <Layout>
        <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <Wallet className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Faça login para acessar</h2>
          <p className="text-muted-foreground text-center">
            Você precisa estar logado para gerenciar sua banca.
          </p>
        </div>
      </Layout>
    );
  }

  // Initial bankroll setup screen
  if (!hasSetInitialBankroll) {
    return (
      <Layout>
        <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Definir Banca Inicial</h2>
              <p className="text-muted-foreground">
                Informe o valor que você tem disponível para apostas na sua casa de apostas.
              </p>
            </div>

            <div className="card-metric space-y-4">
              <div className="space-y-2">
                <Label htmlFor="banca-inicial" className="text-base">Qual é sua banca atual? (R$)</Label>
                <Input
                  id="banca-inicial"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 500.00"
                  value={bancaInicial || ''}
                  onChange={(e) => setBancaInicial(Number(e.target.value))}
                  className="text-lg h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Este é o valor que você tem depositado na casa de apostas.
                </p>
              </div>

              <Button 
                onClick={handleSetInitialBankroll} 
                disabled={saving || bancaInicial <= 0} 
                className="w-full h-12 text-base"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Definir Banca Inicial
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gestão de Banca
            </h1>
            <p className="text-muted-foreground text-sm">
              Controle sua banca e registre suas apostas
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowAddDeposit(true)} 
              className="gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar Dinheiro</span>
              <span className="sm:hidden">Aporte</span>
            </Button>
            <Button onClick={() => setShowAddBet(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Aposta</span>
              <span className="sm:hidden">Aposta</span>
            </Button>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            label="Banca Inicial"
            value={formatCurrency(profile?.initial_bankroll || 0)}
            icon={<Wallet className="w-4 h-4" />}
          />
          <StatCard
            label="Banca Atual"
            value={formatCurrency(bancaAtual)}
            trend={bankrollChange >= 0 ? 'up' : 'down'}
            subValue={bankrollChange !== 0 ? `${bankrollChange >= 0 ? '+' : ''}${bankrollChange.toFixed(1)}%` : undefined}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <StatCard
            label="Lucro Total"
            value={`${stats.totalProfit >= 0 ? '+' : ''}${formatCurrency(stats.totalProfit)}`}
            trend={stats.totalProfit >= 0 ? 'up' : 'down'}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <StatCard
            label="Win Rate"
            value={`${stats.winRate.toFixed(1)}%`}
            subValue={`${stats.wonBets}W / ${stats.lostBets}L`}
            icon={<TrendingUp className="w-4 h-4" />}
          />
        </section>

        {/* Deposit History */}
        {deposits.length > 0 && (
          <section className="card-metric space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              Histórico de Aportes ({deposits.length})
            </h3>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {deposits.slice(0, 5).map((deposit) => (
                <div 
                  key={deposit.id} 
                  className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                      <PlusCircle className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{deposit.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(deposit.created_at), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-success">
                    +{formatCurrency(deposit.amount)}
                  </span>
                </div>
              ))}
              
              {deposits.length > 5 && (
                <p className="text-center text-xs text-muted-foreground pt-2">
                  +{deposits.length - 5} aportes anteriores
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total de aportes</span>
                <span className="font-semibold text-foreground">{formatCurrency(totalDeposits)}</span>
              </div>
            </div>
          </section>
        )}

        {/* Stake Configuration */}
        <section className="card-metric space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculadora de Stake
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Stake recomendado</Label>
                <span className="text-sm font-mono text-primary">
                  {stakePercent[0]}% = {formatCurrency(stakeValue)}
                </span>
              </div>
              <Slider
                value={stakePercent}
                onValueChange={setStakePercent}
                max={10}
                min={1}
                step={0.5}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1% (conservador)</span>
                <span>10% (agressivo)</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            💡 Recomendamos usar entre 1-3% da banca por aposta para uma gestão segura.
          </p>
        </section>

        {/* Apostas Pendentes */}
        <section className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <History className="w-5 h-5" />
            Apostas Pendentes ({pendingBets.length})
          </h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : pendingBets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground card-metric">
              <p className="text-sm">Nenhuma aposta pendente.</p>
              <p className="text-xs mt-2">
                Clique em "Nova Aposta" para adicionar.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {pendingBets.map((bet) => (
                <BetCard
                  key={bet.id}
                  bet={bet}
                  onUpdateResult={handleUpdateResult}
                  onDelete={handleDeleteBet}
                />
              ))}
            </div>
          )}
        </section>

        {/* Histórico de Apostas */}
        {settledBets.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <History className="w-5 h-5" />
              Histórico ({settledBets.length})
            </h3>
            
            <div className="grid gap-3 md:grid-cols-2">
              {settledBets.slice(0, 6).map((bet) => (
                <BetCard
                  key={bet.id}
                  bet={bet}
                  onUpdateResult={handleUpdateResult}
                  onDelete={handleDeleteBet}
                />
              ))}
            </div>

            {settledBets.length > 6 && (
              <p className="text-center text-sm text-muted-foreground">
                +{settledBets.length - 6} apostas no histórico
              </p>
            )}
          </section>
        )}
      </div>

      {/* Modals */}
      <AddBetModal open={showAddBet} onOpenChange={setShowAddBet} />
      <AddDepositModal 
        open={showAddDeposit} 
        onOpenChange={setShowAddDeposit} 
        onAddDeposit={handleAddDeposit}
      />
    </Layout>
  );
}
