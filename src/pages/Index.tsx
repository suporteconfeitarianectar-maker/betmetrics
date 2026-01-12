import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DynamicSummaryCards } from '@/components/cards/DynamicSummaryCards';
import { MobileMatchCard, SimpleMatchCard, HomeAdvantageCard } from '@/components/cards/SimpleMatchCard';
import { Button } from '@/components/ui/button';
import { matches } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Home, TrendingUp, Plus } from 'lucide-react';
import { AddBetModal } from '@/components/bets/AddBetModal';
import { TodayFixtures } from '@/components/fixtures/TodayFixtures';

export default function Index() {
  const [showAddBet, setShowAddBet] = useState(false);

  // Oportunidades com valor positivo
  const opportunityMatches = matches.filter((m) => m.evIndicator === 'positive');
  
  // Top 3 melhores oportunidades (ordenadas por EV)
  const topValueMatches = [...matches]
    .filter((m) => m.evIndicator === 'positive')
    .sort((a, b) => b.ev - a.ev)
    .slice(0, 3);

  // Mandantes favoritos
  const homeAdvantageMatches = matches.filter((m) => m.isHomeAdvantage && m.evIndicator === 'positive');

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6 md:space-y-8">
        
        {/* Seção 1: Resumo do Usuário - Prioridade máxima no mobile */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg md:text-xl font-bold text-card-foreground">
              Seu resumo
            </h1>
            <Button
              size="default"
              onClick={() => setShowAddBet(true)}
              className="gap-2 h-10 px-4 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Aposta</span>
              <span className="sm:hidden">Apostar</span>
            </Button>
          </div>
          <DynamicSummaryCards />
        </section>

        {/* Seção: Jogos do Dia - API-Football */}
        <section>
          <TodayFixtures />
        </section>

        {/* Seção 2: Oportunidades do Dia - Carousel no mobile (1 card por vez) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-card-foreground">
                Oportunidades do dia
              </h2>
            </div>
            <Link to="/jogos">
              <Button variant="ghost" size="sm" className="gap-1 text-primary text-sm h-9 px-3">
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile: Carousel com 1 card ocupando ~90% da tela */}
          <div className="md:hidden scroll-container">
            {opportunityMatches.slice(0, 4).map((match) => (
              <MobileMatchCard key={match.id} match={match} />
            ))}
          </div>
          
          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {opportunityMatches.slice(0, 3).map((match) => (
              <SimpleMatchCard key={match.id} match={match} />
            ))}
          </div>

          {opportunityMatches.length > 3 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              +{opportunityMatches.length - 3} oportunidades disponíveis
            </p>
          )}
        </section>

        {/* Seção 3: Melhor Valor Hoje - Lista vertical no mobile */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-success" />
            <h2 className="text-lg font-bold text-card-foreground">
              Melhor valor hoje
            </h2>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Curadoria automática do modelo
          </p>

          {/* Mobile: Lista vertical com cards full-width */}
          <div className="md:hidden space-y-3">
            {topValueMatches.slice(0, 3).map((match) => (
              <Link 
                key={match.id}
                to={`/jogo/${match.id}`}
                className="card-mobile flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground text-base truncate">
                    {match.homeTeam} vs {match.awayTeam}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">{match.league}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{match.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm font-medium text-success bg-success/10 px-3 py-1 rounded-full">
                    +{(match.ev * 100).toFixed(0)}%
                  </span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-4">
            {topValueMatches.map((match) => (
              <SimpleMatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        {/* Seção 4: Mandantes Favoritos - Carousel no mobile */}
        {homeAdvantageMatches.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-card-foreground">
                Mandantes favoritos
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Vantagem estatística do time da casa
            </p>

            {/* Mobile: Carousel */}
            <div className="md:hidden scroll-container">
              {homeAdvantageMatches.slice(0, 4).map((match) => (
                <div key={match.id} className="scroll-item">
                  <HomeAdvantageCard match={match} />
                </div>
              ))}
            </div>

            {/* Desktop: Grid */}
            <div className="hidden md:grid md:grid-cols-3 xl:grid-cols-4 gap-4">
              {homeAdvantageMatches.slice(0, 4).map((match) => (
                <HomeAdvantageCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="text-center py-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            BetMetrics: decisões baseadas em dados, não em palpites.
          </p>
        </section>
      </div>

      {/* Add Bet Modal */}
      <AddBetModal open={showAddBet} onOpenChange={setShowAddBet} />
    </Layout>
  );
}
