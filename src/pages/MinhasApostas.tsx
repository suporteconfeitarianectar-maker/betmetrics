import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { BetCard } from '@/components/bets/BetCard';
import { AddBetModal } from '@/components/bets/AddBetModal';
import { FinancialSummary } from '@/components/bets/FinancialSummary';
import { useBets } from '@/hooks/useBets';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Clock, Check, X, Target } from 'lucide-react';
import { toast } from 'sonner';

export default function MinhasApostas() {
  const { bets, stats, loading, updateBetResult, deleteBet } = useBets();
  const [showAddBet, setShowAddBet] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const handleUpdateResult = async (betId: string, result: 'win' | 'loss' | 'void') => {
    const { error } = await updateBetResult(betId, result);
    if (error) {
      toast.error('Erro ao atualizar aposta');
    } else {
      const messages = {
        win: '✅ Aposta marcada como GREEN! Lucro adicionado à banca.',
        loss: '❌ Aposta marcada como RED. Valor descontado da banca.',
        void: '↩️ Aposta anulada. Stake devolvido à banca.',
      };
      toast.success(messages[result]);
    }
  };

  const handleDelete = async (betId: string) => {
    const { error } = await deleteBet(betId);
    if (error) {
      toast.error('Erro ao excluir aposta');
    } else {
      toast.success('Aposta excluída');
    }
  };

  const filteredBets = bets.filter((bet) => {
    switch (activeTab) {
      case 'pending':
        return bet.result === 'pending';
      case 'win':
        return bet.result === 'win';
      case 'loss':
        return bet.result === 'loss';
      default:
        return true;
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Carregando apostas...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Minhas Apostas</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie todas as suas apostas
            </p>
          </div>
          <Button onClick={() => setShowAddBet(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Aposta</span>
          </Button>
        </div>

        {/* Financial Summary with Filters */}
        <FinancialSummary bets={bets} />

        {/* Quick Stats */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-warning" />
            <span className="text-muted-foreground">{stats.pendingBets} pendentes</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">{stats.wonBets} greens</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-destructive" />
            <span className="text-muted-foreground">{stats.lostBets} reds</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">
              Todas ({bets.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">
              Pendentes ({stats.pendingBets})
            </TabsTrigger>
            <TabsTrigger value="win" className="text-xs">
              Greens ({stats.wonBets})
            </TabsTrigger>
            <TabsTrigger value="loss" className="text-xs">
              Reds ({stats.lostBets})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {filteredBets.length === 0 ? (
              <div className="text-center py-12 card-metric">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  {activeTab === 'all' 
                    ? 'Nenhuma aposta registrada'
                    : activeTab === 'pending'
                    ? 'Nenhuma aposta pendente'
                    : activeTab === 'win'
                    ? 'Nenhum green ainda'
                    : 'Nenhum red (ótimo!)'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {activeTab === 'all' 
                    ? 'Adicione sua primeira aposta para começar a gerenciar sua banca'
                    : 'Continue apostando para ver resultados aqui'}
                </p>
                {activeTab === 'all' && (
                  <Button onClick={() => setShowAddBet(true)} variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Adicionar aposta
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBets.map((bet) => (
                  <BetCard
                    key={bet.id}
                    bet={bet}
                    onUpdateResult={handleUpdateResult}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Instructions */}
        {stats.pendingBets > 0 && (
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <h4 className="font-medium text-foreground mb-2">💡 Como funciona?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Marque como <span className="text-success font-medium">Green</span> quando a aposta for vencedora</li>
              <li>• Marque como <span className="text-destructive font-medium">Red</span> quando perder</li>
              <li>• O saldo da banca é atualizado automaticamente</li>
            </ul>
          </div>
        )}
      </div>

      <AddBetModal open={showAddBet} onOpenChange={setShowAddBet} />
    </Layout>
  );
}
