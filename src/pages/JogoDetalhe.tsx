import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { EVIndicator } from '@/components/ui/EVIndicator';
import { EVTooltip } from '@/components/ui/EVTooltip';
import { PlanBadge } from '@/components/ui/PlanBadge';
import { Button } from '@/components/ui/button';
import { AddBetModal } from '@/components/bets/AddBetModal';
import { TeamForm } from '@/components/analysis/TeamForm';
import { StatsComparison } from '@/components/analysis/StatsComparison';
import { HeadToHead } from '@/components/analysis/HeadToHead';
import { MarketAnalysis } from '@/components/analysis/MarketAnalysis';
import { matches } from '@/data/mockData';
import { getMatchAnalysis } from '@/data/teamStats';
import { ArrowLeft, Clock, MapPin, TrendingUp, BarChart3, Target, Plus, Wallet, Activity, Users, LineChart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function JogoDetalhe() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [showAddBet, setShowAddBet] = useState(false);
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

  const analysis = getMatchAnalysis(match.id, match.homeTeam, match.awayTeam);

  const handleAddToBankroll = () => {
    if (!user) {
      toast.error('Faça login para adicionar apostas');
      return;
    }
    setShowAddBet(true);
  };

  const prefillData = {
    match_name: `${match.homeTeam} vs ${match.awayTeam}`,
    league: match.league,
    bet_type: match.market,
    odds: match.marketOdds,
  };

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

        {/* Quick EV Summary */}
        <section className="card-metric">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-semibold text-foreground">Valor Esperado (EV)</h2>
                <EVTooltip />
              </div>
              <p className="text-sm text-muted-foreground">{match.market}</p>
            </div>
            <div className="text-right">
              <span className={`text-3xl font-bold font-mono ${match.evIndicator === 'positive' ? 'text-success' : match.evIndicator === 'negative' ? 'text-destructive' : 'text-muted-foreground'}`}>
                {match.ev > 0 ? '+' : ''}{(match.ev * 100).toFixed(1)}%
              </span>
              <div className="mt-1">
                <EVIndicator indicator={match.evIndicator} size="sm" />
              </div>
            </div>
          </div>

          {match.evIndicator === 'positive' && (
            <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
              <p className="text-sm text-success">
                ✅ <strong>Boa oportunidade!</strong> Os dados indicam que a probabilidade real é maior do que o mercado sugere.
              </p>
            </div>
          )}
          {match.evIndicator === 'negative' && (
            <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm text-destructive">
                ⚠️ <strong>Atenção:</strong> A odd oferecida não compensa o risco estimado pelo modelo.
              </p>
            </div>
          )}
        </section>

        {/* Tabs for analysis */}
        <Tabs defaultValue="form" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="form" className="flex items-center gap-1 text-xs">
              <Activity className="w-3 h-3" />
              <span className="hidden sm:inline">Forma</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1 text-xs">
              <BarChart3 className="w-3 h-3" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="h2h" className="flex items-center gap-1 text-xs">
              <Users className="w-3 h-3" />
              <span className="hidden sm:inline">H2H</span>
            </TabsTrigger>
            <TabsTrigger value="markets" className="flex items-center gap-1 text-xs">
              <LineChart className="w-3 h-3" />
              <span className="hidden sm:inline">Mercados</span>
            </TabsTrigger>
          </TabsList>

          {/* Team Form Tab */}
          <TabsContent value="form" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {analysis && (
                <>
                  <div className="card-metric">
                    <TeamForm stats={analysis.homeTeam} isHome={true} />
                  </div>
                  <div className="card-metric">
                    <TeamForm stats={analysis.awayTeam} isHome={false} />
                  </div>
                </>
              )}
            </div>

            {/* Insight */}
            {analysis && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <h4 className="font-medium text-foreground mb-2">💡 O que isso significa?</h4>
                <p className="text-sm text-muted-foreground">
                  {analysis.homeTeam.form > analysis.awayTeam.form + 10 
                    ? `${analysis.homeTeam.team} está em melhor momento. Com ${analysis.homeTeam.last10Results.filter(r => r === 'W').length} vitórias nos últimos 10 jogos, joga em casa com confiança.`
                    : analysis.awayTeam.form > analysis.homeTeam.form + 10
                    ? `${analysis.awayTeam.team} vem em melhor fase, mesmo jogando fora de casa. Isso pode equilibrar o duelo.`
                    : `Os dois times estão em momento similar. A vantagem do mando de campo pode ser decisiva.`
                  }
                </p>
              </div>
            )}
          </TabsContent>

          {/* Stats Comparison Tab */}
          <TabsContent value="stats">
            {analysis && (
              <div className="card-metric">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Comparação nos últimos 10 jogos
                </h3>
                <StatsComparison homeTeam={analysis.homeTeam} awayTeam={analysis.awayTeam} />
                
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <h4 className="font-medium text-foreground mb-2">💡 Destaques</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {analysis.homeTeam.team} marca em média {analysis.homeTeam.avgGoalsScored.toFixed(1)} gols por jogo</li>
                    <li>• {analysis.awayTeam.team} sofreu {analysis.awayTeam.goalsConceded} gols nos últimos 10 jogos</li>
                    <li>• Ambos os times tiveram BTTS em {Math.round((analysis.homeTeam.bothTeamsScored + analysis.awayTeam.bothTeamsScored) / 2 * 10)}% dos jogos</li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Head to Head Tab */}
          <TabsContent value="h2h">
            {analysis && (
              <div className="card-metric">
                <HeadToHead 
                  analysis={analysis} 
                  homeTeam={match.homeTeam} 
                  awayTeam={match.awayTeam} 
                />

                <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <h4 className="font-medium text-foreground mb-2">💡 Histórico do confronto</h4>
                  <p className="text-sm text-muted-foreground">
                    {analysis.headToHead.homeWins > analysis.headToHead.awayWins
                      ? `${match.homeTeam} leva vantagem histórica com ${analysis.headToHead.homeWins} vitórias. Os confrontos costumam ter ${analysis.headToHead.avgGoals.toFixed(1)} gols em média.`
                      : analysis.headToHead.awayWins > analysis.headToHead.homeWins
                      ? `${match.awayTeam} tem histórico favorável mesmo jogando fora, com ${analysis.headToHead.awayWins} vitórias nos últimos confrontos.`
                      : `Confronto equilibrado historicamente. O fator casa pode ser decisivo neste duelo.`
                    }
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Markets Analysis Tab */}
          <TabsContent value="markets">
            {analysis && (
              <MarketAnalysis 
                analysis={analysis} 
                homeTeam={match.homeTeam} 
                awayTeam={match.awayTeam} 
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Odds comparison */}
        <section className="card-metric">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Odds - {match.market}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground mb-2">Odd do mercado</p>
              <p className="text-3xl font-bold font-mono text-foreground">
                {match.marketOdds.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Prob. implícita: {((1 / match.marketOdds) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground mb-2">Odd justa (modelo)</p>
              <p className="text-3xl font-bold font-mono text-primary">
                {match.fairOdds.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Prob. calculada: {(match.calculatedProbability * 100).toFixed(0)}%
              </p>
            </div>
          </div>

          {match.marketOdds > match.fairOdds && (
            <p className="text-sm text-success mt-3 text-center">
              A odd do mercado está <strong>acima</strong> da odd justa = oportunidade de valor
            </p>
          )}
        </section>

        {/* CTA - Add to bankroll */}
        <section className="space-y-3">
          <Button 
            onClick={handleAddToBankroll} 
            className="w-full gap-2"
            size="lg"
          >
            <Plus className="w-4 h-4" />
            Adicionar à gestão de banca
          </Button>

          {user && profile && (
            <p className="text-xs text-center text-muted-foreground">
              <Wallet className="w-3 h-3 inline mr-1" />
              Saldo disponível: R$ {(profile.current_bankroll || 0).toFixed(2)}
            </p>
          )}

          {!user && (
            <p className="text-xs text-center text-muted-foreground">
              <Link to="/auth" className="text-primary hover:underline">
                Faça login
              </Link>
              {' '}para adicionar apostas à sua banca
            </p>
          )}
        </section>

        {match.planRequired !== 'FREE' && (
          <section className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
            <p className="text-sm text-foreground">
              Análise completa disponível no plano {match.planRequired}
            </p>
          </section>
        )}
      </div>

      {/* Add Bet Modal - Pre-filled with match data */}
      <AddBetModal 
        open={showAddBet} 
        onOpenChange={setShowAddBet}
        prefillData={prefillData}
      />
    </Layout>
  );
}
