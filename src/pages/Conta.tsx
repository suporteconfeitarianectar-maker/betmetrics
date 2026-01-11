import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'FREE',
    name: 'Free',
    price: 'Grátis',
    description: 'Explore a plataforma',
    features: [
      'Até 3 análises por dia',
      'Ligas principais',
      'Indicadores básicos',
      'Histórico limitado',
    ],
    badge: 'badge-free',
    current: true,
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 'R$ 49/mês',
    description: 'Para apostadores regulares',
    features: [
      'Análises ilimitadas',
      'Todas as ligas',
      'EV e probabilidades detalhadas',
      'Gestão de banca',
      'Alertas de oportunidades',
      'Histórico completo',
    ],
    badge: 'badge-pro',
    recommended: true,
  },
  {
    id: 'ELITE',
    name: 'Elite',
    price: 'R$ 149/mês',
    description: 'Para profissionais',
    features: [
      'Tudo do Pro',
      'Modelos exclusivos',
      'API de acesso',
      'Análises em tempo real',
      'Suporte prioritário',
      'Relatórios avançados',
    ],
    badge: 'badge-elite',
  },
];

export default function Conta() {
  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <section>
          <h1 className="text-2xl font-bold text-foreground">Conta</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie sua assinatura e preferências
          </p>
        </section>

        {/* Current Plan */}
        <section className="card-metric">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Seu plano atual</p>
              <p className="text-xl font-semibold text-foreground mt-1">Free</p>
            </div>
            <span className="badge-plan badge-free">Demo</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Você está usando o modo demonstração. Todas as funcionalidades estão disponíveis para teste.
          </p>
        </section>

        {/* Plans */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Escolha seu plano
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'card-metric relative',
                  plan.recommended && 'border-primary glow-primary'
                )}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Recomendado
                    </span>
                  </div>
                )}

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground text-lg">
                      {plan.name}
                    </h3>
                    <span className={cn('badge-plan', plan.badge)}>
                      {plan.id}
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-foreground mb-1">
                    {plan.price}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.current ? 'outline' : plan.recommended ? 'default' : 'secondary'}
                    className="w-full"
                    disabled={plan.current}
                  >
                    {plan.current ? 'Plano atual' : 'Upgrade'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quote */}
        <section className="text-center py-6 border-t border-border">
          <p className="text-sm text-muted-foreground italic">
            "BetMetrics ajuda você a tomar decisões melhores com base em dados, não em palpites."
          </p>
        </section>
      </div>
    </Layout>
  );
}
