import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBets } from '@/hooks/useBets';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface AddBetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: {
    match_name?: string;
    league?: string;
    bet_type?: string;
    odds?: number;
  };
}

export function AddBetModal({ open, onOpenChange, prefillData }: AddBetModalProps) {
  const { addBet } = useBets();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    match_name: '',
    league: '',
    bet_type: '',
    odds: '',
    stake: '',
  });

  // Update form when prefillData changes or modal opens
  useEffect(() => {
    if (open && prefillData) {
      setFormData({
        match_name: prefillData.match_name || '',
        league: prefillData.league || '',
        bet_type: prefillData.bet_type || '',
        odds: prefillData.odds?.toString() || '',
        stake: '',
      });
    } else if (!open) {
      setFormData({
        match_name: '',
        league: '',
        bet_type: '',
        odds: '',
        stake: '',
      });
    }
  }, [open, prefillData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const odds = parseFloat(formData.odds);
    const stake = parseFloat(formData.stake);
    
    if (!formData.match_name || !formData.bet_type || isNaN(odds) || isNaN(stake)) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (odds < 1.01) {
      toast.error('Odds deve ser maior que 1.00');
      return;
    }

    if (stake <= 0) {
      toast.error('Stake deve ser maior que 0');
      return;
    }

    if (profile && stake > (profile.current_bankroll || 0)) {
      toast.error('Stake maior que o saldo disponível');
      return;
    }

    setLoading(true);
    const { error } = await addBet({
      match_name: formData.match_name,
      league: formData.league,
      bet_type: formData.bet_type,
      odds,
      stake,
    });

    setLoading(false);

    if (error) {
      toast.error('Erro ao adicionar aposta');
      return;
    }

    toast.success('Aposta adicionada com sucesso');
    onOpenChange(false);
    setFormData({
      match_name: '',
      league: '',
      bet_type: '',
      odds: '',
      stake: '',
    });
  };

  const potentialReturn = () => {
    const odds = parseFloat(formData.odds);
    const stake = parseFloat(formData.stake);
    if (isNaN(odds) || isNaN(stake)) return 0;
    return stake * odds;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nova Aposta
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="match_name">Jogo *</Label>
              <Input
                id="match_name"
                placeholder="Ex: Flamengo vs Corinthians"
                value={formData.match_name}
                onChange={(e) => setFormData({ ...formData, match_name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="league">Liga/Campeonato</Label>
              <Input
                id="league"
                placeholder="Ex: Brasileirão Série A"
                value={formData.league}
                onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bet_type">Tipo de Aposta *</Label>
              <Input
                id="bet_type"
                placeholder="Ex: Vitória Casa, Over 2.5"
                value={formData.bet_type}
                onChange={(e) => setFormData({ ...formData, bet_type: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="odds">Odds *</Label>
                <Input
                  id="odds"
                  type="number"
                  step="0.01"
                  min="1.01"
                  placeholder="1.85"
                  value={formData.odds}
                  onChange={(e) => setFormData({ ...formData, odds: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="stake">Stake (R$) *</Label>
                <Input
                  id="stake"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="50.00"
                  value={formData.stake}
                  onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            {formData.odds && formData.stake && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retorno potencial:</span>
                  <span className="font-semibold text-success">
                    R$ {potentialReturn().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Lucro potencial:</span>
                  <span className="font-medium text-success">
                    R$ {(potentialReturn() - parseFloat(formData.stake || '0')).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {profile && (
              <p className="text-xs text-muted-foreground">
                Saldo disponível: R$ {(profile.current_bankroll || 0).toFixed(2)}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
