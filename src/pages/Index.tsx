import { Layout } from '@/components/layout/Layout';
import { UserSummaryCards } from '@/components/cards/UserSummaryCards';
import { SimpleMatchCard, HomeAdvantageCard } from '@/components/cards/SimpleMatchCard';
import { Button } from '@/components/ui/button';
import { matches } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Home, TrendingUp } from 'lucide-react';

export default function Index() {
  // Oportunidades com valor positivo
  const opportunityMatches = matches.filter((m) => m.evIndicator === 'positive');
  
  // Top 5 melhores oportunidades (ordenadas por EV)
  const topValueMatches = [...matches]
    .filter((m) => m.evIndicator === 'positive')
    .sort((a, b) => b.ev - a.ev)
    .slice(0, 5);

  // Mandantes favoritos
  const homeAdvantageMatches = matches.filter((m) => m.isHomeAdvantage && m.evIndicator === 'positive');

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-8">
        {/* Resumo do Usuário */}
        <section>
          <h1 className="text-xl font-bold text-foreground mb-4">
            Seu resumo
          </h1>
          <UserSummaryCards />
        </section>

        {/* Oportunidades do Dia */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Oportunidades do dia
              </h2>
            </div>
            <Link to="/jogos">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {opportunityMatches.slice(0, 3).map((match) => (
              <SimpleMatchCard key={match.id} match={match} />
            ))}
          </div>

          {opportunityMatches.length > 3 && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              +{opportunityMatches.length - 3} oportunidades disponíveis
            </p>
          )}
        </section>

        {/* Jogos com Melhor Valor */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-success" />
            <h2 className="text-lg font-semibold text-foreground">
              Jogos com melhor valor hoje
            </h2>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Curadoria automática baseada no nosso modelo de análise
          </p>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topValueMatches.slice(0, 3).map((match) => (
              <SimpleMatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        {/* Mandantes Favoritos */}
        {homeAdvantageMatches.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Mandantes favoritos
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Jogos onde o time da casa tem vantagem estatística
            </p>

            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {homeAdvantageMatches.slice(0, 4).map((match) => (
                <HomeAdvantageCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="text-center py-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            BetMetrics ajuda você a tomar decisões melhores com base em dados, não em palpites.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Resultados passados não garantem resultados futuros.
          </p>
        </section>
      </div>
    </Layout>
  );
}
