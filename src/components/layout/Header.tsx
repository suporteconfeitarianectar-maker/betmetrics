import { TrendingUp, Bell, ChevronDown, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { leagues } from '@/data/mockData';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="sticky top-0 z-40 glass-effect border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Mobile Logo */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">BetMetrics</span>
        </div>

        {/* Desktop - League Selector */}
        <div className="hidden md:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Trophy className="w-4 h-4" />
                Todas as ligas
                <ChevronDown className="w-4 h-4" />
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

          <div className="text-sm text-muted-foreground">
            Hoje, 11 de janeiro de 2026
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>
          
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

