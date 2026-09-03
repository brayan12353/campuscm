import { BadgeCheck } from 'lucide-react';
import { cn } from '@/utils/format';

interface VerifiedBadgeProps {
  verified: boolean;
  label?: string;
  className?: string;
}

export function VerifiedBadge({ verified, label = 'Vérifié', className }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <span className={cn('inline-flex items-center gap-1 text-accent-600 text-xs font-medium', className)}>
      <BadgeCheck size={14} />
      {label}
    </span>
  );
}
