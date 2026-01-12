import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MatchCard } from '@/components/cards/MatchCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { matches, leagues, markets } from '@/data/mockData';
import { Filter, SlidersHorizontal, X, Check } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

type EVFilterType = 'all' | 'positive' | 'neutral' | 'negative';

export default function Jogos() {
  const [searchParams] = useSearchParams();
  const initialLeague = searchParams.get('liga') || 'all';
  
  const [selectedLeague, setSelectedLeague] = useState<string>(initialLeague);
  const [selectedMarket, setSelectedMarket] = useState<string>('all');
  const [evFilter, setEvFilter] = useState<EVFilterType>('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Temporary filter state for mobile sheet
  const [tempLeague, setTempLeague] = useState<string>(selectedLeague);
  const [tempMarket, setTempMarket] = useState<string>(selectedMarket);
  const [tempEvFilter, setTempEvFilter] = useState<EVFilterType>(evFilter);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedLeague !== 'all') count++;
    if (selectedMarket !== 'all') count++;
    if (evFilter !== 'all') count++;
    return count;
  }, [selectedLeague, selectedMarket, evFilter]);

  // Filter matches
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      if (selectedLeague !== 'all' && match.leagueId !== selectedLeague) return false;
      if (selectedMarket !== 'all' && match.marketId !== selectedMarket) return false;
      if (evFilter === 'positive' && match.evIndicator !== 'positive') return false;
      if (evFilter === 'neutral' && match.evIndicator !== 'neutral') return false;
      if (evFilter === 'negative' && match.evIndicator !== 'negative') return false;
      return true;
    });
  }, [selectedLeague, selectedMarket, evFilter]);

  // Apply filters from mobile sheet
  const applyMobileFilters = () => {
    setSelectedLeague(tempLeague);
    setSelectedMarket(tempMarket);
    setEvFilter(tempEvFilter);
    setIsSheetOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedLeague('all');
    setSelectedMarket('all');
    setEvFilter('all');
    setTempLeague('all');
    setTempMarket('all');
    setTempEvFilter('all');
  };

  // Reset mobile temp filters when opening sheet
  const handleSheetOpen = (open: boolean) => {
    if (open) {
      setTempLeague(selectedLeague);
      setTempMarket(selectedMarket);
      setTempEvFilter(evFilter);
    }
    setIsSheetOpen(open);
  };

  // Get display names for active filters
  const getLeagueName = (id: string) => leagues.find(l => l.id === id)?.name || id;
  const getMarketName = (id: string) => markets.find(m => m.id === id)?.name || id;
  const getEvName = (ev: EVFilterType) => {
    switch(ev) {
      case 'positive': return 'Oportunidades';
      case 'neutral': return 'Neutro';
      case 'negative': return 'Desfavorável';
      default: return 'Todos';
    }
  };

  // Filter option component for mobile
  const FilterOption = ({ 
    selected, 
    onClick, 
    children 
  }: { 
    selected: boolean; 
    onClick: () => void; 
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
        selected 
          ? 'bg-primary/15 text-primary border border-primary/30' 
          : 'bg-muted/30 text-card-foreground hover:bg-muted/50 border border-transparent'
      }`}
    >
      <span>{children}</span>
      {selected && <Check className="w-4 h-4" />}
    </button>
  );

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-4">
        {/* Header */}
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-card-foreground">Jogos</h1>
            <p className="text-muted-foreground text-xs">
              {filteredMatches.length} jogos encontrados
            </p>
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={isSheetOpen} onOpenChange={handleSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden gap-2 relative">
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-medium rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] flex flex-col p-0">
              <SheetHeader className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-base">Filtros</SheetTitle>
                  <button 
                    onClick={() => {
                      setTempLeague('all');
                      setTempMarket('all');
                      setTempEvFilter('all');
                    }}
                    className="text-xs text-primary"
                  >
                    Limpar tudo
                  </button>
                </div>
              </SheetHeader>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  {/* Liga Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block text-card-foreground">
                      Liga
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <FilterOption 
                        selected={tempLeague === 'all'} 
                        onClick={() => setTempLeague('all')}
                      >
                        Todas
                      </FilterOption>
                      {leagues.map((league) => (
                        <FilterOption
                          key={league.id}
                          selected={tempLeague === league.id}
                          onClick={() => setTempLeague(league.id)}
                        >
                          {league.flag} {league.name}
                        </FilterOption>
                      ))}
                    </div>
                  </div>

                  {/* Market Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block text-card-foreground">
                      Mercado
                    </Label>
                    <div className="grid grid-cols-1 gap-2">
                      <FilterOption 
                        selected={tempMarket === 'all'} 
                        onClick={() => setTempMarket('all')}
                      >
                        Todos os mercados
                      </FilterOption>
                      {markets.map((market) => (
                        <FilterOption
                          key={market.id}
                          selected={tempMarket === market.id}
                          onClick={() => setTempMarket(market.id)}
                        >
                          {market.name}
                        </FilterOption>
                      ))}
                    </div>
                  </div>

                  {/* EV Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block text-card-foreground">
                      Tipo de oportunidade
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <FilterOption 
                        selected={tempEvFilter === 'all'} 
                        onClick={() => setTempEvFilter('all')}
                      >
                        Todos
                      </FilterOption>
                      <FilterOption 
                        selected={tempEvFilter === 'positive'} 
                        onClick={() => setTempEvFilter('positive')}
                      >
                        ✓ Oportunidades
                      </FilterOption>
                      <FilterOption 
                        selected={tempEvFilter === 'neutral'} 
                        onClick={() => setTempEvFilter('neutral')}
                      >
                        Neutro
                      </FilterOption>
                      <FilterOption 
                        selected={tempEvFilter === 'negative'} 
                        onClick={() => setTempEvFilter('negative')}
                      >
                        Desfavorável
                      </FilterOption>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Apply Button */}
              <div className="p-4 border-t border-border bg-card">
                <Button 
                  onClick={applyMobileFilters} 
                  className="w-full"
                  size="lg"
                >
                  Aplicar filtros
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </section>

        {/* Active Filters Display (Mobile) */}
        {activeFiltersCount > 0 && (
          <div className="md:hidden flex flex-wrap gap-2">
            {selectedLeague !== 'all' && (
              <Badge variant="secondary" className="gap-1 text-xs">
                {getLeagueName(selectedLeague)}
                <button onClick={() => setSelectedLeague('all')}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedMarket !== 'all' && (
              <Badge variant="secondary" className="gap-1 text-xs">
                {getMarketName(selectedMarket)}
                <button onClick={() => setSelectedMarket('all')}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {evFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 text-xs">
                {getEvName(evFilter)}
                <button onClick={() => setEvFilter('all')}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Desktop Filters */}
        <section className="hidden md:block space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Liga:</span>
            </div>
            
            {/* Liga Filter */}
            <div className="flex gap-1.5 flex-wrap">
              <Button
                variant={selectedLeague === 'all' ? 'default' : 'outline'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setSelectedLeague('all')}
              >
                Todas
              </Button>
              {leagues.slice(0, 8).map((league) => (
                <Button
                  key={league.id}
                  variant={selectedLeague === league.id ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setSelectedLeague(league.id)}
                >
                  {league.flag} {league.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground ml-6">Mercado:</span>
            </div>
            
            {/* Market Filter */}
            <div className="flex gap-1.5 flex-wrap">
              <Button
                variant={selectedMarket === 'all' ? 'default' : 'outline'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setSelectedMarket('all')}
              >
                Todos
              </Button>
              {markets.slice(0, 5).map((market) => (
                <Button
                  key={market.id}
                  variant={selectedMarket === market.id ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setSelectedMarket(market.id)}
                >
                  {market.name}
                </Button>
              ))}
            </div>

            <div className="w-px h-5 bg-border" />

            {/* EV Filter */}
            <div className="flex gap-1.5">
              <Button
                variant={evFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setEvFilter('all')}
              >
                Todos
              </Button>
              <Button
                variant={evFilter === 'positive' ? 'default' : 'outline'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setEvFilter('positive')}
              >
                ✓ Oportunidades
              </Button>
            </div>

            {activeFiltersCount > 0 && (
              <>
                <div className="w-px h-5 bg-border" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground"
                  onClick={resetFilters}
                >
                  Limpar filtros
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Matches Grid */}
        <section>
          {filteredMatches.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card/50 rounded-lg border border-border/50">
              <p className="text-muted-foreground text-sm mb-3">
                Nenhum jogo encontrado com os filtros selecionados.
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Limpar filtros
              </Button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
