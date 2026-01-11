import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { EVIndicator } from '@/components/ui/EVIndicator';
import { EVTooltip } from '@/components/ui/EVTooltip';
import { PlanBadge } from '@/components/ui/PlanBadge';
import { Button } from '@/components/ui/button';
import { matches } from '@/data/mockData';
import { ArrowLeft, Clock, MapPin, TrendingUp, BarChart3, Target, Plus } from 'lucide-react';

export default function JogoDetalhe() {
  const { id } = useParams();
  const match = matches.find((m) => m.id === id);

  if (!match) {
    return (
      <Layout>
        <div className="p-4 md:p-6 text-center py-12">
          <p className="text-muted-foreground">Jogo não encontrado</p>
          <Link to="/jogos">
            <Button variant="link" className="mt-4">
              Voltar para jogos
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Back button */}
        <Link to="/jogos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Voltar</span>
        </Link>

        {/* Header */}
        <section className="card-metric">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {match.league}
            </span>
            <PlanBadge plan={match.planRequired} />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            {match.homeTeam} vs {match.awayTeam}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {match.date} às {match.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Casa: {match.homeTeam}
            </span>
          </div>
        </section>

        {/* Market info */}
        <section className="card-metric">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Mercado Analisado
          </h2>
          <p className="text-lg text-foreground">{match.market}</p>
        </section>

        {/* Probabilities */}
        <section className="card-metric">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Probabilidades
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground mb-2">Probabilidade calculada</p>
              <p className="text-3xl font-bold font-mono text-foreground">
                {(match.calculatedProbability * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Modelo BetMetrics</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground mb-2">Probabilidade implícita</p>
              <p className="text-3xl font-bold font-mono text-muted-foreground">
                {((1 / match.marketOdds) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Pela odd do mercado</p>
            </div>
          </div>
        </section>

        {/* Odds */}
        <section className="card-metric">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Odds
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground mb-2">Odd do mercado</p>
              <p className="text-3xl font-bold font-mono text-foreground">
                {match.marketOdds.toFixed(2)}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground mb-2">Odd justa</p>
              <p className="text-3xl font-bold font-mono text-primary">
                {match.fairOdds.toFixed(2)}
              </p>
            </div>
          </div>
        </section>

        {/* EV */}
        <section className="card-metric">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-semibold text-foreground">Valor Esperado (EV)</h2>
            <EVTooltip />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <EVIndicator indicator={match.evIndicator} size="lg" />
            <span className={`text-3xl font-bold font-mono ${match.evIndicator === 'positive' ? 'text-success' : match.evIndicator === 'negative' ? 'text-destructive' : 'text-muted-foreground'}`}>
              {match.ev > 0 ? '+' : ''}{(match.ev * 100).toFixed(1)}%
            </span>
          </div>

          {match.evIndicator === 'positive' && (
            <p className="text-sm text-success mt-3">
              Dados indicam vantagem: a probabilidade calculada pelo modelo é maior que a probabilidade implícita da odd.
            </p>
          )}
          {match.evIndicator === 'negative' && (
            <p className="text-sm text-destructive mt-3">
              Oportunidade desfavorável: a odd oferecida não compensa o risco estimado pelo modelo.
            </p>
          )}
        </section>

        {/* Context */}
        <section className="card-metric">
          <h2 className="font-semibold text-foreground mb-4">Contexto da Análise</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Forma recente considerada (últimos 5 jogos)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Mando de campo favorece {match.homeTeam}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Histórico de confrontos diretos analisado
            </li>
          </ul>
        </section>

        {/* Actions */}
        <section className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 gap-2">
            <Plus className="w-4 h-4" />
            Adicionar à gestão de banca
          </Button>
        </section>

        {match.planRequired !== 'FREE' && (
          <section className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
            <p className="text-sm text-foreground">
              Funcionalidade disponível no plano {match.planRequired} (modo demonstração ativo)
            </p>
          </section>
        )}
      </div>
    </Layout>
  );
}
