import { Star } from 'lucide-react';
import { cn } from '@/utils/format';

interface RatingProps {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
}

export function Rating({ rating, count, size = 14, className }: RatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Star size={size} className="fill-warning-400 text-warning-400" />
      <span className="text-sm font-medium text-gray-700">{rating > 0 ? rating.toFixed(1) : 'Nouveau'}</span>
      {count !== undefined && count > 0 && <span className="text-xs text-gray-400">({count})</span>}
    </div>
  );
}
