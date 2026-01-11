import { Layout } from '@/components/layout/Layout';
import { MatchCard } from '@/components/cards/MatchCard';
import { StatCard } from '@/components/cards/StatCard';
import { EVTooltip } from '@/components/ui/EVTooltip';
import { matches, performanceData } from '@/data/mockData';
import { TrendingUp, Target, BarChart3, Percent } from 'lucide-react';

export default function Index() {
  const positiveMatches = matches.filter((m) => m.evIndicator === 'positive');

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Welcome section */}
        <section>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Oportunidades de Valor — Hoje
          </h1>
          <p className="text-muted-foreground text-sm">
            Análises baseadas em dados, não em palpites.
          </p>
        </section>

        {/* Stats overview */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            label="ROI Total"
            value={`${performanceData.roi}%`}
            trend="up"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <StatCard
            label="Análises"
            value={performanceData.totalAnalyses}
            icon={<BarChart3 className="w-4 h-4" />}
          />
          <StatCard
            label="EV Médio"
            value={`${(performanceData.averageEV * 100).toFixed(1)}%`}
            trend="up"
            icon={<Target className="w-4 h-4" />}
          />
          <StatCard
            label="Taxa de acerto"
            value={`${performanceData.winRate}%`}
            icon={<Percent className="w-4 h-4" />}
          />
        </section>

        {/* Value opportunities */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Oportunidades com valor positivo
            </h2>
            <EVTooltip />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {positiveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        {/* All matches today */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Todas as análises de hoje
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

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
