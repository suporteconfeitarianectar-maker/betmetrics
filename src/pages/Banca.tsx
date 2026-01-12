import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/cards/StatCard';
import { BetCard } from '@/components/bets/BetCard';
import { AddBetModal } from '@/components/bets/AddBetModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Wallet, TrendingUp, Calculator, History, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBets } from '@/hooks/useBets';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Banca() {
  const { user, profile, refreshProfile } = useAuth();
  const { bets, stats, loading, updateBetResult, deleteBet } = useBets();
  const [showAddBet, setShowAddBet] = useState(false);
  const [bancaInicial, setBancaInicial] = useState(1000);
  const [stakePercent, setStakePercent] = useState([2]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setBancaInicial(profile.initial_bankroll || 1000);
    }
  }, [profile]);

  const bancaAtual = profile?.current_bankroll || 0;
  const stakeValue = (bancaAtual * stakePercent[0]) / 100;
  const bankrollChange = profile?.initial_bankroll 
    ? ((bancaAtual - profile.initial_bankroll) / profile.initial_bankroll) * 100 
    : 0;

  const handleSaveConfig = async () => {
    if (!user) return;
    
    setSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        initial_bankroll: bancaInicial,
        current_bankroll: profile?.initial_bankroll ? profile.current_bankroll : bancaInicial
      })
      .eq('user_id', user.id);

    setSaving(false);

    if (error) {
      toast.error('Erro ao salvar configurações');
      return;
    }

    toast.success('Configurações salvas com sucesso');
    await refreshProfile();
  };

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

  const pendingBets = bets.filter(b => b.result === 'pending');
  const settledBets = bets.filter(b => b.result !== 'pending');

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

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gestão de Banca
            </h1>
            <p className="text-muted-foreground text-sm">
              Controle sua banca e registre suas apostas
            </p>
          </div>
          <Button onClick={() => setShowAddBet(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Aposta
          </Button>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            label="Banca Inicial"
            value={`R$ ${(profile?.initial_bankroll || 0).toLocaleString('pt-BR')}`}
            icon={<Wallet className="w-4 h-4" />}
          />
          <StatCard
            label="Banca Atual"
            value={`R$ ${bancaAtual.toLocaleString('pt-BR')}`}
            trend={bankrollChange >= 0 ? 'up' : 'down'}
            subValue={bankrollChange !== 0 ? `${bankrollChange >= 0 ? '+' : ''}${bankrollChange.toFixed(1)}%` : undefined}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <StatCard
            label="Lucro Total"
            value={`${stats.totalProfit >= 0 ? '+' : ''}R$ ${stats.totalProfit.toFixed(0)}`}
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

        {/* Configurações */}
        <section className="card-metric space-y-6">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Configurações de Stake
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="banca-inicial">Banca Inicial (R$)</Label>
              <Input
                id="banca-inicial"
                type="number"
                value={bancaInicial}
                onChange={(e) => setBancaInicial(Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Stake padrão</Label>
                <span className="text-sm font-mono text-primary">
                  {stakePercent[0]}% = R$ {stakeValue.toFixed(2)}
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
                <span>1%</span>
                <span>10%</span>
              </div>
            </div>
          </div>

          <Button onClick={handleSaveConfig} disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar configurações'
            )}
          </Button>
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

      {/* Add Bet Modal */}
      <AddBetModal open={showAddBet} onOpenChange={setShowAddBet} />
    </Layout>
  );
}
