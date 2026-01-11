import { cn } from '@/lib/utils';
import { EVIndicator as EVIndicatorType } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EVIndicatorProps {
  indicator: EVIndicatorType;
  value?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function EVIndicator({ 
  indicator, 
  value, 
  showValue = false, 
  size = 'md',
  className 
}: EVIndicatorProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const labels = {
    positive: 'Boa oportunidade',
    neutral: 'Neutra',
    negative: 'Desfavorável',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1.5',
        indicator === 'positive' && 'indicator-positive',
        indicator === 'neutral' && 'indicator-neutral',
        indicator === 'negative' && 'indicator-negative',
        sizeClasses[size],
        className
      )}
    >
      {indicator === 'positive' && <TrendingUp className={iconSizes[size]} />}
      {indicator === 'neutral' && <Minus className={iconSizes[size]} />}
      {indicator === 'negative' && <TrendingDown className={iconSizes[size]} />}
      <span className="font-medium">
        {showValue && value !== undefined
          ? `${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`
          : labels[indicator]}
      </span>
    </div>
  );
}
