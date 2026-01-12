import { useFixtures, Fixture, FixturesByLeague } from '@/hooks/useFixtures';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function FixtureCard({ fixture }: { fixture: Fixture }) {
  const matchTime = format(new Date(fixture.date), 'HH:mm', { locale: ptBR });

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      {/* Teams */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <img
            src={fixture.homeTeam.logo}
            alt={fixture.homeTeam.name}
            className="w-5 h-5 object-contain flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><circle cx="12" cy="12" r="10"/></svg>';
            }}
          />
          <span className="text-sm font-medium truncate">{fixture.homeTeam.name}</span>
        </div>
        <span className="text-xs text-muted-foreground px-2">vs</span>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-sm font-medium truncate text-right">{fixture.awayTeam.name}</span>
          <img
            src={fixture.awayTeam.logo}
            alt={fixture.awayTeam.name}
            className="w-5 h-5 object-contain flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><circle cx="12" cy="12" r="10"/></svg>';
            }}
          />
        </div>
      </div>

      {/* Time */}
      <div className="flex-shrink-0 text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
        {matchTime}
      </div>
    </div>
  );
}

function LeagueSection({ leagueKey, fixtures }: { leagueKey: string; fixtures: Fixture[] }) {
  if (fixtures.length === 0) return null;
  
  const league = fixtures[0].league;

  return (
    <div className="space-y-2">
      {/* League header */}
      <div className="flex items-center gap-2 px-1 pt-2">
        <img
          src={league.logo}
          alt={league.name}
          className="w-5 h-5 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{league.name}</span>
          <span className="text-xs text-muted-foreground">• {league.country}</span>
        </div>
      </div>
      
      {/* Fixtures for this league */}
      <div className="space-y-1">
        {fixtures.map((fixture) => (
          <FixtureCard key={fixture.id} fixture={fixture} />
        ))}
      </div>
    </div>
  );
}

function FixturesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-1">
            {[1, 2].map((j) => (
              <div key={j} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-14 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TodayFixtures() {
  const { fixturesByLeague, fixtures, loading, error, refetch } = useFixtures();

  // Sort leagues by priority (using first fixture's priority)
  const sortedLeagueKeys = Object.keys(fixturesByLeague).sort((a, b) => {
    const priorityA = fixturesByLeague[a]?.[0]?.league.priority ?? 99;
    const priorityB = fixturesByLeague[b]?.[0]?.league.priority ?? 99;
    return priorityA - priorityB;
  });

  const totalFixtures = fixtures.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Jogos do Dia
          {totalFixtures > 0 && (
            <span className="text-xs font-normal text-muted-foreground">
              ({totalFixtures} jogos)
            </span>
          )}
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
        ) : sortedLeagueKeys.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <Calendar className="w-8 h-8" />
            <p className="text-sm">Nenhum jogo encontrado para hoje</p>
            <p className="text-xs">Apenas ligas principais são exibidas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedLeagueKeys.map((leagueKey) => (
              <LeagueSection
                key={leagueKey}
                leagueKey={leagueKey}
                fixtures={fixturesByLeague[leagueKey]}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
