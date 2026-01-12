import { Lock, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

interface TrialExpiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrialExpiredModal({ open, onOpenChange }: TrialExpiredModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <DialogTitle className="text-xl">
            Período de teste expirado
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Seu período de teste gratuito de 7 dias chegou ao fim. Para continuar usando o BetMetrics e acessar todas as análises, faça o upgrade do seu plano.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Benefits reminder */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-card-foreground">
              Com o plano PRO você tem:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Análises ilimitadas</li>
              <li>✓ Todas as ligas e mercados</li>
              <li>✓ Gestão de banca completa</li>
              <li>✓ Histórico e estatísticas</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Link to="/conta">
              <Button className="w-full gap-2">
                Fazer upgrade
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="text-muted-foreground"
              onClick={() => onOpenChange(false)}
            >
              Continuar navegando
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
