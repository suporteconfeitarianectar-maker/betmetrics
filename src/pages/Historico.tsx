import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/cards/StatCard';
import { performanceData } from '@/data/mockData';
import { TrendingUp, Target, BarChart3, Percent, AlertCircle } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function Historico() {
  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <section>
          <h1 className="text-2xl font-bold text-foreground">
            Histórico e Performance
          </h1>
          <p className="text-muted-foreground text-sm">
            Acompanhe o desempenho das análises ao longo do tempo
          </p>
        </section>

        {/* Stats overview */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            label="ROI Total"
            value={`${performanceData.roi}%`}
            subValue="Últimos 30 dias"
            trend="up"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <StatCard
            label="Total de análises"
            value={performanceData.totalAnalyses}
            subValue="Desde o início"
            icon={<BarChart3 className="w-4 h-4" />}
          />
          <StatCard
            label="EV Médio"
            value={`${(performanceData.averageEV * 100).toFixed(1)}%`}
            subValue="Por aposta"
            trend="up"
            icon={<Target className="w-4 h-4" />}
          />
          <StatCard
            label="Taxa de acerto"
            value={`${performanceData.winRate}%`}
            subValue="Análises corretas"
            icon={<Percent className="w-4 h-4" />}
          />
        </section>

        {/* Chart */}
        <section className="card-metric">
          <h3 className="font-semibold text-foreground mb-4">
            Evolução da banca
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData.bankrollHistory}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  domain={['dataMin - 50', 'dataMax + 50']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                  formatter={(value: number) => [`R$ ${value}`, 'Banca']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
          <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium">Aviso importante</p>
            <p className="text-sm text-muted-foreground mt-1">
              Resultados passados não garantem resultados futuros. 
              As análises são baseadas em modelos estatísticos e não constituem recomendação de aposta.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
