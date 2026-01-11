import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Plan } from '@/types';

interface EVTooltipProps {
  userPlan?: Plan;
}

const explanations = {
  FREE: 'EV indica se uma aposta tende a ser boa no longo prazo, comparando a probabilidade calculada com a odd da casa.',
  PRO: 'Quando a probabilidade real estimada é maior que a probabilidade implícita da odd, existe EV positivo.',
  ELITE: 'EV representa o retorno médio esperado por unidade apostada ao longo do tempo. É a diferença entre a probabilidade real e a implícita, multiplicada pela odd menos 1.',
};

export function EVTooltip({ userPlan = 'FREE' }: EVTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <Info className="w-4 h-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs p-4" side="top">
        <p className="font-medium text-foreground mb-2">
          O que é Valor Esperado (EV)?
        </p>
        <p className="text-sm text-muted-foreground">
          {explanations[userPlan]}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
