import { cn } from '@/lib/utils';
import { Plan } from '@/types';

interface PlanBadgeProps {
  plan: Plan;
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  return (
    <span
      className={cn(
        'badge-plan',
        plan === 'FREE' && 'badge-free',
        plan === 'PRO' && 'badge-pro',
        plan === 'ELITE' && 'badge-elite',
        className
      )}
    >
      {plan}
    </span>
  );
}
