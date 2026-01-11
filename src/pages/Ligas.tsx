import { Layout } from '@/components/layout/Layout';
import { LeagueCard } from '@/components/cards/LeagueCard';
import { leagues } from '@/data/mockData';

export default function Ligas() {
  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <section>
          <h1 className="text-2xl font-bold text-foreground">Ligas</h1>
          <p className="text-muted-foreground text-sm">
            Selecione uma liga para ver as análises disponíveis
          </p>
        </section>

        {/* Leagues Grid */}
        <section className="grid gap-4 md:grid-cols-2">
          {leagues.map((league) => (
            <LeagueCard key={league.id} league={league} />
          ))}
        </section>

        {/* Info */}
        <section className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            Todas as ligas estão disponíveis no modo demonstração. 
            Atualize para PRO ou ELITE para acesso completo às análises avançadas.
          </p>
        </section>
      </div>
    </Layout>
  );
}
