import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useDeposits } from '@/hooks/useDeposits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Wallet, Plus, Minus, History, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BankrollManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BankrollManagementModal({ open, onOpenChange }: BankrollManagementModalProps) {
  const { profile, refreshProfile } = useAuth();
  const { deposits, addDeposit, refreshDeposits } = useDeposits();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const currentBankroll = profile?.current_bankroll || 0;
  const initialBankroll = profile?.initial_bankroll || 0;

  const handleSetInitialBankroll = async () => {
    const amount = parseFloat(initialAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      toast.error('Digite um valor válido');
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('deposits')
      .insert({
        user_id: profile?.user_id,
        amount,
        description: 'Banca inicial',
        type: 'initial'
      });

    if (error) {
      toast.error('Erro ao definir banca inicial');
      console.error(error);
    } else {
      toast.success('Banca inicial definida!');
      setInitialAmount('');
      await refreshProfile();
      await refreshDeposits();
    }
    
    setIsSubmitting(false);
  };

  const handleAddDeposit = async () => {
    const amount = parseFloat(depositAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      toast.error('Digite um valor válido');
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await addDeposit(amount, 'Aporte');
    
    if (error) {
      toast.error('Erro ao adicionar aporte');
    } else {
      toast.success('Aporte adicionado!');
      setDepositAmount('');
      await refreshProfile();
    }
    
    setIsSubmitting(false);
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      toast.error('Digite um valor válido');
      return;
    }

    if (amount > currentBankroll) {
      toast.error('Valor maior que o saldo disponível');
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('deposits')
      .insert({
        user_id: profile?.user_id,
        amount,
        description: 'Retirada',
        type: 'withdrawal'
      });

    if (error) {
      toast.error('Erro ao realizar retirada');
      console.error(error);
    } else {
      toast.success('Retirada realizada!');
      setWithdrawAmount('');
      await refreshProfile();
      await refreshDeposits();
    }
    
    setIsSubmitting(false);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'Aporte';
      case 'withdrawal': return 'Retirada';
      case 'initial': return 'Banca inicial';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-success';
      case 'withdrawal': return 'text-destructive';
      case 'initial': return 'text-primary';
      default: return 'text-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Gestão da Banca
          </DialogTitle>
        </DialogHeader>

        {/* Saldo Atual - Destaque */}
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Saldo atual</p>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(currentBankroll)}
          </p>
          {initialBankroll > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Banca inicial: {formatCurrency(initialBankroll)}
            </p>
          )}
        </div>

        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deposit" className="gap-1">
              <Plus className="w-3 h-3" />
              Aporte
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="gap-1">
              <Minus className="w-3 h-3" />
              Retirar
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1">
              <History className="w-3 h-3" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposit" className="space-y-4 mt-4">
            {initialBankroll === 0 ? (
              <div className="space-y-3">
                <Label htmlFor="initial">Defina sua banca inicial</Label>
                <Input
                  id="initial"
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 500,00"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                />
                <Button 
                  onClick={handleSetInitialBankroll} 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Definir banca inicial
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="deposit">Valor do aporte</Label>
                <Input
                  id="deposit"
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 100,00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <Button 
                  onClick={handleAddDeposit} 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar aporte
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label htmlFor="withdraw">Valor da retirada</Label>
              <Input
                id="withdraw"
                type="text"
                inputMode="decimal"
                placeholder="Ex: 50,00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Disponível: {formatCurrency(currentBankroll)}
              </p>
              <Button 
                onClick={handleWithdraw} 
                disabled={isSubmitting || currentBankroll <= 0}
                variant="destructive"
                className="w-full"
              >
                <Minus className="w-4 h-4 mr-2" />
                Realizar retirada
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {deposits.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma movimentação registrada
                </p>
              ) : (
                deposits.map((deposit) => (
                  <div 
                    key={deposit.id} 
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                  >
                    <div>
                      <p className={`text-sm font-medium ${getTypeColor((deposit as any).type || 'deposit')}`}>
                        {getTypeLabel((deposit as any).type || 'deposit')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(deposit.created_at), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <p className={`font-semibold ${getTypeColor((deposit as any).type || 'deposit')}`}>
                      {(deposit as any).type === 'withdrawal' ? '-' : '+'}
                      {formatCurrency(deposit.amount)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
