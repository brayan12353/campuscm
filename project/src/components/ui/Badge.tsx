import type { ReactNode } from 'react';
import { cn } from '@/utils/format';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'accent' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    accent: 'bg-accent-100 text-accent-700',
    neutral: 'bg-gray-800 text-white',
  };
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full font-medium', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
