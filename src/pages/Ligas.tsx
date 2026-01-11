import { Layout } from '@/components/layout/Layout';
import { leagues, countries } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy } from 'lucide-react';

export default function Ligas() {
  // Agrupar ligas por país
  const leaguesByCountry = countries.map((country) => ({
    ...country,
    leagues: leagues.filter((league) => league.country === country.name),
  }));

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

        {/* Ligas por País */}
        <section className="space-y-6">
          {leaguesByCountry.map((country) => (
            <div key={country.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{country.flag}</span>
                <h2 className="text-lg font-semibold text-foreground">{country.name}</h2>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {country.leagues.map((league) => (
                  <Link
                    key={league.id}
                    to={`/jogos?liga=${league.id}`}
                    className="card-metric flex items-center justify-between hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{league.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span>{league.gamesAnalyzed} jogos analisados</span>
                          <span className="text-success">{league.gamesWithValue} oportunidades</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {league.isActive && (
                        <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded-full">
                          Ativo
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Info */}
        <section className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            Todas as ligas estão disponíveis durante o período de teste gratuito de 7 dias.
            Após esse período, faça upgrade para continuar utilizando o BetMetrics.
          </p>
        </section>
      </div>
    </Layout>
  );
}
