import { useFixtures, Fixture } from '@/hooks/useFixtures';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function FixtureCard({ fixture }: { fixture: Fixture }) {
  const matchTime = format(new Date(fixture.date), 'HH:mm', { locale: ptBR });

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      {/* League info */}
      <div className="flex-shrink-0 w-8 h-8">
        {fixture.league.logo ? (
          <img
            src={fixture.league.logo}
            alt={fixture.league.name}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
            ⚽
          </div>
        )}
      </div>

      {/* Match details */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate mb-1">
          {fixture.league.name} • {fixture.league.country}
        </p>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="truncate">{fixture.homeTeam.name}</span>
          <span className="text-muted-foreground">x</span>
          <span className="truncate">{fixture.awayTeam.name}</span>
        </div>
      </div>

      {/* Time */}
      <div className="flex-shrink-0 text-sm font-semibold text-primary">
        {matchTime}
      </div>
    </div>
  );
}

function FixturesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

export function TodayFixtures() {
  const { fixtures, loading, error, refetch } = useFixtures();

  // Limit to first 20 fixtures for performance
  const displayedFixtures = fixtures.slice(0, 20);
  const hasMore = fixtures.length > 20;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Jogos do Dia
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={refetch}
          disabled={loading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <FixturesSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch}>
              Tentar novamente
            </Button>
          </div>
        ) : fixtures.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <Calendar className="w-8 h-8" />
            <p className="text-sm">Nenhum jogo encontrado para hoje</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedFixtures.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
            {hasMore && (
              <p className="text-xs text-center text-muted-foreground pt-2">
                +{fixtures.length - 20} jogos adicionais
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
