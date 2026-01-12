import { MatchAnalysis } from '@/data/teamStats';
import { cn } from '@/lib/utils';
import { TrendingUp, Goal, Users2 } from 'lucide-react';

interface MarketAnalysisProps {
  analysis: MatchAnalysis;
  homeTeam: string;
  awayTeam: string;
}

export function MarketAnalysis({ analysis, homeTeam, awayTeam }: MarketAnalysisProps) {
  const { predictions } = analysis;

  const getConfidenceColor = (confidence: 'alta' | 'média' | 'baixa') => {
    switch (confidence) {
      case 'alta': return 'text-success bg-success/10';
      case 'média': return 'text-warning bg-warning/10';
      case 'baixa': return 'text-muted-foreground bg-muted';
    }
  };

  const getConfidenceLabel = (confidence: 'alta' | 'média' | 'baixa') => {
    switch (confidence) {
      case 'alta': return 'Confiança alta';
      case 'média': return 'Confiança média';
      case 'baixa': return 'Confiança baixa';
    }
  };

  const markets = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Resultado Final',
      items: [
        { 
          label: `${homeTeam} vence`, 
          prob: predictions.homeWin.probability,
          confidence: predictions.homeWin.confidence,
        },
        { 
          label: 'Empate', 
          prob: predictions.draw.probability,
          confidence: predictions.draw.confidence,
        },
        { 
          label: `${awayTeam} vence`, 
          prob: predictions.awayWin.probability,
          confidence: predictions.awayWin.confidence,
        },
      ],
    },
    {
      icon: <Goal className="w-5 h-5" />,
      title: 'Gols no Jogo',
      items: [
        { 
          label: 'Mais de 2.5 gols', 
          prob: predictions.over25.probability,
          confidence: predictions.over25.confidence,
          insight: `Média combinada: ${(analysis.homeTeam.avgGoalsScored + analysis.awayTeam.avgGoalsScored).toFixed(1)} gols`,
        },
        { 
          label: 'Menos de 2.5 gols', 
          prob: 1 - predictions.over25.probability,
          confidence: predictions.over25.probability > 0.5 ? 'baixa' : predictions.over25.probability < 0.4 ? 'alta' : 'média' as 'alta' | 'média' | 'baixa',
        },
      ],
    },
    {
      icon: <Users2 className="w-5 h-5" />,
      title: 'Ambas Marcam',
      items: [
        { 
          label: 'Sim, ambas marcam', 
          prob: predictions.btts.probability,
          confidence: predictions.btts.confidence,
          insight: `${analysis.homeTeam.team}: ${analysis.homeTeam.bothTeamsScored}/10 jogos com BTTS`,
        },
        { 
          label: 'Não, pelo menos um não marca', 
          prob: 1 - predictions.btts.probability,
          confidence: predictions.btts.probability > 0.55 ? 'baixa' : predictions.btts.probability < 0.45 ? 'alta' : 'média' as 'alta' | 'média' | 'baixa',
        },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {markets.map((market, marketIndex) => (
        <div key={marketIndex} className="card-metric">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-primary">{market.icon}</div>
            <h3 className="font-semibold text-foreground">{market.title}</h3>
          </div>

          <div className="space-y-3">
            {market.items.map((item, itemIndex) => (
              <div key={itemIndex} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold font-mono text-foreground">
                      {(item.prob * 100).toFixed(0)}%
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      getConfidenceColor(item.confidence)
                    )}>
                      {getConfidenceLabel(item.confidence)}
                    </span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      item.confidence === 'alta' ? 'bg-success' :
                      item.confidence === 'média' ? 'bg-warning' : 'bg-muted-foreground'
                    )}
                    style={{ width: `${item.prob * 100}%` }}
                  />
                </div>

                {/* Insight */}
                {item.insight && (
                  <p className="text-xs text-muted-foreground italic">
                    💡 {item.insight}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
