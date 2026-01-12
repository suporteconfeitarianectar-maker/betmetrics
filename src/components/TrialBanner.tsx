import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function TrialBanner() {
  const { user, profile, isTrialActive, trialDaysLeft } = useAuth();

  // Don't show if not logged in
  if (!user || !profile) return null;

  // Don't show for paid plans
  if (profile.plan !== 'FREE') return null;

  // Expired trial
  if (!isTrialActive) {
    return (
      <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2">
        <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
          <p className="text-xs text-destructive font-medium truncate">
            Seu período de teste expirou
          </p>
          <Link 
            to="/conta" 
            className="text-xs text-destructive font-medium hover:underline flex items-center gap-1 shrink-0"
          >
            Fazer upgrade
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  // Active trial with days left
  if (trialDaysLeft <= 3) {
    return (
      <div className="bg-warning/10 border-b border-warning/20 px-4 py-2">
        <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-warning" />
            <p className="text-xs text-warning font-medium">
              {trialDaysLeft === 1 
                ? 'Último dia de trial' 
                : `${trialDaysLeft} dias restantes no trial`
              }
            </p>
          </div>
          <Link 
            to="/conta" 
            className="text-xs text-warning font-medium hover:underline flex items-center gap-1 shrink-0"
          >
            Ver planos
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  // Normal trial (more than 3 days left) - subtle indicator
  return (
    <div className="bg-primary/5 border-b border-primary/10 px-4 py-1.5">
      <div className="flex items-center justify-center gap-2 max-w-7xl mx-auto">
        <p className="text-[10px] text-primary/80">
          Trial gratuito · {trialDaysLeft} dias restantes
        </p>
      </div>
    </div>
  );
}
