import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DynamicSummaryCards } from '@/components/cards/DynamicSummaryCards';
import { SimpleMatchCard, HomeAdvantageCard, CompactMatchCard } from '@/components/cards/SimpleMatchCard';
import { Button } from '@/components/ui/button';
import { matches } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Home, TrendingUp, Plus } from 'lucide-react';
import { AddBetModal } from '@/components/bets/AddBetModal';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { user } = useAuth();
  const [showAddBet, setShowAddBet] = useState(false);

  // Oportunidades com valor positivo
  const opportunityMatches = matches.filter((m) => m.evIndicator === 'positive');
  
  // Top 5 melhores oportunidades (ordenadas por EV)
  const topValueMatches = [...matches]
    .filter((m) => m.evIndicator === 'positive')
    .sort((a, b) => b.ev - a.ev)
    .slice(0, 6);

  // Mandantes favoritos
  const homeAdvantageMatches = matches.filter((m) => m.isHomeAdvantage && m.evIndicator === 'positive');

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Resumo do Usuário */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-base font-semibold text-card-foreground">
              Seu resumo
            </h1>
            {user && (
              <Button
                size="sm"
                onClick={() => setShowAddBet(true)}
                className="gap-1 h-8"
              >
                <Plus className="w-4 h-4" />
                Nova Aposta
              </Button>
            )}
          </div>
          <DynamicSummaryCards />
        </section>

        {/* Oportunidades do Dia - Horizontal scroll on mobile */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-card-foreground">
                Oportunidades do dia
              </h2>
            </div>
            <Link to="/jogos">
              <Button variant="ghost" size="sm" className="gap-1 text-primary text-xs h-7 px-2">
                Ver todas
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          {/* Mobile: horizontal scroll / Desktop: grid */}
          <div className="md:hidden scroll-container">
            {opportunityMatches.slice(0, 6).map((match) => (
              <CompactMatchCard key={match.id} match={match} />
            ))}
          </div>
          
          <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {opportunityMatches.slice(0, 3).map((match) => (
              <SimpleMatchCard key={match.id} match={match} />
            ))}
          </div>

          {opportunityMatches.length > 3 && (
            <p className="text-[11px] text-muted-foreground mt-2 text-center md:mt-3">
              +{opportunityMatches.length - 3} oportunidades disponíveis
            </p>
          )}
        </section>

        {/* Jogos com Melhor Valor - Grid 2x2 on mobile */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <h2 className="text-base font-semibold text-card-foreground">
              Melhor valor hoje
            </h2>
          </div>

          <p className="text-[11px] text-muted-foreground mb-3">
            Curadoria automática do modelo
          </p>

          {/* Mobile: 2 column grid / Desktop: 3 column grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {topValueMatches.slice(0, 4).map((match) => (
              <div key={match.id} className="md:hidden">
                <Link 
                  to={`/jogo/${match.id}`}
                  className="card-compact block"
                >
                  <h3 className="font-medium text-card-foreground text-xs leading-tight mb-0.5 truncate">
                    {match.homeTeam}
                  </h3>
                  <p className="text-[10px] text-muted-foreground truncate mb-2">
                    vs {match.awayTeam}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-success">Favorável</span>
                    <span className="text-[10px] text-muted-foreground">{match.time}</span>
                  </div>
                </Link>
              </div>
            ))}
            {topValueMatches.slice(0, 3).map((match) => (
              <div key={`desktop-${match.id}`} className="hidden md:block">
                <SimpleMatchCard match={match} />
              </div>
            ))}
          </div>
        </section>

        {/* Mandantes Favoritos - Horizontal scroll on mobile */}
        {homeAdvantageMatches.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-card-foreground">
                Mandantes favoritos
              </h2>
            </div>

            <p className="text-[11px] text-muted-foreground mb-3">
              Vantagem estatística do time da casa
            </p>

            {/* Mobile: horizontal scroll / Desktop: grid */}
            <div className="md:hidden scroll-container">
              {homeAdvantageMatches.slice(0, 6).map((match) => (
                <div key={match.id} className="scroll-item w-[140px]">
                  <HomeAdvantageCard match={match} />
                </div>
              ))}
            </div>

            <div className="hidden md:grid md:grid-cols-3 xl:grid-cols-4 gap-3">
              {homeAdvantageMatches.slice(0, 4).map((match) => (
                <HomeAdvantageCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="text-center py-4 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground">
            BetMetrics: decisões baseadas em dados, não em palpites.
          </p>
        </section>
      </div>

      {/* Add Bet Modal */}
      <AddBetModal open={showAddBet} onOpenChange={setShowAddBet} />
    </Layout>
  );
}
