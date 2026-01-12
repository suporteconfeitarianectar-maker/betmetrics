import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle } from 'lucide-react';

interface AddDepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDeposit: (amount: number, description: string) => Promise<{ error: Error | null }>;
}

export function AddDepositModal({ open, onOpenChange, onAddDeposit }: AddDepositModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('Aporte');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Valor deve ser maior que zero');
      return;
    }

    setLoading(true);

    const { error: submitError } = await onAddDeposit(numAmount, description || 'Aporte');

    setLoading(false);

    if (submitError) {
      setError('Erro ao adicionar aporte. Tente novamente.');
      return;
    }

    // Reset and close
    setAmount('');
    setDescription('Aporte');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary" />
            Adicionar Dinheiro à Banca
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor do aporte (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="100.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              type="text"
              placeholder="Ex: Depósito Bet365"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Confirmar Aporte'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
