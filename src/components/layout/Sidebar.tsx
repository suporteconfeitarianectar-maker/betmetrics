import { Home, Calendar, Trophy, History, User, TrendingUp, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
        <div className="p-4 rounded-lg bg-sidebar-accent">
          <p className="text-xs text-muted-foreground mb-2">Plano atual</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">FREE</span>
            <span className="badge-plan badge-free">Demo</span>
          </div>
          <Link
            to="/conta"
            className="mt-3 block w-full text-center text-xs text-primary hover:underline"
          >
            Ver planos
          </Link>
        </div>
      </div>
    </aside>
  );
}
