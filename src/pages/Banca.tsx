import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/cards/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Wallet, TrendingUp, Calculator, History } from 'lucide-react';

export default function Banca() {
  const [bancaInicial, setBancaInicial] = useState(1000);
  const [stakePercent, setStakePercent] = useState([2]);

  const bancaAtual = 1124;
  const stakeValue = (bancaAtual * stakePercent[0]) / 100;

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <section>
          <h1 className="text-2xl font-bold text-foreground">
            Gestão de Banca
          </h1>
          <p className="text-muted-foreground text-sm">
            Controle sua banca e configure seu stake padrão
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3 md:gap-4">
          <StatCard
            label="Banca Inicial"
            value={`R$ ${bancaInicial.toLocaleString('pt-BR')}`}
            icon={<Wallet className="w-4 h-4" />}
          />
          <StatCard
            label="Banca Atual"
            value={`R$ ${bancaAtual.toLocaleString('pt-BR')}`}
            trend="up"
            icon={<TrendingUp className="w-4 h-4" />}
          />
        </section>

        {/* Configurações */}
        <section className="card-metric space-y-6">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Configurações de Stake
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="banca-inicial">Banca Inicial (R$)</Label>
              <Input
                id="banca-inicial"
                type="number"
                value={bancaInicial}
                onChange={(e) => setBancaInicial(Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Stake padrão</Label>
                <span className="text-sm font-mono text-primary">
                  {stakePercent[0]}% = R$ {stakeValue.toFixed(2)}
                </span>
              </div>
              <Slider
                value={stakePercent}
                onValueChange={setStakePercent}
                max={10}
                min={1}
                step={0.5}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1%</span>
                <span>10%</span>
              </div>
            </div>
          </div>

          <Button className="w-full">
            Salvar configurações
          </Button>
        </section>

        {/* Histórico de apostas */}
        <section className="card-metric">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <History className="w-5 h-5" />
            Apostas Salvas
          </h3>
          
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Nenhuma aposta salva ainda.</p>
            <p className="text-xs mt-2">
              Use o botão "Adicionar à gestão de banca" na análise de um jogo.
            </p>
          </div>
        </section>

        {/* Demo notice */}
        <section className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-foreground">
            Funcionalidade disponível no plano PRO (modo demonstração ativo)
          </p>
        </section>
      </div>
    </Layout>
  );
}
