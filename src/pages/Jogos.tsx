import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MatchCard } from '@/components/cards/MatchCard';
import { Button } from '@/components/ui/button';
import { matches, leagues } from '@/data/mockData';
import { Filter, SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function Jogos() {
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [evFilter, setEvFilter] = useState<string>('all');

  const filteredMatches = matches.filter((match) => {
    if (selectedLeague !== 'all' && match.leagueId !== selectedLeague) return false;
    if (evFilter === 'positive' && match.evIndicator !== 'positive') return false;
    if (evFilter === 'negative' && match.evIndicator === 'positive') return false;
    return true;
  });

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Jogos</h1>
            <p className="text-muted-foreground text-sm">
              {filteredMatches.length} jogos analisados
            </p>
          </div>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[50vh]">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Liga</Label>
                  <RadioGroup value={selectedLeague} onValueChange={setSelectedLeague}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="league-all" />
                      <Label htmlFor="league-all">Todas as ligas</Label>
                    </div>
                    {leagues.map((league) => (
                      <div key={league.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={league.id} id={`league-${league.id}`} />
                        <Label htmlFor={`league-${league.id}`}>
                          {league.flag} {league.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Valor esperado</Label>
                  <RadioGroup value={evFilter} onValueChange={setEvFilter}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="ev-all" />
                      <Label htmlFor="ev-all">Todos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="positive" id="ev-positive" />
                      <Label htmlFor="ev-positive">Apenas EV positivo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="negative" id="ev-negative" />
                      <Label htmlFor="ev-negative">EV neutro/negativo</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </section>

        {/* Desktop Filters */}
        <section className="hidden md:flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtros:</span>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedLeague === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLeague('all')}
            >
              Todas
            </Button>
            {leagues.map((league) => (
              <Button
                key={league.id}
                variant={selectedLeague === league.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLeague(league.id)}
              >
                {league.flag} {league.name}
              </Button>
            ))}
          </div>

          <div className="w-px h-6 bg-border" />

          <div className="flex gap-2">
            <Button
              variant={evFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setEvFilter('all')}
            >
              Todos
            </Button>
            <Button
              variant={evFilter === 'positive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setEvFilter('positive')}
            >
              EV+
            </Button>
          </div>
        </section>

        {/* Matches Grid */}
        <section>
          {filteredMatches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhum jogo encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
