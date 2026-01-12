import { useState } from 'react';
import { Bell, Calendar, Sparkles, TrendingUp, Info, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { matches } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'system' | 'reminder' | 'opportunity';
  title: string;
  message: string;
  time: string;
  read: boolean;
  matchId?: string;
}

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Generate dynamic notifications based on today's matches
    const todayMatches = matches.slice(0, 5);
    const bestOpportunity = [...matches]
      .filter(m => m.evIndicator === 'positive')
      .sort((a, b) => b.ev - a.ev)[0];

    const notifs: Notification[] = [
      {
        id: '1',
        type: 'system',
        title: 'Bem-vindo ao BetMetrics!',
        message: 'Explore as análises e comece a gerenciar sua banca de forma inteligente.',
        time: 'Agora',
        read: false,
      },
    ];

    if (bestOpportunity) {
      notifs.push({
        id: '2',
        type: 'opportunity',
        title: '🔥 Melhor oportunidade do dia',
        message: `${bestOpportunity.homeTeam} vs ${bestOpportunity.awayTeam} tem EV de +${(bestOpportunity.ev * 100).toFixed(0)}% no mercado ${bestOpportunity.market}`,
        time: 'Hoje',
        read: false,
        matchId: bestOpportunity.id,
      });
    }

    todayMatches.slice(0, 3).forEach((match, index) => {
      notifs.push({
        id: `reminder-${index}`,
        type: 'reminder',
        title: `📅 Jogo às ${match.time}`,
        message: `${match.homeTeam} vs ${match.awayTeam} - ${match.league}`,
        time: 'Hoje',
        read: true,
        matchId: match.id,
      });
    });

    return notifs;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'system':
        return <Info className="w-4 h-4 text-primary" />;
      case 'reminder':
        return <Calendar className="w-4 h-4 text-warning" />;
      case 'opportunity':
        return <Sparkles className="w-4 h-4 text-success" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </SheetTitle>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs text-primary"
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-4">
          <div className="space-y-2 pr-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 rounded-lg border transition-colors cursor-pointer",
                    notification.read 
                      ? "bg-muted/30 border-border" 
                      : "bg-primary/5 border-primary/20"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          "text-sm",
                          notification.read ? "font-normal text-foreground" : "font-medium text-foreground"
                        )}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                        {notification.matchId && (
                          <Link 
                            to={`/jogo/${notification.matchId}`}
                            onClick={() => setOpen(false)}
                          >
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-xs text-primary gap-1"
                            >
                              Ver análise
                              <TrendingUp className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Info footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">
              💡 Notificações são atualizadas com base nos jogos do dia
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
