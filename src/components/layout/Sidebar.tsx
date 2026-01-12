import { Home, Calendar, Trophy, History, User, TrendingUp, Wallet, LogOut, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Calendar, label: 'Jogos', path: '/jogos' },
  { icon: Trophy, label: 'Ligas', path: '/ligas' },
  { icon: TrendingUp, label: 'Histórico', path: '/historico' },
  { icon: Wallet, label: 'Banca', path: '/banca' },
  { icon: User, label: 'Conta', path: '/conta' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, trialDaysLeft, isTrialActive } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getPlanDisplay = () => {
    if (!profile) return { plan: 'FREE', badge: 'Demo' };
    
    if (profile.plan !== 'FREE') {
      return { plan: profile.plan, badge: profile.plan };
    }
    
    if (!isTrialActive) {
      return { plan: 'FREE', badge: 'Expirado' };
    }
    
    return { plan: 'FREE', badge: `${trialDaysLeft}d restantes` };
  };

  const planDisplay = getPlanDisplay();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">BetMetrics</h1>
            <p className="text-xs text-muted-foreground">Análise baseada em dados</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {user ? (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-sidebar-accent">
              <p className="text-[10px] text-muted-foreground mb-1">Plano atual</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{planDisplay.plan}</span>
                <span className={cn(
                  "badge-plan",
                  profile?.plan === 'FREE' && !isTrialActive ? 'badge-free text-destructive' : 'badge-free'
                )}>
                  {planDisplay.badge}
                </span>
              </div>
              <Link
                to="/conta"
                className="mt-2 block w-full text-center text-xs text-primary hover:underline"
              >
                Ver planos
              </Link>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <LogIn className="w-4 h-4" />
              Entrar
            </Button>
          </Link>
        )}
      </div>
    </aside>
  );
}
