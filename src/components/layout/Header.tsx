import { TrendingUp, ChevronDown, Trophy, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { leagues } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NotificationsPanel } from '@/components/notifications/NotificationsPanel';

export function Header() {
  const { user, profile } = useAuth();

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (profile?.email) {
      return profile.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-40 glass-effect border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        {/* Mobile Logo */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground text-sm">BetMetrics</span>
        </div>

        {/* Desktop - League Selector */}
        <div className="hidden md:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
                <Trophy className="w-3.5 h-3.5" />
                Todas as ligas
                <ChevronDown className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 max-h-80 overflow-y-auto">
              <DropdownMenuItem asChild>
                <Link to="/jogos">Todas as ligas</Link>
              </DropdownMenuItem>
              {leagues.slice(0, 8).map((league) => (
                <DropdownMenuItem key={league.id} asChild>
                  <Link to={`/jogos?liga=${league.id}`}>
                    <span className="mr-2">{league.flag}</span>
                    {league.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <Link to="/ligas" className="text-primary">
                  Ver todas as ligas...
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="text-xs text-muted-foreground">
            Hoje, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <NotificationsPanel />
          
          {user ? (
            <Link to="/conta" className="hidden sm:flex items-center gap-2 ml-1">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">{getInitials()}</span>
              </div>
            </Link>
          ) : (
            <Link to="/auth" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs">
                <LogIn className="w-3.5 h-3.5" />
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

